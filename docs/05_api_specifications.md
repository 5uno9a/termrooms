# 05 — API & Realtime Specifications

## REST API Endpoints

### Authentication
```http
POST /api/v1/auth/alias
Content-Type: application/json

{
  "alias": "username"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "alias": "username"
  },
  "tokenSetInHttpOnlyCookie": true
}
```

### Room Management
```http
POST /api/v1/rooms
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "my-room"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "my-room",
  "ownerId": "uuid",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

```http
POST /api/v1/rooms/{name}/join
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "password": "optional-password"
}

Response: 200 OK
{
  "room": {
    "id": "uuid",
    "name": "my-room",
    "topic": "Room description"
  },
  "members": [
    {
      "id": "uuid",
      "alias": "username",
      "role": "member",
      "lastSeenAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

```http
POST /api/v1/rooms/{id}/leave
Authorization: Bearer <jwt>

Response: 204 No Content
```

### Room Configuration
```http
PUT /api/v1/rooms/{id}/password
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "op": "set",
  "password": "new-password"
}

Response: 200 OK
{
  "message": "Password set successfully"
}
```

```http
PUT /api/v1/rooms/{id}/topic
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "topic": "New room topic"
}

Response: 200 OK
{
  "topic": "New room topic"
}
```

### Bookmarks
```http
GET /api/v1/bookmarks
Authorization: Bearer <jwt>

Response: 200 OK
[
  {
    "roomId": "uuid",
    "roomName": "my-room",
    "topic": "Room description",
    "memberCount": 5
  }
]
```

```http
POST /api/v1/bookmarks
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "roomId": "uuid"
}

Response: 201 Created
```

```http
DELETE /api/v1/bookmarks/{roomId}
Authorization: Bearer <jwt>

Response: 204 No Content
```

## WebSocket Events

### Client → Server Events

#### Join Room
```javascript
socket.emit('join_room', {
  roomName: 'my-room',
  password: 'optional-password'
});
```

#### Leave Room
```javascript
socket.emit('leave_room', {
  roomId: 'uuid'
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'uuid',
  body: 'Hello everyone!'
});
```

#### Get Presence
```javascript
socket.emit('get_presence', {
  roomId: 'uuid'
});
```

### Server → Client Events

#### Room Joined
```javascript
socket.on('joined', (data) => {
  console.log(data);
  // {
  //   room: { id: 'uuid', name: 'my-room', topic: 'Room description' },
  //   members: [
  //     { id: 'uuid', alias: 'username', role: 'member', lastSeenAt: '2024-01-01T00:00:00Z' }
  //   ]
  // }
});
```

#### User Joined
```javascript
socket.on('user_joined', (data) => {
  console.log(data);
  // { user: { id: 'uuid', alias: 'username' } }
});
```

#### User Left
```javascript
socket.on('user_left', (data) => {
  console.log(data);
  // { userId: 'uuid' }
});
```

#### New Message
```javascript
socket.on('message', (data) => {
  console.log(data);
  // {
  //   id: 'uuid',
  //   user: { id: 'uuid', alias: 'username' },
  //   body: 'Hello everyone!',
  //   createdAt: '2024-01-01T00:00:00Z'
  // }
});
```

#### Presence Update
```javascript
socket.on('presence', (data) => {
  console.log(data);
  // {
  //   members: [
  //     { id: 'uuid', alias: 'username', role: 'member', lastSeenAt: '2024-01-01T00:00:00Z' }
  //   ]
  // }
});
```

#### Error
```javascript
socket.on('error', (data) => {
  console.log(data);
  // { code: 'unauthorized', message: 'Invalid password' }
});
```

## Error Response Format

All API errors follow this format:

```json
{
  "code": "error_code",
  "message": "Human readable error message",
  "details": {
    "field": "Additional error details"
  }
}
```

### Error Codes
- `bad_request` (400) - Invalid request data
- `unauthenticated` (401) - Missing or invalid authentication
- `forbidden` (403) - Insufficient permissions
- `not_found` (404) - Resource not found
- `conflict` (409) - Resource already exists
- `rate_limited` (429) - Too many requests
- `internal_error` (500) - Server error

## Rate Limiting

### REST API
- 100 requests per minute per IP
- 20 requests per minute per authenticated user
- 5 room creations per hour per user

### WebSocket
- 50 messages per minute per user per room
- 10 room joins per minute per user
- 1 password change per minute per room owner

## Authentication & Security

### JWT Token
- Stored in httpOnly, secure, SameSite=Lax cookie
- 24-hour expiration
- Refresh token for extended sessions
- CSRF protection via double-submit pattern

### WebSocket Authentication
- JWT passed in connection query parameter
- Automatic reconnection with token refresh
- Connection timeout after 5 minutes of inactivity
