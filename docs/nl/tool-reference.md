# Tool Referentie

OrbitEOS biedt 61 tools verdeeld over 9 categorieën.

## Accounts (7 tools)

Multi-tenant account- en sub-accountbeheer.

- **`list_accounts`** — Alle accounts weergeven (alleen rootbeheerder)
- **`create_account`** — Een nieuw account aanmaken
- **`update_account`** — Een account bijwerken
- **`list_sub_accounts`** — Sub-accounts van een account weergeven
- **`create_sub_account`** — Een sub-account aanmaken
- **`update_sub_account`** — Een sub-account bijwerken
- **`delete_sub_account`** — Een sub-account verwijderen

## Sites (9 tools)

Sitehiërarchie, zoeken, configuratie en componenten.

- **`list_sites`** — Alle toegankelijke sites weergeven (boom of plat)
- **`search_sites`** — Sites zoeken op naam, beschrijving of locatie
- **`get_site`** — Gedetailleerde site-informatie opvragen
- **`create_site`** — Een nieuwe site aanmaken (regio/hub/site/zone)
- **`update_site`** — Site-eigenschappen of hiërarchie bijwerken
- **`delete_site`** — Een site en onderliggende items verwijderen
- **`get_site_config`** — Volledige componentconfiguratie opvragen
- **`describe_site`** — Leesbare sitesamenvating
- **`describe_system`** — Systeemoverzicht en beschikbare metrieken

## Gebruikers & Rollen (11 tools)

Gebruikersbeheer, rollen, rechten en uitnodigingen.

- **`list_users`** — Alle gebruikers in het account weergeven
- **`get_user`** — Gebruikersdetails inclusief sitetoewijzingen
- **`create_user`** — Een nieuwe gebruiker aanmaken
- **`update_user`** — Gebruikersprofiel, rol of sites bijwerken
- **`delete_user`** — Een gebruikersaccount deactiveren
- **`invite_user`** — Een e-mailuitnodiging versturen
- **`list_roles`** — Alle rollen met rechten weergeven
- **`list_permissions`** — Alle beschikbare rechten weergeven
- **`create_role`** — Een aangepaste rol aanmaken
- **`update_role`** — Rechten van een rol bijwerken
- **`delete_role`** — Een aangepaste rol verwijderen

## Live Data (3 tools)

Realtime vermogen/energie-snapshots en kanaalwaarden.

- **`get_live_data`** — Huidige vermogen/energie-snapshot voor een site
- **`get_channel_value`** — Een enkele kanaalwaarde lezen
- **`set_channel_value`** — Een waarde naar een schrijfbaar kanaal sturen

## Geschiedenis (3 tools)

Tijdreeksqueries, energietotalen en CSV-export.

- **`query_history`** — Historische tijdreeks-vermogensdata opvragen
- **`query_energy_totals`** — Cumulatieve energietotalen (kWh) opvragen
- **`export_csv`** — Historische data exporteren als CSV

## Besturing (4 tools)

Componentbeheer en kanaalschrijfacties.

- **`create_component`** — Een nieuw component op een site aanmaken
- **`update_component`** — Componentconfiguratie bijwerken
- **`delete_component`** — Een component van een site verwijderen
- **`set_channel_value`** — Een waarde naar een schrijfbaar kanaal sturen

## Diagnostiek (5 tools)

Gezondheidscontroles, netanalyse, zonvergelijking en batterijdimensionering.

- **`check_system_health`** — Controleren of het energiesysteem normaal draait
- **`analyze_grid_usage`** — Analyseren waarom de netimport hoog is
- **`compare_solar_performance`** — Zonneproductie over twee perioden vergelijken
- **`get_energy_summary`** — Energieoverzicht voor een site over een periode
- **`analyze_battery_usage`** — Batterijgebruikpatronen en dimensioneringsadvies

## Systeem (7 tools)

Logboeken, opdrachten, platforminstellingen, auditlog, zoeken en gezondheid.

- **`get_system_log`** — Systeemlogboeken van een site opvragen
- **`execute_command`** — Een systeenopdracht op een edge controller uitvoeren
- **`get_platform_settings`** — Platformconfiguratie-instellingen opvragen
- **`update_platform_settings`** — Platforminstellingen bijwerken
- **`get_audit_log`** — Het auditlogboek doorzoeken
- **`universal_search`** — Zoeken over alle entiteiten
- **`check_platform_health`** — Platformgezondheid controleren

## Marketplace (12 tools)

Plugins bladeren, installeren en aan sites toewijzen.

- **`list_marketplace_categories`** — Alle marketplace-categorieën weergeven
- **`browse_plugins`** — Beschikbare plugins bladeren
- **`get_plugin_details`** — Gedetailleerde plugin-informatie opvragen
- **`install_plugin`** — Een plugin voor uw account installeren
- **`list_installed_plugins`** — Geïnstalleerde plugins weergeven
- **`update_plugin_config`** — Pluginconfiguratie bijwerken
- **`uninstall_plugin`** — Een plugin verwijderen
- **`assign_plugin_to_site`** — Een plugin aan een site toewijzen
- **`remove_plugin_from_site`** — Een plugin van een site verwijderen
- **`list_site_plugins`** — Aan een site toegewezen plugins weergeven
- **`create_marketplace_category`** — Een marketplace-categorie aanmaken
- **`create_plugin`** — Een nieuwe plugin aanmaken
