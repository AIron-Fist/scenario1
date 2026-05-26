// The new Company policy applied
const assert = require('node:assert/strict');
const test = require('node:test');

const { DEFAULT_NODE_ENV, getNodeEnv, startupMessages } = require('./index');

test('defaults NODE_ENV to development', () => {
  assert.equal(getNodeEnv({}), DEFAULT_NODE_ENV);
});

test('uses configured NODE_ENV when provided', () => {
  assert.equal(getNodeEnv({ NODE_ENV: 'production' }), 'production');
});

test('startup messages include the resolved environment', () => {
  assert.deepEqual(startupMessages({ NODE_ENV: 'test' }), [
    '🚀 Starting in [test] mode...',
    '✅ Keys Loaded Safely.',
  ]);
});
