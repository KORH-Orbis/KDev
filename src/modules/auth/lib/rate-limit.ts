const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, RateLimitEntry>();

export function isBlocked(email: string): boolean {
  const entry = attempts.get(email);
  if (!entry) return false;

  if (Date.now() > entry.resetAt) {
    attempts.delete(email);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(email: string): void {
  const entry = attempts.get(email);
  const now = Date.now();

  if (!entry || now > entry.resetAt) {
    attempts.set(email, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function resetAttempts(email: string): void {
  attempts.delete(email);
}

export function getRemainingMinutes(email: string): number {
  const entry = attempts.get(email);
  if (!entry) return 0;
  return Math.ceil((entry.resetAt - Date.now()) / 60000);
}
