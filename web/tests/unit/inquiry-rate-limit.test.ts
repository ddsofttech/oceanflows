import { describe, expect, it } from "vitest";
import {
  consumeInquiryRateLimit,
  getInquiryClientIp,
  resetInquiryRateLimit,
} from "../../src/lib/inquiry-rate-limit";

describe("getInquiryClientIp (TM-12)", () => {
  it("uses CF-Connecting-IP even when X-Forwarded-For is forged", () => {
    const request = new Request("https://example.com/api/inquiry", {
      method: "POST",
      headers: {
        "CF-Connecting-IP": "203.0.113.10",
        "X-Forwarded-For": "198.51.100.99",
      },
    });
    expect(getInquiryClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back to local-unknown without CF header", () => {
    const request = new Request("https://example.com/api/inquiry", {
      method: "POST",
      headers: { "X-Forwarded-For": "198.51.100.99" },
    });
    expect(getInquiryClientIp(request)).toBe("local-unknown");
  });
});

describe("consumeInquiryRateLimit (TM-01)", () => {
  it("allows 5 requests per minute then rejects", () => {
    resetInquiryRateLimit();
    const ip = "203.0.113.44";
    for (let i = 0; i < 5; i += 1) {
      expect(consumeInquiryRateLimit(ip)).toEqual({ allowed: true });
    }
    expect(consumeInquiryRateLimit(ip)).toEqual({ allowed: false });
  });

  it("tracks IPs independently", () => {
    resetInquiryRateLimit();
    const blocked = "203.0.113.1";
    const other = "203.0.113.2";
    for (let i = 0; i < 5; i += 1) {
      consumeInquiryRateLimit(blocked);
    }
    expect(consumeInquiryRateLimit(blocked)).toEqual({ allowed: false });
    expect(consumeInquiryRateLimit(other)).toEqual({ allowed: true });
  });
});
