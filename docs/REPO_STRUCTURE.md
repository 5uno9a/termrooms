# Repository Structure

## Project Organization

```
termrooms/
├── .github/                          # GitHub configuration
│   ├── workflows/                    # CI/CD pipelines
│   │   ├── ci.yml                   # Continuous integration
│   │   ├── deploy-frontend.yml      # Frontend deployment
│   │   └── deploy-backend.yml       # Backend deployment
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md     # PR template
├── docs/                            # Project documentation
│   ├── 00_executive_summary.md      # Course submission summary
│   ├── 01_vision.md                 # Project vision and philosophy
│   ├── 02_user_stories.md           # User requirements
│   ├── 03_feature_specifications.md # Feature matrix and specs
│   ├── 04_data_model.md             # Database schema and design
│   ├── 05_api_specifications.md     # API and WebSocket docs
│   ├── 06_security_privacy.md       # Security and compliance
│   ├── 07_ui_ux_design.md           # Design system and accessibility
│   ├── 08_system_architecture.md    # Technical architecture
│   ├── 09_testing_strategy.md       # Testing approach
│   ├── 10_project_plan.md           # Development timeline
│   ├── 11_github_setup.md           # Contribution guidelines
│   ├── 12_demo_script.md            # Demo and presentation
│   ├── ROUTES.md                    # Application routes
│   └── REPO_STRUCTURE.md            # This file
├── packages/                        # Monorepo packages
│   ├── client/                      # React frontend application
│   │   ├── src/
│   │   │   ├── components/          # React components
│   │   │   │   ├── ui/              # Reusable UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── Toast.tsx
│   │   │   │   ├── terminal/        # Terminal-specific components
│   │   │   │   │   ├── Terminal.tsx
│   │   │   │   │   ├── CommandInput.tsx
│   │   │   │   │   ├── CommandOutput.tsx
│   │   │   │   │   └── CommandHistory.tsx
│   │   │   │   ├── room/            # Room-related components
│   │   │   │   │   ├── RoomView.tsx
│   │   │   │   │   ├── ParticipantsPanel.tsx
│   │   │   │   │   ├── MessageStream.tsx
│   │   │   │   │   └── RoomHeader.tsx
│   │   │   │   └── layout/          # Layout components
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       └── Footer.tsx
│   │   │   ├── pages/               # Page components
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── RoomPage.tsx
│   │   │   │   ├── BookmarksPage.tsx
│   │   │   │   ├── HelpPage.tsx
│   │   │   │   └── AboutPage.tsx
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useRoom.ts
│   │   │   │   ├── useSocket.ts
│   │   │   │   ├── useTerminal.ts
│   │   │   │   └── useBookmarks.ts
│   │   │   ├── services/            # API and business logic
│   │   │   │   ├── api.ts
│   │   │   │   ├── socket.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── storage.ts
│   │   │   ├── utils/               # Utility functions
│   │   │   │   ├── commands.ts
│   │   │   │   ├── validation.ts
│   │   │   │   ├── formatting.ts
│   │   │   │   └── constants.ts
│   │   │   ├── types/               # TypeScript type definitions
│   │   │   │   ├── api.ts
│   │   │   │   ├── room.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── socket.ts
│   │   │   ├── styles/              # Styling
│   │   │   │   ├── globals.css
│   │   │   │   ├── components.css
│   │   │   │   └── themes.css
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── public/                  # Static assets
│   │   │   ├── favicon.ico
│   │   │   ├── logo.svg
│   │   │   └── manifest.json
│   │   ├── tests/                   # Frontend tests
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── .env.example
│   ├── server/                      # Node.js backend application
│   │   ├── src/
│   │   │   ├── controllers/         # Request handlers
│   │   │   │   ├── authController.ts
│   │   │   │   ├── roomController.ts
│   │   │   │   ├── messageController.ts
│   │   │   │   └── bookmarkController.ts
│   │   │   ├── services/            # Business logic
│   │   │   │   ├── authService.ts
│   │   │   │   ├── roomService.ts
│   │   │   │   ├── messageService.ts
│   │   │   │   ├── socketService.ts
│   │   │   │   └── auditService.ts
│   │   │   ├── middleware/          # Express middleware
│   │   │   │   ├── auth.ts
│   │   │   │   ├── validation.ts
│   │   │   │   ├── rateLimit.ts
│   │   │   │   ├── cors.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── routes/              # API routes
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rooms.ts
│   │   │   │   ├── messages.ts
│   │   │   │   └── bookmarks.ts
│   │   │   ├── models/              # Database models
│   │   │   │   ├── User.ts
│   │   │   │   ├── Room.ts
│   │   │   │   ├── Message.ts
│   │   │   │   └── Bookmark.ts
│   │   │   ├── utils/               # Utility functions
│   │   │   │   ├── validation.ts
│   │   │   │   ├── encryption.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── constants.ts
│   │   │   ├── types/               # TypeScript definitions
│   │   │   │   ├── express.d.ts
│   │   │   │   ├── socket.d.ts
│   │   │   │   └── database.ts
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── prisma/                  # Database schema and migrations
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── tests/                   # Backend tests
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── fixtures/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   └── shared/                      # Shared code between packages
│       ├── types/                   # Shared TypeScript types
│       │   ├── api.ts
│       │   ├── room.ts
│       │   ├── user.ts
│       │   └── socket.ts
│       ├── utils/                   # Shared utility functions
│       │   ├── validation.ts
│       │   ├── formatting.ts
│       │   └── constants.ts
│       ├── schemas/                 # Validation schemas
│       │   ├── auth.ts
│       │   ├── room.ts
│       │   └── message.ts
│       └── package.json
├── tests/                           # Cross-package tests
│   ├── e2e/                         # End-to-end tests
│   │   ├── fixtures/
│   │   ├── pages/
│   │   └── playwright.config.ts
│   ├── integration/                 # Integration tests
│   │   ├── api/
│   │   ├── websocket/
│   │   └── database/
│   └── performance/                 # Performance tests
│       ├── load/
│       └── stress/
├── scripts/                         # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── test.sh
│   └── setup.sh
├── .gitignore
├── .env.example
├── .prettierrc
├── .eslintrc.js
├── package.json                     # Root package.json
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

## Package Dependencies

### Root Package
- **Workspace management**: Lerna or npm workspaces
- **Shared scripts**: Build, test, and deployment commands
- **Common dependencies**: TypeScript, ESLint, Prettier

### Client Package
- **React**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Zustand**: State management

### Server Package
- **Express**: Web framework
- **Socket.IO**: WebSocket server
- **Prisma**: Database ORM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Zod**: Validation
- **Redis**: Caching and rate limiting

### Shared Package
- **TypeScript**: Type definitions
- **Zod**: Validation schemas
- **Utility libraries**: Date-fns, lodash

## Development Workflow

### Local Development
1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env.local`
3. **Start database**: PostgreSQL and Redis
4. **Run migrations**: `npm run db:migrate`
5. **Start dev servers**: `npm run dev`

### Testing
- **Unit tests**: `npm run test:unit`
- **Integration tests**: `npm run test:integration`
- **E2E tests**: `npm run test:e2e`
- **All tests**: `npm run test`

### Building
- **Development build**: `npm run build:dev`
- **Production build**: `npm run build:prod`
- **Type checking**: `npm run type-check`
- **Linting**: `npm run lint`

### Deployment
- **Frontend**: GitHub Pages via GitHub Actions
- **Backend**: Render.com via GitHub Actions
- **Database**: PostgreSQL on Render.com
- **Monitoring**: Built-in logging and error tracking

## File Naming Conventions

### Components
- **React components**: PascalCase (e.g., `Terminal.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useAuth.ts`)
- **Services**: camelCase (e.g., `authService.ts`)
- **Utilities**: camelCase (e.g., `formatMessage.ts`)

### Files
- **TypeScript**: `.ts` for logic, `.tsx` for React components
- **Styles**: `.css` for global styles, component-specific styles in components
- **Tests**: `.test.ts` or `.spec.ts` suffix
- **Configuration**: `.config.js` or `.config.ts`

### Directories
- **Components**: lowercase with hyphens (e.g., `command-input/`)
- **Pages**: PascalCase (e.g., `HomePage/`)
- **Services**: camelCase (e.g., `authService/`)
- **Utils**: camelCase (e.g., `validation/`)

## Import/Export Patterns

### Absolute Imports
```typescript
// Use absolute imports for shared code
import { User, Room } from '@shared/types';
import { validateRoomName } from '@shared/utils/validation';
```

### Relative Imports
```typescript
// Use relative imports for local files
import { Terminal } from './Terminal';
import { useAuth } from '../hooks/useAuth';
```

### Barrel Exports
```typescript
// Use index.ts files for clean imports
// components/index.ts
export { Terminal } from './Terminal';
export { CommandInput } from './CommandInput';
export { CommandOutput } from './CommandOutput';

// Usage
import { Terminal, CommandInput, CommandOutput } from './components';
```