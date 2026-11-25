import { describe, expect, it } from "vitest";
import {
  buildInquiryEmailHtml,
  escapeHtml,
  isHoneypotSpam,
  validateInquiryBody,
} from "../../src/lib/inquiry-validation";

describe("validateInquiryBody", () => {
  const valid = {
    name: "Jane SMB",
    email: "jane@example.com",
    phone: "+1-555-0100",
    message: "We want help automating intake forms.",
    hp: "",
  };

  it("accepts OpenAPI valid example", () => {
    const result = validateInquiryBody(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        name: "Jane SMB",
        email: "jane@example.com",
        message: valid.message,
        hp: "",
      });
    }
  });

  it("rejects unknown properties (TM-07)", () => {
    const result = validateInquiryBody({ ...valid, extra: "nope" });
    expect(result).toEqual({
      ok: false,
      error: expect.objectContaining({ error: "validation_failed" }),
    });
  });

  it("returns field map on invalid email", () => {
    const result = validateInquiryBody({ ...valid, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.fields.email).toBeDefined();
    }
  });
});

describe("honeypot", () => {
  it("treats non-empty hp as spam", () => {
    expect(isHoneypotSpam("")).toBe(false);
    expect(isHoneypotSpam("bot")).toBe(true);
  });
});

describe("escapeHtml (TM-05)", () => {
  it("escapes script tags in email HTML", () => {
    const malicious = "<script>alert(1)</script>";
    const html = buildInquiryEmailHtml({
      name: malicious,
      email: "a@b.co",
      message: malicious,
      hp: "",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain(escapeHtml(malicious));
  });
});
