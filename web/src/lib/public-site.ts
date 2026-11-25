const DEFAULT_BOOKING_URL = "https://cal.com";
const DEFAULT_PUBLIC_EMAIL = "contact@ddsofttech.com";

export function publicSiteLinks() {
  const bookingUrl =
    import.meta.env.PUBLIC_BOOKING_URL?.trim() || DEFAULT_BOOKING_URL;
  const publicEmail =
    import.meta.env.PUBLIC_PUBLIC_EMAIL?.trim() || DEFAULT_PUBLIC_EMAIL;
  const inquiryEmail = publicEmail;
  return { bookingUrl, publicEmail, inquiryEmail };
}
