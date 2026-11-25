const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 5;

const hitsByIp = new Map<string, number[]>();

/** Clears in-memory counters (unit tests only). */
export function resetInquiryRateLimit(): void {
  hitsByIp.clear();
}

/**
 * Client key for rate limiting (TM-12).
 * Uses Cloudflare's trusted header; never X-Forwarded-For alone.
 */
export function getInquiryClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIp && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }
  return "local-unknown";
}

export function consumeInquiryRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const prior = hitsByIp.get(ip) ?? [];
  const windowed = prior.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (windowed.length >= RATE_LIMIT_MAX_PER_WINDOW) {
    hitsByIp.set(ip, windowed);
    return { allowed: false };
  }
  windowed.push(now);
  hitsByIp.set(ip, windowed);
  return { allowed: true };
}
