// Compliant
require('dotenv').config();

const DEFAULT_NODE_ENV = 'development';

function getNodeEnv(env = process.env) {
  return env.NODE_ENV || DEFAULT_NODE_ENV;
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
  getNodeEnv,
  startupMessages,
};
