import { describe, expect, it } from "vitest";
import {
  findInquiryDailyLimitKvId,
  validateProductionWranglerKv,
} from "../../scripts/check-production-wrangler-kv";

const sampleToml = `
[[kv_namespaces]]
binding = "INQUIRY_DAILY_LIMIT"
id = "<production-namespace-id>"
preview_id = "<preview-namespace-id>"
`;

describe("validateProductionWranglerKv", () => {
  it("reads INQUIRY_DAILY_LIMIT id from wrangler.toml", () => {
    expect(findInquiryDailyLimitKvId(sampleToml)).toBe(
      "<production-namespace-id>",
    );
  });

  it("fails when production id is a placeholder", () => {
    const errors = validateProductionWranglerKv(sampleToml);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("placeholder");
  });

  it("passes with a real namespace id", () => {
    const toml = sampleToml.replace(
      "<production-namespace-id>",
      "a1b2c3d4e5f6789012345678901234ab",
    );
    expect(validateProductionWranglerKv(toml)).toHaveLength(0);
  });

  it("fails when binding block is missing", () => {
    const errors = validateProductionWranglerKv('name = "test"\n');
    expect(errors[0]).toContain("missing");
  });
});
