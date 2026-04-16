'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeRateLimitKeyPart } = require('../lib/sanitizeRateLimitKeyPart');

describe('sanitizeRateLimitKeyPart', () => {
  it('preserves IPv4-like segments', () => {
    assert.equal(sanitizeRateLimitKeyPart('192.168.0.1'), '192.168.0.1');
  });

  it('replaces unsafe characters with underscores', () => {
    assert.equal(sanitizeRateLimitKeyPart('a:b@c#d'), 'a_b_c_d');
  });

  it('truncates long values', () => {
    const long = 'x'.repeat(200);
    assert.equal(sanitizeRateLimitKeyPart(long).length, 120);
  });

  it('defaults empty to unknown', () => {
    assert.equal(sanitizeRateLimitKeyPart(''), 'unknown');
    assert.equal(sanitizeRateLimitKeyPart(null), 'unknown');
  });
});
