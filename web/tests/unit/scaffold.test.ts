import { describe, expect, it } from "vitest";
import { publicSiteLinks } from "../../src/lib/public-site";
import { sitePhase } from "../../src/lib/site-status";

describe("site lib", () => {
  it("reports preview phase after UX migration", () => {
    expect(sitePhase()).toBe("preview");
  });

  it("provides build-safe public links without bracket placeholders", () => {
    const { bookingUrl, publicEmail } = publicSiteLinks();
    expect(bookingUrl).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(publicEmail).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(bookingUrl.length).toBeGreaterThan(0);
    expect(publicEmail).toContain("@");
  });
});
