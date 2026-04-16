'use strict';

const { sanitizeRateLimitKeyPart } = require('./sanitizeRateLimitKeyPart');

/**
 * Fixed-window count per IP. Uses Redis INCR+EXPIRE when redisClient is truthy; otherwise in-memory Map.
 * @param {{ redisClient?: object | null, namespace: string, ip: string, windowMs: number, max: number, memoryBuckets: Map<string, { start: number, count: number }> }} opts
 * @returns {Promise<{ ok: boolean, retryAfterSec: number }>}
 */
async function fixedWindowRateLimitAllow(opts) {
  const { redisClient, namespace, ip, windowMs, max, memoryBuckets } = opts;
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const safeKey = sanitizeRateLimitKeyPart(ip);
  const redisKey = `rl:ams:${namespace}:${safeKey}`;
  if (redisClient) {
    try {
      const n = await redisClient.incr(redisKey);
      if (n === 1) await redisClient.expire(redisKey, windowSec);
      if (n > max) {
        const ttl = await redisClient.ttl(redisKey);
        const retryAfterSec = Math.max(1, ttl > 0 ? ttl : windowSec);
        return { ok: false, retryAfterSec };
      }
      return { ok: true, retryAfterSec: 0 };
    } catch (err) {
      console.error(`Rate limit Redis (${namespace}):`, err.message);
    }
  }
  const now = Date.now();
  let b = memoryBuckets.get(safeKey);
  if (!b || now - b.start > windowMs) {
    b = { start: now, count: 0 };
    memoryBuckets.set(safeKey, b);
  }
  b.count += 1;
  if (b.count > max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.start + windowMs - now) / 1000)) };
  }
  return { ok: true, retryAfterSec: 0 };
}

module.exports = { fixedWindowRateLimitAllow };
