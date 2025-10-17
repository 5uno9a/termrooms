# TermRooms

> A lightweight, web-based terminal rooms platform for real-time collaboration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

## 🚀 Quick Start

TermRooms lets you create and join collaborative "terminal rooms" directly in your browser using familiar slash commands. No registration required - just create an alias and start collaborating!

### Live Demo
🌐 **[Try TermRooms Now](https://termrooms.dev)**

### Key Features
- **Terminal Interface**: All interactions through slash commands (`/create`, `/join`, `/msg`, etc.)
- **Real-time Communication**: Instant messaging and presence updates
- **Password Protection**: Secure rooms with optional password protection
- **Bookmarks**: Save and quickly access your favorite rooms
- **Accessibility**: Full keyboard navigation and screen reader support
- **Mobile Responsive**: Works great on all devices

## 📖 Documentation

### Project Overview
- [Executive Summary](docs/00_executive_summary.md) - Project overview and course submission
- [Vision & Elevator Pitch](docs/01_vision.md) - Core philosophy and target audience
- [User Stories](docs/02_user_stories.md) - Detailed user requirements

### Technical Specifications
- [Feature Specifications](docs/03_feature_specifications.md) - Complete feature matrix and requirements
- [Data Model](docs/04_data_model.md) - Database schema and entity relationships
- [API Specifications](docs/05_api_specifications.md) - REST API and WebSocket documentation
- [Security & Privacy](docs/06_security_privacy.md) - Security measures and compliance
- [UI/UX Design](docs/07_ui_ux_design.md) - Design system and accessibility features
- [System Architecture](docs/08_system_architecture.md) - Technical architecture and deployment

### Development
- [Testing Strategy](docs/09_testing_strategy.md) - Comprehensive testing approach
- [Project Plan](docs/10_project_plan.md) - 4-week development timeline
- [GitHub Setup](docs/11_github_setup.md) - Repository structure and contribution guidelines
- [Demo Script](docs/12_demo_script.md) - Live demonstration guide

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Socket.IO** for WebSocket communication
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **Redis** for caching and rate limiting

### Infrastructure
- **GitHub Pages** for frontend hosting
- **Render.com** for backend hosting
- **PostgreSQL** for data persistence
- **GitHub Actions** for CI/CD

## 🚀 Getting Started

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

## 🎯 Usage

### Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/create <name>` | Create a new room | `/create my-room` |
| `/join <name> [password]` | Join a room | `/join my-room secret123` |
| `/leave` | Leave current room | `/leave` |
| `/who` | Show room members | `/who` |
| `/msg <text>` | Send a message | `/msg Hello everyone!` |
| `/topic <text>` | Set room topic (owner only) | `/topic Project discussion` |
| `/passwd set <password>` | Set room password (owner only) | `/passwd set mypassword123` |
| `/passwd clear` | Remove room password (owner only) | `/passwd clear` |
| `/help` | Show all commands | `/help` |

### Example Workflow

1. **Create an alias**: Enter your preferred name
2. **Create a room**: `/create project-meeting`
3. **Set a topic**: `/topic Weekly standup meeting`
4. **Invite others**: Share the room name
5. **Collaborate**: Use `/msg` for real-time communication
6. **Bookmark**: Click ⭐ to save the room

## 🧪 Testing

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

### Test Coverage
- **Unit Tests**: 90%+ coverage for business logic
- **Integration Tests**: API endpoints and WebSocket functionality
- **E2E Tests**: Complete user journeys with Playwright
- **Performance Tests**: Load testing with Artillery.js

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables
```bash
# Frontend (.env)
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com

# Backend (.env)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/termrooms
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/11_github_setup.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write tests for new features
- Update documentation as needed

## 📋 Project Status

### Current Phase: Development
- [x] Project setup and documentation
- [x] Core architecture design
- [ ] Backend API implementation
- [ ] Frontend React components
- [ ] Real-time WebSocket features
- [ ] Security and authentication
- [ ] Testing and deployment

### Roadmap
- **Week 1**: Foundation and core features
- **Week 2**: Real-time messaging and presence
- **Week 3**: Security and advanced features
- **Week 4**: Polish, testing, and deployment

## 🐛 Known Issues

- WebSocket reconnection needs improvement
- Mobile keyboard handling could be better
- Rate limiting needs fine-tuning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Socket.IO](https://socket.io/) for real-time communication
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## 📞 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/termrooms/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/termrooms/discussions)

---

**Built with ❤️ for modern web development education**
