'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { fixedWindowRateLimitAllow } = require('../lib/fixedWindowRateLimit');

describe('fixedWindowRateLimitAllow (memory fallback)', () => {
  it('allows up to max requests then blocks with retryAfterSec', async () => {
    const memoryBuckets = new Map();
    const opts = {
      redisClient: null,
      namespace: 'unit',
      ip: '203.0.113.1',
      windowMs: 60_000,
      max: 3,
      memoryBuckets,
    };
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    const blocked = await fixedWindowRateLimitAllow(opts);
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfterSec >= 1);
    assert.ok(blocked.retryAfterSec <= 60);
  });

  it('resets window after windowMs elapses', async () => {
    const memoryBuckets = new Map();
    const windowMs = 80;
    const opts = {
      redisClient: null,
      namespace: 'unit2',
      ip: '203.0.113.2',
      windowMs,
      max: 2,
      memoryBuckets,
    };
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    const blocked = await fixedWindowRateLimitAllow(opts);
    assert.equal(blocked.ok, false);
    await new Promise((r) => setTimeout(r, windowMs + 150));
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
  });
});

describe('fixedWindowRateLimitAllow (Redis path)', () => {
  it('uses INCR/TTL when redisClient succeeds', async () => {
    const memoryBuckets = new Map();
    const counts = new Map();
    const ttls = new Map();
    const redisClient = {
      async incr(key) {
        const n = (counts.get(key) || 0) + 1;
        counts.set(key, n);
        return n;
      },
      async expire(key, sec) {
        ttls.set(key, sec);
      },
      async ttl() {
        return 42;
      },
    };
    const opts = {
      redisClient,
      namespace: 'unit-redis',
      ip: '198.51.100.9',
      windowMs: 60_000,
      max: 2,
      memoryBuckets,
    };
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    const blocked = await fixedWindowRateLimitAllow(opts);
    assert.equal(blocked.ok, false);
    assert.equal(blocked.retryAfterSec, 42);
  });

  it('falls back to memory when Redis incr throws', async () => {
    const memoryBuckets = new Map();
    const redisClient = {
      async incr() {
        throw new Error('redis down');
      },
      async expire() {},
      async ttl() {
        return -1;
      },
    };
    const opts = {
      redisClient,
      namespace: 'unit-fail',
      ip: '198.51.100.10',
      windowMs: 60_000,
      max: 1,
      memoryBuckets,
    };
    assert.deepEqual(await fixedWindowRateLimitAllow(opts), { ok: true, retryAfterSec: 0 });
    const blocked = await fixedWindowRateLimitAllow(opts);
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfterSec >= 1);
  });
});
