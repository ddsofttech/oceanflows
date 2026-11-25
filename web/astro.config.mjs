// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    // Avoid bundling sharp into the Worker (Cloudflare has no sharp at runtime).
    imageService: "passthrough",
    platformProxy: {
      enabled: true,
    },
  }),
});
