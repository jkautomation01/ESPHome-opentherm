/**
 * OpenTherm Heating Schedule Card — weekly preset-schedule editor for the
 * opentherm_schedule custom integration (github.com/jkautomation01/
 * ESPHome-opentherm), paired with opentherm-thermostat-card.js.
 *
 * Plain Web Component, no build step, no external dependencies — drop
 * this file into <config>/www/ and add it as a Lovelace resource, same
 * as opentherm-thermostat-card.js.
 *
 * Config:
 *   type: custom:opentherm-schedule-card
 *   entity: opentherm_schedule.heating_comfort   (required)
 *   name: Heating Schedule                       (optional title)
 *
 * Interaction:
 *   - Tap a preset chip to select it as the "pen", then drag across a
 *     day's bar to paint that time range. Edits are staged locally —
 *     tap Save to call opentherm_schedule.set_week, or Discard to
 *     revert to what's currently active.
 *   - Tap a chip's temperature to edit it inline (calls set_preset
 *     immediately, no Save needed — every block using that preset
 *     updates at once).
 *   - "+" adds a new preset (name + temperature; up to a handful is the
 *     point, there's no hard cap).
 *   - When the entity has a pending proposal (from the learning
 *     pipeline), differing time ranges are shown as a hatched overlay
 *     in the proposed preset's color, with Accept/Reject controls.
 */

const SLOT_MINUTES = 15;
const SLOTS_PER_DAY = (24 * 60) / SLOT_MINUTES; // 96

const DAYS = [
  ["monday", "Mon"],
  ["tuesday", "Tue"],
  ["wednesday", "Wed"],
  ["thursday", "Thu"],
  ["friday", "Fri"],
  ["saturday", "Sat"],
  ["sunday", "Sun"],
];

const PALETTE = [
  "#5c9bd1", // blue
  "#ff8a3d", // orange
  "#7e57c2", // purple
  "#66bb6a", // green
  "#ef5350", // red
  "#ffca28", // amber
  "#26a69a", // teal
  "#8d6e63", // brown
];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function slotToTime(slot) {
  const totalMin = slot * SLOT_MINUTES;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "preset"
  );
}

function blocksToSlots(blocks) {
  const slots = new Array(SLOTS_PER_DAY).fill(null);
  if (!blocks || !blocks.length) return slots;
  const sorted = [...blocks].sort((a, b) => a.start.localeCompare(b.start));
  for (let i = 0; i < sorted.length; i++) {
    const startSlot = Math.round(timeToMinutes(sorted[i].start) / SLOT_MINUTES);
    const endSlot =
      i + 1 < sorted.length
        ? Math.round(timeToMinutes(sorted[i + 1].start) / SLOT_MINUTES)
        : SLOTS_PER_DAY;
    for (let s = clamp(startSlot, 0, SLOTS_PER_DAY); s < clamp(endSlot, 0, SLOTS_PER_DAY); s++) {
      slots[s] = sorted[i].preset;
    }
  }
  return slots;
}

function slotsToBlocks(slots) {
  const blocks = [];
  let segStart = 0;
  for (let s = 1; s <= slots.length; s++) {
    if (s === slots.length || slots[s] !== slots[segStart]) {
      blocks.push({ start: slotToTime(segStart), preset: slots[segStart] });
      segStart = s;
    }
  }
  if (blocks.length) blocks[0].start = "00:00";
  return blocks;
}

function gradientForDay(slots, colorOf) {
  const stops = [];
  let segStart = 0;
  for (let s = 1; s <= slots.length; s++) {
    if (s === slots.length || slots[s] !== slots[segStart]) {
      const color = colorOf(slots[segStart]);
      const fromPct = (segStart / slots.length) * 100;
      const toPct = (s / slots.length) * 100;
      stops.push(`${color} ${fromPct}%`, `${color} ${toPct}%`);
      segStart = s;
    }
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

function gradientForDiff(activeSlots, proposedSlots, colorOf) {
  const stops = [];
  let segStart = 0;
  const sameAt = (i) => activeSlots[i] === proposedSlots[i];
  for (let s = 1; s <= activeSlots.length; s++) {
    if (s === activeSlots.length || sameAt(s) !== sameAt(segStart)) {
      const differs = !sameAt(segStart);
      const color = differs ? colorOf(proposedSlots[segStart]) : "transparent";
      const fromPct = (segStart / activeSlots.length) * 100;
      const toPct = (s / activeSlots.length) * 100;
      stops.push(`${color} ${fromPct}%`, `${color} ${toPct}%`);
      segStart = s;
    }
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

class OpenThermScheduleCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:opentherm-schedule-card",
      entity: "opentherm_schedule.heating_comfort",
    };
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("opentherm-schedule-card: 'entity' is required");
    }
    this._config = config;
    this._pen = null;
    this._dirty = false;
    this._local = null; // { slots: { monday: [...96], ... } }
    this._paintDragDay = null;
    this._paintPointerId = null;
    this._paintLastSlot = null;
    this._addingPreset = false;
    this._editingPreset = null;

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
    return 6;
  }

  // ---------------------------------------------------------------------
  _buildDom() {
    const dayRows = DAYS.map(
      ([key, label]) => `
        <div class="day">
          <div class="day-label">${label}</div>
          <div class="day-bar-wrap">
            <div class="day-bar" data-day="${key}"></div>
            <div class="day-bar-overlay" data-day-overlay="${key}"></div>
          </div>
        </div>`
    ).join("");

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="title" id="title">Heating Schedule</div>
          </div>

          <div class="proposal-bar" id="proposal-bar">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span id="proposal-text">Schedule change suggested</span>
            <div class="spacer"></div>
            <button class="pill reject" id="reject-btn">Reject</button>
            <button class="pill accept" id="accept-btn">Accept</button>
          </div>

          <div class="legend" id="legend"></div>

          <div class="grid" id="grid">${dayRows}</div>
          <div class="axis">
            <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
          </div>

          <div class="save-bar" id="save-bar">
            <span>Unsaved changes</span>
            <div class="spacer"></div>
            <button class="pill ghost" id="discard-btn">Discard</button>
            <button class="pill accept" id="save-btn">Save</button>
          </div>
        </div>
      </ha-card>
    `;

    this._el = {
      title: this.shadowRoot.getElementById("title"),
      legend: this.shadowRoot.getElementById("legend"),
      grid: this.shadowRoot.getElementById("grid"),
      saveBar: this.shadowRoot.getElementById("save-bar"),
      saveBtn: this.shadowRoot.getElementById("save-btn"),
      discardBtn: this.shadowRoot.getElementById("discard-btn"),
      proposalBar: this.shadowRoot.getElementById("proposal-bar"),
      proposalText: this.shadowRoot.getElementById("proposal-text"),
      acceptBtn: this.shadowRoot.getElementById("accept-btn"),
      rejectBtn: this.shadowRoot.getElementById("reject-btn"),
    };

    this._el.saveBtn.addEventListener("click", () => this._save());
    this._el.discardBtn.addEventListener("click", () => this._discard());
    this._el.acceptBtn.addEventListener("click", () =>
      this._callService("opentherm_schedule", "accept_proposal", {})
    );
    this._el.rejectBtn.addEventListener("click", () =>
      this._callService("opentherm_schedule", "reject_proposal", {})
    );

    for (const [day] of DAYS) {
      const row = this.shadowRoot.querySelector(`.day-bar[data-day="${day}"]`);
      this._wireDayPainting(day, row);
    }
  }

  _wireDayPainting(day, row) {
    const start = (ev) => {
      if (!this._pen || !this._local) return;
      this._paintDragDay = day;
      this._paintPointerId = ev.pointerId;
      this._paintLastSlot = null;
      row.setPointerCapture(ev.pointerId);
      this._paintAt(day, row, ev.clientX);
      ev.preventDefault();
    };
    const move = (ev) => {
      if (this._paintDragDay !== day || ev.pointerId !== this._paintPointerId) return;
      this._paintAt(day, row, ev.clientX);
    };
    const end = (ev) => {
      if (this._paintDragDay !== day || ev.pointerId !== this._paintPointerId) return;
      this._paintDragDay = null;
      this._paintPointerId = null;
      this._paintLastSlot = null;
    };
    row.addEventListener("pointerdown", start);
    row.addEventListener("pointermove", move);
    row.addEventListener("pointerup", end);
    row.addEventListener("pointercancel", end);
  }

  _paintAt(day, rowEl, clientX) {
    const rect = rowEl.getBoundingClientRect();
    const frac = clamp((clientX - rect.left) / rect.width, 0, 0.999999);
    const slot = Math.floor(frac * SLOTS_PER_DAY);
    const last = this._paintLastSlot;
    const [from, to] = last == null ? [slot, slot] : [Math.min(last, slot), Math.max(last, slot)];
    const daySlots = this._local.slots[day];
    for (let s = from; s <= to; s++) daySlots[s] = this._pen;
    this._paintLastSlot = slot;
    this._dirty = true;
    this._updateDayBar(day);
    this._el.saveBar.classList.add("show");
  }

  _updateDayBar(day) {
    const presets = this._presets || {};
    const colorOf = (id) => this._colorFor(id);
    const bar = this.shadowRoot.querySelector(`.day-bar[data-day="${day}"]`);
    bar.style.background = gradientForDay(this._local.slots[day], colorOf);

    const overlay = this.shadowRoot.querySelector(`.day-bar-overlay[data-day-overlay="${day}"]`);
    if (this._proposedSlots) {
      overlay.style.display = "block";
      overlay.style.backgroundImage = [
        "repeating-linear-gradient(45deg, rgba(255,255,255,.4) 0 4px, transparent 4px 8px)",
        gradientForDiff(this._local.slots[day], this._proposedSlots[day], colorOf),
      ].join(", ");
    } else {
      overlay.style.display = "none";
    }
  }

  _colorFor(presetId) {
    if (!this._presetOrder) return "#999";
    const idx = this._presetOrder.indexOf(presetId);
    return idx >= 0 ? PALETTE[idx % PALETTE.length] : "#999";
  }

  // ---------------------------------------------------------------------
  _save() {
    const schedule = {};
    for (const [day] of DAYS) {
      schedule[day] = slotsToBlocks(this._local.slots[day]);
    }
    this._callService("opentherm_schedule", "set_week", { schedule });
    this._dirty = false;
    this._el.saveBar.classList.remove("show");
  }

  _discard() {
    this._loadFromEntity(true);
    this._dirty = false;
    this._el.saveBar.classList.remove("show");
  }

  _callService(domain, service, data) {
    if (!this._hass) return;
    this._hass.callService(domain, service, data);
  }

  // ---------------------------------------------------------------------
  _loadFromEntity(force) {
    const st = this._hass.states[this._config.entity];
    if (!st) return;
    this._presets = st.attributes.presets || {};
    this._presetOrder = Object.keys(this._presets);

    if (!this._local || force) {
      const slots = {};
      for (const [day] of DAYS) {
        slots[day] = blocksToSlots((st.attributes.schedule || {})[day]);
      }
      this._local = { slots };
      if (this._pen && !this._presetOrder.includes(this._pen)) this._pen = null;
      if (!this._pen && this._presetOrder.length) this._pen = this._presetOrder[0];
    }

    if (st.attributes.has_proposal && st.attributes.proposed_schedule) {
      this._proposedSlots = {};
      for (const [day] of DAYS) {
        this._proposedSlots[day] = blocksToSlots(st.attributes.proposed_schedule[day]);
      }
    } else {
      this._proposedSlots = null;
    }
  }

  _render() {
    if (!this._hass || !this._el) return;
    const st = this._hass.states[this._config.entity];
    if (!st) return;

    if (this._config.name) this._el.title.textContent = this._config.name;

    // Never clobber an in-progress paint drag or unsaved edits with a
    // fresh load from hass — but proposal state always refreshes.
    this._loadFromEntity(!this._dirty && this._paintDragDay === null);

    this._renderLegend();
    for (const [day] of DAYS) this._updateDayBar(day);

    const hasProposal = !!st.attributes.has_proposal;
    this._el.proposalBar.classList.toggle("show", hasProposal);
    if (hasProposal) {
      this._el.proposalText.textContent = st.attributes.proposed_reason || "Schedule change suggested";
    }
  }

  _renderLegend() {
    const chips = this._presetOrder
      .map((id) => {
        const p = this._presets[id];
        const color = this._colorFor(id);
        const active = this._pen === id ? "active" : "";
        const editing = this._editingPreset === id;
        const tempHtml = editing
          ? `<input class="temp-input" type="number" step="0.5" value="${p.temperature}" data-preset="${id}">`
          : `<span class="preset-temp" data-preset="${id}">${Number(p.temperature).toFixed(1)}°</span>`;
        return `
          <div class="preset-chip ${active}" style="--chip-color:${color}" data-select="${id}">
            <ha-icon icon="${p.icon || "mdi:thermometer"}"></ha-icon>
            <span class="preset-name">${p.name}</span>
            ${tempHtml}
          </div>`;
      })
      .join("");

    const addHtml = this._addingPreset
      ? `
        <div class="preset-chip adding">
          <input class="name-input" type="text" placeholder="Name" id="new-preset-name">
          <input class="temp-input" type="number" step="0.5" value="20" id="new-preset-temp">
          <button class="mini-btn" id="new-preset-confirm"><ha-icon icon="mdi:check"></ha-icon></button>
        </div>`
      : `<div class="preset-chip add" id="add-preset"><ha-icon icon="mdi:plus"></ha-icon></div>`;

    this._el.legend.innerHTML = chips + addHtml;

    this._el.legend.querySelectorAll(".preset-chip[data-select]").forEach((chip) => {
      chip.addEventListener("click", (ev) => {
        if (ev.target.closest(".preset-temp") || ev.target.closest(".temp-input")) return;
        this._pen = chip.dataset.select;
        this._renderLegend();
      });
    });

    this._el.legend.querySelectorAll(".preset-temp").forEach((span) => {
      span.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._editingPreset = span.dataset.preset;
        this._renderLegend();
        const input = this._el.legend.querySelector(".temp-input");
        if (input) {
          input.focus();
          input.select();
        }
      });
    });

    this._el.legend.querySelectorAll(".temp-input").forEach((input) => {
      const commit = () => {
        const id = input.dataset.preset;
        const p = this._presets[id];
        const value = parseFloat(input.value);
        this._editingPreset = null;
        if (Number.isFinite(value) && p) {
          this._callService("opentherm_schedule", "set_preset", {
            preset_id: id,
            name: p.name,
            icon: p.icon,
            temperature: value,
          });
        } else {
          this._renderLegend();
        }
      };
      input.addEventListener("click", (ev) => ev.stopPropagation());
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") input.blur();
      });
    });

    const addBtn = this._el.legend.querySelector("#add-preset");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        this._addingPreset = true;
        this._renderLegend();
        this._el.legend.querySelector("#new-preset-name")?.focus();
      });
    }
    const confirmBtn = this._el.legend.querySelector("#new-preset-confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const nameInput = this._el.legend.querySelector("#new-preset-name");
        const tempInput = this._el.legend.querySelector("#new-preset-temp");
        const name = (nameInput?.value || "").trim();
        const temperature = parseFloat(tempInput?.value);
        this._addingPreset = false;
        if (name && Number.isFinite(temperature)) {
          this._callService("opentherm_schedule", "set_preset", {
            preset_id: slugify(name),
            name,
            icon: "mdi:thermometer",
            temperature,
          });
        } else {
          this._renderLegend();
        }
      });
    }
  }

  _css() {
    return `
      :host { display: block; }
      ha-card { padding: 16px; }
      .wrap { display: flex; flex-direction: column; gap: 12px; }
      .header { display: flex; align-items: center; justify-content: space-between; }
      .title { font-size: 1.1rem; font-weight: 600; color: var(--primary-text-color); }

      .proposal-bar {
        display: none; align-items: center; gap: 8px;
        background: rgba(92,155,209,0.14); color: var(--primary-text-color);
        border-radius: 10px; padding: 8px 10px; font-size: 0.8rem;
      }
      .proposal-bar.show { display: flex; }
      .proposal-bar ha-icon { --mdc-icon-size: 18px; color: var(--info-color, #5c9bd1); }
      .spacer { flex: 1; }

      .pill {
        border: none; border-radius: 999px; padding: 6px 14px;
        font-size: 0.78rem; font-weight: 600; cursor: pointer;
      }
      .pill.accept { background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .pill.reject, .pill.ghost {
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color);
      }

      .legend { display: flex; flex-wrap: wrap; gap: 6px; }
      .preset-chip {
        display: flex; align-items: center; gap: 5px;
        border-radius: 999px; padding: 5px 10px;
        background: var(--secondary-background-color, #f0f0f0);
        border: 2px solid transparent;
        color: var(--primary-text-color);
        font-size: 0.75rem; cursor: pointer; user-select: none;
      }
      .preset-chip ha-icon { --mdc-icon-size: 16px; color: var(--chip-color, currentColor); }
      .preset-chip.active { border-color: var(--chip-color, var(--primary-color)); }
      .preset-chip .preset-temp {
        color: var(--secondary-text-color); padding: 1px 4px; border-radius: 6px;
      }
      .preset-chip .preset-temp:hover { background: rgba(0,0,0,0.08); }
      .preset-chip.add { color: var(--secondary-text-color); padding: 5px 9px; }
      .preset-chip.adding { gap: 4px; padding: 4px 6px; }
      .name-input, .temp-input {
        width: 52px; border: none; border-radius: 6px; padding: 3px 5px;
        font-size: 0.75rem; background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
      }
      .name-input { width: 72px; }
      .mini-btn {
        border: none; background: var(--primary-color); color: var(--text-primary-color, #fff);
        border-radius: 6px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
        cursor: pointer;
      }
      .mini-btn ha-icon { --mdc-icon-size: 14px; }

      .grid { display: flex; flex-direction: column; gap: 6px; }
      .day { display: flex; align-items: center; gap: 8px; }
      .day-label { width: 30px; font-size: 0.72rem; color: var(--secondary-text-color); flex-shrink: 0; }
      .day-bar-wrap { position: relative; flex: 1; height: 22px; border-radius: 6px; overflow: hidden; }
      .day-bar {
        position: absolute; inset: 0; touch-action: none; cursor: crosshair;
      }
      .day-bar-overlay {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.75; display: none;
      }

      .axis {
        display: flex; justify-content: space-between;
        padding-left: 38px; margin-top: -2px;
        font-size: 0.62rem; color: var(--secondary-text-color); opacity: 0.7;
      }

      .save-bar {
        display: none; align-items: center; gap: 8px;
        background: var(--secondary-background-color, #f0f0f0);
        border-radius: 10px; padding: 8px 10px; font-size: 0.8rem;
        color: var(--primary-text-color);
      }
      .save-bar.show { display: flex; }
    `;
  }
}

customElements.define("opentherm-schedule-card", OpenThermScheduleCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "opentherm-schedule-card",
  name: "OpenTherm Heating Schedule",
  description: "Weekly preset-based schedule editor for the opentherm_schedule helper — paint presets onto the week, review learning proposals.",
  preview: false,
});
