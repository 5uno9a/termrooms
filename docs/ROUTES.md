# ROUTES — Page-by-Page Requirements

| Route | Purpose | Key Elements |
|---|---|---|
| `/` | Home | Hero, brief explainer, CTA buttons (Play/Create/Sandbox) |
| `/play` | Discover/join rooms | Public room list (later), join by code |
| `/create` | Create room instance | Form: model select, room name, tick rate |
| `/docs` | Documentation | Render markdown links to /docs/*.md |
| `/about` | Project intro | Team, philosophy |
| `/help` | Quickstart & FAQ | How to run sandbox, build models |
| `/account` | Auth + profile | Sign-in, my games (later) |
| `/room/:id` | Live game | Panels grid, actions, logs (multiplayer later) |
| `/dev-sandbox` | Creator Mode | Editor, Preview, Toolbar, Console |

**Dev Sandbox specifics**
- Left: JSON editor (Monaco)
- Right: Live preview (Unicode panels)
- Toolbar: Run / Pause / Reset / Validate / Export
- Console: validation + engine logs
