const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  message: 5000,
} as const;

export type InquiryField = "name" | "email" | "phone" | "message";
export type ClientFieldErrors = Partial<Record<InquiryField, string>>;

export type InquirySubmitPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  hp: string;
};

export type InquiryUiOutcome =
  | { kind: "sent" }
  | { kind: "field-errors"; fields: ClientFieldErrors }
  | { kind: "delivery-failure" }
  | { kind: "rejected" }
  | { kind: "rate-limited" }
  | { kind: "daily-limit-reached" }
  | { kind: "unknown-error" };

export function validateInquiryClient(values: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): ClientFieldErrors | null {
  const fields: ClientFieldErrors = {};

  const name = values.name.trim();
  if (!name) {
    fields.name = "Enter your name.";
  } else if (name.length > LIMITS.name) {
    fields.name = `Name must be at most ${LIMITS.name} characters.`;
  }

  const email = values.email.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    fields.email = "Enter a valid email address.";
  } else if (email.length > LIMITS.email) {
    fields.email = `Email must be at most ${LIMITS.email} characters.`;
  }

  const phone = values.phone;
  if (phone.length > LIMITS.phone) {
    fields.phone = `Phone must be at most ${LIMITS.phone} characters.`;
  }

  const message = values.message.trim();
  if (!message) {
    fields.message = "Tell us what you are looking to improve.";
  } else if (message.length > LIMITS.message) {
    fields.message = `Message must be at most ${LIMITS.message} characters.`;
  }

  return Object.keys(fields).length > 0 ? fields : null;
}

export function classifyInquiryResponse(
  status: number,
  body: unknown,
): InquiryUiOutcome {
  if (status === 400 && isValidationBody(body)) {
    return { kind: "field-errors", fields: body.fields as ClientFieldErrors };
  }
  if (status === 502) {
    return { kind: "delivery-failure" };
  }
  if (status === 429) {
    if (isRateLimitBody(body)) {
      if (body.error === "daily_limit_reached") {
        return { kind: "daily-limit-reached" };
      }
      return { kind: "rate-limited" };
    }
    return { kind: "rate-limited" };
  }
  if (status === 200 && isInquiryResult(body)) {
    if (body.sent === true && body.rejected === false) {
      return { kind: "sent" };
    }
    if (body.rejected === true) {
      return { kind: "rejected" };
    }
  }
  return { kind: "unknown-error" };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidationBody(
  value: unknown,
): value is { error: string; fields: Record<string, string> } {
  return (
    isRecord(value) &&
    value.error === "validation_failed" &&
    isRecord(value.fields)
  );
}

function isInquiryResult(
  value: unknown,
): value is { sent: boolean; rejected: boolean } {
  return (
    isRecord(value) &&
    typeof value.sent === "boolean" &&
    typeof value.rejected === "boolean"
  );
}

function isRateLimitBody(
  value: unknown,
): value is { error: "rate_limited" | "daily_limit_reached" } {
  return (
    isRecord(value) &&
    (value.error === "rate_limited" || value.error === "daily_limit_reached")
  );
}

type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string }) => string;
  getResponse: (widgetId?: string) => string | undefined;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "1";
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}

function clearFieldErrors(form: HTMLFormElement) {
  for (const field of form.querySelectorAll<HTMLElement>(".form-field")) {
    field.classList.remove("is-error");
    const errorEl = field.querySelector<HTMLElement>(".form-field__error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }
}

function applyFieldErrors(form: HTMLFormElement, fields: ClientFieldErrors) {
  for (const [key, message] of Object.entries(fields)) {
    if (!message) continue;
    const input = form
      .querySelector<HTMLElement>(`#${key}`)
      ?.closest(".form-field");
    if (!input) continue;
    input.classList.add("is-error");
    let errorEl = input.querySelector<HTMLElement>(".form-field__error");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "form-field__error";
      input.appendChild(errorEl);
    }
    errorEl.id = `${key}-error`;
    const control = input.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `#${key}`,
    );
    if (control) {
      control.setAttribute("aria-describedby", errorEl.id);
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

function renderStatus(
  container: HTMLElement,
  html: string,
  options: { role: "status" | "alert"; className: string },
) {
  container.innerHTML = html;
  container.hidden = false;
  container.className = options.className;
  container.setAttribute("role", options.role);
}

function clearStatus(container: HTMLElement) {
  container.innerHTML = "";
  container.hidden = true;
  container.removeAttribute("role");
  container.className = "";
}

function applyInquiryOutcome(
  outcome: InquiryUiOutcome,
  ctx: {
    form: HTMLFormElement;
    statusSlot: HTMLElement;
    publicEmail: string;
    turnstileSiteKey: string;
    turnstileWidgetId?: string;
  },
) {
  const { form, statusSlot, publicEmail, turnstileSiteKey, turnstileWidgetId } =
    ctx;

  if (outcome.kind === "sent") {
    form.hidden = true;
    renderStatus(
      statusSlot,
      "<strong>Inquiry sent</strong><p>We received your message. We will follow up by email.</p>",
      { role: "status", className: "status-message status-message--success" },
    );
    return;
  }

  if (outcome.kind === "field-errors") {
    applyFieldErrors(form, outcome.fields);
    renderStatus(statusSlot, "<strong>Check the fields below</strong>", {
      role: "alert",
      className: "status-message status-message--error",
    });
    return;
  }

  if (outcome.kind === "daily-limit-reached") {
    renderStatus(
      statusSlot,
      `<strong>Daily inquiry limit reached</strong><p>You have reached the daily limit for inquiries from this email address. Try again after midnight UTC, or email us at <a href="mailto:${publicEmail}">${publicEmail}</a>.</p>`,
      {
        role: "alert",
        className: "status-message status-message--error",
      },
    );
    return;
  }

  if (
    outcome.kind === "delivery-failure" ||
    outcome.kind === "unknown-error" ||
    outcome.kind === "rate-limited"
  ) {
    const copy =
      outcome.kind === "rate-limited"
        ? "<strong>Could not send right now</strong><p>Please wait a moment and try again.</p>"
        : `<strong>Could not send right now</strong><p>Try again, or email us at <a href="mailto:${publicEmail}">${publicEmail}</a>.</p>`;
    renderStatus(statusSlot, copy, {
      role: "alert",
      className: "status-message status-message--error",
    });
    return;
  }

  if (outcome.kind === "rejected") {
    renderStatus(
      statusSlot,
      `<strong>Could not send</strong><p>We could not accept this submission. Try again, or email us at <a href="mailto:${publicEmail}">${publicEmail}</a>.</p>`,
      {
        role: "alert",
        className: "status-message status-message--error",
      },
    );
    if (turnstileSiteKey && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId);
    }
  }
}

async function postInquiry(
  payload: InquirySubmitPayload,
  headers: Record<string, string>,
): Promise<InquiryUiOutcome> {
  try {
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => null)) as unknown;
    return classifyInquiryResponse(response.status, body);
  } catch {
    return { kind: "unknown-error" };
  }
}

export function initInquiryForm(root: ParentNode = document) {
  const shell = root.querySelector<HTMLElement>("[data-inquiry-form]");
  if (!shell) return;

  const form = shell.querySelector<HTMLFormElement>(".inquiry-form");
  const statusSlot = shell.querySelector<HTMLElement>("[data-inquiry-status]");
  if (!form || !statusSlot) return;

  const publicEmail = shell.dataset.publicEmail ?? "";
  const turnstileSiteKey = shell.dataset.turnstileSiteKey?.trim() ?? "";
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  const turnstileMount = form.querySelector<HTMLElement>(
    "[data-turnstile-mount]",
  );
  let turnstileWidgetId: string | undefined;

  if (turnstileSiteKey && turnstileMount) {
    loadTurnstileScript()
      .then(() => {
        if (!window.turnstile) return;
        turnstileWidgetId = window.turnstile.render(turnstileMount, {
          sitekey: turnstileSiteKey,
        });
      })
      .catch(() => {
        /* Turnstile optional when secret is not configured server-side */
      });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus(statusSlot);
    clearFieldErrors(form);

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
      .value;
    const hp = (form.elements.namedItem("hp") as HTMLInputElement).value;

    const clientErrors = validateInquiryClient({ name, email, phone, message });
    if (clientErrors) {
      applyFieldErrors(form, clientErrors);
      renderStatus(statusSlot, "<strong>Check the fields below</strong>", {
        role: "alert",
        className: "status-message status-message--error",
      });
      return;
    }

    const payload: InquirySubmitPayload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      hp,
    };
    if (phone.trim().length > 0) {
      payload.phone = phone;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (turnstileSiteKey && window.turnstile) {
      const token = window.turnstile.getResponse(turnstileWidgetId);
      if (token) {
        headers["X-Turnstile-Token"] = token;
      }
    }

    const outcome = await postInquiry(payload, headers);

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
    }

    applyInquiryOutcome(outcome, {
      form,
      statusSlot,
      publicEmail,
      turnstileSiteKey,
      turnstileWidgetId,
    });
  });
}
