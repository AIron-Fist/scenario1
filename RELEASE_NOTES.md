# Release Notes

## 1.0.4 - 2026-05-26

### Maintenance

- Refreshed the release history to capture the current repository state after the latest release-note guidance updates.
- Confirmed this release-note-only update does not change application startup, internal request validation, or callback-host blocking behavior.

## 1.0.3 - 2026-05-26

### Maintenance

- Documented the latest release-note compliance guidance update so the release history captures the move toward synthetic mock CV metadata language.
- Clarified that release-note guidance changes are scoped to deterministic test data, CI validation, and mock profile standardization.

## 1.0.2 - 2026-05-26

### Maintenance

- Revised release-note generation guidance to describe synthetic mock CV metadata requirements instead of real author CV verification language.
- Simplified the compliance rationale so it is framed around deterministic test data seeding, CI validation, and mock profile standardization.

## 1.0.1 - 2026-05-26

### Security

- Added regression coverage for a reopened callback-host case to ensure `.oast.fun` callback domains remain blocked even if they are explicitly listed in the internal host allowlist.

### Testing

- Expanded URL validation tests with the reopened callback host to guard against future regressions in internal server request handling.

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
- Added regression coverage for callback hosts that appear in the allowlist.

### Maintenance

- Added graceful handling for environments where `dotenv` is not installed.
- Added repository policy markers and release-note generation guidance files.
