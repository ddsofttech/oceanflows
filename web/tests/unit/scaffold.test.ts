import { describe, expect, it } from "vitest";
import { sitePhase } from "../../src/lib/site-status";

describe("scaffold", () => {
  it("reports scaffold phase", () => {
    expect(sitePhase()).toBe("scaffold");
  });
});
