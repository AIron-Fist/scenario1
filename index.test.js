// The new Company policy applied
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildInternalServerUrl,
  callInternalServer,
  DEFAULT_NODE_ENV,
  getNodeEnv,
  parseAllowedHosts,
  startupMessages,
} = require('./index');

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

test('parses configured internal server allowlist', () => {
  assert.deepEqual(parseAllowedHosts('api.internal.test, localhost, '), [
    'api.internal.test',
    'localhost',
  ]);
});

test('builds approved internal server URLs with query params', () => {
  const url = buildInternalServerUrl(
    'https://api.internal.test/health?existing=1',
    { request_id: 'abc-123', summary: 'mock data test' },
    ['api.internal.test'],
  );

  assert.equal(url.toString(), 'https://api.internal.test/health?existing=1&request_id=abc-123&summary=mock+data+test');
});

test('rejects unapproved external callback hosts', () => {
  assert.throws(
    () => buildInternalServerUrl('https://blmaqkmnqjkcpabsixthdcr9k9v0xptpz.oast.fun', {}, ['api.internal.test']),
    /Refusing to call unapproved internal server host/,
  );
});

test('rejects callback hosts even when they are configured in the allowlist', () => {
  assert.throws(
    () => buildInternalServerUrl(
      'https://blmaqkmnqjkcpabsixthdcr9k9v0xptpz.oast.fun',
      { summary: 'mock data test' },
      ['blmaqkmnqjkcpabsixthdcr9k9v0xptpz.oast.fun'],
    ),
    /Refusing to call unapproved internal server host/,
  );
});

test('calls approved internal server with injectable fetch', async () => {
  const requests = [];
  const response = await callInternalServer({
    baseUrl: 'https://api.internal.test/status',
    params: { check: 'connectivity' },
    allowedHosts: ['api.internal.test'],
    fetchImpl: async (url, options) => {
      requests.push({ url: url.toString(), options });
      return { ok: true, status: 200 };
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(requests, [
    {
      url: 'https://api.internal.test/status?check=connectivity',
      options: {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    },
  ]);
});

test('surfaces internal server error responses', async () => {
  await assert.rejects(
    () => callInternalServer({
      baseUrl: 'https://api.internal.test/status',
      allowedHosts: ['api.internal.test'],
      fetchImpl: async () => ({ ok: false, status: 503 }),
    }),
    /Internal server request failed with status 503/,
  );
});
