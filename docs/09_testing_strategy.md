# 09 — Testing Strategy

## Testing Pyramid

### Unit Tests (70%)
**Framework**: Vitest + React Testing Library
**Coverage Target**: 90%+ for business logic

#### Frontend Unit Tests
```typescript
// Terminal command parser
describe('CommandParser', () => {
  it('should parse /create command correctly', () => {
    const result = parseCommand('/create my-room');
    expect(result).toEqual({
      command: 'create',
      args: ['my-room'],
      valid: true
    });
  });

  it('should reject invalid room names', () => {
    const result = parseCommand('/create invalid@name');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid room name');
  });
});

// React components
describe('Terminal Component', () => {
  it('should render command output correctly', () => {
    const output = [
      { type: 'command', content: '/who', timestamp: new Date() },
      { type: 'response', content: 'alice, bob', timestamp: new Date() }
    ];
    
    render(<Terminal output={output} onCommand={jest.fn()} />);
    
    expect(screen.getByText('/who')).toBeInTheDocument();
    expect(screen.getByText('alice, bob')).toBeInTheDocument();
  });
});
```

#### Backend Unit Tests
```typescript
// Room management service
describe('RoomService', () => {
  it('should create room with valid data', async () => {
    const roomData = { name: 'test-room', ownerId: 'user-1' };
    const room = await roomService.createRoom(roomData);
    
    expect(room.name).toBe('test-room');
    expect(room.ownerId).toBe('user-1');
    expect(room.id).toBeDefined();
  });

  it('should reject duplicate room names', async () => {
    await roomService.createRoom({ name: 'duplicate', ownerId: 'user-1' });
    
    await expect(
      roomService.createRoom({ name: 'duplicate', ownerId: 'user-2' })
    ).rejects.toThrow('Room already exists');
  });
});

// WebSocket handlers
describe('Socket Handlers', () => {
  it('should handle join_room event', async () => {
    const mockSocket = createMockSocket();
    const mockRoom = { id: 'room-1', name: 'test-room' };
    
    await handleJoinRoom(mockSocket, { roomName: 'test-room' });
    
    expect(mockSocket.join).toHaveBeenCalledWith('room-1');
    expect(mockSocket.emit).toHaveBeenCalledWith('joined', expect.any(Object));
  });
});
```

### Integration Tests (20%)
**Framework**: Supertest + Jest
**Coverage Target**: 80%+ for API endpoints

#### API Integration Tests
```typescript
describe('Room API', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/v1/rooms', () => {
    it('should create room with authentication', async () => {
      const token = await createTestUser();
      const roomData = { name: 'integration-test' };
      
      const response = await request(app)
        .post('/api/v1/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send(roomData)
        .expect(201);
      
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: 'integration-test',
        ownerId: expect.any(String)
      });
    });

    it('should reject unauthenticated requests', async () => {
      await request(app)
        .post('/api/v1/rooms')
        .send({ name: 'test' })
        .expect(401);
    });
  });

  describe('WebSocket Integration', () => {
    it('should broadcast messages to room members', async () => {
      const client1 = createTestSocket();
      const client2 = createTestSocket();
      
      await client1.emit('join_room', { roomName: 'test-room' });
      await client2.emit('join_room', { roomName: 'test-room' });
      
      const messagePromise = new Promise(resolve => {
        client2.on('message', resolve);
      });
      
      await client1.emit('send_message', {
        roomId: 'room-1',
        body: 'Hello world'
      });
      
      const message = await messagePromise;
      expect(message).toMatchObject({
        body: 'Hello world',
        user: expect.any(Object)
      });
    });
  });
});
```

### End-to-End Tests (10%)
**Framework**: Playwright
**Coverage Target**: Critical user journeys

#### E2E Test Scenarios
```typescript
describe('TermRooms E2E', () => {
  test('Complete room lifecycle', async ({ page }) => {
    // Navigate to app
    await page.goto('https://termrooms.dev');
    
    // Create alias
    await page.fill('[data-testid="alias-input"]', 'testuser');
    await page.click('[data-testid="create-alias"]');
    
    // Create room
    await page.fill('[data-testid="room-name"]', 'e2e-test-room');
    await page.click('[data-testid="create-room"]');
    
    // Verify room creation
    await expect(page.locator('[data-testid="room-title"]')).toContainText('e2e-test-room');
    await expect(page.locator('[data-testid="terminal-output"]')).toContainText('created room e2e-test-room');
    
    // Send message
    await page.fill('[data-testid="terminal-input"]', '/msg Hello from E2E test');
    await page.press('[data-testid="terminal-input"]', 'Enter');
    
    // Verify message appears
    await expect(page.locator('[data-testid="message-stream"]')).toContainText('Hello from E2E test');
    
    // Set password
    await page.fill('[data-testid="terminal-input"]', '/passwd set testpassword123');
    await page.press('[data-testid="terminal-input"]', 'Enter');
    
    // Verify password set
    await expect(page.locator('[data-testid="terminal-output"]')).toContainText('password set');
  });

  test('Join protected room with password', async ({ page }) => {
    // Create room with password (from previous test)
    await setupProtectedRoom();
    
    // Open new tab and join room
    const newPage = await page.context().newPage();
    await newPage.goto('https://termrooms.dev');
    
    await newPage.fill('[data-testid="alias-input"]', 'testuser2');
    await newPage.click('[data-testid="create-alias"]');
    
    await newPage.fill('[data-testid="join-room-name"]', 'e2e-test-room');
    await newPage.fill('[data-testid="join-room-password"]', 'testpassword123');
    await newPage.click('[data-testid="join-room"]');
    
    // Verify successful join
    await expect(newPage.locator('[data-testid="room-title"]')).toContainText('e2e-test-room');
    await expect(newPage.locator('[data-testid="participants"]')).toContainText('testuser2');
  });

  test('Accessibility compliance', async ({ page }) => {
    await page.goto('https://termrooms.dev');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'alias-input');
    
    // Test screen reader support
    const terminalOutput = page.locator('[data-testid="terminal-output"]');
    await expect(terminalOutput).toHaveAttribute('role', 'log');
    
    // Test high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    const contrast = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="terminal-input"]');
      const styles = window.getComputedStyle(element);
      // Check contrast ratio (simplified)
      return styles.color !== styles.backgroundColor;
    });
    expect(contrast).toBe(true);
  });
});
```

## Performance Testing

### Load Testing
**Tool**: Artillery.js
**Targets**: 50 users per room, 100 concurrent rooms

```yaml
# artillery-config.yml
config:
  target: 'https://termrooms-api.onrender.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  scenarios:
    - name: "Room operations"
      weight: 70
      flow:
        - post:
            url: "/api/v1/rooms"
            json:
              name: "load-test-{{ $randomString() }}"
        - think: 2
        - post:
            url: "/api/v1/rooms/{{ roomId }}/join"
        - think: 5
        - post:
            url: "/api/v1/rooms/{{ roomId }}/leave"
    - name: "WebSocket messaging"
      weight: 30
      flow:
        - connect:
            url: "wss://termrooms-api.onrender.com"
        - emit:
            channel: "join_room"
            data:
              roomName: "load-test-room"
        - emit:
            channel: "send_message"
            data:
              roomId: "{{ roomId }}"
              body: "Load test message {{ $randomString() }}"
        - think: 1
```

### Stress Testing
**Tool**: K6
**Targets**: System breaking point identification

```javascript
// stress-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100
    { duration: '2m', target: 200 }, // Ramp to 200
    { duration: '5m', target: 200 }, // Stay at 200
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
  },
};

export default function() {
  let response = http.post('https://termrooms-api.onrender.com/api/v1/rooms', {
    name: `stress-test-${Math.random()}`
  });
  
  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

## Test Data Management

### Test Database
- **Isolation**: Each test gets a fresh database
- **Seeding**: Pre-populated test data for consistent results
- **Cleanup**: Automatic cleanup after each test suite

### Mock Services
- **External APIs**: Mock all external dependencies
- **WebSocket**: Mock Socket.IO for unit tests
- **File System**: Mock file operations for testing

### Test Fixtures
```typescript
// test-fixtures.ts
export const testUsers = [
  { id: 'user-1', alias: 'alice', createdAt: new Date() },
  { id: 'user-2', alias: 'bob', createdAt: new Date() }
];

export const testRooms = [
  { id: 'room-1', name: 'test-room', ownerId: 'user-1' },
  { id: 'room-2', name: 'protected-room', ownerId: 'user-1', passwordHash: 'hashed' }
];

export const testMessages = [
  { id: 'msg-1', roomId: 'room-1', userId: 'user-1', body: 'Hello world' }
];
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/termrooms_test
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Quality Gates
- **Unit Test Coverage**: Minimum 90%
- **Integration Test Coverage**: Minimum 80%
- **E2E Test Coverage**: All critical user journeys
- **Performance**: API response time < 200ms
- **Security**: No high/critical vulnerabilities
- **Accessibility**: WCAG 2.2 AA compliance
