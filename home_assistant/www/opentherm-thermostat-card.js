/**
 * OpenTherm Thermostat Card — a custom Lovelace card for the ESPHome
 * OpenTherm thermostat (github.com/jkautomation01/ESPHome-opentherm).
 *
 * Plain Web Component, no build step, no external dependencies — drop
 * this file into <config>/www/ and add it as a Lovelace resource. See
 * home_assistant/README section "Custom Lovelace Card" for install
 * instructions and a full example card configuration.
 *
 * Config (all entity ids optional except climate_entity; anything not
 * configured is simply omitted from the card):
 *   type: custom:opentherm-thermostat-card
 *   climate_entity: climate.opentherm_thermostat_heating        (required)
 *   mode_select_entity: select.opentherm_thermostat_operation_mode
 *   dhw_switch_entity: switch.opentherm_thermostat_hot_water
 *   dhw_setpoint_entity: number.opentherm_thermostat_hot_water_setpoint
 *   dhw_active_entity: binary_sensor.opentherm_thermostat_hot_water_active
 *   flame_entity: binary_sensor.opentherm_thermostat_flame_on
 *   condensing_entity: binary_sensor.opentherm_thermostat_condensing_mode_active
 *   modulation_entity: sensor.opentherm_thermostat_boiler_relative_modulation_level
 *   connected_entity: binary_sensor.opentherm_thermostat_home_assistant_connected
 *   backup_mode_entity: binary_sensor.opentherm_thermostat_backup_mode_active
 *   name: OpenTherm                                              (optional title)
 *   step: 0.5                                                    (optional, °C per nudge)
 */

const MODES = [
  { key: "Normal", icon: "mdi:home-thermometer-outline", label: "Normal" },
  { key: "Eco", icon: "mdi:leaf", label: "Eco" },
  { key: "Away", icon: "mdi:car-side", label: "Away" },
  { key: "Holiday", icon: "mdi:beach", label: "Holiday" },
];

const START_ANGLE = -135;
const END_ANGLE = 135;
const SWEEP = END_ANGLE - START_ANGLE;
const CX = 100;
const CY = 100;
const R = 82;
const STROKE = 14;

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle < 0.5) return "";
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function valueToAngle(value, min, max) {
  const frac = clamp((value - min) / (max - min), 0, 1);
  return START_ANGLE + frac * SWEEP;
}

function angleToValue(angle, min, max) {
  const frac = (angle - START_ANGLE) / SWEEP;
  return min + frac * (max - min);
}

function fmt1(v) {
  return Number.isFinite(v) ? v.toFixed(1) : "--";
}

class OpenThermThermostatCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:opentherm-thermostat-card",
      climate_entity: "climate.opentherm_thermostat_heating",
      mode_select_entity: "select.opentherm_thermostat_operation_mode",
      dhw_switch_entity: "switch.opentherm_thermostat_hot_water",
      dhw_setpoint_entity: "number.opentherm_thermostat_hot_water_setpoint",
      dhw_active_entity: "binary_sensor.opentherm_thermostat_hot_water_active",
      flame_entity: "binary_sensor.opentherm_thermostat_flame_on",
      condensing_entity: "binary_sensor.opentherm_thermostat_condensing_mode_active",
      modulation_entity: "sensor.opentherm_thermostat_boiler_relative_modulation_level",
      connected_entity: "binary_sensor.opentherm_thermostat_home_assistant_connected",
      backup_mode_entity: "binary_sensor.opentherm_thermostat_backup_mode_active",
    };
  }

  setConfig(config) {
    if (!config || !config.climate_entity) {
      throw new Error("opentherm-thermostat-card: 'climate_entity' is required");
    }
    this._config = config;
    this._step = config.step || 0.5;
    this._last = {};
    this._dragging = false;
    this._dragValue = null;

    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._buildDom();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 7;
  }

  // ---------------------------------------------------------------------
  // DOM construction (once) — everything after this only mutates classes/
  // text/attributes so CSS animations never restart on a routine state tick.
  // ---------------------------------------------------------------------
  _buildDom() {
    const modeChips = MODES.map(
      (m) => `
        <button class="chip" data-mode="${m.key}" title="${m.label}">
          <ha-icon icon="${m.icon}"></ha-icon>
          <span>${m.label}</span>
        </button>`
    ).join("");

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="title" id="title">OpenTherm</div>
            <div class="conn" id="conn" title="Connection">
              <ha-icon id="conn-icon" icon="mdi:wifi"></ha-icon>
            </div>
          </div>

          <div class="dial-area">
            <svg id="svg" viewBox="0 0 200 200">
              <path id="track" class="track" fill="none"></path>
              <path id="fill" class="fill" fill="none"></path>
              <circle id="marker" class="marker" r="7"></circle>
              <circle id="hit" class="hit" cx="${CX}" cy="${CY}" r="${R}" fill="none"></circle>
            </svg>
            <div class="center" id="center">
              <div class="current" id="current-temp">--°</div>
              <div class="target-row">
                <button class="nudge" id="minus" aria-label="Decrease target">
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
                <div class="target" id="target-temp">--°</div>
                <button class="nudge" id="plus" aria-label="Increase target">
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>
              <div class="hint" id="hint">tap ring to toggle heat</div>
            </div>
          </div>

          <div class="modes" id="modes">${modeChips}</div>

          <div class="tiles">
            <div class="tile" id="flame-tile">
              <div class="icon-wrap flame-wrap" id="flame-wrap">
                <ha-icon icon="mdi:fire" class="flame-icon"></ha-icon>
              </div>
              <div class="tile-text">
                <div class="tile-label">Flame</div>
                <div class="tile-value" id="modulation-value">--</div>
              </div>
            </div>

            <div class="tile" id="dhw-tile">
              <div class="icon-wrap water-wrap" id="water-wrap">
                <svg class="ripples" viewBox="0 0 60 60">
                  <circle class="ripple r1" cx="30" cy="30" r="10"></circle>
                  <circle class="ripple r2" cx="30" cy="30" r="10"></circle>
                  <circle class="ripple r3" cx="30" cy="30" r="10"></circle>
                </svg>
                <ha-icon icon="mdi:water-boiler" class="water-icon"></ha-icon>
              </div>
              <div class="tile-text">
                <div class="tile-label">Hot Water</div>
                <div class="tile-value" id="dhw-value">--</div>
              </div>
            </div>

            <div class="tile" id="leaf-tile">
              <div class="icon-wrap leaf-wrap" id="leaf-wrap">
                <ha-icon icon="mdi:leaf"></ha-icon>
              </div>
              <div class="tile-text">
                <div class="tile-label">Condensing</div>
                <div class="tile-value" id="leaf-value">--</div>
              </div>
            </div>
          </div>

          <div class="backup-banner" id="backup-banner">
            <ha-icon icon="mdi:shield-alert-outline"></ha-icon>
            <span>Backup mode active — Home Assistant unreachable</span>
          </div>
        </div>
      </ha-card>
    `;

    // Cache refs
    this._el = {
      title: this.shadowRoot.getElementById("title"),
      conn: this.shadowRoot.getElementById("conn"),
      connIcon: this.shadowRoot.getElementById("conn-icon"),
      svg: this.shadowRoot.getElementById("svg"),
      track: this.shadowRoot.getElementById("track"),
      fill: this.shadowRoot.getElementById("fill"),
      marker: this.shadowRoot.getElementById("marker"),
      hit: this.shadowRoot.getElementById("hit"),
      center: this.shadowRoot.getElementById("center"),
      currentTemp: this.shadowRoot.getElementById("current-temp"),
      targetTemp: this.shadowRoot.getElementById("target-temp"),
      hint: this.shadowRoot.getElementById("hint"),
      minus: this.shadowRoot.getElementById("minus"),
      plus: this.shadowRoot.getElementById("plus"),
      modes: this.shadowRoot.getElementById("modes"),
      flameTile: this.shadowRoot.getElementById("flame-tile"),
      flameWrap: this.shadowRoot.getElementById("flame-wrap"),
      modulationValue: this.shadowRoot.getElementById("modulation-value"),
      dhwTile: this.shadowRoot.getElementById("dhw-tile"),
      waterWrap: this.shadowRoot.getElementById("water-wrap"),
      dhwValue: this.shadowRoot.getElementById("dhw-value"),
      leafWrap: this.shadowRoot.getElementById("leaf-wrap"),
      leafValue: this.shadowRoot.getElementById("leaf-value"),
      backupBanner: this.shadowRoot.getElementById("backup-banner"),
    };

    // track arc never changes
    this._el.track.setAttribute("d", describeArc(CX, CY, R, START_ANGLE, END_ANGLE));
    this._el.track.style.strokeWidth = STROKE;
    this._el.fill.style.strokeWidth = STROKE;

    this._wireEvents();
  }

  _wireEvents() {
    const cfg = this._config;

    this._el.minus.addEventListener("click", (e) => {
      e.stopPropagation();
      this._nudgeTarget(-this._step);
    });
    this._el.plus.addEventListener("click", (e) => {
      e.stopPropagation();
      this._nudgeTarget(this._step);
    });

    this._el.center.addEventListener("click", () => {
      if (this._dragging) return;
      this._toggleHvac();
    });

    // Drag-to-set on the ring
    const svg = this._el.svg;
    let pointerId = null;

    const angleFromPointer = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      return clamp(angle, START_ANGLE, END_ANGLE);
    };

    const distFromCenter = (clientX, clientY) => {
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / 200;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.hypot(clientX - cx, clientY - cy) / scale;
    };

    svg.addEventListener("pointerdown", (ev) => {
      const d = distFromCenter(ev.clientX, ev.clientY);
      if (d < R - STROKE || d > R + STROKE) return; // only the ring itself
      if (!this._climateState() || this._hvacMode() === "off") return;
      pointerId = ev.pointerId;
      svg.setPointerCapture(pointerId);
      this._dragging = true;
      this._onDragMove(angleFromPointer(ev.clientX, ev.clientY));
      ev.preventDefault();
    });
    svg.addEventListener("pointermove", (ev) => {
      if (!this._dragging || ev.pointerId !== pointerId) return;
      this._onDragMove(angleFromPointer(ev.clientX, ev.clientY));
    });
    const endDrag = (ev) => {
      if (!this._dragging || (pointerId !== null && ev.pointerId !== pointerId)) return;
      this._dragging = false;
      pointerId = null;
      if (this._dragValue != null) {
        this._callService("climate", "set_temperature", cfg.climate_entity, {
          temperature: this._dragValue,
        });
      }
      this._dragValue = null;
    };
    svg.addEventListener("pointerup", endDrag);
    svg.addEventListener("pointercancel", endDrag);

    // Mode chips
    this._el.modes.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".chip");
      if (!btn || !cfg.mode_select_entity) return;
      this._callService("select", "select_option", cfg.mode_select_entity, {
        option: btn.dataset.mode,
      });
    });

    // DHW tile toggles the switch
    this._el.dhwTile.addEventListener("click", () => {
      if (!cfg.dhw_switch_entity || !this._hass) return;
      const st = this._hass.states[cfg.dhw_switch_entity];
      const isOn = st && st.state === "on";
      this._callService("switch", isOn ? "turn_off" : "turn_on", cfg.dhw_switch_entity, {});
    });
  }

  _onDragMove(angle) {
    const min = this._minTemp();
    const max = this._maxTemp();
    let value = angleToValue(angle, min, max);
    value = Math.round(value / this._step) * this._step;
    value = clamp(value, min, max);
    this._dragValue = value;
    this._paintDial(this._currentTempValue(), value, true);
    this._el.targetTemp.textContent = `${fmt1(value)}°`;
  }

  _nudgeTarget(delta) {
    const st = this._climateState();
    if (!st) return;
    const min = this._minTemp();
    const max = this._maxTemp();
    const cur = st.attributes.temperature;
    if (!Number.isFinite(cur)) return;
    const next = clamp(Math.round((cur + delta) / this._step) * this._step, min, max);
    this._callService("climate", "set_temperature", this._config.climate_entity, {
      temperature: next,
    });
  }

  _toggleHvac() {
    const st = this._climateState();
    if (!st) return;
    const next = st.state === "off" ? "heat" : "off";
    this._callService("climate", "set_hvac_mode", this._config.climate_entity, {
      hvac_mode: next,
    });
  }

  _callService(domain, service, entity_id, data) {
    if (!this._hass || !entity_id) return;
    this._hass.callService(domain, service, { entity_id, ...data });
  }

  // ---------------------------------------------------------------------
  // Reading state
  // ---------------------------------------------------------------------
  _climateState() {
    return this._hass && this._hass.states[this._config.climate_entity];
  }
  _hvacMode() {
    const st = this._climateState();
    return st ? st.state : "off";
  }
  _currentTempValue() {
    const st = this._climateState();
    return st ? st.attributes.current_temperature : NaN;
  }
  _minTemp() {
    const st = this._climateState();
    return (this._config.min_temp ?? (st && st.attributes.min_temp)) || 10;
  }
  _maxTemp() {
    const st = this._climateState();
    return (this._config.max_temp ?? (st && st.attributes.max_temp)) || 30;
  }
  _stateOf(entityId) {
    return entityId && this._hass ? this._hass.states[entityId] : undefined;
  }
  _isOn(entityId) {
    const st = this._stateOf(entityId);
    return !!st && st.state === "on";
  }

  // ---------------------------------------------------------------------
  // Render (change-detected — never touches DOM for values that didn't move)
  // ---------------------------------------------------------------------
  _render() {
    if (!this._hass || !this._el) return;
    const cfg = this._config;
    const st = this._climateState();
    if (!st) return;

    if (cfg.name && this._last.name !== cfg.name) {
      this._el.title.textContent = cfg.name;
      this._last.name = cfg.name;
    }

    const current = st.attributes.current_temperature;
    const target = this._dragging ? this._dragValue : st.attributes.temperature;
    const hvacOn = st.state !== "off";
    // hvac_action distinguishes "mode is Heat" from "the boiler is
    // actually being asked for heat right now" — mode alone stays Heat
    // for as long as you leave the thermostat on, while action swings
    // between heating and standby as the room passes target.
    const heating = hvacOn && st.attributes.hvac_action === "heating";
    const flameOn = this._isOn(cfg.flame_entity);

    if (this._last.current !== current) {
      this._el.currentTemp.textContent = Number.isFinite(current) ? `${fmt1(current)}°` : "--°";
      this._last.current = current;
    }
    if (!this._dragging && this._last.target !== target) {
      this._el.targetTemp.textContent = Number.isFinite(target) ? `${fmt1(target)}°` : "--°";
      this._last.target = target;
    }
    if (this._last.hvacOn !== hvacOn || this._last.heating !== heating) {
      this._el.center.classList.toggle("off", !hvacOn);
      this._el.center.classList.toggle("standby", hvacOn && !heating);
      this._el.hint.textContent = !hvacOn
        ? "tap ring to turn on heat"
        : heating
        ? "Heating — tap ring to turn off"
        : "Standby — tap ring to turn off";
      this._last.hvacOn = hvacOn;
      this._last.heating = heating;
    }
    if (!this._dragging) {
      this._paintDial(current, target, flameOn);
    }

    // Connection / backup status
    const connected = cfg.connected_entity ? this._isOn(cfg.connected_entity) : true;
    const backup = this._isOn(cfg.backup_mode_entity);
    if (this._last.connected !== connected || this._last.backup !== backup) {
      this._el.connIcon.setAttribute("icon", connected ? "mdi:wifi" : "mdi:wifi-off");
      this._el.conn.classList.toggle("bad", !connected);
      this._el.backupBanner.classList.toggle("show", backup);
      this._last.connected = connected;
      this._last.backup = backup;
    }

    // Flame tile
    if (this._last.flameOn !== flameOn) {
      this._el.flameWrap.classList.toggle("active", flameOn);
      this._el.flameTile.classList.toggle("active", flameOn);
      this._last.flameOn = flameOn;
    }
    const modulation = cfg.modulation_entity ? this._stateOf(cfg.modulation_entity) : undefined;
    const modText = modulation && Number.isFinite(parseFloat(modulation.state))
      ? `${Math.round(parseFloat(modulation.state))}%`
      : flameOn ? "on" : "off";
    if (this._last.modText !== modText) {
      this._el.modulationValue.textContent = modText;
      this._last.modText = modText;
    }

    // DHW tile
    const dhwActive = cfg.dhw_active_entity
      ? this._isOn(cfg.dhw_active_entity)
      : this._isOn(cfg.dhw_switch_entity);
    const dhwEnabled = cfg.dhw_switch_entity ? this._isOn(cfg.dhw_switch_entity) : false;
    if (this._last.dhwActive !== dhwActive) {
      this._el.waterWrap.classList.toggle("active", dhwActive);
      this._el.dhwTile.classList.toggle("active", dhwActive);
      this._last.dhwActive = dhwActive;
    }
    const dhwText = dhwActive ? "drawing" : dhwEnabled ? "ready" : "off";
    if (this._last.dhwText !== dhwText) {
      this._el.dhwValue.textContent = dhwText;
      this._el.dhwTile.classList.toggle("enabled", dhwEnabled);
      this._last.dhwText = dhwText;
    }

    // Condensing tile
    const condensing = this._isOn(cfg.condensing_entity);
    if (this._last.condensing !== condensing) {
      this._el.leafWrap.classList.toggle("active", condensing);
      this._el.leafValue.textContent = condensing ? "yes" : "no";
      this._last.condensing = condensing;
    }

    // Mode chips
    const mode = cfg.mode_select_entity ? this._stateOf(cfg.mode_select_entity)?.state : undefined;
    if (this._last.mode !== mode) {
      this._el.modes.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.toggle("active", chip.dataset.mode === mode);
      });
      this._el.modes.style.display = cfg.mode_select_entity ? "" : "none";
      this._last.mode = mode;
    }

    // Hide tiles for unconfigured entities (once)
    if (!this._last.visibilityDone) {
      this._el.dhwTile.style.display = cfg.dhw_switch_entity || cfg.dhw_active_entity ? "" : "none";
      this._el.leafWrap.parentElement.style.display = cfg.condensing_entity ? "" : "none";
      this._last.visibilityDone = true;
    }
  }

  _paintDial(current, target, warm) {
    const min = this._minTemp();
    const max = this._maxTemp();
    const targetAngle = valueToAngle(Number.isFinite(target) ? target : min, min, max);
    const currentAngle = valueToAngle(Number.isFinite(current) ? current : min, min, max);
    const lo = Math.min(targetAngle, currentAngle);
    const hi = Math.max(targetAngle, currentAngle);

    this._el.fill.setAttribute("d", describeArc(CX, CY, R, lo, hi));
    this._el.fill.classList.toggle("warm", !!warm);
    this._el.fill.classList.toggle("settled", hi - lo < 2);

    const pos = polarToCartesian(CX, CY, R, targetAngle);
    this._el.marker.setAttribute("cx", pos.x);
    this._el.marker.setAttribute("cy", pos.y);
  }

  _css() {
    return `
      :host { display: block; }
      ha-card { padding: 16px; }
      .wrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
      .header { width: 100%; display: flex; align-items: center; justify-content: space-between; }
      .title { font-size: 1.1rem; font-weight: 600; color: var(--primary-text-color); }
      .conn { color: var(--success-color, #4caf50); display: flex; }
      .conn.bad { color: var(--error-color, #f44336); }
      .conn ha-icon { --mdc-icon-size: 18px; }

      .dial-area { position: relative; width: 200px; height: 200px; }
      svg#svg { width: 100%; height: 100%; touch-action: none; cursor: pointer; }
      .track { stroke: var(--divider-color, #e0e0e0); }
      .fill {
        stroke: var(--info-color, #5c9bd1);
        transition: d 0.35s ease, stroke 0.35s ease;
        stroke-linecap: round;
      }
      .fill.warm { stroke: #ff8a3d; }
      .fill.settled { stroke: #66bb6a; }
      .marker {
        fill: var(--card-background-color, #fff);
        stroke: var(--primary-text-color);
        stroke-width: 3;
        transition: cx 0.35s ease, cy 0.35s ease;
      }
      .hit { pointer-events: none; }

      .center {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 2px; cursor: pointer;
      }
      .center.off { opacity: 0.55; }
      .center.standby .hint { color: #5c9bd1; opacity: 0.85; }
      .current { font-size: 2.1rem; font-weight: 300; color: var(--primary-text-color); line-height: 1; }
      .target-row { display: flex; align-items: center; gap: 8px; }
      .target { font-size: 1rem; color: var(--secondary-text-color); min-width: 46px; text-align: center; }
      .nudge {
        width: 26px; height: 26px; border-radius: 50%; border: none;
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
      }
      .nudge ha-icon { --mdc-icon-size: 16px; }
      .nudge:active { transform: scale(0.9); }
      .hint { font-size: 0.68rem; color: var(--secondary-text-color); opacity: 0.7; margin-top: 2px; }

      .modes { display: flex; gap: 6px; width: 100%; }
      .chip {
        flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
        padding: 6px 2px; border-radius: 10px; border: none;
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--secondary-text-color);
        font-size: 0.65rem; cursor: pointer; transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
      }
      .chip ha-icon { --mdc-icon-size: 18px; }
      .chip.active {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        transform: translateY(-1px);
      }
      .chip:active { transform: scale(0.95); }

      .tiles { display: flex; gap: 8px; width: 100%; }
      .tile {
        flex: 1; display: flex; align-items: center; gap: 8px;
        background: var(--secondary-background-color, #f0f0f0);
        border-radius: 12px; padding: 8px; cursor: pointer;
      }
      .tile-text { display: flex; flex-direction: column; }
      .tile-label { font-size: 0.62rem; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.02em; }
      .tile-value { font-size: 0.82rem; color: var(--primary-text-color); font-weight: 600; }

      .icon-wrap {
        width: 34px; height: 34px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        position: relative; flex-shrink: 0;
        background: var(--card-background-color, #fff);
        color: var(--secondary-text-color);
      }

      /* --- Flame --- */
      .flame-wrap ha-icon { --mdc-icon-size: 18px; transition: color 0.2s ease; }
      .flame-wrap.active { color: #ff7043; }
      .flame-wrap.active .flame-icon { animation: flicker 1.1s ease-in-out infinite; }
      @keyframes flicker {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
        25% { transform: scale(1.08) rotate(-3deg); opacity: 0.85; }
        50% { transform: scale(0.96) rotate(2deg); opacity: 1; }
        75% { transform: scale(1.05) rotate(-1deg); opacity: 0.9; }
      }

      /* --- Water --- */
      .water-wrap ha-icon { --mdc-icon-size: 18px; position: relative; z-index: 1; transition: color 0.2s ease; }
      .water-wrap.active { color: #29b6f6; }
      .ripples { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.2s ease; }
      .water-wrap.active .ripples { opacity: 1; }
      .ripple { fill: none; stroke: #29b6f6; stroke-width: 2; transform-origin: center; opacity: 0; }
      .water-wrap.active .r1 { animation: ripple 2s ease-out infinite; }
      .water-wrap.active .r2 { animation: ripple 2s ease-out infinite 0.6s; }
      .water-wrap.active .r3 { animation: ripple 2s ease-out infinite 1.2s; }
      @keyframes ripple {
        0% { r: 8; opacity: 0.7; }
        100% { r: 26; opacity: 0; }
      }

      /* --- Condensing leaf --- */
      .leaf-wrap ha-icon { --mdc-icon-size: 18px; transition: color 0.2s ease; }
      .leaf-wrap.active { color: #66bb6a; animation: glow 2.4s ease-in-out infinite; }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(102,187,106,0.35); }
        50% { box-shadow: 0 0 0 6px rgba(102,187,106,0); }
      }

      .backup-banner {
        display: none; align-items: center; gap: 6px; width: 100%;
        background: rgba(244,67,54,0.12); color: var(--error-color, #f44336);
        border-radius: 10px; padding: 6px 10px; font-size: 0.72rem;
      }
      .backup-banner.show { display: flex; }
      .backup-banner ha-icon { --mdc-icon-size: 16px; }
    `;
  }
}

customElements.define("opentherm-thermostat-card", OpenThermThermostatCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "opentherm-thermostat-card",
  name: "OpenTherm Thermostat",
  description: "Circular thermostat card for the ESPHome OpenTherm project, with flame/hot-water animations and Normal/Eco/Away/Holiday modes.",
  preview: false,
});
