const INQUIRY_LIMITS = {
  nameMax: 120,
  emailMax: 254,
  phoneMax: 40,
  messageMax: 5000,
} as const;

const INQUIRY_KEYS = ["name", "email", "phone", "message", "hp"] as const;

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  hp: string;
};

type ValidationErrorBody = {
  error: "validation_failed";
  fields: Record<string, string>;
};

type ValidationResult =
  | { ok: true; data: InquiryPayload }
  | { ok: false; error: ValidationErrorBody };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type FieldFailure = { ok: false; error: ValidationErrorBody };
type ParsedString = { ok: true; value: string };
type ParsedPhone = { ok: true; value?: string };

function validationFailure(field: string, message: string): FieldFailure {
  return {
    ok: false,
    error: { error: "validation_failed", fields: { [field]: message } },
  };
}

function parseRequiredString(
  value: unknown,
  field: string,
  label: string,
  maxLength: number,
): FieldFailure | ParsedString {
  if (typeof value !== "string" || value.trim().length < 1) {
    return validationFailure(field, `${label} is required.`);
  }
  if (value.length > maxLength) {
    return validationFailure(
      field,
      `${label} must be at most ${maxLength} characters.`,
    );
  }
  return { ok: true, value: value.trim() };
}

function parsePhone(value: unknown): FieldFailure | ParsedPhone {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }
  if (typeof value !== "string") {
    return validationFailure("phone", "Phone must be a string.");
  }
  if (value.length > INQUIRY_LIMITS.phoneMax) {
    return validationFailure(
      "phone",
      `Phone must be at most ${INQUIRY_LIMITS.phoneMax} characters.`,
    );
  }
  return { ok: true, value };
}

export function validateInquiryBody(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return validationFailure("_", "Request body must be a JSON object.");
  }

  const unknownKeys = Object.keys(body).filter(
    (key) => !INQUIRY_KEYS.includes(key as (typeof INQUIRY_KEYS)[number]),
  );
  if (unknownKeys.length > 0) {
    return validationFailure("_", `Unknown field: ${unknownKeys[0]}.`);
  }

  const nameResult = parseRequiredString(
    body.name,
    "name",
    "Name",
    INQUIRY_LIMITS.nameMax,
  );
  if (!nameResult.ok) {
    return nameResult;
  }

  const emailRaw = body.email;
  if (typeof emailRaw !== "string" || emailRaw.trim().length < 1) {
    return validationFailure("email", "Email is required.");
  }
  if (emailRaw.length > INQUIRY_LIMITS.emailMax) {
    return validationFailure(
      "email",
      `Email must be at most ${INQUIRY_LIMITS.emailMax} characters.`,
    );
  }
  if (!EMAIL_PATTERN.test(emailRaw)) {
    return validationFailure("email", "Enter a valid email address.");
  }

  const phoneResult = parsePhone(body.phone);
  if (!phoneResult.ok) {
    return phoneResult;
  }

  const messageResult = parseRequiredString(
    body.message,
    "message",
    "Message",
    INQUIRY_LIMITS.messageMax,
  );
  if (!messageResult.ok) {
    return messageResult;
  }

  if (typeof body.hp !== "string") {
    return validationFailure("hp", "Honeypot field is required.");
  }

  const data: InquiryPayload = {
    name: nameResult.value,
    email: emailRaw.trim(),
    message: messageResult.value,
    hp: body.hp,
  };
  if (phoneResult.value !== undefined) {
    data.phone = phoneResult.value;
  }

  return { ok: true, data };
}

/** Non-empty honeypot classifies as spam (BR-07). Contract allows only empty hp. */
export function isHoneypotSpam(hp: string): boolean {
  return hp.length > 0;
}

export function buildInquiryEmailHtml(payload: InquiryPayload): string {
  const phoneLine =
    payload.phone !== undefined && payload.phone.length > 0
      ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>`
      : "";
  return `<!DOCTYPE html>
<html lang="en">
<body>
  <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
  ${phoneLine}
  <p><strong>Message:</strong></p>
  <p>${escapeHtml(payload.message).replaceAll("\n", "<br />")}</p>
</body>
</html>`;
}
