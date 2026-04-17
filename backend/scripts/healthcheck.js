#!/usr/bin/env node
/**
 * Docker/Coolify healthcheck — node:20-alpine has no wget/curl by default.
 */
const http = require('http');
const port = parseInt(process.env.PORT || '4000', 10);
const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});
req.on('error', () => process.exit(1));
req.setTimeout(8000, () => {
  req.destroy();
  process.exit(1);
});
