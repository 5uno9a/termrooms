# 04 — Multiplayer & Roles

## Roles
```json
[
  { "id": "chief", "permissions": ["all"] },
  { "id": "engineer", "permissions": ["operate"] },
  { "id": "technician", "permissions": ["repair"] },
  { "id": "observer", "permissions": ["read"] }
]
```

Actions can declare `allowed_roles`. Server enforces; client hides forbidden controls.

## Players Structure
```json
[
  { "id": "u1", "name": "Chief", "role": "chief", "status": "online" }
]
```

## Panels
- **Players Panel** — roster with roles
- **Command Log Panel** — shows who ran what
- **Events Panel** — system rule triggers
