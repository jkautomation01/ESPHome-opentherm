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

## Control strategy: room-led, weather-compensated bounds

Control is **room-led**: you get a normal HA thermostat card, set a target
room temperature, and the system drives the boiler to hit it — using your
existing room temperature sensor. But instead of a plain on/off room
thermostat (which makes a modulating condensing boiler fire at full output
and cycle, wasting gas), the flow setpoint is computed by a
proportional+integral (PI) loop: it nudges the flow temperature up or down
based on how far the room is from target.

An **outdoor-temperature weather curve** wraps that PI loop as a
feed-forward starting point and a hard ceiling/floor on each cycle — so on
a mild day the loop is never allowed to push the flow setpoint higher than
necessary, and on a cold day it's never left too low to keep up. This is
what keeps a modulating condensing boiler like the Intergas 28/24 cW4
running at the lowest flow temperature that still meets the room's actual
demand, which is the biggest lever for gas savings.

The external sensor on the CV return line is the ground truth for whether
the boiler is actually condensing (recovering extra heat from flue gas
condensation) — it condenses when return water is roughly below 55°C. The
control loop uses that sensor to trim the flow setpoint down automatically
if the return line runs hotter, keeping the boiler in its efficient range
regardless of what the PI loop alone would have asked for.

So the split of responsibilities is:

- **ESPHome device** (`opentherm-thermostat.yaml`): a reliable OpenTherm
  bridge. Exposes every boiler sensor/switch/number to Home Assistant,
  reads the external return-line sensor, and provides backup control.
  No control logic runs here beyond safety fallbacks — it doesn't know
  about your room sensor at all.
- **Home Assistant** (`home_assistant/`): the "smart" part — the
  thermostat card, the room-led PI control loop bounded by the weather
  curve, the condensing clamp, night setback, open-window cutoff, and
  presence-based eco mode. This is where you'll tune things over time,
  and where you get history/statistics for free.

## Repository layout

```
opentherm-thermostat.yaml                            ESPHome device firmware
secrets.yaml.example                                 template for secrets.yaml (gitignored)
home_assistant/
  opentherm_room_climate.yaml                         HA package: thermostat card + helper entities
  blueprints/opentherm_room_led_heating.yaml          HA automation blueprint (the gas-saving control loop)
  dashboard_example.yaml                              example Lovelace view
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

## Setting up the gas-saving control loop

1. **Add the thermostat card + helpers.** Edit
   `home_assistant/opentherm_room_climate.yaml` and replace
   `sensor.YOUR_ROOM_TEMPERATURE_SENSOR` with your actual room temperature
   sensor's entity ID. Then include the file, e.g. in `configuration.yaml`:
   ```yaml
   homeassistant:
     packages:
       opentherm: !include home_assistant/opentherm_room_climate.yaml
   ```
   This creates `climate.opentherm_heating` (your thermostat card) plus
   three helper entities the control loop uses:
   `input_number.opentherm_room_target_temp`,
   `input_boolean.opentherm_heat_mode_requested`, and
   `input_number.opentherm_pi_integral`. Restart HA (packages need a
   restart, not just a reload).
2. **Import the control loop.** Go to **Settings → Automations →
   Blueprints → Import Blueprint**, and point it at
   `home_assistant/blueprints/opentherm_room_led_heating.yaml` (or copy it
   into your `config/blueprints/automation/` folder).
3. **Create an automation from the blueprint** and fill in:
   - Your room temperature sensor, and the three helper entities from step 1.
   - The device's `number.*_heating_flow_setpoint` and
     `switch.*_central_heating` entities.
   - An outdoor temperature sensor (a weather integration entity works fine).
   - The device's `sensor.*_cv_return_line_temperature` entity.
   - Optionally: door/window sensors to cut heating when something is
     open, presence entities for an away setback, and night setback times.
4. **Tune it for your house:**
   - `design_outdoor_temp` / `design_flow_temp` set the cold-day end of
     the weather-curve bounds; `min_flow_temp` is the floor.
     `heating_limit_outdoor_temp` is where the feed-forward base drops to
     the floor (heating still runs above it if the room genuinely calls
     for it — the PI term handles that — it's just starting from a low
     base).
   - `kp`/`ki`/`integral_limit` tune how aggressively the flow setpoint
     reacts to room error. Start with the defaults (kp=4, ki=1.5); if the
     room temperature oscillates, lower both; if it settles noticeably
     below target and stays there, raise `ki` slightly.
   - Watch the **Condensing Mode Active** binary sensor and your gas
     meter over the first couple of weeks, and nudge `design_flow_temp`
     down if the boiler condenses reliably — lower flow temps at the same
     comfort level is the actual gas saving.

Set your target temperature and heat/off mode from the
`climate.opentherm_heating` thermostat card — that's the entity you (or
any other HA automation) should control day to day. Avoid writing to
`number.*_heating_flow_setpoint` directly; the control loop overwrites it
every cycle.

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
   Note: while Home Assistant *is* connected and the room-led automation
   is running, it re-asserts `switch.*_central_heating` every cycle based
   on the thermostat card's mode — so a button press only "sticks" when
   HA is actually down. That's intentional; it's a backup path, not a
   second control surface competing with HA.

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
