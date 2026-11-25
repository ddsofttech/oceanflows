import { describe, expect, it, vi } from "vitest";
import { resetInquiryRateLimit } from "../../src/lib/inquiry-rate-limit";
import { verifyTurnstileToken } from "../../src/lib/inquiry-turnstile";
import { submitInquiry } from "../../src/pages/api/inquiry";

describe("verifyTurnstileToken", () => {
  it("rejects empty token", async () => {
    expect(await verifyTurnstileToken(null, "secret")).toEqual({ ok: false });
  });

  it("accepts successful siteverify response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
    const result = await verifyTurnstileToken("token", "secret", fetchMock);
    expect(result).toEqual({ ok: true });
  });
});

describe("submitInquiry with Turnstile", () => {
  it("rejects when secret configured but token invalid", async () => {
    resetInquiryRateLimit();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ success: false }), { status: 200 }),
      );
    const body = {
      name: "Jane",
      email: "jane@example.com",
      message: "Hello",
      hp: "",
    };
    const request = new Request("https://example.com/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.7",
        "X-Turnstile-Token": "bad-token",
      },
      body: JSON.stringify(body),
    });
    const response = await submitInquiry(
      request,
      {
        INQUIRY_EMAIL: "inbox@example.com",
        RESEND_API_KEY: "re_test",
        TURNSTILE_SECRET_KEY: "turnstile_secret",
      },
      { fetchImpl: fetchMock },
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: false, rejected: true });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
