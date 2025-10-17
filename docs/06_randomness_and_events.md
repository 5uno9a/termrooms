# 06 — Randomness & Events

## Random Initialization
```json
"init_random": {
  "vars": { "core_temp": { "min": 45, "max": 65 } },
  "entities": { "pumpA.health": { "min": 80, "max": 100 } }
}
```

## Random Events (tick-time chance)
```json
"random_events": [
  { "chance": 0.15, "effects": [{ "delta": ["vars.pressure", 10] }], "message": "Pressure spike!" }
]
```

## Seeds
- Store `meta.seed` for deterministic replays in dev mode.
