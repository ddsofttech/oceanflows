import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryInquiryDailyLimitStore } from "../../src/lib/inquiry-daily-limit";
import { resetInquiryRateLimit } from "../../src/lib/inquiry-rate-limit";
import { submitInquiry } from "../../src/pages/api/inquiry";

const validBody = {
  name: "Jane SMB",
  email: "jane@example.com",
  phone: "+1-555-0100",
  message: "We want help automating intake forms.",
  hp: "",
};

const dailyStore = createMemoryInquiryDailyLimitStore();

const testEnv = {
  INQUIRY_EMAIL: "inbox@example.com",
  RESEND_API_KEY: "re_test_key",
  RESEND_FROM_EMAIL: "onboarding@resend.dev",
  INQUIRY_LIMIT_HASH_PEPPER: "contract-test-pepper",
};

function defaultDeps(fetchImpl: typeof fetch) {
  return { fetchImpl, dailyLimitStore: dailyStore };
}

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
    dailyStore.reset();
    vi.restoreAllMocks();
  });

  it("returns 400 validation_failed for invalid email", async () => {
    const response = await submitInquiry(
      postRequest({ ...validBody, email: "bad" }),
      testEnv,
      defaultDeps(fetch),
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
      defaultDeps(fetchMock),
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
    const response = await submitInquiry(
      postRequest(validBody),
      testEnv,
      defaultDeps(fetchMock),
    );
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

  it("returns 502 delivery_failed when Resend fails after daily increment (BR-12)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("error", { status: 500 }));
    const response = await submitInquiry(
      postRequest(validBody),
      testEnv,
      defaultDeps(fetchMock),
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "delivery_failed" });
    expect(await dailyStore.peekCount("jane@example.com", testEnv.INQUIRY_LIMIT_HASH_PEPPER)).toBe(1);
  });

  it("returns 429 rate_limited on second request in a minute (BR-13)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    resetInquiryRateLimit();
    const ip = "203.0.113.99";
    await submitInquiry(
      postRequest(validBody, { "CF-Connecting-IP": ip }),
      testEnv,
      defaultDeps(fetchMock),
    );
    const response = await submitInquiry(
      postRequest(validBody, { "CF-Connecting-IP": ip }),
      testEnv,
      { fetchImpl: fetchMock, dailyLimitStore: dailyStore },
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate_limited" });
  });

  it("returns 429 daily_limit_reached on fourth same-email POST (FR-15)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    for (let i = 0; i < 3; i += 1) {
      await submitInquiry(
        postRequest(validBody, { "CF-Connecting-IP": `203.0.113.${i + 1}` }),
        testEnv,
        defaultDeps(fetchMock),
      );
    }
    const response = await submitInquiry(
      postRequest(validBody, { "CF-Connecting-IP": "203.0.113.10" }),
      testEnv,
      defaultDeps(fetchMock),
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "daily_limit_reached" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("applies IP limit before validation (NFR-06)", async () => {
    resetInquiryRateLimit();
    const ip = "203.0.113.200";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    await submitInquiry(
      postRequest(validBody, { "CF-Connecting-IP": ip }),
      testEnv,
      defaultDeps(fetchMock),
    );
    const response = await submitInquiry(
      postRequest({ ...validBody, email: "not-an-email" }, { "CF-Connecting-IP": ip }),
      testEnv,
      defaultDeps(fetchMock),
    );
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate_limited" });
  });

  it("does not increment daily count on validation failure (BR-12)", async () => {
    await submitInquiry(
      postRequest({ ...validBody, email: "bad" }),
      testEnv,
      defaultDeps(fetch),
    );
    expect(
      await dailyStore.peekCount("jane@example.com", testEnv.INQUIRY_LIMIT_HASH_PEPPER),
    ).toBe(0);
  });

  it("does not log PII when processing (TM-03)", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    await submitInquiry(postRequest(validBody), testEnv, defaultDeps(fetchMock));
    const combined = logSpy.mock.calls
      .map((call) => JSON.stringify(call))
      .join(" ");
    expect(combined).not.toContain("jane@example.com");
    expect(combined).not.toContain("We want help");
    expect(combined).toContain("inquiry.sent");
    logSpy.mockRestore();
  });
});