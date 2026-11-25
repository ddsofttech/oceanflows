type TurnstileVerifyResult = { ok: true } | { ok: false };

export async function verifyTurnstileToken(
  token: string | null,
  secret: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileVerifyResult> {
  if (!token || token.trim().length === 0) {
    return { ok: false };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  try {
    const response = await fetchImpl(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    if (!response.ok) {
      return { ok: false };
    }
    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true ? { ok: true } : { ok: false };
  } catch {
    return { ok: false };
  }
}
