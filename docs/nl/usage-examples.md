# Voorbeelden

## Systeemgezondheid controleren

**Gebruiker:** "Draait mijn energiesysteem normaal?"

**Gebruikte tools:** `list_sites` daarna `check_system_health`

De assistent roept `list_sites` aan om beschikbare sites te vinden, daarna `check_system_health` op de site:

```
Systeemstatus: OK
Netmodus: ON-GRID
Netvermogen: -1200 W (exporterend)
Productie: 4500 W
Verbruik: 3300 W
Batterij SoC: 78%
UITKOMST: Systeem draait normaal.
```

## Energieoverzicht

**Gebruiker:** "Hoeveel zonne-energie heb ik deze maand opgewekt?"

**Gebruikte tools:** `get_energy_summary`

De assistent roept `get_energy_summary` aan met `fromDate` en `toDate`:

```
Zonneproductie: 342,5 kWh
Verbruik: 287,1 kWh
Netimport: 45,2 kWh
Netexport: 100,6 kWh
Eigenverbruikspercentage: 70,6%
Autarkie: 84,3%
```

## Live vermogensmonitoring

**Gebruiker:** "Wat is mijn huidige energieverbruik?"

**Gebruikte tools:** `get_live_data`

De assistent roept `get_live_data` aan voor de site:

```
Net: -850 W (exporterend naar net)
Zonneproductie: 4200 W
Verbruik: 2100 W
Batterij: laden met 1250 W, SoC 65%
Laadpaal: 0 W (niet aan het laden)
```

## Batterijanalyse

**Gebruiker:** "Moet ik een grotere batterij nemen?"

**Gebruikte tools:** `analyze_battery_usage`

De assistent roept `analyze_battery_usage` aan over de laatste 30 dagen:

```
Batterijcapaciteit: 10 kWh
Totaal geladen: 185,3 kWh
Totaal ontladen: 167,8 kWh
Netexport (overtollige zon): 210,5 kWh
Netimport: 89,2 kWh

Uw systeem exporteert 210,5 kWh naar het net — meer dan de batterij
ontlaadt. Een grotere batterij zou meer overtollige productie kunnen opvangen.
```

## Siteconfiguratie

**Gebruiker:** "Welke apparaten zijn aangesloten op mijn systeem?"

**Gebruikte tools:** `get_site_config`

De assistent roept `get_site_config` aan:

```
ess0: Batterijomvormer (FENECON Commercial 30)
meter0: Netmeter (Janitza UMG 96RM-E)
meter1: Productiemeter
charger0: Laadpaal (KEBA KeContact)
ctrlBalancing0: Eigenverbruik-optimalisatiecontroller
```
