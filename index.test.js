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

test('startup messages do not expose configured secrets', () => {
  const messages = startupMessages({
    NODE_ENV: 'production',
    STRIPE_LIVE_SECRET_KEY: 'sk_live_should_not_be_printed',
    SENDGRID_API_KEY: 'sendgrid_should_not_be_printed',
    DATABASE_URL: 'postgres://user:password@example.com:5432/app',
  });

  assert.equal(messages.join('\n').includes('sk_live_should_not_be_printed'), false);
  assert.equal(messages.join('\n').includes('sendgrid_should_not_be_printed'), false);
  assert.equal(messages.join('\n').includes('postgres://user:password@example.com:5432/app'), false);
});
