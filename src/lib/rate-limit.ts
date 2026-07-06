const ratelimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = ratelimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    ratelimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function rateLimitPostcard(ip: string): { success: boolean; remaining: number } {
  return rateLimit(`postcard-daily:${ip}`, 5, DAY_MS);
}
