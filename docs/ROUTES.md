# Application Routes

## Frontend Routes

### Public Routes
- **`/`** - Landing page with room creation/joining
- **`/help`** - Command reference and keyboard shortcuts
- **`/about`** - Project information and features

### Authenticated Routes
- **`/room/:roomId`** - Main room interface with terminal
- **`/bookmarks`** - User's bookmarked rooms
- **`/settings`** - User preferences and account settings

### Error Routes
- **`/404`** - Page not found
- **`/500`** - Server error
- **`/offline`** - Network connectivity issues

## API Routes

### Authentication
- **`POST /api/v1/auth/alias`** - Create or get user alias
- **`POST /api/v1/auth/refresh`** - Refresh JWT token
- **`POST /api/v1/auth/logout`** - Logout and clear session

### Rooms
- **`POST /api/v1/rooms`** - Create new room
- **`GET /api/v1/rooms/:id`** - Get room details
- **`POST /api/v1/rooms/:name/join`** - Join room by name
- **`POST /api/v1/rooms/:id/leave`** - Leave room
- **`PUT /api/v1/rooms/:id/password`** - Set/clear room password
- **`PUT /api/v1/rooms/:id/topic`** - Set room topic
- **`DELETE /api/v1/rooms/:id`** - Delete room (owner only)

### Bookmarks
- **`GET /api/v1/bookmarks`** - Get user's bookmarks
- **`POST /api/v1/bookmarks`** - Add bookmark
- **`DELETE /api/v1/bookmarks/:roomId`** - Remove bookmark

### Messages
- **`GET /api/v1/rooms/:id/messages`** - Get message history
- **`POST /api/v1/rooms/:id/messages`** - Send message (WebSocket preferred)

### Admin
- **`GET /api/v1/admin/rooms`** - List all rooms (admin only)
- **`GET /api/v1/admin/audit/:roomId`** - Get room audit log
- **`GET /api/v1/admin/stats`** - System statistics

## WebSocket Events

### Client → Server
- **`join_room`** - Join a room
- **`leave_room`** - Leave current room
- **`send_message`** - Send message to room
- **`get_presence`** - Get room member list
- **`typing_start`** - User started typing
- **`typing_stop`** - User stopped typing

### Server → Client
- **`joined`** - Successfully joined room
- **`user_joined`** - New user joined room
- **`user_left`** - User left room
- **`message`** - New message received
- **`presence`** - Updated room member list
- **`typing`** - User typing indicator
- **`error`** - Error message
- **`room_updated`** - Room settings changed

## Route Protection

### Authentication Required
- All room management endpoints
- Bookmark endpoints
- Message endpoints
- Admin endpoints

### Rate Limited
- Room creation (5 per hour per user)
- Message sending (20 per 10 minutes per user)
- Authentication attempts (10 per minute per IP)

### CORS Configuration
- **Allowed Origins**: `https://termrooms.dev`, `http://localhost:5173`
- **Allowed Methods**: GET, POST, PUT, DELETE
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: true