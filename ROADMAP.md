# OrbitEOS Product Roadmap

> **Vision**: The Homey for high-end residential, commercial, and industrial energy management.
> Homey nails consumer UX for smart homes. OrbitEOS takes the same philosophy to serious energy systems — luxury homes, factories, solar farms, and energy communities.

---

## Current State (What We Have)

### Strengths (keep & strengthen)
- Multi-tenant hierarchy: Account > Sub-account > Site (region/hub/site/zone)
- RBAC with 5 roles, 25 permissions, per-site access control
- Live energy flow visualization (animated SVG, particle effects)
- Historical charts with 5 tabs (overview, production, consumption, storage, grid)
- Edge controller management (components, channels, config)
- Optimization strategies (peak shaving, self-consumption, ToU, grid-optimized charge)
- Native MCP server with 50+ tools (AI-first control)
- Platform admin (users, roles, accounts, settings, audit log)
- Marketplace with 9 categories, plugin-to-site assignment
- CSV/XLSX data export
- Dual auth (WebSocket + JWT REST API)
- TimescaleDB for time-series data

### DB Schema Ready (no UI yet)
- Phase 5: Alert rules + notification channels (email, slack, push, webhook, SMS)
- Phase 6: Scheduled reports (daily/weekly/monthly, PDF/HTML/CSV)
- Phase 7: Tariffs + billing (flat, time-of-use, tiered, demand pricing)
- Phase 8: Custom dashboards (templates, widgets with grid position, per-user overrides)

### Gaps vs Homey
- No cost/tariff UI (schema exists)
- No custom dashboards (schema exists)
- No alert management UI (schema exists)
- No report scheduling UI (schema exists)
- No per-device energy ranking ("top consumers")
- No automation builder (Flows)
- No device taxonomy (formal classes + capabilities)
- No scenes/presets
- No developer SDK or submission portal
- No dynamic spot pricing integration
- No consumer-friendly onboarding
- No mobile app (responsive web only)

---

## Target Personas

| # | Persona | Segment | Key Needs |
|---|---------|---------|-----------|
| P1 | **Estate Owner** | High-end residential | Luxury home with solar + battery + EV + pool + HVAC. Wants beautiful dashboard, cost savings visibility, automated scenes |
| P2 | **Facility Manager** | Commercial | Factory/office with solar + battery + EV fleet. Needs peak shaving, demand charge management, multi-zone monitoring |
| P3 | **Energy Portfolio Manager** | Industrial / Communities | Manages 10-500 sites across regions. Needs fleet overview, comparative analytics, automated reporting |
| P4 | **Solar/Storage Installer** | Professional services | Deploys and maintains systems for clients. Needs remote monitoring, fleet management, alert escalation |
| P5 | **Building Automation Integrator** | System integrator | Connects BMS, HVAC, lighting with energy. Needs protocol flexibility, custom dashboards, automation rules |
| P6 | **Energy Developer** | Plugin/integration builder | Builds drivers for inverters, meters, BMS. Needs SDK, docs, submission process, marketplace presence |

---

## Implementation Phases

---

### Phase 1: Cost Intelligence (Tariffs & Billing UI)
**Goal**: Show users how much their energy costs and saves — the #1 feature that drives ROI conversations.
**DB**: Tables exist (Phase 7). Need API routes + frontend.

| # | Task | Type | Detail |
|---|------|------|--------|
| 1.1 | Tariff CRUD API routes | Backend | `POST/GET/PUT/DELETE /tariffs`, `/tariff-rates`, `/site-tariffs`. Expose flat, time-of-use, tiered, demand rate types |
| 1.2 | Tariff management page | Frontend | New admin page `/admin/tariffs`. Table of tariffs with rate editor. Assign tariffs to sites with effective dates |
| 1.3 | Billing computation engine | Backend | Cron job or on-demand: query energy totals per billing period, apply tariff rates, write `billing_periods` table |
| 1.4 | Cost overlay on History page | Frontend | Add cost (EUR/USD) alongside kWh on all history charts. New "Cost" tab with import cost, export revenue, net cost |
| 1.5 | Cost summary cards on Dashboard | Frontend | Cards showing: today's cost, month-to-date cost, projected monthly cost, savings from solar |
| 1.6 | Site cost comparison widget | Frontend | For portfolio managers: compare cost/kWh across sites, rank by efficiency |
| 1.7 | Dynamic pricing integration | Backend | API service to fetch spot prices from ENTSO-E (EU), aWATTar, Tibber. Store as `dynamic` tariff type. Auto-update hourly |
| 1.8 | Dynamic price chart | Frontend | Show current and next-24h electricity prices. Highlight cheapest windows for battery charging |

---

### Phase 2: Custom Dashboards & Widgets
**Goal**: Every user gets a dashboard tailored to their role and sites — from a homeowner's single-screen overview to a portfolio manager's fleet map.
**DB**: Tables exist (Phase 8). Need API routes + frontend widget system.

| # | Task | Type | Detail |
|---|------|------|--------|
| 2.1 | Dashboard CRUD API routes | Backend | `POST/GET/PUT/DELETE /dashboards`, `/dashboard-widgets`. Support template sharing across account |
| 2.2 | Widget registry | Frontend | Registry of available widget types with render component, default config, min/max size. Start with 12 built-in widgets |
| 2.3 | Dashboard grid layout engine | Frontend | `react-grid-layout` for drag-and-drop widget placement. Responsive breakpoints (desktop: 12-col, tablet: 6-col, mobile: 2-col) |
| 2.4 | Built-in widgets (core 12) | Frontend | See widget list below |
| 2.5 | Dashboard switcher | Frontend | Dropdown/tabs to switch between dashboards per site. "Edit mode" toggle for drag-and-drop |
| 2.6 | Per-user dashboard overrides | Frontend | Users can customize their view of a shared template. Stored in `user_dashboards.overrides` |
| 2.7 | Dashboard templates by site type | Backend + Frontend | Pre-built templates: "Residential", "Commercial", "Solar Farm", "Industrial". Auto-assigned on site creation |
| 2.8 | Kiosk mode | Frontend | Full-screen mode for wall-mounted displays. Auto-rotate between dashboards. Hide nav/chrome |
| 2.9 | Plugin widgets | Frontend | Marketplace plugins can register custom widget types. Rendered in sandboxed iframe with postMessage API |

**Built-in Widget Types**:

| # | Widget | Size | Description |
|---|--------|------|-------------|
| W1 | Energy Flow | 6x4 | Animated SVG flow diagram (existing EnergyFlowHub) |
| W2 | Power Summary | 6x2 | Grid, solar, battery, consumption cards (existing PowerSummaryRow) |
| W3 | Autarchy Gauge | 2x2 | Circular gauge showing self-sufficiency % |
| W4 | Self-Consumption Gauge | 2x2 | Circular gauge showing self-consumption % |
| W5 | Battery Status | 2x2 | SoC bar + charge/discharge indicator |
| W6 | Cost Today | 2x2 | Today's energy cost with trend arrow |
| W7 | Energy Chart | 6x3 | Configurable time-series chart (production/consumption/grid) |
| W8 | Top Consumers | 4x4 | Ranked list of devices by energy consumption (see Phase 3) |
| W9 | System Health | 3x2 | Online/offline status, grid mode, alerts count |
| W10 | Weather | 2x3 | Temperature + solar irradiance forecast |
| W11 | Site Map | 6x4 | Geographic map with site markers (for portfolio view) |
| W12 | Alert Feed | 4x3 | Recent alerts with severity badges |

---

### Phase 3: Device Intelligence & Energy Ranking
**Goal**: Know exactly which device consumes what. Formal device taxonomy replaces raw factoryId pattern matching.

| # | Task | Type | Detail |
|---|------|------|--------|
| 3.1 | Device class taxonomy | Shared | Define formal device classes: `solar_inverter`, `battery_storage`, `grid_meter`, `ev_charger`, `heat_pump`, `hvac`, `lighting_controller`, `production_meter`, `consumption_meter`, `io_controller`, `generic`. Map from OpenEMS factoryId patterns |
| 3.2 | Device capability system | Shared | Typed capabilities per class: `measure_power` (W), `meter_power` (kWh), `measure_battery_soc` (%), `measure_voltage` (V), `measure_current` (A), `measure_temperature` (C), `target_power` (W). Auto-derived from OpenEMS channel addresses |
| 3.3 | Top consumers computation | Backend | Periodic job: query `meter_power` per component, compute kWh per day/week/month, rank by consumption. Apply tariff for cost. Store in summary table |
| 3.4 | Top consumers widget | Frontend | Ranked bar chart: device name, kWh, % of total, cost. Filterable by period (today/week/month/year) |
| 3.5 | Device detail page | Frontend | `/devices/:id` — live channel values, historical chart, energy summary, configuration. Replace current modal with full page |
| 3.6 | Device health indicators | Frontend | Per-device: online/offline badge, last-seen timestamp, warning/fault indicators from component channels |
| 3.7 | Device groups | Frontend + Backend | Group devices by user-defined tags (e.g., "Building A EV Chargers", "Rooftop Solar"). Aggregate power display |
| 3.8 | Device comparison | Frontend | Compare 2-4 devices side by side: production, consumption, efficiency over time |

---

### Phase 4: Alerts, Notifications & Reports
**Goal**: Proactive monitoring — don't wait for users to check the dashboard.
**DB**: Tables exist (Phase 5 + 6). Need API routes + frontend.

| # | Task | Type | Detail |
|---|------|------|--------|
| 4.1 | Alert rules CRUD API | Backend | `POST/GET/PUT/DELETE /alert-rules`. Support conditions: `gt`, `lt`, `eq`, `ne`, `absent`. Per-site scoping |
| 4.2 | Notification channels CRUD API | Backend | `POST/GET/PUT/DELETE /notification-channels`. Types: email, Slack, webhook, push, SMS |
| 4.3 | Alert evaluation engine | Backend | Background worker: evaluate rules against live channel data every 30s. Respect `duration_seconds` for debounce. Write `alert_history` on trigger |
| 4.4 | Notification dispatch | Backend | Send alerts to mapped channels. Email via SMTP (configured in settings). Slack via webhook URL. Push via web push API. Webhook via HTTP POST |
| 4.5 | Alert management page | Frontend | `/admin/alerts` — table of rules with inline status, severity badges. Create/edit modal with channel selector, condition builder, site scope |
| 4.6 | Notification channels page | Frontend | `/admin/notifications` — manage email, Slack, webhook endpoints. Test button per channel |
| 4.7 | Alert feed widget | Frontend | Dashboard widget showing recent alerts. Click to acknowledge. Filter by severity |
| 4.8 | Alert badge in nav | Frontend | Bell icon in TopBar with unacknowledged count. Dropdown preview of recent alerts |
| 4.9 | Report scheduling API | Backend | `POST/GET/PUT/DELETE /report-schedules`. Cron-based triggers. Generate PDF/HTML/CSV from templates |
| 4.10 | Report generation engine | Backend | Template renderer: pull energy data for period, apply tariffs, generate charts (server-side), compile PDF. Store in S3/local |
| 4.11 | Report management page | Frontend | `/admin/reports` — schedule list, recent report history with download links, manual "Run now" button |
| 4.12 | Scheduled email delivery | Backend | Auto-email reports to recipients on schedule. Attach PDF or inline HTML |

---

### Phase 5: Automation Engine (Rules & Flows)
**Goal**: User-defined automation without code. "When battery SoC drops below 20% AND it's off-peak hours, THEN charge from grid."

| # | Task | Type | Detail |
|---|------|------|--------|
| 5.1 | Automation rules schema | Backend | New tables: `platform.automation_rules` (id, site_id, name, enabled, trigger JSONB, conditions JSONB[], actions JSONB[], priority, created_by). `platform.automation_history` (hypertable for execution log) |
| 5.2 | Trigger types | Backend | Channel value change, channel threshold crossed, schedule (cron), time-of-day, sunrise/sunset, alert fired, price threshold, manual |
| 5.3 | Condition types | Backend | Channel value comparison, time window, day of week, battery SoC range, grid mode, system state, variable comparison |
| 5.4 | Action types | Backend | Set channel value, execute system command, send notification, set variable, delay, enable/disable controller, API webhook call |
| 5.5 | Automation evaluation engine | Backend | Event-driven: on channel data change, evaluate matching triggers. Check conditions. Execute actions in order. Log to history |
| 5.6 | Variables system | Backend + Frontend | New table `platform.variables` (id, site_id, name, type [boolean/number/string], value JSONB). CRUD API. Use in conditions and actions |
| 5.7 | Automation builder page | Frontend | `/automations` — list view + visual builder. When/And/Then card-based UI (inspired by Homey Flows). Drag cards from palette, configure inline |
| 5.8 | Automation card palette | Frontend | Grouped by: Devices (channel triggers/actions per component), Time (schedule, sunrise/sunset), Logic (variables, comparisons), Notifications (email, push), System (commands, mode changes) |
| 5.9 | Automation templates | Backend + Frontend | Pre-built templates: "Charge battery at off-peak", "Alert on grid outage", "EV smart charging", "Peak shaving schedule", "Export surplus solar". One-click install with site-specific config |
| 5.10 | Automation history & log | Frontend | Per-automation execution log: triggered at, conditions met/not, actions executed, errors |
| 5.11 | Scene presets | Frontend + Backend | Named presets that set multiple channels at once: "Night mode" (reduce EV charge, discharge battery), "Away mode" (minimal consumption), "Storm mode" (charge battery to 100%) |

---

### Phase 6: Fleet & Portfolio Management
**Goal**: Manage 10-500 sites from one screen. The feature that makes OrbitEOS unbeatable for commercial and industrial users (Homey can't do this).

| # | Task | Type | Detail |
|---|------|------|--------|
| 6.1 | Portfolio overview page | Frontend | `/portfolio` — card grid or table of all sites with live KPIs: power (kW), energy today (kWh), SoC (%), cost today, status (online/alert/offline) |
| 6.2 | Portfolio map view | Frontend | Leaflet/Mapbox map with site markers. Color-coded by status (green=healthy, yellow=warning, red=alert). Click marker for site summary popup |
| 6.3 | Fleet comparison charts | Frontend | Compare production/consumption/cost across sites. Bar chart ranked by efficiency. Scatter plot of solar yield vs capacity |
| 6.4 | Aggregated fleet KPIs | Backend + Frontend | Sum across all sites: total production, total consumption, total cost/savings, fleet-wide autarchy %, average SoC |
| 6.5 | Site status matrix | Frontend | Grid view: rows = sites, columns = KPIs. Heatmap coloring for quick anomaly detection. Sort/filter by any column |
| 6.6 | Bulk operations | Frontend | Select multiple sites → apply tariff, assign plugin, run report, send command. Batch actions for fleet management |
| 6.7 | Sub-account dashboards | Frontend | Per sub-account aggregated view (e.g., "All Residential" or "All Commercial"). Rollup KPIs |
| 6.8 | Comparative benchmarking | Backend | Compute per-site: kWh/kWp (solar yield), self-consumption ratio, cost per kWh, peak demand. Rank sites, highlight underperformers |
| 6.9 | Maintenance scheduling | Backend + Frontend | New table for maintenance events (planned downtime, inverter cleaning, battery inspection). Calendar view |
| 6.10 | Remote site health | Backend | Periodic health check per site: edge online, components responding, data freshness, anomaly detection |

---

### Phase 7: Developer Ecosystem & Marketplace
**Goal**: Third-party developers can build drivers, widgets, analytics modules, and control strategies.

| # | Task | Type | Detail |
|---|------|------|--------|
| 7.1 | Plugin SDK specification | Docs | Define plugin types: `device_driver`, `analytics`, `controller`, `dashboard_widget`, `notification`, `data_export`, `cloud_integration`. Define manifest schema, lifecycle hooks, permissions model |
| 7.2 | Plugin manifest schema | Backend | `plugin.json`: id, name, version, type, category, author, description, config_schema (JSON Schema), permissions, capabilities, entry_point |
| 7.3 | Plugin runtime sandbox | Backend | Docker-based sandboxed execution. Plugin runs as sidecar container with limited API access. Communication via REST + events |
| 7.4 | Plugin API (internal) | Backend | API available to plugins: read channels, write channels, query history, create alerts, register widgets, emit events |
| 7.5 | Developer portal | Frontend | Public-facing docs site: getting started, plugin types, API reference, config schema guide, submission process |
| 7.6 | Plugin submission flow | Backend + Frontend | Developer uploads plugin package → automated validation → admin review queue → approval → published to marketplace |
| 7.7 | Plugin review admin page | Frontend | `/admin/marketplace/review` — pending submissions, test results, approve/reject with feedback |
| 7.8 | Enhanced marketplace UI | Frontend | Richer plugin cards: screenshots, ratings, install count, last updated, compatibility matrix. Detail page with full readme, changelog |
| 7.9 | Plugin versioning & updates | Backend | Semver versioning. Auto-notify admins of available updates. One-click update. Rollback support |
| 7.10 | Official plugin collection | Content | Build and publish first-party plugins: SMA, Fronius, SolarEdge, Huawei, Growatt, Sungrow, BYD, Tesla Powerwall, Victron, Enphase |

---

### Phase 8: Consumer Experience & Mobile
**Goal**: Make OrbitEOS beautiful and accessible for high-end residential users — not just engineers.

| # | Task | Type | Detail |
|---|------|------|--------|
| 8.1 | Onboarding wizard | Frontend | Post-registration guided setup: name your site → set location → connect edge → auto-discover devices → assign tariff → choose dashboard template |
| 8.2 | Guided device setup | Frontend | Step-by-step pairing flow per device type. Visual guides with diagrams. Auto-detect connected components |
| 8.3 | Light theme polish | Frontend | Complete the light theme (currently "coming soon"). Ensure all components, charts, and SVGs work in both modes |
| 8.4 | Mobile-optimized dashboard | Frontend | Touch-friendly widgets. Swipeable dashboard pages. Pull-to-refresh. Optimized energy flow for small screens |
| 8.5 | Push notifications (web) | Frontend + Backend | Service Worker for web push. Subscribe to alert channels. Background notifications even when app is closed |
| 8.6 | PWA manifest | Frontend | Full PWA: installable, offline shell, app icon, splash screen. "Add to Home Screen" prompt |
| 8.7 | Native mobile app (shell) | Mobile | React Native or Capacitor wrapper around the web app. Native push notifications, biometric auth, quick-glance widgets |
| 8.8 | Voice assistant integration | Backend | Google Home / Amazon Alexa skill: "Hey Google, what's my solar production?" → queries MCP → returns answer. Reuse existing MCP tools |
| 8.9 | White-label branding | Frontend + Backend | Per-account: custom logo, colors, favicon, login page branding, email templates. Stored in `platform.settings` per account |
| 8.10 | Multi-language expansion | Frontend | Add DE, FR, ES, IT to existing EN/NL. Use Crowdin for community translation. Locale-specific number/date formatting |
| 8.11 | Accessibility audit (WCAG 2.1 AA) | Frontend | Keyboard navigation, screen reader labels, color contrast, focus indicators, reduced motion support |

---

### Phase 9: Advanced Analytics & AI
**Goal**: Move from monitoring to intelligence. Predictive insights, anomaly detection, optimization recommendations.

| # | Task | Type | Detail |
|---|------|------|--------|
| 9.1 | Solar forecast | Backend | Integrate weather + solar irradiance APIs (Solcast, OpenWeather). Predict next 24-48h production based on panel capacity + orientation |
| 9.2 | Consumption forecast | Backend | ML model on historical consumption patterns. Day-ahead and week-ahead predictions. Account for seasonality, day-of-week |
| 9.3 | Battery optimization advisor | Backend | Given forecast (solar + consumption + prices), recommend optimal charge/discharge schedule. Show "savings if optimized" vs current |
| 9.4 | Anomaly detection | Backend | Flag unusual patterns: production drop (dirty panels?), consumption spike (equipment fault?), battery degradation (capacity fade). Auto-create alerts |
| 9.5 | AI chat improvements | Frontend + Backend | Embed AI chat panel in dashboard (not just MCP). Contextual: knows which site/device user is viewing. Can execute actions with confirmation |
| 9.6 | Natural language queries | Frontend | "Show me last month's consumption vs production" → auto-generates chart. "Why was grid import high yesterday?" → runs analysis |
| 9.7 | Energy efficiency score | Backend | Per-site score (0-100) based on: self-consumption ratio, autarchy, cost efficiency, peak management. Trend over time |
| 9.8 | Carbon footprint tracking | Backend + Frontend | Convert energy data to CO2 using grid emission factors per country. Show tonnes saved from solar. ESG reporting support |
| 9.9 | ROI calculator | Frontend | Input: system cost, tariff, solar capacity. Output: payback period, annual savings, lifetime value. Based on actual production data |

---

## Phase Priority & Timeline

| Phase | Name | Priority | Depends On | Effort | Impact |
|-------|------|----------|------------|--------|--------|
| **1** | Cost Intelligence | **P0** | — | Medium | High — every user asks "how much am I saving?" |
| **2** | Custom Dashboards | **P0** | — | Large | High — core UX differentiator |
| **3** | Device Intelligence | **P1** | — | Medium | High — "which device costs the most?" |
| **4** | Alerts & Reports | **P1** | Phase 1 (costs in reports) | Large | High — proactive vs reactive monitoring |
| **5** | Automation Engine | **P2** | Phase 3 (device taxonomy) | Very Large | Very High — but complex, needs solid foundation |
| **6** | Fleet Management | **P1** | Phase 1 + 3 | Large | Very High for commercial/industrial personas |
| **7** | Developer Ecosystem | **P2** | Phase 3 (capabilities) | Very Large | Long-term platform value |
| **8** | Consumer Experience | **P2** | Phase 1 + 2 | Large | High for residential persona |
| **9** | Advanced Analytics | **P3** | Phase 1 + 3 + 4 | Very Large | Differentiator but needs data foundation |

---

## Entity Model (Target State)

```
Account (tenant)
├── Sub-accounts (divisions)
├── Users (with roles & site access)
├── Roles (with permissions)
├── Tariffs (flat / ToU / tiered / demand)
├── Notification Channels (email / slack / webhook / push)
├── Dashboard Templates (shared layouts)
├── Variables (user-defined values)
├── Installed Plugins (from marketplace)
└── Sites (hierarchical tree)
    ├── Sites (children: region > hub > site > zone)
    ├── Edge Mappings (edge controllers)
    ├── Devices (typed by class + capabilities)
    │   ├── Capabilities (measure_power, meter_power, soc, etc.)
    │   ├── Channels (live data addresses)
    │   ├── Energy Summary (kWh, cost, ranking)
    │   └── Device Groups (user-defined tags)
    ├── Controllers (optimization strategies)
    ├── Automation Rules (when/and/then)
    │   ├── Triggers (channel change, schedule, price, etc.)
    │   ├── Conditions (value compare, time, state)
    │   └── Actions (set channel, notify, command)
    ├── Scene Presets (named multi-channel states)
    ├── Alert Rules (threshold monitoring)
    │   └── Alert History (triggered events)
    ├── Report Schedules (periodic generation)
    ├── Site Tariff Assignment (with effective dates)
    ├── Billing Periods (computed cost data)
    ├── Plugin Assignments (per-site plugins)
    └── User Dashboards (per-user overrides)

Marketplace (global)
├── Categories (9 types)
├── Plugins (device drivers, analytics, controllers, widgets, etc.)
│   ├── Config Schema (JSON Schema)
│   ├── Capabilities (what it provides)
│   ├── Screenshots / Readme
│   └── Version History
└── Plugin Reviews (submissions pending approval)

Platform (root)
├── Settings (SMTP, branding, security, AI)
├── Audit Log (who did what when)
└── Global Permissions Catalog
```

---

## Key Design Principles (Learned from Homey)

1. **Cost first, kWh second** — users care about money, not kilowatt-hours. Always show cost alongside energy.
2. **One screen, one story** — each dashboard should tell a complete story without scrolling. Use widgets wisely.
3. **Devices are first-class citizens** — not raw "components". Give them names, classes, icons, health status.
4. **Automation should be visual** — card-based When/And/Then is proven. Don't build a code editor.
5. **Templates over blank canvases** — pre-built dashboards, automation templates, report templates. Let users customize, not create from scratch.
6. **Alerts are proactive dashboards** — if a user has to open the app to see a problem, you've already failed.
7. **Portfolio > single site** — commercial/industrial users manage fleets. The multi-site view IS the product for them.
8. **Plugin ecosystem = moat** — every device driver added makes the platform stickier. Invest in the developer experience.
