const DEFAULT_PUBLIC_EMAIL = "contact@ddsofttech.com";
const DEFAULT_BOOKING_URL = "https://cal.com";

function trimPublicEnv(name: keyof ImportMetaEnv): string | undefined {
  const raw = import.meta.env[name];
  if (typeof raw !== "string") {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Build-time public contact and booking configuration (PUBLIC_* only). */
export function publicSiteConfig() {
  const bookingUrl = trimPublicEnv("PUBLIC_BOOKING_URL");
  const publicEmail =
    trimPublicEnv("PUBLIC_PUBLIC_EMAIL") ?? DEFAULT_PUBLIC_EMAIL;
  const phone = trimPublicEnv("PUBLIC_PUBLIC_PHONE");
  const linkedInUrl = trimPublicEnv("PUBLIC_LINKEDIN_URL");
  const turnstileSiteKey = trimPublicEnv("PUBLIC_TURNSTILE_SITE_KEY");
  const isProd = import.meta.env.PROD;

  const bookingAvailable = Boolean(bookingUrl) || isProd;
  const resolvedBookingUrl =
    bookingUrl ?? (isProd ? DEFAULT_BOOKING_URL : undefined);

  return {
    publicEmail,
    phone,
    linkedInUrl,
    turnstileSiteKey,
    bookingUrl: resolvedBookingUrl,
    bookingAvailable,
  };
}

export function publicSiteLinks() {
  const site = publicSiteConfig();
  return {
    bookingUrl: site.bookingUrl ?? DEFAULT_BOOKING_URL,
    publicEmail: site.publicEmail,
    inquiryEmail: site.publicEmail,
  };
}
