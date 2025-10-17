# 05 — API Specification

## REST Endpoints

### Game Management
```http
GET    /api/games                    # List public games
GET    /api/games/search?q={term}    # Search games
GET    /api/games/{id}               # Get game details
POST   /api/games                    # Create new game
PUT    /api/games/{id}               # Update game
DELETE /api/games/{id}               # Delete game
```

### Game Instances
```http
POST   /api/instances                # Create game instance
GET    /api/instances/{id}           # Get instance details
POST   /api/instances/{id}/join      # Join instance
POST   /api/instances/{id}/leave     # Leave instance
POST   /api/instances/{id}/start     # Start game
POST   /api/instances/{id}/end       # End game
```

### Messages
```http
GET    /api/instances/{id}/messages  # Get message history
POST   /api/instances/{id}/messages  # Send message
```

### Actions
```http
POST   /api/instances/{id}/actions   # Execute game action
GET    /api/instances/{id}/actions   # Get action history
```

## WebSocket Events

### Client → Server
```typescript
// Join instance
{ type: 'join_instance', instanceId: string, password?: string }

// Leave instance
{ type: 'leave_instance' }

// Send message
{ type: 'send_message', content: string }

// Execute action
{ type: 'execute_action', action: string, parameters?: any }

// UI commands
{ type: 'ui_command', command: string, parameters: any }
```

### Server → Client
```typescript
// Instance joined
{ type: 'instance_joined', instance: GameInstance, players: Player[] }

// Player joined
{ type: 'player_joined', player: Player }

// Player left
{ type: 'player_left', playerId: string }

// New message
{ type: 'message', message: Message }

// Game state update
{ type: 'game_state', state: GameState }

// Action result
{ type: 'action_result', actionId: string, success: boolean, result: any }

// UI update
{ type: 'ui_update', panels: PanelLayout[] }

// Error
{ type: 'error', code: string, message: string }
```

## Request/Response Examples

### Create Game Instance
```http
POST /api/instances
{
  "gameId": "reactor-v1",
  "password": "optional-password"
}

Response: 201 Created
{
  "id": "abc123",
  "instanceId": "REACTOR-ABC123",
  "gameId": "reactor-v1",
  "status": "waiting",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Join Instance
```http
POST /api/instances/abc123/join
{
  "alias": "player1",
  "password": "optional-password"
}

Response: 200 OK
{
  "playerId": "player-uuid",
  "role": "operator",
  "instance": { ... },
  "players": [ ... ]
}
```

### Execute Action
```http
POST /api/instances/abc123/actions
{
  "action": "pump_on",
  "parameters": { "pump": "pump_a" }
}

Response: 200 OK
{
  "actionId": "action-uuid",
  "success": true,
  "result": { "message": "Pump A activated" }
}
```
