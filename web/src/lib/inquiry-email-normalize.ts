/** BR-14: canonical form for per-email daily counters. */
export function normalizeInquiryEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) {
    return trimmed;
  }

  let local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);

  const plus = local.indexOf("+");
  if (plus >= 0) {
    local = local.slice(0, plus);
  }

  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
  }

  return `${local}@${domain}`;
}
