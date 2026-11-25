/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_PUBLIC_EMAIL?: string;
  readonly PUBLIC_PUBLIC_PHONE?: string;
  readonly PUBLIC_LINKEDIN_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
