# TermRooms

> A web-based game creation platform for terminal-based simulations and multiplayer collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

##  Quick Start

TermRooms is a game creation platform where developers build terminal-based simulations using JSON models, and players join temporary game instances to collaborate on interactive challenges. Features a dev sandbox for creating games and a game library for discovery.


### Key Features
- **Game Creation Platform**: Build terminal-based simulations using JSON models
- **Dev Sandbox**: Live preview and validation for game development
- **Game Library**: Browse and discover public/private games
- **Game Instances**: Temporary multiplayer sessions with real-time collaboration
- **ASCII/Unicode Visualization**: Draggable panels with interactive widgets
- **Terminal Commands**: Slash commands for game management and control

## 📖 Documentation

### Core Documentation
- [Executive Summary](docs/00_executive_summary.md) - Project overview and course submission
- [Vision & Platform Architecture](docs/01_vision.md) - Core philosophy and platform structure
- [Command Reference](docs/02_commands.md) - Complete command reference
- [Feature Specifications](docs/03_features.md) - Feature requirements and specifications
- [Data Model](docs/04_data_model.md) - Database schema and data structures
- [API Specifications](docs/05_api.md) - REST API and WebSocket documentation
- [Implementation Plan](docs/06_implementation_plan.md) - Detailed 4-week development plan

### Legacy Documentation
- [UI/UX Design](docs/07_ui_ux_design.md) - Design system and accessibility features
- [System Architecture](docs/08_system_architecture.md) - Technical architecture details
- [Dev Sandbox](docs/09_dev_sandbox_and_upload.md) - Dev sandbox specifications
- [Project Plan](docs/10_project_plan.md) - Project timeline and milestones
- [Game Engine](docs/13_game_engine_specifications.md) - Game engine specifications

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Gridstack** for draggable panels
- **Socket.IO Client** for real-time communication
- **Monaco Editor** for JSON editing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Socket.IO** for WebSocket communication
- **Prisma** ORM with PostgreSQL
- **JSON-based Game Engine** for simulations
- **Real-time State Management** for multiplayer

### Infrastructure
- **GitHub Pages** for frontend hosting
- **Render.com** for backend hosting
- **PostgreSQL** for data persistence
- **GitHub Actions** for CI/CD


### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/termrooms.git
   cd termrooms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:migrate
   ```

5. **Start development servers**
   ```bash
   # Start backend (port 3001)
   npm run dev:server
   
   # Start frontend (port 5173)
   npm run dev:client
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

##  Usage

### Game Discovery
| Command | Description | Example |
|---------|-------------|---------|
| `/games` | List public games | `/games` |
| `/games search <term>` | Search games | `/games search reactor` |
| `/games info <gameId>` | Show game details | `/games info reactor-v1` |

### Game Instances
| Command | Description | Example |
|---------|-------------|---------|
| `/join <gameId> [password]` | Join game instance | `/join reactor-abc123 secret` |
| `/leave` | Leave current instance | `/leave` |
| `/who` | Show players in instance | `/who` |
| `/chat <message>` | Send message to instance | `/chat Starting pump A` |
| `/command <action>` | Execute game action | `/command pump_on` |

### Dev Sandbox
| Command | Description | Example |
|---------|-------------|---------|
| `/dev new <name>` | Create new game | `/dev new my-reactor` |
| `/dev load <gameId>` | Load existing game | `/dev load reactor-v1` |
| `/dev save` | Save current game | `/dev save` |
| `/dev publish [private]` | Publish game | `/dev publish` |
| `/dev preview` | Preview game | `/dev preview` |

### Example Workflow

1. **Browse Games**: Use `/games` to see available games
2. **Join Instance**: `/join reactor-abc123` to join a game
3. **Collaborate**: Use `/chat` and `/command` for coordination
4. **Create Games**: Use `/dev new` to build your own simulations
5. **Publish**: Use `/dev publish` to share your games

## Testing

### Run Tests
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:coverage     # Coverage report
```

A web-based platform for creating, sharing, and playing terminal-style simulation games in real-time multiplayer rooms.

## Deployment

```bash
# Install dependencies
npm install

# Start development servers
npm run dev:client  # Frontend on http://localhost:5177
npm run dev:server  # Backend on http://localhost:3000
```


## Current Status

## Project Status

### ✅ Completed
- Game Engine Core (85% complete)
- Frontend UI (70% complete)
- Documentation (75% complete)

### 🚧 In Progress
- Visualization System (0% complete)

## Known Issues

## Architecture

##  License

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL + Prisma
- **Real-time**: WebSocket for state synchronization

## Acknowledgments

- [Architecture](./docs/ARCHITECTURE.md) - System design and components
- [API Reference](./docs/API.md) - REST and WebSocket APIs
- [Game Engine](./docs/GAME_ENGINE.md) - JSON-based game system
- [Development Guide](./docs/DEVELOPMENT.md) - Setup and contribution
- [Decision Log](./docs/DECISIONS.md) - Architectural decisions

## Support

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License


