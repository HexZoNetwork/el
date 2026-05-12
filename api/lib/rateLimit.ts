// In-memory storage for rate limiting (resets on function cold start)
const memoryStore = new Map<string, RateLimitState>();

export interface RateLimitState {
  failCount: number;
  lastFailTime: number;
  lockoutEndTime: number;
  penaltyLevel: number;
}

const FAILURES_PER_PENALTY = 5;
const PENALTIES = [5, 10, 20, 40, 80, 160]; // in minutes, doubles each time

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remainingSeconds: number;
  message: string;
}> {
  const now = Date.now();
  const state = memoryStore.get(ip);

  if (!state) {
    return { allowed: true, remainingSeconds: 0, message: "OK" };
  }

  if (state.lockoutEndTime > now) {
    const remainingSeconds = Math.ceil((state.lockoutEndTime - now) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      message: `Too many failed attempts. Try again in ${remainingSeconds}s`,
    };
  }

  memoryStore.delete(ip);
  return { allowed: true, remainingSeconds: 0, message: "OK" };
}

export async function recordFailure(ip: string): Promise<void> {
  const now = Date.now();
  const state = memoryStore.get(ip) || {
    failCount: 0,
    lastFailTime: 0,
    lockoutEndTime: 0,
    penaltyLevel: 0,
  };

  state.failCount++;
  state.lastFailTime = now;

  if (state.failCount >= FAILURES_PER_PENALTY) {
    const minutesToLock = PENALTIES[state.penaltyLevel] || PENALTIES[PENALTIES.length - 1];
    state.lockoutEndTime = now + minutesToLock * 60 * 1000;
    state.penaltyLevel++;
    state.failCount = 0;
  }

  memoryStore.set(ip, state);
}

export async function resetRateLimit(ip: string): Promise<void> {
  memoryStore.delete(ip);
}
