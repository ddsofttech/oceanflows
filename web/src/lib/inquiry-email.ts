import {
  buildInquiryEmailHtml,
  type InquiryPayload,
} from "./inquiry-validation";

type ResendSendInput = {
  apiKey: string;
  fromAddress: string;
  toAddress: string;
  payload: InquiryPayload;
};

type ResendSendResult = { ok: true } | { ok: false; status: number };

export async function sendInquiryViaResend(
  input: ResendSendInput,
  fetchImpl: typeof fetch = fetch,
): Promise<ResendSendResult> {
  const subject = `Website inquiry from ${input.payload.name}`;
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.fromAddress,
      to: [input.toAddress],
      subject,
      html: buildInquiryEmailHtml(input.payload),
      reply_to: input.payload.email,
    }),
  });

  if (response.ok) {
    return { ok: true };
  }
  return { ok: false, status: response.status };
}
