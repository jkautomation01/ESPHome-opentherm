# ESPHome OpenTherm Thermostat

An intelligent OpenTherm thermostat built entirely on ESPHome, designed to
minimize gas usage on a modulating condensing combi boiler. All control
logic runs on the device itself — Home Assistant is used only as a data
source (your existing room and outdoor temperature sensors) and as the
primary place you interact with it, but the thermostat keeps working on
its own if HA is unreachable.

**Hardware:** [DIYLESS OpenTherm Thermostat 1](https://diyless.com/product/opentherm-thermostat)
(WeMos D1 Mini ESP32 + Master OpenTherm Shield) + an external DS18B20
temperature sensor mounted on the CV (central heating) return line.

**Boiler:** Intergas 28/24 cW4 (modulating condensing combi) — but the
firmware works with any OpenTherm-compliant boiler.

## Control strategy: room-led, weather-compensated bounds — all on-device

You get a normal Home Assistant thermostat card (a native `climate`
entity exposed automatically by the device — no HA-side YAML needed) that
targets your room temperature. Underneath, three things happen entirely
on the ESP32, every control cycle:

1. **Room-led PID control** (`climate: platform: pid`, entity `ch_climate`)
   computes a 0–1 heat demand level from your room sensor's error against
   the target you set on the thermostat card.
2. **Weather compensation** (`ch_pid_scaling_output`) turns that demand
   level into an absolute flow setpoint, bounded between a constant floor
   (`min_flow_temp`) and a ceiling computed from the outdoor temperature
   (`design_outdoor_temp`/`design_flow_temp`/`heating_limit_outdoor_temp`).
   On a mild day the ceiling is low, so the loop physically can't ask the
   boiler for more flow temperature than necessary; on a cold day the
   ceiling opens up.
3. **Condensing clamp**: if the external return-line sensor shows the
   boiler running hotter than `condensing_threshold`, the computed
   setpoint gets trimmed down further, pushing the boiler back into its
   efficient condensing range.

The result is written to the OpenTherm CH setpoint (`t_set`). This is what
keeps a modulating condensing boiler like the Intergas cW4 running at the
lowest flow temperature that satisfies both the weather and your actual
room temperature — the single biggest lever for gas savings — instead of
firing at a high, wasteful flow temperature or cycling on/off like a plain
room thermostat would.

The device still needs your room and outdoor temperature *readings* from
Home Assistant (it doesn't have its own room sensor) — but the decision
of what to do with them is made on the ESP32, not in a HA automation. If
HA goes away, the last known readings simply go stale rather than the
whole control loop disappearing, and the watchdog described below takes
over if that stretches on too long.

## Nest-style extras

Three optional features, each behind its own switch (all default **on** —
flip any off from Home Assistant or the local web UI to fall back to
plain room-led + weather-compensated control):

- **Room Sensor Glitch Guard** (`switch.*_room_sensor_glitch_guard`) —
  Nest's Sunblock is specific to a temperature sensor built into a
  sun-exposed wall display; since your room sensor is your own existing
  HA sensor rather than anything mounted on this board, that exact
  problem generally doesn't apply here. What this does instead: reject
  any room-temperature update from Home Assistant that jumps faster than
  `glitch_guard_max_rate_c_per_min` (default 1.0°C/min — real room air
  doesn't move anywhere near that fast) and hold the last good value
  instead. Catches a sensor glitch, a stuck HA integration, or genuinely
  a sensor sitting in direct sun, without the PID loop overreacting to
  it. Every downstream feature (PID, anticipatory shutoff, preheat) sees
  the cleaned-up value. Visible via **Room Sensor Glitch Detected**.
- **Anticipate Heating Coast** (`switch.*_anticipate_heating_coast`) —
  Nest's True Radiant equivalent. As the room nears its target, the flow
  setpoint eases down early (proportionally, within a "coast window") so
  residual heat already in the radiators/floor carries the room the rest
  of the way instead of overshooting. The size of that window is driven
  by `anticipatory_coast_minutes` × the **learned near-target ("creep")
  rate** — see "How the heating rate is learned" below. Raise
  `anticipatory_coast_minutes` well above the 8-minute default (try
  20–30) if you're on underfloor heating rather than radiators — floor
  slabs coast for much longer.
- **Preheat Schedule** (`switch.*_preheat_schedule`) — Nest's Time to
  Temp / auto-schedule equivalent. Up to 4 time-of-day target-temperature
  slots (`schedule_slot1_hour/minute/target` through `slot4`), started
  early enough — based on the learned **bulk warm-up rate** — to hit each
  slot's target right at its scheduled time rather than starting cold at
  that exact minute. A manual change on the thermostat card is respected
  until the next slot boundary, same as a normal scheduling thermostat.
  Needs the `timezone` substitution set correctly for the schedule clock.

### How the heating rate is learned

Both features above depend on knowing how fast your rooms actually warm
up. Rather than one blended number, the firmware learns rates separately
along two axes, since a single average would misrepresent both use cases:

- **Phase** — a room warms fastest right after you raise the target (flow
  setpoint near the weather-curve ceiling) and slows as it approaches
  target (PID error shrinking, Anticipate Heating Coast already easing
  off). Averaging those together would make Preheat Schedule's lead-time
  estimate too short and Anticipate Heating Coast's coast window too
  long. So two phases are tracked separately: **bulk** warm-up (used by
  Preheat Schedule) whenever the room-to-target gap is ≥
  `creep_phase_gap_threshold` (default 1.5°C), and **creep** (used by
  Anticipate Heating Coast) whenever it's below that.
- **Outdoor-temperature bucket** — heat loss scales with the difference
  between room and outdoor temperature, so the same flow setpoint warms a
  room slower on a cold day than a mild one. `heat_rate_outdoor_buckets`
  (default 3) splits the range from `design_outdoor_temp` to
  `heating_limit_outdoor_temp` into that many buckets, each learning its
  own rate.

That's 2 phases × 3 buckets = 6 independent rates. Each one keeps a small
ring buffer of its last `heat_rate_history_depth` samples (default 6) —
every ~1 minute of active heating, if the room-temperature delta since
the last sample is plausible (positive and under 0.5°C, on top of what
the Glitch Guard already filtered), it's classified into the right
phase/bucket cell and written into that cell's buffer, overwriting the
oldest entry once full. When a rate is needed, it's read back as the
**median** of that cell's buffer rather than an average, so one unusual
sample (a door propped open mid-heat-up, a guest cracking a window)
can't skew the estimate the way it would in a running average — it just
gets outvoted by the more typical samples around it.

Each cell starts seeded at a generic 0.05°C/min (~3°C/h) guess and is
used as-is until real samples arrive, so the two features aren't inert
on day one; expect the numbers to firm up over the first week or so as
the house sees a range of outdoor conditions and warm-up situations.

**Learned Heating Rate (Bulk)** and **Learned Heating Rate (Creep)**
(both °C/h) always show whichever outdoor bucket currently applies —
that's the practical "is this behaving reasonably" check, enabled by
default. For watching all 6 cells converge individually, there are also
6 **Heating Rate — Bulk/Creep, Bucket 1/2/3** sensors (bucket 1 =
coldest end of the range, bucket 3 = mildest) — these are disabled by
default (enable from the entity's settings in Home Assistant) since most
people don't need them.

If you change `heat_rate_outdoor_buckets` or `heat_rate_history_depth`,
you also need to update `heat_rate_cells` / `heat_rate_array_size` and
the matching `initial_value` list on `heat_rate_history` /
`heat_rate_write_idx` / `heat_rate_count` in the `globals:` section —
the comments there spell out the sizing formula.

## Operation modes

A **select** entity, `select.*_operation_mode`, switches between four
modes:

- **Normal** — unchanged day-to-day behavior: Preheat Schedule (if on) or
  whatever you last set on the thermostat card.
- **Eco** — `eco_setback` (default 2°C) below your Normal target. A quick
  "turn it down a bit right now" toggle.
- **Away** — `away_setback` (default 4°C) below your Normal target, for a
  day out.
- **Holiday** — a fixed frost-protection target (`holiday_target`,
  default 12°C), independent of season or schedule, and turns **Hot
  Water** off for the duration (worth it for a multi-day absence, unlike
  Eco/Away where DHW is on-demand and costs nothing left enabled) —
  restored to whatever it was before Holiday when you leave.

Eco/Away/Holiday all compute their target from whatever was last in
effect under Normal, not from each other — switching Eco → Away doesn't
stack a second setback on top of the first. Preheat Schedule only runs
while mode is Normal, so a schedule slot boundary can't silently cancel
a Holiday setting while you're away.

## Repository layout

```
opentherm-thermostat.yaml               ESPHome device firmware — the whole thermostat
secrets.yaml.example                    template for secrets.yaml (gitignored)
home_assistant/dashboard_example.yaml   optional example Lovelace view
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
  **GPIO4** and `GND`. Pressing it toggles the heating climate on/off
  locally — works even with no WiFi or Home Assistant. Verify GPIO4 is
  actually free on your specific board revision before wiring (it isn't
  used by the OpenTherm shield or the 1-Wire bus, but check the
  silkscreen).

Pins are substitution variables at the top of `opentherm-thermostat.yaml`
if you need to change any of them.

## Setup

1. **Edit the substitutions** at the top of `opentherm-thermostat.yaml`:
   - `room_temperature_entity_id` / `outdoor_temperature_entity_id` are
     already set to this install's actual Home Assistant entity IDs —
     update them here if either sensor ever changes.
   - `timezone` and the four `schedule_slotN_hour`/`_minute`/`_target`
     substitutions — your daily routine (defaults: 06:30→20°C,
     09:00→17°C, 17:00→20°C, 22:30→16°C). Turn off the Preheat Schedule
     switch after flashing if you'd rather set the target manually.
   - Everything else (weather-curve points, condensing threshold, PID
     gains, setpoint ranges) has a sensible default — see "Tuning" below.
2. `cp secrets.yaml.example secrets.yaml` and fill in your WiFi
   credentials, a generated API encryption key, and an OTA password (the
   file explains how to generate the key).
3. Install [ESPHome](https://esphome.io/guides/installing_esphome) (CLI or
   the Home Assistant ESPHome add-on) and flash over USB the first time:
   ```
   esphome run opentherm-thermostat.yaml
   ```
   Subsequent updates can go over-the-air.
4. Add the device in Home Assistant (Settings → Devices & Services →
   it'll be auto-discovered), using the same encryption key from
   `secrets.yaml`.
5. Set your target temperature and heat/off mode from the device's
   `climate.opentherm_thermostat_heating` thermostat card — that's your
   day-to-day control surface.

An example dashboard view is in `home_assistant/dashboard_example.yaml`.

## Custom Lovelace Card

`home_assistant/www/opentherm-thermostat-card.js` is a custom card purpose-built
for this device: a circular dial you can drag (or nudge with ±) to set the
target temperature, the four Operation Mode chips, and animated tiles for
flame, hot water, and condensing status. It's a plain Web Component — no
build step, no npm, no external dependencies — so installing it is just
copying one file:

1. Copy `home_assistant/www/opentherm-thermostat-card.js` into your Home
   Assistant `config/www/` folder (create it if it doesn't exist).
2. **Settings → Dashboards → ⋮ → Resources → Add Resource**:
   - URL: `/local/opentherm-thermostat-card.js`
   - Resource type: **JavaScript Module**
3. Add the card to a dashboard (YAML mode) — an example is already wired
   into `home_assistant/dashboard_example.yaml`:
   ```yaml
   - type: custom:opentherm-thermostat-card
     climate_entity: climate.opentherm_thermostat_heating
     mode_select_entity: select.opentherm_thermostat_operation_mode
     dhw_switch_entity: switch.opentherm_thermostat_hot_water
     dhw_setpoint_entity: number.opentherm_thermostat_hot_water_setpoint
     dhw_active_entity: binary_sensor.opentherm_thermostat_hot_water_active
     flame_entity: binary_sensor.opentherm_thermostat_flame_on
     condensing_entity: binary_sensor.opentherm_thermostat_condensing_mode_active
     modulation_entity: sensor.opentherm_thermostat_boiler_relative_modulation_level
     connected_entity: binary_sensor.opentherm_thermostat_home_assistant_connected
     backup_mode_entity: binary_sensor.opentherm_thermostat_backup_mode_active
   ```
   Only `climate_entity` is required — omit any of the others and that
   part of the card (a tile, the mode row, the connection dot) just
   doesn't render, rather than erroring.

Interactions: drag anywhere on the ring to set the target (release to
apply), tap the ± buttons for a quick 0.5° nudge, tap the center to toggle
heat on/off, tap a mode chip to switch Operation Mode, tap the Hot Water
tile to toggle DHW. The flame flickers while the boiler is actually
firing, the hot-water tile ripples while a tap is actually open (not just
whenever DHW is enabled), and the condensing leaf glows green when the
return-line sensor confirms the boiler's in its efficient range — all
tied to real entity state, not decorative.

## What you get in Home Assistant

- `climate` — **Heating**: the thermostat card (target room temperature, heat/off)
- `select` — **Operation Mode**: Normal / Eco / Away / Holiday
- `switch` — Hot Water (DHW on/off; Central Heating also exists but is
  driven automatically by the Heating climate's mode), plus the three
  feature toggles: Room Sensor Glitch Guard, Anticipate Heating Coast,
  Preheat Schedule
- `number` — Hot Water Setpoint (°C)
- `sensor` — boiler flow temp, DHW temp, return temp (boiler-reported),
  **CV Return Line Temperature (your external sensor)**, modulation %,
  CH water pressure, exhaust temp, fault/diagnostic codes, WiFi signal,
  uptime, **Learned Heating Rate (Bulk)**, **Learned Heating Rate (Creep)**
- `binary_sensor` — flame, heating/DHW active, boiler fault/diagnostic
  flags, **Condensing Mode Active**, **Home Assistant Connected**,
  **Backup Mode Active**, **Room Sensor Glitch Detected**
- `button` — Restart

## Tuning

- `design_outdoor_temp` / `design_flow_temp` set the cold-day end of the
  weather-curve ceiling; `min_flow_temp` is the constant floor.
  `heating_limit_outdoor_temp` is the outdoor temperature above which the
  ceiling drops to the floor (heating can still run above it if the room
  genuinely calls for it — the PID term handles that — it just starts
  from a low ceiling).
- `pid_kp` / `pid_ki` (defaults are DIYLESS's field-tested starting
  values for this exact hardware) tune how aggressively the flow setpoint
  reacts to room error. If room temperature oscillates, lower both; if it
  settles noticeably below target and stays there, raise `pid_ki`
  slightly.
- Watch the **Condensing Mode Active** binary sensor and your gas meter
  over the first couple of weeks, and lower `design_flow_temp` if the
  boiler condenses reliably — lower flow temps at the same comfort level
  is the actual gas saving.
- A window/door cutoff is pre-written but commented out in the firmware
  (search for "window/door cutoff" in `opentherm-thermostat.yaml`) — needs
  a `binary_sensor.*` entity ID filled in and uncommenting.
- The built-in Preheat Schedule covers a fixed daily routine (4 slots).
  For one-off exceptions (an away setback while on holiday, a "party
  night" override), `climate.opentherm_thermostat_heating` is a
  completely normal HA climate entity — a `climate.set_temperature` /
  `climate.set_hvac_mode` call from an ordinary HA automation works
  alongside the schedule (it'll just get overridden again at the next
  scheduled slot boundary, same as a manual card change).

## Backup control (no Home Assistant required)

Three independent layers, from "HA had a hiccup" to "everything is down":

1. **ESPHome local web UI** — every device has a built-in web server at
   its IP address (`web_server:` in the config), including the thermostat
   card. Works over WiFi without HA.
2. **HA-disconnect watchdog** — if the Home Assistant API connection drops
   for more than `ha_disconnect_backup_delay` (default 15 minutes), the
   device stops the PID loop (your room/outdoor readings can't update
   without HA) and forces a safe fallback CH setpoint (default 45°C) so
   the house doesn't go cold while you fix HA. It hands control back to
   the PID loop automatically the moment HA reconnects. Visible via the
   **Home Assistant Connected** / **Backup Mode Active** binary sensors.
3. **Physical backup button** (optional, if wired) — toggles the heating
   climate on/off directly on the device, no network required at all.

None of these are a full offline schedule — they're deliberately minimal
"don't let the house get cold" fallbacks, not a replacement for normal
operation.

## Notes on the Intergas 28/24 cW4

- The cW4 is an instant (non-storage) combi — the DHW setpoint controls
  the target tap water temperature, not a cylinder.
- Return-line condensing threshold of 55°C in the config is a reasonable
  default for Intergas units; adjust `condensing_threshold` /
  `condensing_trim_step` if you find your unit's condensing point differs.

## Finding out what your boiler actually supports

OpenTherm has no "list your capabilities" command — a master can only find
out whether the boiler supports a given Data-ID by asking for it and
seeing whether it comes back with real data or gets NACKed. The one
partial exception is Data-ID 3 ("Slave Configuration"), a handful of
genuine capability flags (`binary_sensor.*_hot_water_present_capability_`,
`*_cooling_supported_capability_`, `*_heating_circuit_2_present_capability_`,
etc.) — everything else has to be probed empirically.

The firmware now requests every sensor and binary_sensor Data-ID the
ESPHome `opentherm` component knows how to ask for — all 38 sensor keys
and all 26 binary_sensor keys, not just the ones a typical CH+DHW combi
needs. Anything your specific boiler doesn't implement (like
`t_exhaust`/exhaust temperature, which many residential combis — Intergas
included — simply don't report) will just show as unavailable rather than
a wrong value; that unavailable state *is* the answer to "does it support
this." A few (the CH2/solar keys: `t_flow_ch2`, `t_storage`,
`t_collector`) are almost certainly inapplicable to a cW4 with no second
heating circuit or solar integration, but cost nothing to leave in and
confirm.

Once you've flashed this and seen which of the new diagnostic entities
actually populate, it's reasonable to prune the ones that stay
unavailable back out of the firmware — they're harmless left in (a NACKed
request is normal OpenTherm traffic, not an error condition), but there's
no reason to keep asking for data a boiler has already told you it
doesn't have.
