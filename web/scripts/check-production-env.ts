/**
 * Validates owner-supplied build/deploy env before production release (cbw-devops-02).
 * Run with CHECK_PRODUCTION_ENV=1 (see web-deploy.yml and CLOUDFLARE-PAGES-SETUP.md).
 */

export const GENERIC_BOOKING = new Set(["https://cal.com", "https://cal.com/"]);

export const REQUIRED_PUBLIC: Array<{
  name: string;
  reject?: (value: string) => string | undefined;
}> = [
  {
    name: "PUBLIC_BOOKING_URL",
    reject: (v) =>
      GENERIC_BOOKING.has(v)
        ? "must be the owner's Cal.com event URL, not the Cal.com homepage"
        : undefined,
  },
  { name: "PUBLIC_PUBLIC_EMAIL" },
  { name: "PUBLIC_CF_ANALYTICS_TOKEN" },
];

export function validateProductionEnv(
  env: Record<string, string | undefined>,
): string[] {
  const errors: string[] = [];
  for (const { name, reject } of REQUIRED_PUBLIC) {
    const raw = env[name];
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      errors.push(`${name} is required for production deploy`);
      continue;
    }
    const reason = reject?.(value);
    if (reason) {
      errors.push(`${name}: ${reason}`);
    }
  }
  return errors;
}

function main() {
  if (process.env.CHECK_PRODUCTION_ENV !== "1") {
    console.log(
      "check-production-env: skipped (set CHECK_PRODUCTION_ENV=1 for production deploy)",
    );
    return;
  }

  const errors = validateProductionEnv(process.env as Record<string, string>);
  if (errors.length) {
    console.error("Production environment check failed:");
    for (const line of errors) {
      console.error(`  ${line}`);
    }
    process.exit(1);
  }

  console.log("Production environment variables OK.");
}

const isMain =
  import.meta.url === new URL(process.argv[1] ?? "", "file:").href ||
  process.argv[1]?.endsWith("check-production-env.ts");

if (isMain) {
  main();
}
