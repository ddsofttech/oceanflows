type InquiryLogOutcome =
  | "sent"
  | "rejected"
  | "validation_failed"
  | "delivery_failed"
  | "rate_limited"
  | "daily_limit_reached";

export function logInquiryEvent(
  requestId: string,
  outcome: InquiryLogOutcome,
  event: string,
): void {
  console.log(JSON.stringify({ event, requestId, outcome }));
}
