import { describe, expect, it } from "vitest";
import { validateProductionEnv } from "../../scripts/check-production-env";

describe("validateProductionEnv", () => {
  it("requires PUBLIC_BOOKING_URL, PUBLIC_PUBLIC_EMAIL, PUBLIC_CF_ANALYTICS_TOKEN", () => {
    const errors = validateProductionEnv({});
    expect(errors).toContain(
      "PUBLIC_BOOKING_URL is required for production deploy",
    );
    expect(errors).toContain(
      "PUBLIC_PUBLIC_EMAIL is required for production deploy",
    );
    expect(errors).toContain(
      "PUBLIC_CF_ANALYTICS_TOKEN is required for production deploy",
    );
  });

  it("rejects generic Cal.com homepage as booking URL", () => {
    const errors = validateProductionEnv({
      PUBLIC_BOOKING_URL: "https://cal.com",
      PUBLIC_PUBLIC_EMAIL: "hello@example.com",
      PUBLIC_CF_ANALYTICS_TOKEN: "token",
    });
    expect(errors.some((e) => e.includes("event URL"))).toBe(true);
  });

  it("passes with owner-style values", () => {
    const errors = validateProductionEnv({
      PUBLIC_BOOKING_URL: "https://cal.com/ddsofttech/30min",
      PUBLIC_PUBLIC_EMAIL: "contact@ddsofttech.com",
      PUBLIC_CF_ANALYTICS_TOKEN: "beacon-token",
    });
    expect(errors).toHaveLength(0);
  });
});
