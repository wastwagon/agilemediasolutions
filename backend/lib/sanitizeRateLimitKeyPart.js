'use strict';

/** Normalize client IP (or other identifier) for use inside Redis key suffixes. */
function sanitizeRateLimitKeyPart(value) {
  return String(value || 'unknown').replace(/[^\w.-]/g, '_').slice(0, 120);
}

module.exports = { sanitizeRateLimitKeyPart };
