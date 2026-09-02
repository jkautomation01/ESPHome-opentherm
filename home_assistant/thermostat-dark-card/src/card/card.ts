import {
  type CSSResultGroup,
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../const';
import type { HomeAssistant } from '../ha-types';
import { hasEntityChanged } from '../ha-types';
import { localize } from '../localize/index';
import { getAvailableThemes } from '../themes/index';
import type { HvacAction, ThermostatCardConfig } from '../types';
import '../dial/dial';

// Fallback mdi icon per mode option when mode_icons doesn't map it.
const DEFAULT_MODE_ICONS: Record<string, string> = {
  normal: 'mdi:home-thermometer-outline',
  home: 'mdi:home-thermometer-outline',
  eco: 'mdi:leaf',
  away: 'mdi:car-side',
  holiday: 'mdi:beach',
  sleep: 'mdi:power-sleep',
  boost: 'mdi:fire',
};

@customElement('opentherm-thermostat-dial-card')
export class ThermostatDarkCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ThermostatCardConfig;

  public static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
        { name: 'name', selector: { text: {} } },
        {
          type: 'grid',
          name: '',
          flatten: true,
          schema: [
            {
              name: 'theme',
              selector: { select: { options: getAvailableThemes(), mode: 'dropdown' } },
            },
            { name: 'step', selector: { number: { min: 0.5, max: 5, step: 0.5, mode: 'box' } } },
            { name: 'pending', selector: { number: { min: 1, max: 30, step: 1, mode: 'box' } } },
          ],
        },
        { name: 'ambient_temperature', selector: { entity: { domain: 'sensor' } } },
        { name: 'status_entity', selector: { entity: { domain: ['sensor', 'input_text'] } } },
        {
          type: 'grid',
          name: '',
          flatten: true,
          schema: [
            { name: 'hide_name', selector: { boolean: {} } },
            { name: 'readonly', selector: { boolean: {} } },
            { name: 'show_power_toggle', selector: { boolean: {} } },
            { name: 'show_preset_indicator', selector: { boolean: {} } },
          ],
        },
        {
          type: 'grid',
          name: '',
          flatten: true,
          schema: [
            { name: 'dhw_entity', selector: { entity: { domain: ['binary_sensor', 'switch'] } } },
            { name: 'window_entity', selector: { entity: { domain: 'binary_sensor' } } },
            { name: 'mode_select_entity', selector: { entity: { domain: 'select' } } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => {
        const lang = document.documentElement.lang || 'en';
        return localize(`editor_${schema.name}`, lang) ?? schema.name;
      },
    };
  }

  public static getStubConfig(hass?: { states: Record<string, unknown> }): Record<string, unknown> {
    const entities = hass ? Object.keys(hass.states).filter((e) => e.startsWith('climate.')) : [];
    return { entity: entities[0] || 'climate.thermostat' };
  }

  public setConfig(config: ThermostatCardConfig): void {
    if (!config?.entity) {
      throw new Error('Entity is required');
    }
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions() {
    return {
      columns: 6,
      min_columns: 3,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this._config) return false;
    const watched = [
      this._config.entity,
      this._config.dhw_entity,
      this._config.window_entity,
      this._config.mode_select_entity,
      ...(this._config.problem_entities ?? []),
    ].filter((id): id is string => !!id);
    return watched.some((id) => hasEntityChanged(this, changedProps, id));
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const entity = this.hass.states[this._config.entity];
    if (!entity) {
      return html`
        <ha-card>
          <div class="warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;
    }

    const attrs = entity.attributes;

    // Resolve ambient temperature (external sensor or entity attribute)
    let currentTemp = attrs.current_temperature as number;
    if (this._config.ambient_temperature) {
      const ambientEntity = this.hass.states[this._config.ambient_temperature];
      if (ambientEntity) {
        currentTemp = parseFloat(ambientEntity.state);
      }
    }

    const hvacAction = (attrs.hvac_action || entity.state) as HvacAction;
    const hvacMode = entity.state as string;
    const presetMode = (attrs.preset_mode as string) || null;

    const temperature = (attrs.temperature as number) ?? null;
    const targetTempLow = (attrs.target_temp_low as number) ?? null;
    const targetTempHigh = (attrs.target_temp_high as number) ?? null;

    const minTemp = this._config.range_min ?? (attrs.min_temp as number) ?? 7;
    const maxTemp = this._config.range_max ?? (attrs.max_temp as number) ?? 35;
    const step = this._config.step ?? (attrs.target_temp_step as number) ?? 0.5;

    const name =
      this._config.hide_name || this._config.name === false
        ? ''
        : (this._config.name ?? (attrs.friendly_name as string) ?? '');

    return html`
      <ha-card>
        ${name ? html`<div class="card-title">${name}</div>` : ''}
        <opentherm-thermostat-dial
          .current_temperature=${currentTemp}
          .temperature=${temperature}
          .target_temp_low=${targetTempLow}
          .target_temp_high=${targetTempHigh}
          .min_temp=${minTemp}
          .max_temp=${maxTemp}
          .target_temp_step=${step}
          .hvac_action=${hvacAction}
          .hvac_mode=${hvacMode}
          .preset_mode=${presetMode}
          .diameter=${this._config.diameter}
          .num_ticks=${this._config.num_ticks}
          .tick_degrees=${this._config.tick_degrees}
          .pending=${this._config.pending}
          .idle_zone=${this._config.idle_zone}
          .show_ticks=${this._config.show_ticks ?? true}
          .show_power_toggle=${this._config.show_power_toggle ?? true}
          .show_preset_indicator=${this._config.show_preset_indicator ?? true}
          .readonly=${this._config.readonly ?? false}
          .theme=${this._config.theme}
          .colors=${this._config.colors}
          ._presetIcons=${this._config.preset_icons}
          .status_text=${this._resolveStatusText()}
          @temperature-changed=${this._handleTemperatureChanged}
          @toggle=${this._handleToggle}
          @more-info=${this._handleMoreInfo}
        ></opentherm-thermostat-dial>
        ${this._renderBadges()}
        ${this._renderModeChips()}
      </ha-card>
    `;
  }

  // --- Badges row: hot water / window / problem, below the dial ---
  private _renderBadges(): TemplateResult | string {
    const cfg = this._config;
    if (!cfg.dhw_entity && !cfg.window_entity && !(cfg.problem_entities?.length)) return '';

    const dhwOn = cfg.dhw_entity ? this._isOn(cfg.dhw_entity) : false;
    const windowOpen = cfg.window_entity ? this._isOn(cfg.window_entity) : false;
    const hasProblem = (cfg.problem_entities ?? []).some((id) => this._isOn(id));

    return html`
      <div class="badges">
        ${
          cfg.dhw_entity
            ? html`
          <div class="badge ${dhwOn ? 'badge--active' : ''}" @click=${this._handleDhwClick} title="Hot water">
            <ha-icon icon="mdi:water-boiler"></ha-icon>
          </div>
        `
            : ''
        }
        ${
          cfg.window_entity
            ? html`
          <div class="badge ${windowOpen ? 'badge--warn' : ''}" title="Window">
            <ha-icon icon=${windowOpen ? 'mdi:window-open-variant' : 'mdi:window-closed-variant'}></ha-icon>
          </div>
        `
            : ''
        }
        ${
          hasProblem
            ? html`
          <div class="badge badge--error" title="Problem detected">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private _handleDhwClick(): void {
    const cfg = this._config;
    if (!cfg.dhw_entity) return;
    const entity = this.hass.states[cfg.dhw_entity];
    if (!entity || !cfg.dhw_entity.startsWith('switch.')) return; // read-only for binary_sensor
    const service = entity.state === 'on' ? 'turn_off' : 'turn_on';
    this.hass.callService('switch', service, { entity_id: cfg.dhw_entity });
  }

  private _isOn(entityId: string): boolean {
    return this.hass.states[entityId]?.state === 'on';
  }

  // --- Mode chips row: options from mode_select_entity, below badges ---
  private _renderModeChips(): TemplateResult | string {
    const cfg = this._config;
    if (!cfg.mode_select_entity) return '';
    const entity = this.hass.states[cfg.mode_select_entity];
    if (!entity) return '';
    const options = (entity.attributes.options as string[]) ?? [];
    if (!options.length) return '';
    const current = entity.state;

    return html`
      <div class="mode-chips">
        ${options.map((option) => {
          const icon =
            cfg.mode_icons?.[option] ?? DEFAULT_MODE_ICONS[option.toLowerCase()] ?? 'mdi:circle-outline';
          return html`
            <button
              class="mode-chip ${option === current ? 'mode-chip--active' : ''}"
              @click=${() => this._handleModeSelect(option)}
              title=${option}
            >
              <ha-icon icon=${icon}></ha-icon>
              <span>${option}</span>
            </button>
          `;
        })}
      </div>
    `;
  }

  private _handleModeSelect(option: string): void {
    const cfg = this._config;
    if (!cfg.mode_select_entity) return;
    this.hass.callService('select', 'select_option', {
      entity_id: cfg.mode_select_entity,
      option,
    });
  }

  private _handleTemperatureChanged(e: CustomEvent): void {
    const detail = e.detail;

    if (detail.temperature !== undefined) {
      this.hass.callService('climate', 'set_temperature', {
        entity_id: this._config.entity,
        temperature: detail.temperature,
      });
    } else if (detail.target_temp_low !== undefined) {
      this.hass.callService('climate', 'set_temperature', {
        entity_id: this._config.entity,
        target_temp_low: detail.target_temp_low,
        target_temp_high: detail.target_temp_high,
      });
    }
  }

  private _handleToggle(): void {
    const entity = this.hass.states[this._config.entity];
    const service = entity.state === 'off' ? 'turn_on' : 'turn_off';
    this.hass.callService('climate', service, {
      entity_id: this._config.entity,
    });
  }

  private _handleMoreInfo(): void {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId: this._config.entity },
    });
    this.dispatchEvent(event);
  }

  private _resolveStatusText(): string | null {
    if (!this._config.status_entity) return null;
    const entity = this.hass.states[this._config.status_entity];
    if (!entity) return null;
    const state = entity.state;
    if (!state || state === 'unknown' || state === 'unavailable') return null;
    return state;
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        padding: 16px;
        overflow: hidden;
      }
      .card-title {
        font-size: 1.2em;
        color: var(--secondary-text-color);
        text-align: center;
        padding-bottom: 8px;
        font-weight: 400;
      }
      .warning {
        padding: 16px;
        color: var(--error-color);
      }

      /* --- Badges row: hot water / window / problem --- */
      .badges {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 12px;
      }
      .badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--secondary-background-color, #2a2a2a);
        color: var(--secondary-text-color, #888);
        transition: background 0.2s ease, color 0.2s ease;
      }
      .badge ha-icon {
        --mdc-icon-size: 18px;
      }
      .badge--active {
        background: color-mix(in srgb, #29b6f6 25%, var(--secondary-background-color, #2a2a2a));
        color: #29b6f6;
        cursor: pointer;
      }
      .badge--warn {
        background: color-mix(in srgb, #ffa726 25%, var(--secondary-background-color, #2a2a2a));
        color: #ffa726;
      }
      .badge--error {
        background: color-mix(in srgb, #f44336 25%, var(--secondary-background-color, #2a2a2a));
        color: #f44336;
      }

      /* --- Mode chips row --- */
      .mode-chips {
        display: flex;
        gap: 6px;
        margin-top: 12px;
      }
      .mode-chip {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 2px;
        border-radius: 10px;
        border: none;
        background: var(--secondary-background-color, #2a2a2a);
        color: var(--secondary-text-color, #888);
        font-size: 0.65rem;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
      }
      .mode-chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .mode-chip--active {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        transform: translateY(-1px);
      }
      .mode-chip:active {
        transform: scale(0.95);
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'opentherm-thermostat-dial-card': ThermostatDarkCard;
  }
}
