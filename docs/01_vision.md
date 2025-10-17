# 01 — Vision & Platform Architecture

## Elevator Pitch (≤75 words)
A game creation platform where developers build terminal-based simulations using JSON models, and players join temporary game instances to collaborate on interactive challenges. Features a dev sandbox for creating games, a game library for discovery, and real-time multiplayer coordination through ASCII/Unicode dashboards.

## Core Philosophy
1. **Game-First Platform** — Everything revolves around creating and playing games
2. **JSON-Based Development** — Simple, declarative game creation
3. **Temporary Instances** — Games run as sessions, not persistent rooms
4. **Real-Time Collaboration** — Multiplayer coordination during gameplay
5. **Educational Focus** — Systems thinking through hands-on simulation

## Platform Architecture
```
TermRooms Platform
├── Dev Sandbox (Create Games)
│   ├── JSON Editor
│   ├── Live Preview
│   └── Game Publishing
├── Game Library (Browse Games)
│   ├── Public Games
│   ├── Private Games (by ID)
│   └── Game Details
└── Game Instances (Play Games)
    ├── Game ID + Password
    ├── Player Panel
    ├── Game Chat
    ├── Command Console
    └── Game Panels
```

## Success Metrics
- Developers can create a game in 10 minutes
- Players can join a game instance in 15 seconds
- Real-time updates appear within 100ms
- 100% keyboard accessibility compliance
- Mobile-responsive game interface