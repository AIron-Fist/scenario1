# Release Notes

## 1.0.0 - 2026-05-26

### Highlights

- Added a small Node.js startup app with dotenv-backed environment loading and a safe default `NODE_ENV` of `development`.
- Added startup messaging that confirms keys are loaded without printing configured secrets or connection strings.
- Added guarded internal server request helpers that only call approved HTTPS hosts.
- Hardened callback-host validation so known external callback domains are rejected even when explicitly allowlisted.
- Improved repository hygiene by ignoring local secret files and removing tracked environment/YAML secret material.

### Security

- Internal server calls now require an approved host allowlist and HTTPS URLs.
- Callback domains ending in `.oast.fun` are blocked before requests are made.
- Startup output is covered by tests to prevent accidental leakage of API keys, database URLs, or other sensitive values.
- Local `.env` and `secrets.yaml` files are ignored so secret material stays out of source control.

### Testing

- Added Node test coverage for environment defaults, startup output, allowlist parsing, URL construction, host rejection, and internal request handling.
- Added regression coverage for callback hosts that appear in the allowlist, including the reopened issue callback host case.

### Maintenance

- Added graceful handling for environments where `dotenv` is not installed.
- Added repository policy markers and release-note generation guidance files.
