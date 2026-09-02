# opentherm-thermostat-dial-card

A fork of [thermostat-dark-card](https://github.com/ciotlosm/lovelace-thermostat-dark-card)
by Marius Ciotlos (MIT licensed — see `LICENSE`), extended for the
[ESPHome-opentherm](https://github.com/jkautomation01/ESPHome-opentherm)
project with a row of status badges and a mode-select row below the dial:

- **Hot water badge** (`dhw_entity`) — lit while hot water is actively
  drawing. Point it at a `switch.*` entity instead of a `binary_sensor.*`
  and tapping it toggles the switch; a `binary_sensor.*` is read-only.
- **Window badge** (`window_entity`) — shows open/closed for a
  `binary_sensor.*` (window/door contact).
- **Problem badge** (`problem_entities`, a list) — only appears at all
  while at least one listed `binary_sensor.*` is `on` (boiler fault,
  lockout, etc.).
- **Mode chips** (`mode_select_entity`) — one chip per option on a
  `select.*` entity (e.g. Normal/Eco/Away/Holiday), highlighting the
  current one; tapping a chip calls `select.select_option`. This is
  separate from HA's native climate `preset_mode` (which the upstream
  card's built-in single preset icon already handles) because this
  project's Operation Mode is its own `select` entity, not a climate
  preset.

All three render *inside the dial itself*, in the same slot the upstream
card uses for its single preset (leaf) icon — as a row that also includes
the preset icon when one applies, always centered regardless of how many
of the four are present. This mirrors the upstream card's own convention
rather than adding a separate strip of badges below the dial.

Everything else — the dial, drag-to-set, dark/light/glassy/transparent
themes, power toggle — is unmodified upstream behavior. See the
[upstream README](https://github.com/ciotlosm/lovelace-thermostat-dark-card#readme)
for the full base config reference (`theme`, `step`, `pending`,
`show_ticks`, `colors`, `status_entity`, `ambient_temperature`, etc.).

## Config example

```yaml
type: custom:opentherm-thermostat-dial-card
entity: climate.opentherm_thermostat_heating
name: OpenTherm
theme: dark
dhw_entity: binary_sensor.opentherm_thermostat_hot_water_active
window_entity: binary_sensor.woonkamer_raam_sensor_contact
mode_select_entity: select.opentherm_thermostat_operation_mode
problem_entities:
  - binary_sensor.opentherm_thermostat_boiler_fault
  - binary_sensor.opentherm_thermostat_boiler_diagnostic
  - binary_sensor.opentherm_thermostat_service_required
  - binary_sensor.opentherm_thermostat_lockout_reset
  - binary_sensor.opentherm_thermostat_low_water_pressure_fault
  - binary_sensor.opentherm_thermostat_flame_fault
  - binary_sensor.opentherm_thermostat_air_pressure_fault
  - binary_sensor.opentherm_thermostat_water_overtemperature
```

## Building

The built card (`opentherm-thermostat-dial-card.js`) is committed to
`../www/` so installing the project doesn't require Node — see the main
project README's "Custom Lovelace Card" section. Only rebuild this if
you're changing the card itself:

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # biome lint
npm run build        # -> dist/opentherm-thermostat-dial-card.js
cp dist/opentherm-thermostat-dial-card.js ../www/opentherm-thermostat-dial-card.js
```

`npm run preview` (after `npm run build`) serves `demo/index.html` for a
quick visual check without deploying to a real Home Assistant instance.

## Diffing against upstream

To pull in upstream fixes: clone
`ciotlosm/lovelace-thermostat-dark-card` fresh, diff its `src/` against
this fork's `src/` (the tag renames — `thermostat-dark-card` →
`opentherm-thermostat-dial-card`, `thermostat-dial` →
`opentherm-thermostat-dial` — plus the badges/mode-chips additions in
`src/card/card.ts` and the new fields in `src/types.ts` are the only
intentional differences), and re-apply anything worth keeping.
