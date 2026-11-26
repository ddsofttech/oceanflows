import { describe, expect, it } from "vitest";
import {
  buildDailyLimitKvKey,
  createMemoryInquiryDailyLimitStore,
  hashedDailyLimitKeyPart,
  reserveInquiryDailySlot,
  secondsUntilNextUtcMidnight,
  utcDayKeySegment,
} from "../../src/lib/inquiry-daily-limit";
import { normalizeInquiryEmail } from "../../src/lib/inquiry-email-normalize";

const PEPPER = "unit-test-pepper";

describe("secondsUntilNextUtcMidnight", () => {
  it("returns at least 60 seconds", () => {
    const now = new Date("2026-11-26T23:59:50.000Z");
    expect(secondsUntilNextUtcMidnight(now)).toBeGreaterThanOrEqual(60);
  });

  it("targets next UTC midnight", () => {
    const now = new Date("2026-11-26T12:00:00.000Z");
    expect(secondsUntilNextUtcMidnight(now)).toBe(12 * 60 * 60);
  });
});

describe("utcDayKeySegment", () => {
  it("formats yyyyMMdd in UTC", () => {
    expect(utcDayKeySegment(new Date("2026-01-05T15:00:00.000Z"))).toBe(
      "20260105",
    );
  });
});

describe("hashedDailyLimitKeyPart (TM-15)", () => {
  it("never embeds plaintext email in the hash input key", async () => {
    const hash = await hashedDailyLimitKeyPart(PEPPER, "jane@example.com");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain("jane");
    expect(hash).not.toContain("@");
  });
});

describe("InquiryDailyLimitStore (NFR-11)", () => {
  it("blocks the fourth reservation for the same normalized email", async () => {
    const store = createMemoryInquiryDailyLimitStore();
    const email = "jane@example.com";
    for (let i = 0; i < 3; i += 1) {
      expect(
        await reserveInquiryDailySlot(store, email, PEPPER),
      ).toEqual({ ok: true });
    }
    expect(await reserveInquiryDailySlot(store, email, PEPPER)).toEqual({
      ok: false,
      reason: "daily_limit_reached",
    });
  });

  it("aggregates gmail dot and plus variants", async () => {
    const store = createMemoryInquiryDailyLimitStore();
    const variants = [
      "J.Doe+tag@gmail.com",
      "jdo.e@gmail.com",
      "jdoe@gmail.com",
    ];
    for (const raw of variants) {
      expect(
        await reserveInquiryDailySlot(store, raw, PEPPER),
      ).toEqual({ ok: true });
    }
    expect(
      await reserveInquiryDailySlot(store, "j.d.o.e@gmail.com", PEPPER),
    ).toEqual({
      ok: false,
      reason: "daily_limit_reached",
    });
    expect(normalizeInquiryEmail(variants[0])).toBe("jdoe@gmail.com");
  });

  it("uses distinct KV keys per UTC day segment", async () => {
    const hash = await hashedDailyLimitKeyPart(
      PEPPER,
      normalizeInquiryEmail("a@example.com"),
    );
    expect(buildDailyLimitKvKey("20261126", hash)).toBe(
      `inquiry:daily:20261126:${hash}`,
    );
    expect(buildDailyLimitKvKey("20261126", hash)).not.toContain("a@example.com");
  });
});