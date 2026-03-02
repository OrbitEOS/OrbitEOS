# Authentication

OrbitEOS uses **OAuth 2.1** with PKCE and Dynamic Client Registration (DCR).

## Endpoints

- **Authorization** — `https://mcp.orbiteos.cloud/oauth/authorize`
- **Token** — `https://mcp.orbiteos.cloud/oauth/token`
- **Registration (DCR)** — `https://mcp.orbiteos.cloud/oauth/register`

## Flow

Grant type: `authorization_code` with `S256` PKCE. Public clients (no client secret required).

## Scopes

- **`sites:read`** — Read site data
- **`sites:write`** — Create/update/delete sites
- **`components:read`** — Read component configuration
- **`components:write`** — Create/update/delete components
- **`channels:read`** — Read channel values
- **`channels:write`** — Write to channels
- **`history:read`** — Query historical data
- **`history:export`** — Export data as CSV
- **`users:read`** — Read user information
- **`users:write`** — Create/update/delete users
- **`roles:read`** — Read roles and permissions
- **`roles:write`** — Create/update/delete roles
- **`system:logs`** — Access system logs
- **`system:commands`** — Execute system commands
