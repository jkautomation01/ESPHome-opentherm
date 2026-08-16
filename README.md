# ESPHome OpenTherm Thermostat

An intelligent OpenTherm thermostat built on ESPHome, designed to minimize
gas usage on a modulating condensing combi boiler while being controlled
primarily from Home Assistant, with local backup control that doesn't
depend on HA, WiFi, or the cloud.

**Hardware:** [DIYLESS OpenTherm Thermostat 1](https://diyless.com/product/opentherm-thermostat)
(WeMos D1 Mini ESP32 + Master OpenTherm Shield) + an external DS18B20
temperature sensor mounted on the CV (central heating) return line.

**Boiler:** Intergas 28/24 cW4 (modulating condensing combi) — but the
firmware and automation work with any OpenTherm-compliant boiler.

## Why weather compensation, not a room thermostat

There's no room-temperature sensor on this device by design. A modulating
condensing boiler like the Intergas cW4 wastes the least gas when it runs
continuously at the *lowest* flow temperature that still keeps the house
warm — modulating gently rather than firing at full output and cycling
on/off against a room thermostat. That lowest-workable flow temperature
depends on outdoor temperature, not room temperature, which is exactly
what a **weather compensation curve** computes.

The external sensor on the CV return line is the ground truth for whether
the boiler is actually condensing (recovering extra heat from flue gas
condensation) — it condenses when return water is roughly below 55°C.
The Home Assistant automation in this repo uses that sensor to trim the
flow setpoint down automatically if the return line runs hotter, keeping
the boiler in its efficient range.

So the split of responsibilities is:

- **ESPHome device** (`opentherm-thermostat.yaml`): a reliable OpenTherm
  bridge. Exposes every boiler sensor/switch/number to Home Assistant,
  reads the external return-line sensor, and provides backup control.
  No control logic runs here beyond safety fallbacks.
- **Home Assistant** (`home_assistant/`): the "smart" part — the weather
  compensation curve, optional room-comfort trim, night setback,
  open-window cutoff, presence-based eco mode. This is where you'll tune
  things over time, and where you get history/statistics for free.

## Repository layout

```
opentherm-thermostat.yaml                          ESPHome device firmware
secrets.yaml.example                                 template for secrets.yaml (gitignored)
home_assistant/
  blueprints/opentherm_weather_compensation.yaml    HA automation blueprint (the gas-saving logic)
  dashboard_example.yaml                            example Lovelace view
```

## Wiring

- OpenTherm master shield: stacked onto the WeMos D1 Mini ESP32 per the
  DIYLESS board design. Uses GPIO21 (in) / GPIO22 (out) — already wired on
  the board, no action needed.
- External return-line DS18B20: connect `DATA` to **GPIO14** with a 4.7kΩ
  pull-up resistor between `DATA` and `3V3` (standard 1-Wire wiring), plus
  `GND`/`3V3`. Mount the sensor with good thermal contact on the CV return
  pipe (thermal paste + insulation over it gives the most accurate
  reading).
- Optional physical backup button: a momentary push-button between
  **GPIO4** and `GND`. Pressing it toggles central heating on/off locally
  — works even with no WiFi or Home Assistant. Verify GPIO4 is actually
  free on your specific board revision before wiring (it isn't used by the
  OpenTherm shield or the 1-Wire bus, but check the silkscreen).

Pins are substitution variables at the top of `opentherm-thermostat.yaml`
if you need to change any of them.

## Flashing

1. Install [ESPHome](https://esphome.io/guides/installing_esphome) (CLI or
   the Home Assistant ESPHome add-on).
2. `cp secrets.yaml.example secrets.yaml` and fill in your WiFi
   credentials, a generated API encryption key, and an OTA password (the
   file explains how to generate the key).
3. First flash over USB:
   ```
   esphome run opentherm-thermostat.yaml
   ```
   Subsequent updates can go over-the-air (`esphome upload ...` or via the
   ESPHome dashboard).
4. The device will show up as a discovered ESPHome node in Home Assistant
   (Settings → Devices & Services) — add it, using the same encryption
   key from `secrets.yaml`.

## What you get in Home Assistant

- `switch` — Central Heating, Hot Water
- `number` — Heating Flow Setpoint (°C), Hot Water Setpoint (°C)
- `sensor` — boiler flow temp, DHW temp, return temp (boiler-reported),
  **CV Return Line Temperature (your external sensor)**, modulation %,
  CH water pressure, exhaust temp, fault/diagnostic codes, WiFi signal,
  uptime
- `binary_sensor` — flame, heating/DHW active, boiler fault/diagnostic
  flags, **Condensing Mode Active**, **Home Assistant Connected**,
  **Backup Mode Active**
- `button` — Restart

## Setting up the gas-saving automation

1. In Home Assistant, go to **Settings → Automations → Blueprints →
   Import Blueprint**, and point it at
   `home_assistant/blueprints/opentherm_weather_compensation.yaml` (or
   copy it into your `config/blueprints/automation/` folder).
2. Create an automation from the blueprint and fill in:
   - The device's `number.*_heating_flow_setpoint` and
     `switch.*_central_heating` entities.
   - An outdoor temperature sensor (a weather integration entity works
     fine).
   - The device's `sensor.*_cv_return_line_temperature` entity.
   - Optionally: a room temperature sensor + `input_number` target for a
     small comfort trim, door/window sensors to cut heating when something
     is open, presence entities for an away setback, and night setback
     times.
3. Tune the curve for your house: `design_outdoor_temp` /
   `design_flow_temp` set the cold-day end of the curve,
   `heating_limit_outdoor_temp` sets when heating switches off entirely,
   `min_flow_temp` is the curve floor. Start conservative (higher flow
   temps) and lower `design_flow_temp` gradually while watching the
   **Condensing Mode Active** sensor and your gas meter — the goal is the
   lowest flow temperature that still keeps rooms comfortable on the
   coldest days.

An example dashboard view is in `home_assistant/dashboard_example.yaml`.

## Backup control (no Home Assistant required)

Three independent layers, from "HA had a hiccup" to "everything is down":

1. **ESPHome local web UI** — every device has a built-in web server at
   its IP address (`web_server:` in the config) with toggles for heating,
   hot water, and the setpoints. Works over WiFi without HA.
2. **HA-disconnect watchdog** — if the Home Assistant API connection drops
   for more than `ha_disconnect_backup_delay` (default 15 minutes), the
   device automatically turns central heating on at a safe fallback
   setpoint (default 45°C) so the house doesn't go cold while you fix HA.
   It backs off automatically the moment HA reconnects. Visible via the
   **Home Assistant Connected** / **Backup Mode Active** binary sensors.
3. **Physical backup button** (optional, if wired) — toggles central
   heating on/off directly on the device, no network required at all.

None of these are a full offline schedule — they're deliberately minimal
"don't let the house get cold" fallbacks, not a replacement for Home
Assistant control.

## Notes on the Intergas 28/24 cW4

- The cW4 is an instant (non-storage) combi — the DHW setpoint controls
  the target tap water temperature, not a cylinder.
- Return-line condensing threshold of 55°C in the config is a reasonable
  default for Intergas units; adjust `condensing_threshold` /
  `condensing_max_return_temp` if you find your unit's condensing point
  differs.
