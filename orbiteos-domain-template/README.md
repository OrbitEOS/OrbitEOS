# OrbitEOS Domain Template

A starter template for building custom domains for the OrbitEOS platform.

## Structure

```
orbiteos-domain-template/
├── domain.json                    # Domain manifest (categories, DLD types, capabilities, apps)
├── packages/
│   ├── domain-api/                # Fastify API service (health, device state, registration)
│   ├── domain-mcp/                # MCP server with domain-specific tools
│   ├── domain-shared/             # Shared types + BaseDLD abstract class
│   └── domain-web/                # React components for domain UI
├── drivers/example-driver/        # Example device driver
└── scripts/
    ├── register.ts                # Register domain with platform
    └── dev.ts                     # Start dev server
```

## Getting Started

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Start development server
npm run dev

# Register with OrbitEOS platform
npm run register
```

## Creating a Domain

1. **Edit `domain.json`** — Define your domain slug, DLD types, sensors, actuators, capabilities, and apps
2. **Implement DLDs** — Extend `BaseDLD` in `packages/domain-shared/src/dld/` for each device type
3. **Build drivers** — Create drivers in `drivers/` that communicate with physical hardware
4. **Add API routes** — Expose device state and actions via `packages/domain-api/`
5. **Add MCP tools** — Enable AI agents to interact with your domain via `packages/domain-mcp/`
6. **Build UI** — Create React components in `packages/domain-web/` for the frontend

## Key Concepts

### DLD (Domain Logical Device)
A domain-specific abstraction over physical hardware. Each DLD type defines:
- **State schema** — The shape of the device's current state
- **Sensors** — Read-only data points (temperature, power, etc.)
- **Actuators** — Writable control points (set_mode, force_charge, etc.)
- **Valid actions** — Named operations the device supports (calibrate, reset, etc.)

### Physical Device
The actual hardware (protocol: modbus_tcp, mqtt, http, etc.). Multiple physical devices can feed into one DLD.

### PLD (Platform Logical Device)
A cross-domain aggregation of multiple DLDs. Created by the platform user to combine devices from different domains.

## Registration

Your domain service registers with the OrbitEOS platform at startup. The platform periodically health-checks registered domains.

```bash
# Register your running domain service
npm run register
```

This calls `POST /api/domains/register` on the platform with your domain's slug, name, and base URL.
