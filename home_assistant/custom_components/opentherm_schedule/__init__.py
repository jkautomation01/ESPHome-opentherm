"""OpenTherm Heating Schedule — a purpose-built helper for the OpenTherm
thermostat firmware (github.com/jkautomation01/ESPHome-opentherm).

Exposes one entity, opentherm_schedule.heating_comfort:
  - state: the currently active preset id (e.g. "home", "away", "sleep")
  - attributes: the full preset list (name/icon/temperature), the full
    weekly schedule, the resolved current_target_temperature and
    minutes_to_next_change (what the ESP32 firmware actually imports),
    and — when present — a proposed_schedule from the learning pipeline
    for the card to show as a diff and let you accept or reject.

Services (domain: opentherm_schedule):
  - set_preset(preset_id, name, icon, temperature): create or update a
    named preset. Updating an existing preset's temperature instantly
    changes every block in the schedule that uses it.
  - set_week(schedule): bulk-replace the active weekly schedule. Each
    day's block list is normalized so the first block always covers
    from 00:00 (its own "start" value is ignored/overwritten).
  - propose_schedule(schedule, reason=None): store a proposed schedule
    (same shape as set_week's) without applying it — meant to be called
    by the learning automation, not a person.
  - accept_proposal(): merge the pending proposed_schedule into the
    active schedule and clear it.
  - reject_proposal(): discard the pending proposed_schedule.
"""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timedelta
import logging

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_component import EntityComponent
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType
import homeassistant.util.dt as dt_util

_LOGGER = logging.getLogger(__name__)

DOMAIN = "opentherm_schedule"
OBJECT_ID = "heating_comfort"

STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN

WEEKDAYS = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)

_TIME_RE = r"^([01]\d|2[0-3]):[0-5]\d$"

_DEFAULT_DAY = [
    {"start": "00:00", "preset": "sleep"},
    {"start": "06:30", "preset": "home"},
    {"start": "09:00", "preset": "away"},
    {"start": "17:00", "preset": "home"},
    {"start": "22:30", "preset": "sleep"},
]

DEFAULT_DATA = {
    "presets": {
        "home": {"name": "Home", "icon": "mdi:home-thermometer", "temperature": 20.0},
        "away": {"name": "Away", "icon": "mdi:car-side", "temperature": 17.0},
        "sleep": {"name": "Sleep", "icon": "mdi:power-sleep", "temperature": 16.0},
        "boost": {"name": "Boost", "icon": "mdi:fire", "temperature": 22.0},
    },
    "schedule": {day: deepcopy(_DEFAULT_DAY) for day in WEEKDAYS},
    "proposed_schedule": None,
    "proposed_at": None,
    "proposed_reason": None,
}

_BLOCK_SCHEMA = vol.Schema(
    {
        vol.Required("start"): cv.matches_regex(_TIME_RE),
        vol.Required("preset"): cv.slug,
    }
)

_SCHEDULE_SCHEMA = vol.Schema({vol.In(WEEKDAYS): [_BLOCK_SCHEMA]})

SERVICE_SET_PRESET = "set_preset"
SERVICE_SET_WEEK = "set_week"
SERVICE_PROPOSE_SCHEDULE = "propose_schedule"
SERVICE_ACCEPT_PROPOSAL = "accept_proposal"
SERVICE_REJECT_PROPOSAL = "reject_proposal"

SET_PRESET_SCHEMA = vol.Schema(
    {
        vol.Required("preset_id"): cv.slug,
        vol.Required("name"): cv.string,
        vol.Optional("icon", default="mdi:thermometer"): cv.icon,
        vol.Required("temperature"): vol.Coerce(float),
    }
)

SET_WEEK_SCHEMA = vol.Schema({vol.Required("schedule"): _SCHEDULE_SCHEMA})

PROPOSE_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("schedule"): _SCHEDULE_SCHEMA,
        vol.Optional("reason"): cv.string,
    }
)

EMPTY_SCHEMA = vol.Schema({})


def _normalize_schedule(schedule: dict, presets: dict) -> dict:
    """Validate preset references and force each day's first block to 00:00."""
    normalized: dict[str, list[dict]] = {}
    for day in WEEKDAYS:
        blocks = schedule.get(day) or []
        if not blocks:
            raise HomeAssistantError(f"'{day}' has no blocks — every day needs at least one")
        blocks = sorted(blocks, key=lambda b: b["start"])
        for block in blocks:
            if block["preset"] not in presets:
                raise HomeAssistantError(
                    f"'{day}' references unknown preset '{block['preset']}'"
                )
        blocks[0] = {**blocks[0], "start": "00:00"}
        normalized[day] = blocks
    return normalized


def _minutes_since_midnight(hhmm: str) -> int:
    hour, minute = hhmm.split(":")
    return int(hour) * 60 + int(minute)


def _resolve(
    schedule: dict, now: datetime
) -> tuple[str | None, str | None, datetime | None]:
    """Return (current_preset, next_preset, next_change_datetime)."""
    day_key = WEEKDAYS[now.weekday()]
    blocks = schedule.get(day_key) or []
    if not blocks:
        return None, None, None

    now_min = now.hour * 60 + now.minute
    current_idx = 0
    for i, block in enumerate(blocks):
        if _minutes_since_midnight(block["start"]) <= now_min:
            current_idx = i
        else:
            break
    current_preset = blocks[current_idx]["preset"]

    if current_idx + 1 < len(blocks):
        next_block = blocks[current_idx + 1]
        hour, minute = (int(p) for p in next_block["start"].split(":"))
        next_dt = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        return current_preset, next_block["preset"], next_dt

    # Next change is tomorrow's first block (always starts at 00:00).
    for offset in range(1, 8):
        tomorrow = now + timedelta(days=offset)
        tomorrow_blocks = schedule.get(WEEKDAYS[tomorrow.weekday()]) or []
        if tomorrow_blocks:
            next_dt = (now + timedelta(days=offset)).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            return current_preset, tomorrow_blocks[0]["preset"], next_dt
    return current_preset, None, None


class OpenThermScheduleEntity(Entity):
    """The single opentherm_schedule.heating_comfort entity."""

    _attr_should_poll = False
    _attr_icon = "mdi:radiator"
    _attr_name = "Heating Comfort"
    _attr_unique_id = f"{DOMAIN}_{OBJECT_ID}"

    def __init__(self, hass: HomeAssistant, store: Store, data: dict) -> None:
        self.hass = hass
        self.entity_id = f"{DOMAIN}.{OBJECT_ID}"
        self._store = store
        self._data = data
        self._current_preset: str | None = None
        self._attrs: dict = {}
        self._recompute()

    @property
    def data(self) -> dict:
        return self._data

    @property
    def state(self):
        return self._current_preset

    @property
    def extra_state_attributes(self) -> dict:
        return self._attrs

    def _recompute(self) -> None:
        now = dt_util.now()
        presets = self._data["presets"]
        current_preset, next_preset, next_dt = _resolve(self._data["schedule"], now)
        self._current_preset = current_preset

        current_target = presets.get(current_preset, {}).get("temperature") if current_preset else None
        next_target = presets.get(next_preset, {}).get("temperature") if next_preset else None
        minutes_to_next = (next_dt - now).total_seconds() / 60 if next_dt else None

        self._attrs = {
            "presets": presets,
            "schedule": self._data["schedule"],
            "current_target_temperature": current_target,
            "next_preset": next_preset,
            "next_target_temperature": next_target,
            "next_change": next_dt.isoformat() if next_dt else None,
            "minutes_to_next_change": round(minutes_to_next, 1) if minutes_to_next is not None else None,
            "has_proposal": self._data["proposed_schedule"] is not None,
            "proposed_schedule": self._data["proposed_schedule"],
            "proposed_at": self._data["proposed_at"],
            "proposed_reason": self._data["proposed_reason"],
        }

    async def async_update_and_save(self) -> None:
        self._recompute()
        self.async_write_ha_state()
        await self._store.async_save(self._data)

    async def async_tick(self, _now) -> None:
        self._recompute()
        self.async_write_ha_state()


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    stored = await store.async_load()
    data = stored if stored is not None else deepcopy(DEFAULT_DATA)

    component = EntityComponent[OpenThermScheduleEntity](_LOGGER, DOMAIN, hass)
    entity = OpenThermScheduleEntity(hass, store, data)
    await component.async_add_entities([entity])

    async_track_time_interval(hass, entity.async_tick, timedelta(minutes=1))

    if stored is None:
        await store.async_save(data)

    async def handle_set_preset(call: ServiceCall) -> None:
        preset_id = call.data["preset_id"]
        entity.data["presets"][preset_id] = {
            "name": call.data["name"],
            "icon": call.data["icon"],
            "temperature": call.data["temperature"],
        }
        await entity.async_update_and_save()

    async def handle_set_week(call: ServiceCall) -> None:
        entity.data["schedule"] = _normalize_schedule(call.data["schedule"], entity.data["presets"])
        await entity.async_update_and_save()

    async def handle_propose_schedule(call: ServiceCall) -> None:
        entity.data["proposed_schedule"] = _normalize_schedule(
            call.data["schedule"], entity.data["presets"]
        )
        entity.data["proposed_at"] = dt_util.now().isoformat()
        entity.data["proposed_reason"] = call.data.get("reason")
        await entity.async_update_and_save()
        hass.bus.async_fire(f"{DOMAIN}_proposal_created", {"reason": call.data.get("reason")})

    async def handle_accept_proposal(call: ServiceCall) -> None:
        if entity.data["proposed_schedule"] is None:
            raise HomeAssistantError("No proposal pending")
        entity.data["schedule"] = entity.data["proposed_schedule"]
        entity.data["proposed_schedule"] = None
        entity.data["proposed_at"] = None
        entity.data["proposed_reason"] = None
        await entity.async_update_and_save()

    async def handle_reject_proposal(call: ServiceCall) -> None:
        entity.data["proposed_schedule"] = None
        entity.data["proposed_at"] = None
        entity.data["proposed_reason"] = None
        await entity.async_update_and_save()

    hass.services.async_register(DOMAIN, SERVICE_SET_PRESET, handle_set_preset, schema=SET_PRESET_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SET_WEEK, handle_set_week, schema=SET_WEEK_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_PROPOSE_SCHEDULE, handle_propose_schedule, schema=PROPOSE_SCHEDULE_SCHEMA
    )
    hass.services.async_register(DOMAIN, SERVICE_ACCEPT_PROPOSAL, handle_accept_proposal, schema=EMPTY_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_REJECT_PROPOSAL, handle_reject_proposal, schema=EMPTY_SCHEMA)

    return True
