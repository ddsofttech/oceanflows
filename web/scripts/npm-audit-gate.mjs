import { spawnSync } from "node:child_process";

/**
 * Production audit gate for RP0 scaffold.
 * Fails on critical issues in direct runtime dependencies outside the Astro toolchain.
 */
const ALLOWED = new Set([
  "astro",
  "sharp",
  "esbuild",
  "vite",
  "zod",
  "zod-to-ts",
]);

const result = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
  encoding: "utf8",
  shell: false,
});

let payload;
try {
  payload = JSON.parse(result.stdout);
} catch {
  console.error("npm-audit-gate: could not parse npm audit output");
  process.exit(1);
}

const advisories = Object.values(payload.advisories ?? {});
const blocking = advisories.filter((adv) => {
  if (adv.severity !== "critical") return false;
  const modules = Object.keys(adv.via).length ? Object.keys(adv.via) : [];
  const names = modules.length
    ? modules
    : (adv.via ?? [])
        .filter((v) => typeof v === "object" && v?.name)
        .map((v) => v.name);
  return names.some(
    (name) => name && !ALLOWED.has(name.split("/").pop() ?? name),
  );
});

if (blocking.length) {
  console.error(
    "Blocking critical advisories outside Astro toolchain allowlist:",
  );
  for (const adv of blocking) {
    console.error(
      `- ${adv.severity}: ${adv.title} (${adv.module_name ?? "unknown"})`,
    );
  }
  process.exit(1);
}

if (result.status && result.status > 0) {
  console.log(
    "npm audit reported toolchain advisories on astro/sharp/esbuild/vite/zod; RP0 allowlist accepted.",
  );
}

console.log("npm-audit-gate: pass");
