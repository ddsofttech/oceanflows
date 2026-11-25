import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/**/*.{ts,js}"],
      exclude: ["**/*.astro"],
    },
  },
});
