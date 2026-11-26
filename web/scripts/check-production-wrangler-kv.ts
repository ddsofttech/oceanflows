/**
 * Blocks production deploy when INQUIRY_DAILY_LIMIT KV id is still a placeholder.
 * Run with CHECK_PRODUCTION_ENV=1 (web-deploy.yml, SETUP-GUIDES.md §A8).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PLACEHOLDER = /<[^>]+>/;
const BINDING = "INQUIRY_DAILY_LIMIT";

export function findInquiryDailyLimitKvId(wranglerToml: string): string | undefined {
  const blockRe =
    /\[\[kv_namespaces\]\][\s\S]*?binding\s*=\s*["']INQUIRY_DAILY_LIMIT["'][\s\S]*?id\s*=\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(wranglerToml)) !== null) {
    return match[1];
  }

  const lineRe = new RegExp(
    `binding\\s*=\\s*["']${BINDING}["'][\\s\\S]*?\\nid\\s*=\\s*["']([^"']+)["']`,
    "m",
  );
  const lineMatch = wranglerToml.match(lineRe);
  return lineMatch?.[1];
}

export function validateProductionWranglerKv(wranglerToml: string): string[] {
  const errors: string[] = [];
  const id = findInquiryDailyLimitKvId(wranglerToml);
  if (!id) {
    errors.push(
      `${BINDING}: missing [[kv_namespaces]] binding in web/wrangler.toml`,
    );
    return errors;
  }
  if (PLACEHOLDER.test(id) || id.includes("kv-namespace-id")) {
    errors.push(
      `${BINDING}: production KV namespace id must be replaced (not a placeholder)`,
    );
  }
  return errors;
}

function main() {
  if (process.env.CHECK_PRODUCTION_ENV !== "1") {
    console.log(
      "check-production-wrangler-kv: skipped (set CHECK_PRODUCTION_ENV=1 for production deploy)",
    );
    return;
  }

  const path = resolve(import.meta.dirname, "../wrangler.toml");
  const wranglerToml = readFileSync(path, "utf8");
  const errors = validateProductionWranglerKv(wranglerToml);
  if (errors.length) {
    console.error("Production wrangler KV check failed:");
    for (const line of errors) {
      console.error(`  ${line}`);
    }
    process.exit(1);
  }

  console.log("Production wrangler KV binding OK.");
}

const isMain =
  import.meta.url === new URL(process.argv[1] ?? "", "file:").href ||
  process.argv[1]?.endsWith("check-production-wrangler-kv.ts");

if (isMain) {
  main();
}