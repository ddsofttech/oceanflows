# Company marketing site (`web/`)

Astro + `@astrojs/cloudflare` scaffold for **company-branding-website** (RP0).

## Commands

| Command                      | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `npm run dev`                | Local Astro dev server                    |
| `npm run build`              | Production build to `dist/`               |
| `npm run check`              | `astro check` + `tsc`                     |
| `npm run test` / `test:e2e`  | Vitest + Playwright smoke                 |
| `npm run check:placeholders` | Fail if `[TOKEN]` placeholders in `dist/` |

## Environment

Copy `.env.example` and `.dev.vars.example` (never commit secrets). Production values live in **Cloudflare Pages** env settings — see `docs/company-branding-website/delivery/CLOUDFLARE-PAGES-SETUP.md`.

## Stack note (RP0)

Scaffold uses **Astro 5.x** with `output: "server"` + prerendered routes (replaces Astro 4 `hybrid`). `docs/ENGINEERING-STANDARDS.md` still lists Astro 4 — treat as Class A clarification pending architect sync.
