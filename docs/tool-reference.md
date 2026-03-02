# Tool Reference

OrbitEOS exposes 61 tools across 9 categories.

## Accounts (7 tools)

Multi-tenant account and sub-account management.

- **`list_accounts`** — List all accounts (root admin only)
- **`create_account`** — Create a new account
- **`update_account`** — Update an account
- **`list_sub_accounts`** — List sub-accounts for an account
- **`create_sub_account`** — Create a sub-account
- **`update_sub_account`** — Update a sub-account
- **`delete_sub_account`** — Delete a sub-account

## Sites (9 tools)

Site hierarchy, search, configuration, and components.

- **`list_sites`** — List all accessible sites (tree or flat)
- **`search_sites`** — Search sites by name, description, or location
- **`get_site`** — Get detailed site information
- **`create_site`** — Create a new site (region/hub/site/zone)
- **`update_site`** — Update site properties or hierarchy
- **`delete_site`** — Delete a site and its children
- **`get_site_config`** — Get full component configuration
- **`describe_site`** — Human-readable site summary
- **`describe_system`** — System overview and available metrics

## Users & Roles (11 tools)

User CRUD, roles, permissions, and invitations.

- **`list_users`** — List all users in the account
- **`get_user`** — Get user details including site assignments
- **`create_user`** — Create a new user
- **`update_user`** — Update user profile, role, or sites
- **`delete_user`** — Deactivate a user account
- **`invite_user`** — Send an email invitation
- **`list_roles`** — List all roles with permissions
- **`list_permissions`** — List all available permissions
- **`create_role`** — Create a custom role
- **`update_role`** — Update a role's permissions
- **`delete_role`** — Delete a custom role

## Live Data (3 tools)

Real-time power/energy snapshots and channel values.

- **`get_live_data`** — Current power/energy snapshot for a site
- **`get_channel_value`** — Read a single channel value
- **`set_channel_value`** — Write a value to a writable channel

## History (3 tools)

Time-series queries, energy totals, and CSV export.

- **`query_history`** — Query historical timeseries power data
- **`query_energy_totals`** — Query cumulative energy totals (kWh)
- **`export_csv`** — Export historical data as CSV

## Control (4 tools)

Component management and channel writes.

- **`create_component`** — Create a new component on a site
- **`update_component`** — Update component configuration
- **`delete_component`** — Delete a component from a site
- **`set_channel_value`** — Write a value to a writable channel

## Diagnostics (5 tools)

Health checks, grid analysis, solar comparison, and battery sizing.

- **`check_system_health`** — Check if a site's energy system is running normally
- **`analyze_grid_usage`** — Analyze why grid import is high
- **`compare_solar_performance`** — Compare solar production across two periods
- **`get_energy_summary`** — Energy summary for a site over a period
- **`analyze_battery_usage`** — Battery usage patterns and sizing recommendations

## System (7 tools)

Logs, commands, platform settings, audit log, search, and health.

- **`get_system_log`** — Get system logs for a site
- **`execute_command`** — Execute a system command on an edge controller
- **`get_platform_settings`** — Get platform configuration settings
- **`update_platform_settings`** — Update platform settings
- **`get_audit_log`** — Query the audit log
- **`universal_search`** — Search across all entities
- **`check_platform_health`** — Check platform health

## Marketplace (12 tools)

Plugin browsing, installation, and site assignment.

- **`list_marketplace_categories`** — List all marketplace categories
- **`browse_plugins`** — Browse available plugins
- **`get_plugin_details`** — Get detailed plugin information
- **`install_plugin`** — Install a plugin for your account
- **`list_installed_plugins`** — List installed plugins
- **`update_plugin_config`** — Update plugin configuration
- **`uninstall_plugin`** — Uninstall a plugin
- **`assign_plugin_to_site`** — Assign a plugin to a site
- **`remove_plugin_from_site`** — Remove a plugin from a site
- **`list_site_plugins`** — List plugins assigned to a site
- **`create_marketplace_category`** — Create a marketplace category
- **`create_plugin`** — Create a new plugin
