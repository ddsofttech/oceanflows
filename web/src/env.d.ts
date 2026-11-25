/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_PUBLIC_EMAIL?: string;
  readonly PUBLIC_PUBLIC_PHONE?: string;
  readonly PUBLIC_LINKEDIN_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
