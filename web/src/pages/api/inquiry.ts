import type { APIRoute } from "astro";
import { sendInquiryViaResend } from "../../lib/inquiry-email";
import { logInquiryEvent } from "../../lib/inquiry-log";
import {
  consumeInquiryRateLimit,
  getInquiryClientIp,
} from "../../lib/inquiry-rate-limit";
import { verifyTurnstileToken } from "../../lib/inquiry-turnstile";
import {
  isHoneypotSpam,
  validateInquiryBody,
} from "../../lib/inquiry-validation";

export const prerender = false;

export type InquiryRuntimeEnv = {
  INQUIRY_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  PUBLIC_PUBLIC_EMAIL?: string;
};

export type InquiryDeps = {
  fetchImpl?: typeof fetch;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function resolveEnv(locals: App.Locals): InquiryRuntimeEnv {
  const runtimeEnv = (locals as { runtime?: { env?: InquiryRuntimeEnv } })
    .runtime?.env;
  return {
    INQUIRY_EMAIL: runtimeEnv?.INQUIRY_EMAIL ?? import.meta.env.INQUIRY_EMAIL,
    RESEND_API_KEY:
      runtimeEnv?.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY:
      runtimeEnv?.TURNSTILE_SECRET_KEY ?? import.meta.env.TURNSTILE_SECRET_KEY,
    RESEND_FROM_EMAIL:
      runtimeEnv?.RESEND_FROM_EMAIL ?? import.meta.env.RESEND_FROM_EMAIL,
    PUBLIC_PUBLIC_EMAIL:
      runtimeEnv?.PUBLIC_PUBLIC_EMAIL ?? import.meta.env.PUBLIC_PUBLIC_EMAIL,
  };
}

function resolveFromAddress(env: InquiryRuntimeEnv): string {
  return (
    env.RESEND_FROM_EMAIL ?? env.PUBLIC_PUBLIC_EMAIL ?? "onboarding@resend.dev"
  );
}

export async function submitInquiry(
  request: Request,
  env: InquiryRuntimeEnv,
  deps: InquiryDeps = {},
): Promise<Response> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const requestId = crypto.randomUUID();

  const clientIp = getInquiryClientIp(request);
  const rate = consumeInquiryRateLimit(clientIp);
  if (!rate.allowed) {
    logInquiryEvent(requestId, "rate_limited", "inquiry.rate_limited");
    return jsonResponse({ error: "rate_limited" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logInquiryEvent(
      requestId,
      "validation_failed",
      "inquiry.validation_failed",
    );
    return jsonResponse(
      {
        error: "validation_failed",
        fields: { _: "Request body must be valid JSON." },
      },
      400,
    );
  }

  const validated = validateInquiryBody(body);
  if (!validated.ok) {
    logInquiryEvent(
      requestId,
      "validation_failed",
      "inquiry.validation_failed",
    );
    return jsonResponse(validated.error, 400);
  }

  if (isHoneypotSpam(validated.data.hp)) {
    logInquiryEvent(requestId, "rejected", "inquiry.spam_rejected");
    return jsonResponse({ sent: false, rejected: true }, 200);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileToken = request.headers.get("X-Turnstile-Token");
    const turnstile = await verifyTurnstileToken(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      fetchImpl,
    );
    if (!turnstile.ok) {
      logInquiryEvent(requestId, "rejected", "inquiry.spam_rejected");
      return jsonResponse({ sent: false, rejected: true }, 200);
    }
  }

  const inquiryEmail = env.INQUIRY_EMAIL;
  const resendKey = env.RESEND_API_KEY;
  if (!inquiryEmail || !resendKey) {
    logInquiryEvent(requestId, "delivery_failed", "inquiry.delivery_failed");
    return jsonResponse({ error: "delivery_failed" }, 502);
  }

  const delivery = await sendInquiryViaResend(
    {
      apiKey: resendKey,
      fromAddress: resolveFromAddress(env),
      toAddress: inquiryEmail,
      payload: validated.data,
    },
    fetchImpl,
  );

  if (!delivery.ok) {
    logInquiryEvent(requestId, "delivery_failed", "inquiry.delivery_failed");
    return jsonResponse({ error: "delivery_failed" }, 502);
  }

  logInquiryEvent(requestId, "sent", "inquiry.sent");
  return jsonResponse({ sent: true, rejected: false }, 200);
}

export const POST: APIRoute = async ({ request, locals }) => {
  return submitInquiry(request, resolveEnv(locals));
};
