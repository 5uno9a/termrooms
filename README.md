# TermRooms Game Platform

A web-based platform for creating, sharing, and playing terminal-style simulation games in real-time multiplayer rooms.

## Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev:client  # Frontend on http://localhost:5177
npm run dev:server  # Backend on http://localhost:3000
```

## Project Structure

```
termrooms/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Node.js backend
├── docs/               # Documentation
├── README.md           # This file
└── package.json        # Root package.json
```

## Current Status

**Phase**: Frontend Foundation  
**Progress**: 45% Complete

### ✅ Completed
- Game Engine Core (85% complete)
- Frontend UI (70% complete)
- Documentation (75% complete)

### 🚧 In Progress
- Visualization System (0% complete)

### ❌ Missing
- Widget Renderers
- Real-time Communication
- Game Instances
- Authentication

## Architecture

**Client-Side Rendering** with **Server-Side State Management**

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL + Prisma
- **Real-time**: WebSocket for state synchronization

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and components
- [API Reference](./docs/API.md) - REST and WebSocket APIs
- [Game Engine](./docs/GAME_ENGINE.md) - JSON-based game system
- [Development Guide](./docs/DEVELOPMENT.md) - Setup and contribution
- [Decision Log](./docs/DECISIONS.md) - Architectural decisions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.