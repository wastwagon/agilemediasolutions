'use strict';

const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const root = join(__dirname, '..');
const testDir = join(root, 'test');

let files;
try {
  files = readdirSync(testDir)
    .filter((f) => f.endsWith('.test.js'))
    .map((f) => join(testDir, f))
    .sort();
} catch (err) {
  console.error('Cannot read test directory:', err.message);
  process.exit(1);
}

if (files.length === 0) {
  console.error('No *.test.js files found in test/');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...files], {
  stdio: 'inherit',
  cwd: root,
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.signal) {
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
