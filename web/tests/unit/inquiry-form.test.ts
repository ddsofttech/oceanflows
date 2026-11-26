import { describe, expect, it } from "vitest";
import {
  classifyInquiryResponse,
  validateInquiryClient,
} from "../../src/scripts/inquiry-form";

describe("validateInquiryClient", () => {
  it("flags empty required fields with UX copy", () => {
    const errors = validateInquiryClient({
      name: "",
      email: "not-an-email",
      phone: "",
      message: "",
    });
    expect(errors).toEqual({
      name: "Enter your name.",
      email: "Enter a valid email address.",
      message: "Tell us what you are looking to improve.",
    });
  });
});

describe("classifyInquiryResponse", () => {
  it("treats spam rejection as rejected (no success UI)", () => {
    expect(
      classifyInquiryResponse(200, { sent: false, rejected: true }),
    ).toEqual({ kind: "rejected" });
  });

  it("treats successful delivery as sent", () => {
    expect(
      classifyInquiryResponse(200, { sent: true, rejected: false }),
    ).toEqual({ kind: "sent" });
  });

  it("maps validation errors from the API", () => {
    expect(
      classifyInquiryResponse(400, {
        error: "validation_failed",
        fields: { email: "Enter a valid email address." },
      }),
    ).toEqual({
      kind: "field-errors",
      fields: { email: "Enter a valid email address." },
    });
  });

  it("maps IP burst 429 rate_limited (FR-08)", () => {
    expect(
      classifyInquiryResponse(429, { error: "rate_limited" }),
    ).toEqual({ kind: "rate-limited" });
  });

  it("maps per-email daily cap 429 daily_limit_reached (FR-15)", () => {
    expect(
      classifyInquiryResponse(429, { error: "daily_limit_reached" }),
    ).toEqual({ kind: "daily-limit-reached" });
  });
});
