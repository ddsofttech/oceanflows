# Setup guides (owner / dashboard)

How to configure the three external services the marketing site needs: **Cloudflare** (host + analytics), **Resend** (inquiry email), and **Cal.com** (consultation booking).

Never commit secret values. Local templates: `web/.env.example` and `web/.dev.vars.example`. Production values live in the Cloudflare Worker **Variables and Secrets** (and Build variables when a `PUBLIC_*` value must be available at build time).

---

## A. Cloudflare

Cloudflare’s product for this site is a **Worker application** (Workers Builds + Git), not the old static **Pages** wizard. Astro uses `@astrojs/cloudflare` (`output: "server"`), so deploy is **`npx wrangler deploy`**. There is **no “build output directory”** field — Wrangler reads `web/wrangler.toml` after `npm run build`.

`web/wrangler.toml` must be a **Workers** config (`main` + `[assets]`), **not** `pages_build_output_dir`. That Pages-only key makes Wrangler warn and fail with “Missing entry-point” under Workers Builds.

Astro adapter must use `imageService: "passthrough"` (or `"cloudflare"`) so **sharp** is not bundled into the Worker — otherwise `npx wrangler deploy` fails resolving Node built-ins (`fs`, `child_process`) via `detect-libc`.

Official refs: [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [Astro on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), [GitHub Actions / Wrangler](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

### A1. Create the Worker application

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages**.
3. Select **Create application** (not “Pages → Connect to Git”).
4. Choose **GitHub** (or GitLab), authorize, pick repo **`ddsofttech/oceanflows`**.
5. Configure:

| Setting | Value |
|---|---|
| **Name** | `oceanflows-company-site` (must match `name` in `web/wrangler.toml`) |
| **Git branch** (production) | `main` (D24 — production Workers Builds track `main`) |
| **Root directory** | `web` |
| **Build command** | `npm ci && CHECK_PRODUCTION_ENV=1 npm run check:production-env && npm run build && npm run check:placeholders` (set build vars in §A2 first) |
| **Deploy command** | `npx wrangler deploy` (default — keep this) |
| **Preview command** | `npx wrangler preview` (default) |

6. **API token (optional on this screen):** leave Cloudflare’s auto-generated token. You do **not** need a manual Pages token for Git-connected Workers Builds.
7. Select **Save and Deploy** / **Deploy**.
8. Open the `*.workers.dev` URL when the first build succeeds.

Later edits: open the Worker → **Settings → Builds**.

#### Why no “build output directory”

Workers Builds runs **build** then **deploy**. Deploy is Wrangler (`npx wrangler deploy`), which uploads the Worker + assets from the Astro Cloudflare adapter output. The old Pages field “Build output directory = `dist`” only applied to static Pages Git projects.

### A2. Build variables (Astro `PUBLIC_*` — RP2)

Worker → **Settings** → **Builds** → **Build variables and secrets**. Required before RP2 production sign-off (PRD Q19, BR-09, FR-14):

| Name | Type | Required RP2 | Notes |
|---|---|---|---|
| `PUBLIC_BOOKING_URL` | Variable / Secret | **Yes** | Owner Cal.com **Link** URL (not `https://cal.com` homepage) |
| `PUBLIC_PUBLIC_EMAIL` | Variable | **Yes** | Public mailto on Contact |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Variable / Secret | **Yes** | Dashboard → Web Analytics → JS Snippet token (FR-14) |
| `PUBLIC_PUBLIC_PHONE` | Variable | No | Omit if unset |
| `PUBLIC_LINKEDIN_URL` | Variable | No | Omit if unset |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | No | If Turnstile enabled |

Set `CHECK_PRODUCTION_ENV=1` in the build command (§A1) so `npm run check:production-env` fails the build when required vars are missing.

Mirror the same `PUBLIC_*` names in **GitHub Actions** secrets if you use `.github/workflows/web-deploy.yml`.

Astro inlines `PUBLIC_*` at **build** time. Runtime-only vars are not enough for client-visible fields — redeploy after changing Build variables.

### A3. Runtime variables and secrets

Worker → **Settings → Variables and Secrets** (request time — not only Build variables).

| Name | Type | Notes |
|---|---|---|
| `INQUIRY_EMAIL` | Secret | Inbox that receives inquiry form mail |
| `RESEND_API_KEY` | Secret | From Resend (see §B) |
| `RESEND_FROM_EMAIL` | Secret / Variable | Verified sender address |
| `TURNSTILE_SECRET_KEY` | Secret | Optional |
| `INQUIRY_LIMIT_HASH_PEPPER` | Secret | Required for per-email daily cap (`inquiry-email-daily-limit`); see §A8 |

Key list also in `web/.env.example` and `web/.dev.vars.example`. Never commit values.

### A4. Account ID and API token (GitHub Actions only)

Workers Builds **does not** require a manual token. Use this only if `.github/workflows/web-deploy.yml` also deploys.

**Account ID**

1. Workers & Pages overview, or any zone **Overview** → **API** sidebar → **Account ID**.
2. Or: Worker → copy from URL / account switcher.
3. GitHub repo secret: `CLOUDFLARE_ACCOUNT_ID`.

**API token**

1. Open [Account API tokens](https://dash.cloudflare.com/?to=/:account/api-tokens)  
   Path: **My Profile** (user icon) → **API Tokens**, or account **Manage account → Account API tokens**.
2. **Create Token** → template **Edit Cloudflare Workers** → **Use template**.
3. Restrict **Account Resources** to this account only.
4. Create → copy once → GitHub secret `CLOUDFLARE_API_TOKEN`.

Custom token (legacy Pages deploy only): add Account permissions **Workers Scripts → Edit**, **Account Settings → Read**, and **Cloudflare Pages → Edit** only if the workflow still uses `wrangler pages deploy`. Prefer Workers + `npx wrangler deploy`.

Prefer **one** deploy path: Workers Builds (Git) **or** GitHub Actions, not both fighting the same Worker name. Repo workflow uses `workingDirectory: web`.

### A5. Custom domain and HTTPS (RP2 — D2, D6, NFR-06)

| Step | Owner | Done when |
|---|---|---|
| Apex `oceanflows.net` on Cloudflare DNS | Duong | A/AAAA or CNAME to Worker |
| Custom domain on Worker | devops | Worker → Settings → Domains & Routes → `oceanflows.net` active |
| TLS certificate | automatic | Edge cert **Active** for apex |
| **Always Use HTTPS** | devops | Zone → SSL/TLS → Edge Certificates → **Always Use HTTPS** = On (`http://` → `https://`) |
| Optional `www` | Duong | CNAME `www` → apex or redirect rule (deferred at RP1 — add if needed) |
| Resend domain | Duong | `RESEND_FROM_EMAIL` on verified domain |

1. Worker → **Settings → Domains & Routes** / **Triggers** → add custom domain (e.g. `oceanflows.net`). Prefer the zone DNS on Cloudflare so HTTPS is automatic.
2. Confirm apex has Cloudflare **A** / **AAAA** (or the Worker custom-domain records Cloudflare creates). `www` is optional — add a CNAME/Worker route only if you want `www` live.
3. Zone → **SSL/TLS → Edge Certificates** → enable **Always Use HTTPS** so `http://` redirects to `https://` (NFR-06). Confirm: `curl -sI http://oceanflows.net/` returns **301/302** to `https://...`.

Post-deploy smoke (from repo): `cd web && npm run smoke:production` (checks HTTPS 200, no `[TOKEN]` placeholders, warns on missing beacon / HTTP redirect).

### A6. Web Analytics (FR-14)

1. Dashboard → **Analytics & Logs** → **Web Analytics** → add or manage the site for `oceanflows.net`.
2. Open **JS Snippet** / **Manage site** and copy the **beacon token** (the token value inside the snippet, not the whole script tag).
3. Set `PUBLIC_CF_ANALYTICS_TOKEN` as a **Build** variable (and runtime if you keep them in sync).
4. Redeploy. Confirm page source includes `beacon.min.js` / `data-cf-beacon`, and Application storage shows **no new analytics cookies**.

### A7. Branch protection (GitHub)

Mark required checks from `.github/workflows/web-ci.yml` after a green PR.

### A8. KV daily limit (`INQUIRY_DAILY_LIMIT`, D7, TM-16)

Per-email caps (max **3** POSTs per normalized email per **UTC calendar day**) use a dedicated Cloudflare KV namespace bound as **`INQUIRY_DAILY_LIMIT`** on Worker `oceanflows-company-site`. KV stores **peppered SHA-256 keys + integer counts only** — never plaintext email. See `docs/inquiry-email-daily-limit/delivery/ENVIRONMENTS.md` for CI/deploy notes.

#### A8.1 Create KV namespaces (owner)

1. Dashboard → **Workers & Pages** → **KV**.
2. Create **`INQUIRY_DAILY_LIMIT_PRODUCTION`** → copy **Namespace ID**.
3. Create **`INQUIRY_DAILY_LIMIT_PREVIEW`** (separate namespace for previews/QA) → copy **Namespace ID**.
4. Optional CLI: `cd web && npx wrangler kv namespace list`.

#### A8.2 Bind namespaces in `web/wrangler.toml`

`web/wrangler.toml` declares:

```toml
[[kv_namespaces]]
binding = "INQUIRY_DAILY_LIMIT"
id = "<your-production-namespace-id>"
preview_id = "<your-preview-namespace-id>"
```

Replace both placeholders with the real IDs from §A8.1. **Production deploy must not keep angle-bracket placeholders** — `npm run check:production-wrangler-kv` (with `CHECK_PRODUCTION_ENV=1`) fails deploy if `id` is still a placeholder (see `.github/workflows/web-deploy.yml`). Workers Builds: append `&& npm run check:production-wrangler-kv` to the build command when `CHECK_PRODUCTION_ENV=1` is already set (§A1).

#### A8.3 Hash pepper (owner, TM-15)

1. Generate high-entropy secret (≥32 bytes), e.g. `openssl rand -base64 32`.
2. Worker → **Settings → Variables and Secrets** → add secret **`INQUIRY_LIMIT_HASH_PEPPER`** (runtime, not `PUBLIC_*`).
3. For local `wrangler dev` / preview only, copy the name into gitignored `web/.dev.vars` (template: `web/.dev.vars.example`). Never commit values.

#### A8.4 API token scope (TM-16)

Deploy tokens (**Edit Cloudflare Workers**) should be limited to this account, Worker `oceanflows-company-site`, and the two KV namespaces above. Avoid broad account KV admin on CI tokens unless unavoidable.

#### A8.5 Production deploy checklist

| Step | Owner | Done when |
|---|---|---|
| KV namespace IDs exist | Human | `wrangler kv namespace list` shows prod + preview |
| `wrangler.toml` ids replaced | Human | No `<production-namespace-id>` in committed config for prod path |
| `INQUIRY_DAILY_LIMIT` binding live | devops + Human | Binding name matches NFR-11 |
| `INQUIRY_LIMIT_HASH_PEPPER` set (prod + preview) | Human | Secret present in Worker runtime |
| Placeholder guard green | Human | `CHECK_PRODUCTION_ENV=1 npm run check:production-wrangler-kv` exits 0 |
| Inquiry delivery (existing) | Human | §B4 smoke still passes |

---

## B. Resend (inquiry email)

Resend delivers `POST /api/inquiry` messages to `INQUIRY_EMAIL`. Official: [Resend docs](https://resend.com/docs).

### B1. Account and API key

1. Sign in at [https://resend.com](https://resend.com) (or create an account).
2. **API Keys** → **Create API Key** → name it (e.g. `oceanflows-production`) → copy once.
3. Store as Cloudflare Worker secret **`RESEND_API_KEY`** (never `PUBLIC_*`, never commit).

### B2. From address / domain

Production needs a **verified** sender:

1. Resend → **Domains** → **Add Domain** (e.g. `oceanflows.net` or your sending domain).
2. Add the DNS records Resend shows (SPF, DKIM, etc.) at your DNS host (Cloudflare DNS if the zone is there).
3. Wait until the domain status is **Verified**.
4. Set Cloudflare **`RESEND_FROM_EMAIL`** to an address on that domain (e.g. `noreply@oceanflows.net` or `hello@…`).

**Sandbox / early test:** Resend may allow sending only to your own account email until the domain is verified. That is fine for a smoke test; production inquiries need the verified domain.

### B3. Inquiry inbox

1. Choose the mailbox that should receive form submissions (e.g. `contact@…` or a Google Workspace / personal inbox).
2. Set Cloudflare secret **`INQUIRY_EMAIL`** to that address.
3. Optionally set **`PUBLIC_PUBLIC_EMAIL`** to the same or a public-facing address shown on Contact / privacy copy.

### B4. Smoke check

1. Redeploy after secrets are set.
2. Submit a real inquiry from `https://oceanflows.net/#contact` (or Workers.dev preview).
3. Confirm: UI success state, message in `INQUIRY_EMAIL`, no 5xx on `/api/inquiry`.

**Compromise (TM-04):** if `RESEND_API_KEY` is exposed or suspected compromised:

1. Resend Dashboard → **API Keys** → **Create API Key** (new key).
2. Cloudflare Worker → **Settings → Variables and Secrets** → edit `RESEND_API_KEY` → paste new key → save.
3. Resend → revoke the old API key.
4. Send a test inquiry on production; confirm delivery to `INQUIRY_EMAIL`.
5. Record incident and rotation time for S7 follow-up (no secrets in git or tickets).

---

## C. Cal.com (consultation booking)

The site opens **`PUBLIC_BOOKING_URL`** in a new tab (not an embed). Use a **Link** booking URL — not the Cal.com marketing homepage, and not an **Event** (fixed-date RSVP).

Cal.com renamed **Event Types** → **Links**. Sidebar: **Links**, **Events**, **Bookings**. You want **Links**.

Official: [Create your first link](https://cal.com/help/event-types/create-first-event), [What are Links](https://cal.com/help/event-types/event-types).

### C1. Account

1. Go to [https://cal.com](https://cal.com) and sign in (or create a free account).
2. Choose a username (e.g. `young-dang`). Public links look like `https://cal.com/<username>/<slug>`.

### C2. Create a booking Link

1. Open **Links** (or [app.cal.com/links](https://app.cal.com/links)) — **not** **Events**.
2. Click **New booking link**.
3. Set:
   - **Title:** e.g. `30-minute consultation`
   - **URL / slug:** e.g. `consultation` or `30min` → `https://cal.com/<username>/30min`
   - **Length:** `30` minutes
   - Description optional
4. Connect a calendar and set availability so slots appear.
5. Save / enable the link so it is bookable.

### C3. Copy the URL into Cloudflare

1. On the Link, use **Copy link** / open **Preview**.
2. Confirm the URL looks like:

```text
https://cal.com/<your-username>/<event-slug>
```

   Wrong: `https://cal.com` alone. Wrong: an **Events** URL without your username path (fixed-date Events are a different product).

3. Set Cloudflare variable **`PUBLIC_BOOKING_URL`** to that full URL (Build + runtime if the link is baked into HTML at build time).
4. Redeploy. On Contact, **Open booking calendar** should open the Cal.com slot picker in a new tab.

### C4. Smoke check

1. Private/incognito window → open `PUBLIC_BOOKING_URL` → time slots visible.
2. Site Contact → booking control → new tab to the same Link.
3. Optional: complete a test booking; it should appear under Cal.com **Bookings**.

---

## Quick checklist

| Step | Done when |
|---|---|
| Worker Builds green on `main` | `*.workers.dev` or custom domain serves the site |
| Custom domain + Always Use HTTPS | `https://oceanflows.net` 200; `http://` redirects |
| Resend domain + secrets | Inquiry form delivers to `INQUIRY_EMAIL` |
| Cal.com Link URL | `PUBLIC_BOOKING_URL` opens a 30‑minute slot picker |
| Web Analytics token | Beacon present; no analytics cookies |
| KV daily limit | `INQUIRY_DAILY_LIMIT` bound; pepper set; placeholder KV guard passes |
