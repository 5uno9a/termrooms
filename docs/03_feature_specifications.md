# 03 — Feature Specifications

## Priority Matrix

| Priority | Feature | Acceptance Criteria |
|----------|---------|-------------------|
| **Must** | Create/Join/Leave Rooms | `/create {name}` returns success with room id; `/join {name}` admits user (or prompts password); `/leave` removes presence and emits `user_left` to all clients |
| **Must** | Game Engine | JSON-based simulation system with state management, tick loop, and real-time updates |
| **Must** | ReactorSim Game | Nuclear reactor management simulation with multiplayer collaboration |
| **Must** | Real-time State Sync | Game state updates broadcast to all players within 100ms; deterministic simulation |
| **Must** | Dev Sandbox | JSON model editor for creating custom games; validation and preview system |
| **Must** | Messaging | `/msg {text}` emits to room; messages render in stream and are persisted with timestamp and sender |
| **Must** | Accessibility | All actions possible via keyboard; live regions narrate events; contrast ≥ 4.5:1; focus visible |
| **Should** | Password Protection | `/passwd set {min8chars}` hashes and stores password; `/passwd clear` removes it |
| **Should** | Game Sharing | Upload/download custom games; public/private game library |
| **Should** | Role-based Actions | Different user roles (operator, engineer, observer) with different permissions |
| **Should** | Mobile Responsive | Terminal remains usable on mobile; panels stack vertically; touch targets ≥ 44px |
| **Could** | Advanced Simulations | Additional built-in games (CitySim, SpaceSim) |
| **Could** | Game Analytics | Track game performance and user engagement |

## Terminal Command Specifications

| Command | Syntax | Validation | Success Message | Error Message | Maps To |
|---------|--------|------------|----------------|---------------|---------|
| `/create` | `/create {roomName}` | roomName 3–32, alnum + - | `created room {name}` | `room exists` | REST POST /rooms; WS joined |
| `/join` | `/join {roomName} [password]` | name exists; password if required | `joined {name}` | `not found / unauthorized` | REST POST /rooms/{name}/join; WS joined |
| `/leave` | `/leave` | in room | `left {name}` | `not in room` | WS leave_room |
| `/msg` | `/msg {text}` | 1–500 chars | echoes message | `not in room` | WS send_message |
| `/who` | `/who` | in room | list rendered | `not in room` | WS get_presence |
| `/help` | `/help` | — | list of commands | — | client-side |
| **Game Commands** | | | | | |
| `/game start {type}` | `/game start reactor` | valid game type | `game started: {type}` | `game already running` | WS start_game |
| `/game join` | `/game join` | game running, not joined | `joined game as {role}` | `no active game` | WS join_game |
| `/game leave` | `/game leave` | in game | `left game` | `not in game` | WS leave_game |
| `/game status` | `/game status` | in room | game state rendered | `no active game` | WS get_game_state |
| `/action {action}` | `/action pump_on` | valid action, in game | `action queued` | `invalid action` | WS game_action |
| `/sim {command}` | `/sim pause` | game running | `simulation paused` | `no active game` | WS sim_command |
| **UI Commands** | | | | | |
| `/ui panel add {id}` | `/ui panel add left width=48 title="CORE STATUS"` | valid id, width | `panel added` | `panel exists` | WS ui_panel_add |
| `/ui add {widget}` | `/ui add bar panel=left var=power` | valid widget, panel | `widget added` | `invalid panel` | WS ui_widget_add |
| `/ui layout {type}` | `/ui layout vertical` | valid layout type | `layout changed` | `invalid layout` | WS ui_layout_change |
| `/ui panel move {id}` | `/ui panel move left x=2 y=3` | valid panel, coords | `panel moved` | `invalid position` | WS ui_panel_move |
| `/ui panel resize {id}` | `/ui panel resize left w=4 h=6` | valid panel, size | `panel resized` | `invalid size` | WS ui_panel_resize |

## Performance Requirements
- **Response Time**: API responses < 200ms, WebSocket broadcasts < 100ms
- **Concurrency**: Support 50+ users per room, 100+ concurrent rooms
- **Availability**: 99.9% uptime during course evaluation period
- **Scalability**: Horizontal scaling ready for future growth

## Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: WebSocket, LocalStorage, ES2020, CSS Grid/Flexbox
