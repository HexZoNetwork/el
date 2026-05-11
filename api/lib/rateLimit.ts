let kvAvailable = false;
let kv: any = null;

try {
  const kvModule = await import("@vercel/kv");
  kv = kvModule.kv;
  kvAvailable = !!kv;
} catch (err) {
  console.warn("Vercel KV not configured, using in-memory fallback");
}

// In-memory fallback (will reset on function restart)
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

  if (kvAvailable && kv) {
    try {
      const key = `rate-limit:${ip}`;
      const state = await kv.get<RateLimitState>(key);

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

      await kv.del(key);
      return { allowed: true, remainingSeconds: 0, message: "OK" };
    } catch (err) {
      console.error("KV rate limit check failed, using fallback:", err);
    }
  }

  // Fallback to in-memory
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

  if (kvAvailable && kv) {
    try {
      const key = `rate-limit:${ip}`;
      const state = (await kv.get<RateLimitState>(key)) || {
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

      await kv.setex(key, 24 * 60 * 60, JSON.stringify(state));
      return;
    } catch (err) {
      console.error("KV record failure failed, using fallback:", err);
    }
  }

  // Fallback to in-memory
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
  if (kvAvailable && kv) {
    try {
      const key = `rate-limit:${ip}`;
      await kv.del(key);
      return;
    } catch (err) {
      console.error("KV reset failed, using fallback:", err);
    }
  }

  memoryStore.delete(ip);
}
