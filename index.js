// The new Company policy applied
function loadDotenv() {
  try {
    require('dotenv').config();
  } catch (error) {
    if (error && error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
  }
}

loadDotenv();

const DEFAULT_NODE_ENV = 'development';
const DEFAULT_ALLOWED_INTERNAL_HOSTS = ['localhost', '127.0.0.1', '::1'];
const BLOCKED_CALLBACK_HOST_SUFFIXES = ['.oast.fun'];

function getNodeEnv(env = process.env) {
  return env.NODE_ENV || DEFAULT_NODE_ENV;
}

function parseAllowedHosts(value) {
  if (!value) {
    return DEFAULT_ALLOWED_INTERNAL_HOSTS;
  }

  return value
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedInternalUrl(url, allowedHosts = DEFAULT_ALLOWED_INTERNAL_HOSTS) {
  const hostname = url.hostname.toLowerCase();
  const allowed = new Set(allowedHosts.map((host) => host.toLowerCase()));

  return (
    url.protocol === 'https:' &&
    allowed.has(hostname) &&
    !BLOCKED_CALLBACK_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  );
}

function buildInternalServerUrl(baseUrl, params = {}, allowedHosts = DEFAULT_ALLOWED_INTERNAL_HOSTS) {
  if (!baseUrl) {
    throw new Error('INTERNAL_SERVER_URL is required');
  }

  const url = new URL(baseUrl);

  if (!isAllowedInternalUrl(url, allowedHosts)) {
    throw new Error(`Refusing to call unapproved internal server host: ${url.hostname}`);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function callInternalServer({
  baseUrl,
  params,
  allowedHosts,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required');
  }

  const url = buildInternalServerUrl(baseUrl, params, allowedHosts);
  const response = await fetchImpl(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Internal server request failed with status ${response.status}`);
  }

  return response;
}

function startupMessages(env = process.env) {
  return [
    `🚀 Starting in [${getNodeEnv(env)}] mode...`,
    '✅ Keys Loaded Safely.',
  ];
}

if (require.main === module) {
  startupMessages().forEach((message) => console.log(message));
}

module.exports = {
  DEFAULT_NODE_ENV,
  DEFAULT_ALLOWED_INTERNAL_HOSTS,
  BLOCKED_CALLBACK_HOST_SUFFIXES,
  buildInternalServerUrl,
  callInternalServer,
  getNodeEnv,
  parseAllowedHosts,
  loadDotenv,
  startupMessages,
};
