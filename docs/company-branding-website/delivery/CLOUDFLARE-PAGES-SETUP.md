# Cloudflare Workers setup (owner / dashboard)

Cloudflare’s current product for this site is a **Worker application** (Workers Builds + Git), not the old static **Pages** wizard. Astro uses `@astrojs/cloudflare` (`output: "server"`), so deploy is **`npx wrangler deploy`**. There is **no “build output directory”** field — Wrangler reads `web/wrangler.toml` after `npm run build`.

`web/wrangler.toml` must be a **Workers** config (`main` + `[assets]`), **not** `pages_build_output_dir`. That Pages-only key makes Wrangler warn and fail with “Missing entry-point” under Workers Builds.

Astro adapter must use `imageService: "passthrough"` (or `"cloudflare"`) so **sharp** is not bundled into the Worker — otherwise `npx wrangler deploy` fails resolving Node built-ins (`fs`, `child_process`) via `detect-libc`.

Official refs: [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [Astro on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), [GitHub Actions / Wrangler](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

## 1. Create the application (recommended)

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages**.
3. Select **Create application** (not “Pages → Connect to Git”).
4. Choose **GitHub** (or GitLab), authorize, pick repo **`ddsofttech/oceanflows`**.
5. Configure:

| Setting | Value |
|---|---|
| **Name** | `oceanflows-company-site` (must match `name` in `web/wrangler.toml`) |
| **Git branch** (production) | `release/company-branding-website` (request branch with `web/`) |
| **Root directory** | `web` |
| **Build command** | `npm ci && CHECK_PRODUCTION_ENV=1 npm run check:production-env && npm run build && npm run check:placeholders` (set build vars in §2.1 first) |
| **Deploy command** | `npx wrangler deploy` (default — keep this) |
| **Preview command** | `npx wrangler preview` (default) |

6. **API token (optional on this screen):** leave Cloudflare’s auto-generated token. You do **not** need a manual Pages token for Git-connected Workers Builds.
7. Select **Save and Deploy** / **Deploy**.
8. Open the `*.workers.dev` URL when the first build succeeds.

Later edits: open the Worker → **Settings → Builds**.

### Why no “build output directory”

Workers Builds runs **build** then **deploy**. Deploy is Wrangler (`npx wrangler deploy`), which uploads the Worker + assets from the Astro Cloudflare adapter output. The old Pages field “Build output directory = `dist`” only applied to static Pages Git projects.

## 2. Runtime variables and secrets

### 2.1 Build variables (Astro `PUBLIC_*` — RP2 / `cbw-devops-02`)

Worker → **Settings** → **Builds** → **Build variables and secrets**. Required before RP2 production sign-off (PRD Q19, BR-09, FR-14):

| Name | Type | Required RP2 | Notes |
|---|---|---|---|
| `PUBLIC_BOOKING_URL` | Variable / Secret | **Yes** | Owner Cal.com **event** URL (not `https://cal.com` homepage) |
| `PUBLIC_PUBLIC_EMAIL` | Variable | **Yes** | Public mailto on Contact |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Variable / Secret | **Yes** | Dashboard → Analytics & Logs → Web Analytics → JS Snippet token (FR-14) |
| `PUBLIC_PUBLIC_PHONE` | Variable | No | Omit if unset |
| `PUBLIC_LINKEDIN_URL` | Variable | No | Omit if unset |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | No | If Turnstile enabled |

Set `CHECK_PRODUCTION_ENV=1` in the build command (see §1) so `npm run check:production-env` fails the build when required vars are missing.

Mirror the same `PUBLIC_*` names in **GitHub Actions** secrets if you use `.github/workflows/web-deploy.yml`.

### 2.2 Runtime variables and secrets (API / Worker)

Worker → **Settings → Variables and Secrets** (request time — not only Build variables).

| Name | Type | Notes |
|---|---|---|
| `INQUIRY_EMAIL` | Secret | Inquiry inbox (Resend `to`) |
| `RESEND_API_KEY` | Secret | Resend |
| `RESEND_FROM_EMAIL` | Secret / Variable | Verified sender |
| `TURNSTILE_SECRET_KEY` | Secret | Optional |

Key list also in `web/.env.example` and `web/.dev.vars.example`. Never commit values.

`PUBLIC_*` values must be present at **build** time (§2.1). Runtime-only copies of `PUBLIC_*` do not update inlined HTML; redeploy after changing them.

## 3. Account ID (for GitHub Actions only)

If you use `.github/workflows/web-deploy.yml` instead of (or in addition to) Workers Builds:

1. Workers & Pages overview, or any zone **Overview** → **API** sidebar → **Account ID**.
2. Or: Worker → copy from URL / account switcher.

Add GitHub repo secret `CLOUDFLARE_ACCOUNT_ID`.

## 4. API token for GitHub Actions (optional path)

Workers Builds **does not** require you to create a token yourself. Use this section only for **GitHub Actions** / Wrangler CI.

### Where to go (current UI)

1. Open [Account API tokens](https://dash.cloudflare.com/?to=/:account/api-tokens)  
   Path: **My Profile** (user icon) → **API Tokens**, or account **Manage account → Account API tokens**.
2. **Create Token**.

### Recommended: template (Workers)

1. Find template **Edit Cloudflare Workers** → **Use template**.
2. Restrict **Account Resources** to this account only.
3. Create → copy the token once → GitHub secret `CLOUDFLARE_API_TOKEN`.

That template grants Workers Scripts write (and related) — enough for `npx wrangler deploy`.

### Custom token (if you still deploy with `wrangler pages deploy`)

1. **Create Token** → **Custom token** → **Get started**.
2. Under **Permissions**, add rows from the dropdowns (this is **not** a menu named “Cloudflare Pages”):

| | Permission group | Access |
|---|---|---|
| Account | **Workers Scripts** | Edit |
| Account | **Account Settings** | Read |
| Account | **Cloudflare Pages** | Edit *(only if the workflow uses `wrangler pages deploy`)* |

“Account → Cloudflare Pages → Edit” in older docs meant **that permission row**, not a dashboard page. If **Cloudflare Pages** does not appear in the Account permission list, use the **Edit Cloudflare Workers** template and deploy with `npx wrangler deploy` (Workers Builds / current Astro path).

## 5. Align the GitHub Action (if used)

Repo workflow `.github/workflows/web-deploy.yml` runs `deploy` (Wrangler Workers) with `workingDirectory: web`. Prefer **one** deploy path: either Workers Builds (Git) **or** GitHub Actions, not both fighting the same Worker name.

## 6. Custom domain and DNS (RP2 — D2, D6, NFR-06)

### 6.1 Checklist

| Step | Owner | Done when |
|---|---|---|
| Apex `oceanflows.net` on Cloudflare DNS | Duong | A/AAAA or CNAME to Worker |
| Custom domain on Worker | devops | Worker → Settings → Domains & Routes → `oceanflows.net` active |
| TLS certificate | automatic | Edge cert **Active** for apex |
| **Always Use HTTPS** | devops | Zone → SSL/TLS → Edge Certificates → **Always Use HTTPS** = On (`http://` → `https://`) |
| Optional `www` | Duong | CNAME `www` → apex or redirect rule (deferred at RP1 — add if needed) |
| Resend domain | Duong | `RESEND_FROM_EMAIL` on verified domain |

Post-deploy smoke (from repo): `cd web && npm run smoke:production` (checks HTTPS 200, no `[TOKEN]` placeholders, warns on missing beacon / HTTP redirect).

### 6.2 HTTPS enforcement (NFR-06)

RP1 allowed HTTP 200 on apex without redirect. RP2 requires redirect to HTTPS:

1. Cloudflare **zone** for `oceanflows.net` → **SSL/TLS** → **Edge Certificates** → enable **Always Use HTTPS**.
2. Confirm: `curl -sI http://oceanflows.net/` returns **301/302** to `https://...` (smoke script checks this).

## 7. Resend (RP1+)

Verify sender domain (or use Resend test inbox). Store `RESEND_API_KEY` only as a Cloudflare **Secret**.

### 7.1 Resend API key rotation (TM-04)

If `RESEND_API_KEY` is exposed or suspected compromised:

1. Resend Dashboard → **API Keys** → **Create API Key** (new key).
2. Cloudflare Worker → **Settings → Variables and Secrets** → edit `RESEND_API_KEY` → paste new key → save.
3. Resend → revoke the old API key.
4. Send a test inquiry on production; confirm delivery to `INQUIRY_EMAIL`.
5. Record incident and rotation time for S7 follow-up (no secrets in git or tickets).

## 8. Branch protection (GitHub)

Mark required checks from `.github/workflows/web-ci.yml` after a green PR.
