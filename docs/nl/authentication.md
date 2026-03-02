# Authenticatie

OrbitEOS gebruikt **OAuth 2.1** met PKCE en Dynamic Client Registration (DCR).

## Eindpunten

- **Autorisatie** — `https://mcp.orbiteos.cloud/oauth/authorize`
- **Token** — `https://mcp.orbiteos.cloud/oauth/token`
- **Registratie (DCR)** — `https://mcp.orbiteos.cloud/oauth/register`

## Stroom

Grant type: `authorization_code` met `S256` PKCE. Publieke clients (geen client secret vereist).

## Scopes

- **`sites:read`** — Sitedata lezen
- **`sites:write`** — Sites aanmaken/bijwerken/verwijderen
- **`components:read`** — Componentconfiguratie lezen
- **`components:write`** — Componenten aanmaken/bijwerken/verwijderen
- **`channels:read`** — Kanaalwaarden lezen
- **`channels:write`** — Naar kanalen schrijven
- **`history:read`** — Historische data opvragen
- **`history:export`** — Data exporteren als CSV
- **`users:read`** — Gebruikersinformatie lezen
- **`users:write`** — Gebruikers aanmaken/bijwerken/verwijderen
- **`roles:read`** — Rollen en rechten lezen
- **`roles:write`** — Rollen aanmaken/bijwerken/verwijderen
- **`system:logs`** — Toegang tot systeemlogboeken
- **`system:commands`** — Systeenopdrachten uitvoeren
