# 03 — Feature Specifications

## Priority Matrix

| Priority | Feature | Acceptance Criteria |
|----------|---------|-------------------|
| **Must** | Create/Join/Leave Rooms | `/create {name}` returns success with room id; `/join {name}` admits user (or prompts password); `/leave` removes presence and emits `user_left` to all clients |
| **Must** | Password Protection | `/passwd set {min8chars}` hashes and stores password; `/passwd clear` removes it; joining a protected room requires password or emits error: unauthorized |
| **Must** | Real-time Presence | Joining/leaving broadcasts `user_joined`/`user_left`; `/who` lists active members within 200ms under normal load (≤50 users/room) |
| **Must** | Messaging | `/msg {text}` emits to room; messages render in stream and are persisted with timestamp and sender |
| **Must** | Bookmarks | "⭐ Bookmark" adds `{userId, roomId}`; appears on landing; removal updates immediately |
| **Must** | Accessibility | All actions possible via keyboard; live regions narrate events; contrast ≥ 4.5:1; focus visible |
| **Should** | Topics | `/topic {text}` stores and broadcasts; displays at top of room |
| **Should** | Audit Log | Admin can view last 100 events with timestamps and actor ids |
| **Should** | Mobile Responsive | Terminal remains usable on mobile; panels stack vertically; touch targets ≥ 44px |
| **Could** | Ephemeral Guest Links | One-time URLs auto-expire after first use or 10 minutes |
| **Could** | Slash Autocomplete | Up/down history; tab to cycle known commands |
| **Could** | Emoji Reactions | Quick reactions to messages with emoji picker |

## Terminal Command Specifications

| Command | Syntax | Validation | Success Message | Error Message | Maps To |
|---------|--------|------------|----------------|---------------|---------|
| `/create` | `/create {roomName}` | roomName 3–32, alnum + - | `created room {name}` | `room exists` | REST POST /rooms; WS joined |
| `/join` | `/join {roomName} [password]` | name exists; password if required | `joined {name}` | `not found / unauthorized` | REST POST /rooms/{name}/join; WS joined |
| `/leave` | `/leave` | in room | `left {name}` | `not in room` | WS leave_room |
| `/passwd` | `/passwd set {p}` or `/passwd clear` | set: ≥8 chars owner only | `password set/cleared` | `forbidden / weak password` | REST PUT /rooms/{id}/password |
| `/who` | `/who` | in room | list rendered | `not in room` | WS get_presence |
| `/msg` | `/msg {text}` | 1–500 chars | echoes message | `not in room` | WS send_message |
| `/topic` | `/topic {text}` | owner; ≤140 chars | `topic updated` | `forbidden` | REST PUT /rooms/{id}/topic; WS broadcast |
| `/help` | `/help` | — | list of commands | — | client-side |

## Performance Requirements
- **Response Time**: API responses < 200ms, WebSocket broadcasts < 100ms
- **Concurrency**: Support 50+ users per room, 100+ concurrent rooms
- **Availability**: 99.9% uptime during course evaluation period
- **Scalability**: Horizontal scaling ready for future growth

## Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: WebSocket, LocalStorage, ES2020, CSS Grid/Flexbox
