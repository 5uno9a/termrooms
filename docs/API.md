# API Reference

## Base URLs

- **Development**: `http://localhost:3000`
- **Staging**: `https://api-staging.termrooms.com`
- **Production**: `https://api.termrooms.com`

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## REST API Endpoints

### Games

#### GET /api/games
Get list of available games.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `category` (string): Game category
- `author` (string): Game author

**Response:**
```json
{
  "games": [
    {
      "id": "reactor-sim",
      "name": "Nuclear Reactor Simulator",
      "description": "Manage a nuclear reactor and prevent meltdowns",
      "author": "system",
      "version": "1.0.0",
      "category": "simulation",
      "maxPlayers": 8,
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2024-12-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /api/games/:id
Get specific game details.

**Response:**
```json
{
  "id": "reactor-sim",
  "name": "Nuclear Reactor Simulator",
  "description": "Manage a nuclear reactor and prevent meltdowns",
  "author": "system",
  "version": "1.0.0",
  "category": "simulation",
  "maxPlayers": 8,
  "model": {
    "meta": { ... },
    "vars": { ... },
    "entities": { ... },
    "actions": [ ... ],
    "rules": [ ... ],
    "ui": { ... }
  },
  "createdAt": "2024-12-01T00:00:00Z",
  "updatedAt": "2024-12-01T00:00:00Z"
}
```

#### POST /api/games
Create a new game.

**Request Body:**
```json
{
  "name": "My Game",
  "description": "Game description",
  "category": "simulation",
  "maxPlayers": 4,
  "model": {
    "meta": { ... },
    "vars": { ... },
    "entities": { ... },
    "actions": [ ... ],
    "rules": [ ... ],
    "ui": { ... }
  }
}
```

**Response:**
```json
{
  "id": "my-game-123",
  "name": "My Game",
  "description": "Game description",
  "author": "user123",
  "version": "1.0.0",
  "category": "simulation",
  "maxPlayers": 4,
  "createdAt": "2024-12-01T00:00:00Z"
}
```

### Game Instances

#### GET /api/instances
Get list of active game instances.

**Query Parameters:**
- `gameId` (string): Filter by game ID
- `status` (string): Filter by status (waiting, active, finished)
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "instances": [
    {
      "id": "instance-123",
      "gameId": "reactor-sim",
      "gameName": "Nuclear Reactor Simulator",
      "status": "waiting",
      "players": [
        {
          "id": "player-1",
          "alias": "Engineer1",
          "role": "chief",
          "joinedAt": "2024-12-01T00:00:00Z"
        }
      ],
      "maxPlayers": 8,
      "currentPlayers": 1,
      "createdAt": "2024-12-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### POST /api/instances
Create a new game instance.

**Request Body:**
```json
{
  "gameId": "reactor-sim",
  "password": "optional-password",
  "maxPlayers": 8
}
```

**Response:**
```json
{
  "id": "instance-123",
  "gameId": "reactor-sim",
  "status": "waiting",
  "password": "optional-password",
  "maxPlayers": 8,
  "createdAt": "2024-12-01T00:00:00Z"
}
```

#### POST /api/instances/:id/join
Join a game instance.

**Request Body:**
```json
{
  "password": "optional-password",
  "alias": "MyAlias",
  "role": "engineer"
}
```

**Response:**
```json
{
  "success": true,
  "playerId": "player-123",
  "message": "Successfully joined game"
}
```

### Users

#### GET /api/users/me
Get current user profile.

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "username": "username",
  "createdAt": "2024-12-01T00:00:00Z",
  "stats": {
    "gamesCreated": 5,
    "gamesPlayed": 25,
    "totalPlayTime": 3600
  }
}
```

## WebSocket API

### Connection

Connect to WebSocket server:

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events

#### Client → Server

##### join-game
Join a game instance.

```javascript
socket.emit('join-game', {
  instanceId: 'instance-123',
  password: 'optional-password',
  alias: 'MyAlias',
  role: 'engineer'
});
```

##### leave-game
Leave current game instance.

```javascript
socket.emit('leave-game');
```

##### game-action
Perform a game action.

```javascript
socket.emit('game-action', {
  action: 'increase_power',
  parameters: { value: 10 }
});
```

##### chat-message
Send chat message.

```javascript
socket.emit('chat-message', {
  message: 'Hello everyone!'
});
```

#### Server → Client

##### game-state-update
Game state has been updated.

```javascript
socket.on('game-state-update', (data) => {
  console.log('New game state:', data.state);
  // Update UI with new state
});
```

##### player-joined
A player joined the game.

```javascript
socket.on('player-joined', (data) => {
  console.log('Player joined:', data.player);
  // Update player list
});
```

##### player-left
A player left the game.

```javascript
socket.on('player-left', (data) => {
  console.log('Player left:', data.playerId);
  // Update player list
});
```

##### chat-message
Received chat message.

```javascript
socket.on('chat-message', (data) => {
  console.log('Chat message:', data.message);
  // Display in chat
});
```

##### error
Error occurred.

```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
  // Show error to user
});
```

## Error Responses

### HTTP Errors

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "details": {
    "field": "name",
    "reason": "required"
  }
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions for this action"
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

### WebSocket Errors

```javascript
{
  "error": "INVALID_ACTION",
  "message": "Action not allowed for your role",
  "action": "increase_power",
  "role": "observer"
}
```

## Rate Limiting

### REST API
- **General**: 100 requests per minute per IP
- **Authentication**: 5 requests per minute per IP
- **Game Actions**: 60 requests per minute per user

### WebSocket
- **Messages**: 30 messages per minute per connection
- **Game Actions**: 10 actions per minute per user
- **Chat**: 20 messages per minute per user

## Pagination

All list endpoints support pagination:

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

### Query Parameters
- `sort`: Sort field (e.g., `createdAt`, `name`)
- `order`: Sort order (`asc` or `desc`)
- `filter`: Filter criteria (varies by endpoint)

### Examples
```
GET /api/games?sort=createdAt&order=desc&filter[category]=simulation
GET /api/instances?filter[status]=active&sort=createdAt&order=asc
```
