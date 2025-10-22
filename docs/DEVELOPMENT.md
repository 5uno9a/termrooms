# Development Guide

## Prerequisites

- **Node.js**: 18.x or later
- **npm**: 9.x or later
- **PostgreSQL**: 14.x or later
- **Git**: 2.x or later

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/termrooms.git
cd termrooms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
```bash
# Create PostgreSQL database
createdb termrooms_dev

# Run migrations
npm run db:migrate
```

### 4. Start Development Servers
```bash
# Start both client and server
npm run dev

# Or start individually
npm run dev:client  # Frontend on http://localhost:5177
npm run dev:server  # Backend on http://localhost:3000
```

## Project Structure

```
termrooms/
├── packages/
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Page components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API and WebSocket clients
│   │   │   ├── stores/         # State management
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── utils/          # Utility functions
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── server/                 # Node.js backend
│       ├── src/
│       │   ├── game-engine/    # Game engine core
│       │   ├── api/            # REST API routes
│       │   ├── websocket/      # WebSocket handlers
│       │   ├── database/       # Database models and migrations
│       │   ├── middleware/     # Express middleware
│       │   └── utils/          # Utility functions
│       ├── prisma/             # Database schema and migrations
│       ├── package.json
│       └── tsconfig.json
├── docs/                       # Documentation
├── .github/                    # GitHub Actions workflows
├── package.json               # Root package.json
└── README.md
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/widget-renderers

# Make changes
# ... edit files ...

# Run tests
npm test

# Commit changes
git add .
git commit -m "feat: implement bar widget renderer"

# Push branch
git push origin feature/widget-renderers
```

### 2. Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Run all checks
npm run check
```

### 3. Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test packages/server/src/game-engine/__tests__/action-processor.test.ts
```

## Available Scripts

### Root Level
```bash
npm run dev          # Start both client and server
npm run build        # Build both client and server
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run type-check   # Type check all packages
npm run check        # Run lint, type-check, and test
```

### Client Package
```bash
npm run dev:client   # Start Vite dev server
npm run build:client # Build for production
npm run preview      # Preview production build
npm run lint:client  # Lint client code
```

### Server Package
```bash
npm run dev:server   # Start Node.js server
npm run build:server # Build for production
npm run start        # Start production server
npm run lint:server  # Lint server code
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
```

## Environment Variables

### Client (.env.local)
```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Server (.env)
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/termrooms_dev
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5177
```

## Database Management

### Prisma Commands
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Database Schema
The database schema is defined in `packages/server/prisma/schema.prisma`:

```prisma
model Game {
  id          String   @id @default(cuid())
  name        String
  description String
  author      String
  version     String
  model       Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GameInstance {
  id        String   @id @default(cuid())
  gameId    String
  game      Game     @relation(fields: [gameId], references: [id])
  status    String
  players   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Development

### Adding New Endpoints
1. Create route handler in `packages/server/src/api/`
2. Add route to Express app in `packages/server/src/app.ts`
3. Add TypeScript types in `packages/server/src/types/`
4. Write tests in `packages/server/src/api/__tests__/`

### Example Route Handler
```typescript
// packages/server/src/api/games.ts
import { Request, Response } from 'express';
import { GameService } from '../services/GameService';

export const getGames = async (req: Request, res: Response) => {
  try {
    const games = await GameService.getAllGames();
    res.json({ games });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};
```

## WebSocket Development

### Adding New Events
1. Define event types in `packages/server/src/websocket/types.ts`
2. Add event handler in `packages/server/src/websocket/handlers/`
3. Register handler in `packages/server/src/websocket/index.ts`
4. Update client types in `packages/client/src/types/websocket.ts`

### Example WebSocket Handler
```typescript
// packages/server/src/websocket/handlers/game.ts
import { Socket } from 'socket.io';
import { GameService } from '../../services/GameService';

export const handleJoinGame = async (socket: Socket, data: JoinGameData) => {
  try {
    const result = await GameService.joinGame(socket.userId, data.instanceId);
    socket.emit('join-game-success', result);
  } catch (error) {
    socket.emit('error', { message: error.message });
  }
};
```

## Frontend Development

### Adding New Components
1. Create component in `packages/client/src/components/`
2. Add TypeScript types in `packages/client/src/types/`
3. Write tests in `packages/client/src/components/__tests__/`
4. Export from `packages/client/src/components/index.ts`

### Example Component
```typescript
// packages/client/src/components/Widget.tsx
import React from 'react';

interface WidgetProps {
  type: 'bar' | 'schematic' | 'log';
  config: WidgetConfig;
  data: GameState;
}

export const Widget: React.FC<WidgetProps> = ({ type, config, data }) => {
  // Component implementation
  return <div>Widget content</div>;
};
```

## Game Engine Development

### Adding New Widget Types
1. Define widget type in `packages/server/src/game-engine/types.ts`
2. Create renderer in `packages/server/src/game-engine/renderers/`
3. Register renderer in `packages/server/src/game-engine/WidgetRegistry.ts`
4. Add tests in `packages/server/src/game-engine/__tests__/`

### Example Widget Renderer
```typescript
// packages/server/src/game-engine/renderers/BarWidgetRenderer.ts
import { WidgetRenderer } from '../types';

export class BarWidgetRenderer implements WidgetRenderer {
  render(widget: Widget, gameState: GameState): string {
    const { target, min, max, unit } = widget.config;
    const value = gameState.vars[target];
    const percentage = ((value - min) / (max - min)) * 100;
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${value}${unit}`;
  }
}
```

## Testing

### Test Structure
```
packages/
├── client/
│   └── src/
│       └── components/
│           └── __tests__/
│               └── Widget.test.tsx
└── server/
    └── src/
        └── game-engine/
            └── __tests__/
                └── action-processor.test.ts
```

### Writing Tests
```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { BarWidgetRenderer } from '../BarWidgetRenderer';

describe('BarWidgetRenderer', () => {
  it('should render progress bar correctly', () => {
    const renderer = new BarWidgetRenderer();
    const widget = {
      type: 'bar',
      config: { target: 'power', min: 0, max: 100, unit: 'MW' }
    };
    const gameState = { vars: { power: 75 } };
    
    const result = renderer.render(widget, gameState);
    expect(result).toBe('[████████░░] 75MW');
  });
});
```

## Debugging

### Client Debugging
- Use React Developer Tools
- Check browser console for errors
- Use Vite's built-in debugging features
- Add console.log statements for debugging

### Server Debugging
- Use Node.js debugger: `node --inspect packages/server/dist/index.js`
- Check server logs in terminal
- Use VS Code debugger configuration
- Add logging with Winston or similar

### Database Debugging
- Use Prisma Studio: `npm run db:studio`
- Check database logs
- Use database query tools (pgAdmin, etc.)
- Add database logging in Prisma

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load components and routes
- Optimize bundle size with code splitting

### Backend
- Use connection pooling for database
- Implement caching with Redis
- Optimize database queries
- Use compression middleware

### Database
- Add appropriate indexes
- Use database query optimization
- Implement read replicas for scaling
- Monitor query performance

## Deployment

### Development
```bash
# Build all packages
npm run build

# Start production servers
npm run start
```

### Production
```bash
# Build with production optimizations
npm run build:prod

# Run database migrations
npm run db:migrate:prod

# Start with PM2 or similar
pm2 start ecosystem.config.js
```

## Contributing

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use TypeScript strict mode
- Write meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Run all checks: `npm run check`
5. Submit pull request
6. Address review feedback

### Commit Convention
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql
```

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Test Issues
```bash
# Clear test cache
npm run test -- --clearCache
```

### Getting Help
- Check existing issues on GitHub
- Create new issue with detailed description
- Join Discord community
- Read documentation thoroughly
