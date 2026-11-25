# Cloudflare Pages setup (owner / dashboard)

Provisioning for `company-branding-website` uses **Cloudflare Pages** with the Astro Cloudflare adapter. CI builds in GitHub Actions; deploy wiring needs account access.

## 1. Create the Pages project

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/) (account with D2 custom domain).
2. **Workers & Pages → Create → Pages → Connect to Git**.
3. Repository: `ddsofttech/oceanflows` (or mirror).
4. **Production branch:** `main` or team default; **preview:** all non-production branches (PR previews).
5. **Root directory:** `web`
6. **Build command:** `npm ci && npm run build`
7. **Build output directory:** `dist`

Alternatively, use the **GitHub Action** workflow `.github/workflows/web-deploy.yml` with API token deploy (no dashboard Git link required).

## 2. GitHub secrets (for Action deploy)

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Pages deploy (Account → Cloudflare Pages → Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from Workers & Pages overview |

Optional for production RP2:

| Variable (production env) | Example |
|---|---|
| `PUBLIC_BOOKING_URL` | Cal.com link (D3) |
| `PUBLIC_PUBLIC_EMAIL` | Public contact email (D6) |
| `INQUIRY_EMAIL` | Inbox for inquiries |
| `RESEND_API_KEY` | Resend send API (encrypted) |
| `TURNSTILE_SECRET_KEY` | Optional spam |

Use **Settings → Environment variables** per environment (Production vs Preview). Never commit values; use `web/.env.example` as the key list.

## 3. Custom domain (RP2 / cbw-devops-02)

1. Pages project → **Custom domains** → add D2 hostname.
2. Confirm HTTPS (automatic when DNS is on Cloudflare or CNAME is correct).
3. Run production placeholder check (`web` `npm run check:placeholders` after build with production env).

## 4. Resend (RP1+)

1. Verify sending domain or use Resend onboarding inbox for staging.
2. Store `RESEND_API_KEY` only in Cloudflare encrypted env or `wrangler secret`.

## 5. Branch protection (GitHub)

Mark required status checks from `.github/workflows/web-ci.yml` job names once the first PR is green (orchestrator / repo owner).