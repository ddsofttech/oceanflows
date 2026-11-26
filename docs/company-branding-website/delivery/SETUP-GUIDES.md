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
| **Git branch** (production) | `release/company-branding-website` (request branch with `web/`) |
| **Root directory** | `web` |
| **Build command** | `npm ci && npm run build` |
| **Deploy command** | `npx wrangler deploy` (default — keep this) |
| **Preview command** | `npx wrangler preview` (default) |

6. **API token (optional on this screen):** leave Cloudflare’s auto-generated token. You do **not** need a manual Pages token for Git-connected Workers Builds.
7. Select **Save and Deploy** / **Deploy**.
8. Open the `*.workers.dev` URL when the first build succeeds.

Later edits: open the Worker → **Settings → Builds**.

#### Why no “build output directory”

Workers Builds runs **build** then **deploy**. Deploy is Wrangler (`npx wrangler deploy`), which uploads the Worker + assets from the Astro Cloudflare adapter output. The old Pages field “Build output directory = `dist`” only applied to static Pages Git projects.

### A2. Runtime variables and secrets

Worker → **Settings → Variables and Secrets** (runtime — not only Build variables).

| Name | Type | Notes |
|---|---|---|
| `PUBLIC_BOOKING_URL` | Variable | Cal.com **Link** URL (see §C) |
| `PUBLIC_PUBLIC_EMAIL` | Variable | Public contact email shown on the site |
| `PUBLIC_PUBLIC_PHONE` | Variable | Optional |
| `PUBLIC_LINKEDIN_URL` | Variable | Optional |
| `PUBLIC_TURNSTILE_SITE_KEY` | Variable | Optional |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Variable (also Build var) | Web Analytics beacon token (see §A5) |
| `INQUIRY_EMAIL` | Secret | Inbox that receives inquiry form mail |
| `RESEND_API_KEY` | Secret | From Resend (see §B) |
| `RESEND_FROM_EMAIL` | Secret / Variable | Verified sender address |
| `TURNSTILE_SECRET_KEY` | Secret | Optional |

Key list also in `web/.env.example`. Never commit values.

**Build-time `PUBLIC_*` values:** Astro inlines `PUBLIC_*` at **build**. For analytics and booking/email shown in HTML, also set them under **Settings → Builds → Build variables and secrets**, then **redeploy** (trigger a new build). Runtime-only vars are not enough for client-visible `PUBLIC_*` fields.

### A3. Account ID and API token (GitHub Actions only)

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

### A4. Custom domain and HTTPS

1. Worker → **Settings → Domains & Routes** / **Triggers** → add custom domain (e.g. `oceanflows.net`). Prefer the zone DNS on Cloudflare so HTTPS is automatic.
2. Confirm apex has Cloudflare **A** / **AAAA** (or the Worker custom-domain records Cloudflare creates). `www` is optional — add a CNAME/Worker route only if you want `www` live.
3. Zone → **SSL/TLS → Edge Certificates** → enable **Always Use HTTPS** so `http://` redirects to `https://` (NFR-06).

### A5. Web Analytics (FR-14)

1. Dashboard → **Analytics & Logs** → **Web Analytics** → add or manage the site for `oceanflows.net`.
2. Open **JS Snippet** / **Manage site** and copy the **beacon token** (the token value inside the snippet, not the whole script tag).
3. Set `PUBLIC_CF_ANALYTICS_TOKEN` as a **Build** variable (and runtime if you keep them in sync).
4. Redeploy. Confirm page source includes `beacon.min.js` / `data-cf-beacon`, and Application storage shows **no new analytics cookies**.

### A6. Branch protection (GitHub)

Mark required checks from `.github/workflows/web-ci.yml` after a green PR.

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

**Compromise:** rotate the Resend API key in Resend, update `RESEND_API_KEY` on the Worker, redeploy; revoke the old key.

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
| Worker Builds green on `release/company-branding-website` | `*.workers.dev` or custom domain serves the site |
| Custom domain + Always Use HTTPS | `https://oceanflows.net` 200; `http://` redirects |
| Resend domain + secrets | Inquiry form delivers to `INQUIRY_EMAIL` |
| Cal.com Link URL | `PUBLIC_BOOKING_URL` opens a 30‑minute slot picker |
| Web Analytics token | Beacon present; no analytics cookies |
