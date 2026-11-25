import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/** Owner copy placeholders like [BOOKING_URL], not JS array literals. */
const PLACEHOLDER = /\[[A-Z][A-Z0-9_]+\]/g;
const OUT_DIR = path.resolve("dist");

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && /\.(html|js|css)$/i.test(entry.name)) {
      yield full;
    }
  }
}

async function main() {
  const hits: string[] = [];
  try {
    for await (const file of walk(OUT_DIR)) {
      const text = await readFile(file, "utf8");
      const matches = text.match(PLACEHOLDER);
      if (matches?.length) {
        hits.push(`${file}: ${[...new Set(matches)].join(", ")}`);
      }
    }
  } catch {
    console.error(
      `check-production-placeholders: missing ${OUT_DIR} — run npm run build first`,
    );
    process.exit(1);
  }

  if (hits.length) {
    console.error("Production placeholder tokens found in build output:");
    for (const line of hits) {
      console.error(`  ${line}`);
    }
    process.exit(1);
  }

  console.log("No bracket placeholders in build output.");
}

main();
