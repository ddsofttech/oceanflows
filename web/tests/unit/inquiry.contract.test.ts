import { afterEach, describe, expect, it, vi } from "vitest";
import { resetInquiryRateLimit } from "../../src/lib/inquiry-rate-limit";
import { submitInquiry } from "../../src/pages/api/inquiry";

const validBody = {
  name: "Jane SMB",
  email: "jane@example.com",
  phone: "+1-555-0100",
  message: "We want help automating intake forms.",
  hp: "",
};

const testEnv = {
  INQUIRY_EMAIL: "inbox@example.com",
  RESEND_API_KEY: "re_test_key",
  RESEND_FROM_EMAIL: "onboarding@resend.dev",
};

function postRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("https://example.com/api/inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Connecting-IP": "203.0.113.50",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/inquiry contract", () => {
  afterEach(() => {
    resetInquiryRateLimit();
    vi.restoreAllMocks();
  });

  it("returns 400 validation_failed for invalid email", async () => {
    const response = await submitInquiry(
      postRequest({ ...validBody, email: "bad" }),
      testEnv,
    );
    expect(response.status).toBe(400);
    const json = (await response.json()) as {
      error: string;
      fields: Record<string, string>;
    };
    expect(json.error).toBe("validation_failed");
    expect(json.fields.email).toBeDefined();
  });

  it("returns 200 rejected for honeypot spam without Resend call", async () => {
    const fetchMock = vi.fn();
    const response = await submitInquiry(
      postRequest({ ...validBody, hp: "filled" }),
      testEnv,
      { fetchImpl: fetchMock },
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: false, rejected: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 200 sent on successful Resend delivery", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: "email_1" }), { status: 200 }),
      );
    const response = await submitInquiry(postRequest(validBody), testEnv, {
      fetchImpl: fetchMock,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true, rejected: false });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const payload = JSON.parse(init.body as string) as {
      to: string[];
      html: string;
    };
    expect(payload.to).toEqual(["inbox@example.com"]);
    expect(payload.html).toContain("Jane SMB");
    expect(payload.html).not.toContain("<script>");
  });

  it("returns 502 delivery_failed when Resend fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("error", { status: 500 }));
    const response = await submitInquiry(postRequest(validBody), testEnv, {
      fetchImpl: fetchMock,
    });
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "delivery_failed" });
  });

  it("returns 429 rate_limited on sixth request in a minute", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    resetInquiryRateLimit();
    const ip = "203.0.113.99";
    for (let i = 0; i < 5; i += 1) {
      await submitInquiry(
        postRequest(validBody, { "CF-Connecting-IP": ip }),
        testEnv,
        {
          fetchImpl: fetchMock,
        },
      );
    }
    const response = await submitInquiry(
      postRequest(validBody, { "CF-Connecting-IP": ip }),
      testEnv,
      { fetchImpl: fetchMock },
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate_limited" });
  });

  it("does not log PII when processing (TM-03)", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    await submitInquiry(postRequest(validBody), testEnv, {
      fetchImpl: fetchMock,
    });
    const combined = logSpy.mock.calls
      .map((call) => JSON.stringify(call))
      .join(" ");
    expect(combined).not.toContain("jane@example.com");
    expect(combined).not.toContain("We want help");
    expect(combined).toContain("inquiry.sent");
    logSpy.mockRestore();
  });
});
