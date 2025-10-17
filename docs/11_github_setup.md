# 11 — GitHub Setup & Contribution Guidelines

## Repository Structure

```
termrooms/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── deploy-frontend.yml # Frontend deployment
│   │   └── deploy-backend.yml  # Backend deployment
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                       # Project documentation
├── packages/
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── server/                 # Node.js backend
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared/                 # Shared types and utilities
│       ├── types/
│       ├── utils/
│       └── package.json
├── tests/
│   ├── e2e/                    # End-to-end tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test data
├── .gitignore
├── .env.example
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json                # Root package.json for scripts
```

## Branch Strategy

### Main Branches
- **`main`**: Production-ready code, always deployable
- **`develop`**: Integration branch for features, staging environment

### Feature Branches
- **`feature/description`**: New features (e.g., `feature/password-protection`)
- **`bugfix/description`**: Bug fixes (e.g., `bugfix/websocket-reconnection`)
- **`hotfix/description`**: Critical production fixes (e.g., `hotfix/security-patch`)

### Branch Naming Convention
```
type/description-in-kebab-case

Examples:
- feature/terminal-commands
- bugfix/message-persistence
- hotfix/authentication-bypass
- docs/api-documentation
- test/websocket-integration
```

## Pull Request Process

### Before Creating a PR
1. **Sync with main**: `git checkout main && git pull origin main`
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes**: Implement feature with tests
4. **Run tests**: `npm run test:all`
5. **Commit changes**: Use conventional commit format
6. **Push branch**: `git push origin feature/your-feature`

### PR Requirements
- [ ] **Description**: Clear description of changes and motivation
- [ ] **Tests**: Unit tests for new functionality
- [ ] **Documentation**: Update relevant documentation
- [ ] **Breaking Changes**: Document any breaking changes
- [ ] **Screenshots**: UI changes include before/after screenshots
- [ ] **Checklist**: Complete the PR checklist

### PR Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements left
- [ ] No TODO comments left
- [ ] Breaking changes documented
```

## Commit Convention

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples
```
feat(terminal): add command autocomplete
fix(websocket): handle connection drops gracefully
docs(api): update authentication endpoints
test(integration): add room creation tests
chore(deps): update dependencies to latest versions
```

## Code Review Guidelines

### For Authors
- **Self-review first**: Review your own code before requesting review
- **Small PRs**: Keep PRs focused and reasonably sized
- **Clear descriptions**: Explain what changed and why
- **Test coverage**: Ensure adequate test coverage
- **Documentation**: Update docs for user-facing changes

### For Reviewers
- **Be constructive**: Provide helpful feedback and suggestions
- **Check functionality**: Verify the code works as intended
- **Check tests**: Ensure tests are adequate and pass
- **Check security**: Look for potential security issues
- **Check performance**: Consider performance implications

### Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are comprehensive and pass
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
- [ ] Documentation updated appropriately
- [ ] No breaking changes without notice
- [ ] Error handling is appropriate
- [ ] Code is readable and maintainable

## Issue Management

### Issue Labels
- **bug**: Something isn't working
- **enhancement**: New feature or request
- **documentation**: Improvements or additions to documentation
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention is needed
- **priority:high**: High priority
- **priority:medium**: Medium priority
- **priority:low**: Low priority
- **type:frontend**: Frontend related
- **type:backend**: Backend related
- **type:devops**: DevOps related

### Issue Templates

#### Bug Report
```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [e.g. Chrome 90, Firefox 88, Safari 14]
- Version: [e.g. 1.0.0]

## Additional Context
Add any other context about the problem here.
```

#### Feature Request
```markdown
## Feature Description
A clear and concise description of what you want to happen.

## Motivation
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe the solution you'd like to see implemented.

## Alternatives
Describe any alternative solutions or workarounds you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Continuous Integration (`ci.yml`)
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run lint
      - run: npm run type-check
```

#### Frontend Deployment (`deploy-frontend.yml`)
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: ['packages/client/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:client
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./packages/client/dist
```

#### Backend Deployment (`deploy-backend.yml`)
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['packages/server/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:server
      - run: npm run deploy:backend
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
```

## Development Workflow

### Getting Started
1. **Fork repository**: Create your own fork
2. **Clone locally**: `git clone https://github.com/yourusername/termrooms.git`
3. **Install dependencies**: `npm install`
4. **Set up environment**: Copy `.env.example` to `.env.local`
5. **Start development**: `npm run dev`

### Daily Workflow
1. **Sync with upstream**: `git fetch upstream && git merge upstream/main`
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes**: Implement feature with tests
4. **Test locally**: `npm run test:all`
5. **Commit changes**: `git commit -m "feat: your feature"`
6. **Push and PR**: `git push origin feature/your-feature`

### Release Process
1. **Update version**: `npm version patch/minor/major`
2. **Update changelog**: Document changes
3. **Create release**: GitHub release with changelog
4. **Deploy**: Automatic deployment via CI/CD
5. **Monitor**: Check deployment status and logs

## Code Style Guidelines

### TypeScript
- Use strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Use const assertions where appropriate

### React
- Use functional components with hooks
- Prefer composition over inheritance
- Use TypeScript for all components
- Follow the single responsibility principle
- Use proper prop types and interfaces

### Node.js
- Use async/await over callbacks
- Handle errors appropriately
- Use proper logging levels
- Follow RESTful API conventions
- Validate all inputs

### General
- Use meaningful commit messages
- Write self-documenting code
- Add comments for complex logic
- Follow the DRY principle
- Keep functions small and focused
