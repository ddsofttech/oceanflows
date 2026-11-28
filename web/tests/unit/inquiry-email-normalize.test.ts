import { describe, expect, it } from "vitest";
import { normalizeInquiryEmail } from "../../src/lib/inquiry-email-normalize";

describe("normalizeInquiryEmail (BR-14)", () => {
  it("trims and lowercases", () => {
    expect(normalizeInquiryEmail("  Jane@Example.COM ")).toBe(
      "jane@example.com",
    );
  });

  it("strips plus-tags in the local part", () => {
    expect(normalizeInquiryEmail("user+newsletter@example.com")).toBe(
      "user@example.com",
    );
  });

  it("removes dots from gmail.com local parts", () => {
    expect(normalizeInquiryEmail("first.last@gmail.com")).toBe(
      "firstlast@gmail.com",
    );
  });

  it("removes dots from googlemail.com local parts", () => {
    expect(normalizeInquiryEmail("a.b.c@googlemail.com")).toBe(
      "abc@googlemail.com",
    );
  });

  it("does not remove dots on non-google domains", () => {
    expect(normalizeInquiryEmail("a.b@example.com")).toBe("a.b@example.com");
  });
});
