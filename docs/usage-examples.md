# Usage Examples

## Check System Health

**User:** "Is my energy system running normally?"

**Tools used:** `list_sites` then `check_system_health`

The assistant calls `list_sites` to find available sites, then `check_system_health` on the site:

```
System State: OK
Grid Mode: ON-GRID
Grid Power: -1200 W (exporting)
Production: 4500 W
Consumption: 3300 W
Battery SoC: 78%
VERDICT: System is running normally.
```

## Energy Summary

**User:** "How much solar did I generate this month?"

**Tools used:** `get_energy_summary`

The assistant calls `get_energy_summary` with `fromDate` and `toDate`:

```
Solar Production: 342.5 kWh
Consumption: 287.1 kWh
Grid Import: 45.2 kWh
Grid Export: 100.6 kWh
Self-Consumption Rate: 70.6%
Autarchy: 84.3%
```

## Live Power Monitoring

**User:** "What is my current power usage?"

**Tools used:** `get_live_data`

The assistant calls `get_live_data` for the site:

```
Grid: -850 W (exporting to grid)
Solar Production: 4200 W
Consumption: 2100 W
Battery: charging at 1250 W, SoC 65%
EV Charger: 0 W (not charging)
```

## Battery Analysis

**User:** "Should I get a bigger battery?"

**Tools used:** `analyze_battery_usage`

The assistant calls `analyze_battery_usage` over the last 30 days:

```
Battery Capacity: 10 kWh
Total Charged: 185.3 kWh
Total Discharged: 167.8 kWh
Grid Export (excess solar): 210.5 kWh
Grid Import: 89.2 kWh

Your system exports 210.5 kWh to the grid — more than the battery
discharges. A larger battery could capture more excess production.
```

## Site Configuration

**User:** "What devices are connected to my system?"

**Tools used:** `get_site_config`

The assistant calls `get_site_config`:

```
ess0: Battery inverter (FENECON Commercial 30)
meter0: Grid meter (Janitza UMG 96RM-E)
meter1: Production meter
charger0: EV Charger (KEBA KeContact)
ctrlBalancing0: Self-consumption optimization controller
```
