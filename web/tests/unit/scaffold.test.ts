import { describe, expect, it } from "vitest";
import {
  cfAnalyticsToken,
  publicSiteConfig,
  publicSiteLinks,
} from "../../src/lib/public-site";
import { sitePhase } from "../../src/lib/site-status";

describe("site lib", () => {
  it("reports live-contact phase after inquiry UI is wired", () => {
    expect(sitePhase()).toBe("live-contact");
  });

  it("provides build-safe public links without bracket placeholders", () => {
    const { bookingUrl, publicEmail } = publicSiteLinks();
    expect(bookingUrl).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(publicEmail).not.toMatch(/\[[A-Z0-9_]+\]/);
    expect(bookingUrl.length).toBeGreaterThan(0);
    expect(publicEmail).toContain("@");
  });

  it("omits analytics token when PUBLIC_CF_ANALYTICS_TOKEN is unset", () => {
    expect(cfAnalyticsToken()).toBeUndefined();
  });

  it("marks booking unavailable in non-production when URL is unset", () => {
    const site = publicSiteConfig();
    if (import.meta.env.PROD) {
      expect(site.bookingAvailable).toBe(true);
    } else {
      const urlSet = Boolean(import.meta.env.PUBLIC_BOOKING_URL?.trim());
      expect(site.bookingAvailable).toBe(urlSet);
    }
  });
});
