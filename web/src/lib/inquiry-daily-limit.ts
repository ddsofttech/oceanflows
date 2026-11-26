import { normalizeInquiryEmail } from "./inquiry-email-normalize";

export const DAILY_INQUIRY_MAX_PER_UTC_DAY = 3;

export type InquiryKvNamespace = {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
};

export type DailyLimitReserveResult =
  | { ok: true }
  | { ok: false; reason: "daily_limit_reached" }
  | { ok: false; reason: "store_error" };

export interface InquiryDailyLimitStore {
  reserveDailyInquirySlot(
    normalizedEmail: string,
    pepper: string,
    now?: Date,
  ): Promise<DailyLimitReserveResult>;
}

/** Seconds until next UTC midnight (minimum 60 for KV TTL). */
export function secondsUntilNextUtcMidnight(now = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  const seconds = Math.floor((next - now.getTime()) / 1000);
  return Math.max(60, seconds);
}

export function utcDayKeySegment(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export async function hashedDailyLimitKeyPart(
  pepper: string,
  normalizedEmail: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${pepper}${normalizedEmail}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function buildDailyLimitKvKey(
  daySegment: string,
  hashHex: string,
): string {
  return `inquiry:daily:${daySegment}:${hashHex}`;
}

function parseCount(raw: string | null): number {
  if (raw === null || raw.trim().length === 0) {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

async function reserveOnKey(
  store: {
    get(key: string): Promise<string | null>;
    put(
      key: string,
      value: string,
      options?: { expirationTtl?: number },
    ): Promise<void>;
  },
  key: string,
  ttlSeconds: number,
): Promise<DailyLimitReserveResult> {
  try {
    const current = parseCount(await store.get(key));
    if (current >= DAILY_INQUIRY_MAX_PER_UTC_DAY) {
      return { ok: false, reason: "daily_limit_reached" };
    }
    const next = current + 1;
    await store.put(key, String(next), {
      expirationTtl: ttlSeconds,
    });
    return { ok: true };
  } catch {
    return { ok: false, reason: "store_error" };
  }
}

export class KvInquiryDailyLimitStore implements InquiryDailyLimitStore {
  constructor(private readonly kv: InquiryKvNamespace) {}

  async reserveDailyInquirySlot(
    normalizedEmail: string,
    pepper: string,
    now = new Date(),
  ): Promise<DailyLimitReserveResult> {
    const day = utcDayKeySegment(now);
    const hash = await hashedDailyLimitKeyPart(pepper, normalizedEmail);
    const key = buildDailyLimitKvKey(day, hash);
    const ttl = secondsUntilNextUtcMidnight(now);
    return reserveOnKey(this.kv, key, ttl);
  }
}

/** Shared in-memory backend for unit tests (NFR-11 cross-call cap). */
export function createMemoryInquiryDailyLimitStore(): InquiryDailyLimitStore & {
  reset(): void;
  peekCount(normalizedEmail: string, pepper: string, now?: Date): Promise<number>;
} {
  const values = new Map<string, number>();

  return {
    reset(): void {
      values.clear();
    },
    async peekCount(
      normalizedEmail: string,
      pepper: string,
      now = new Date(),
    ): Promise<number> {
      const day = utcDayKeySegment(now);
      const hash = await hashedDailyLimitKeyPart(pepper, normalizedEmail);
      const key = buildDailyLimitKvKey(day, hash);
      return values.get(key) ?? 0;
    },
    async reserveDailyInquirySlot(
      normalizedEmail: string,
      pepper: string,
      now = new Date(),
    ): Promise<DailyLimitReserveResult> {
      const day = utcDayKeySegment(now);
      const hash = await hashedDailyLimitKeyPart(pepper, normalizedEmail);
      const key = buildDailyLimitKvKey(day, hash);
      const ttl = secondsUntilNextUtcMidnight(now);
      const backend = {
        get: async (k: string) => {
          const count = values.get(k);
          return count === undefined ? null : String(count);
        },
        put: async (k: string, v: string, _opts?: { expirationTtl?: number }) => {
          values.set(k, parseCount(v));
        },
      };
      return reserveOnKey(backend, key, ttl);
    },
  };
}

export function resolveInquiryDailyLimitStore(
  kv: InquiryKvNamespace | undefined,
): InquiryDailyLimitStore | null {
  if (!kv) {
    return null;
  }
  return new KvInquiryDailyLimitStore(kv);
}

/** Reserve a slot for a raw email after BR-14 normalization. */
export async function reserveInquiryDailySlot(
  store: InquiryDailyLimitStore,
  email: string,
  pepper: string,
  now?: Date,
): Promise<DailyLimitReserveResult> {
  return store.reserveDailyInquirySlot(
    normalizeInquiryEmail(email),
    pepper,
    now,
  );
}