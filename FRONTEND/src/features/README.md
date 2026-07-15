# Feature modules

Each portal area owns its API service, types, hooks, components, and pages:

- `auth` — login, registration, session handling, and token lifecycle
- `customer` — customer-facing endpoint test screens
- `vendor` — vendor workflows and analytics
- `admin` — administration workflows
- `developer-tools` — request telemetry and runtime diagnostics

Shared UI belongs in `src/components`, application-wide state in `src/contexts`,
and cross-cutting HTTP concerns in `src/api`.
