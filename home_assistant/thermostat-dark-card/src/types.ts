// Card configuration (user-facing YAML config)
export interface ThermostatCardConfig {
  type: string;
  entity: string;
  name?: string | false;
  hide_name?: boolean;
  theme?: string;
  // Dial behavior
  step?: number;
  pending?: number; // seconds before committing temperature change
  idle_zone?: number; // minimum gap between low/high in dual mode
  // Visual options
  diameter?: number;
  show_ticks?: boolean;
  show_power_toggle?: boolean;
  show_preset_indicator?: boolean;
  readonly?: boolean;
  num_ticks?: number;
  tick_degrees?: number;
  // Color overrides (YAML only, not in visual editor)
  colors?: {
    heating?: string;
    cooling?: string;
    idle?: string;
    off?: string;
  };
  // Status text entity — displayed above temperature in the dial
  status_entity?: string;
  // Preset icon mapping (YAML only) — map preset name to icon: eco, away, home, sleep, boost, comfort, activity
  preset_icons?: Record<string, string>;
  // Overrides
  range_min?: number;
  range_max?: number;
  ambient_temperature?: string; // external sensor entity

  // --- OpenTherm project additions (badges row below the dial) ---
  // Hot water usage — any entity whose state is "on" (a binary_sensor for
  // active draw, or a switch) lights the water-boiler icon.
  dhw_entity?: string;
  // Window/door cutoff sensor — "on" (open) shows the open-window icon
  // and dims the dial to flag that heating is suspended.
  window_entity?: string;
  // One or more binary_sensors treated as fault/problem flags (boiler
  // fault, lockout, etc.) — the alert icon shows only while any is "on".
  problem_entities?: string[];
  // A select entity for a mode concept outside HA's native climate
  // preset_mode (e.g. this project's Normal/Eco/Away/Holiday Operation
  // Mode) — rendered as a row of chips from the entity's `options`
  // attribute, highlighting its current `state`.
  mode_select_entity?: string;
  // Optional mdi icon name per mode option (e.g. { Eco: "mdi:leaf" }).
  // Falls back to a generic icon for options without a mapping.
  mode_icons?: Record<string, string>;
}

// HA climate entity HVAC actions (what's actually happening)
export type HvacAction =
  | 'off'
  | 'heating'
  | 'cooling'
  | 'idle'
  | 'drying'
  | 'fan'
  | 'preheating'
  | 'defrosting';
