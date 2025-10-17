# 08 — System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React SPA] --> B[Terminal Component]
        A --> C[Participants Panel]
        A --> D[Message Stream]
        A --> E[Auth Context]
    end
    
    subgraph "CDN & Static"
        F[GitHub Pages] --> A
        G[Vercel Edge] --> A
    end
    
    subgraph "API Gateway"
        H[Express.js Server] --> I[Auth Middleware]
        H --> J[Rate Limiting]
        H --> K[Request Validation]
    end
    
    subgraph "WebSocket Layer"
        L[Socket.IO Server] --> M[Room Manager]
        L --> N[Presence Tracker]
        L --> O[Message Broker]
    end
    
    subgraph "Data Layer"
        P[PostgreSQL] --> Q[Prisma ORM]
        R[Redis Cache] --> S[Session Store]
        R --> T[Rate Limit Store]
    end
    
    subgraph "External Services"
        U[Render.com] --> H
        U --> L
        V[GitHub Actions] --> W[CI/CD Pipeline]
    end
    
    A --> H
    A --> L
    H --> Q
    L --> Q
    H --> R
    L --> R
    W --> F
    W --> U
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer for complex state
- **WebSocket**: Socket.IO client for real-time communication
- **HTTP Client**: Axios for REST API calls
- **Testing**: Vitest + React Testing Library + Playwright

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with custom middleware
- **WebSocket**: Socket.IO for real-time features
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session storage and rate limiting
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Zod for request/response validation

### Infrastructure
- **Frontend Hosting**: GitHub Pages with custom domain
- **Backend Hosting**: Render.com with auto-scaling
- **Database**: PostgreSQL on Render.com
- **CDN**: Vercel Edge Network for global distribution
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Built-in logging and error tracking

## Deployment Architecture

### Environments

#### Development
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **Backend**: `http://localhost:3001` (Express dev server)
- **Database**: Local PostgreSQL or SQLite
- **WebSocket**: Same port as backend with Socket.IO

#### Preview (Staging)
- **Frontend**: `https://preview.termrooms.dev` (GitHub Pages)
- **Backend**: `https://termrooms-api-preview.onrender.com` (Render)
- **Database**: PostgreSQL on Render (preview instance)
- **Purpose**: Testing new features before production

#### Production
- **Frontend**: `https://termrooms.dev` (GitHub Pages + CDN)
- **Backend**: `https://termrooms-api.onrender.com` (Render)
- **Database**: PostgreSQL on Render (production instance)
- **Monitoring**: Error tracking and performance monitoring

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=https://termrooms-api.onrender.com
VITE_WS_URL=wss://termrooms-api.onrender.com
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

#### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/termrooms
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://termrooms.dev
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## Database Design

### Connection Pooling
- **Prisma Connection Pool**: 10-20 connections per instance
- **Connection Timeout**: 30 seconds
- **Query Timeout**: 10 seconds
- **Retry Logic**: Exponential backoff for failed connections

### Indexing Strategy
```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_rooms_name_lower ON rooms(LOWER(name));
CREATE INDEX CONCURRENTLY idx_memberships_user_room ON memberships(user_id, room_id);
CREATE INDEX CONCURRENTLY idx_messages_room_time ON messages(room_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_audit_room_time ON audit_log(room_id, created_at DESC);

-- Partial indexes for active data
CREATE INDEX CONCURRENTLY idx_memberships_active ON memberships(room_id, last_seen_at) 
WHERE last_seen_at > NOW() - INTERVAL '1 hour';
```

### Data Retention
- **Messages**: Auto-delete after 30 days
- **Audit Logs**: Auto-delete after 90 days
- **Inactive Rooms**: Soft delete after 7 days of no activity
- **User Sessions**: Cleanup expired sessions daily

## Real-Time Communication

### WebSocket Architecture
- **Connection Management**: Automatic reconnection with exponential backoff
- **Room Broadcasting**: Efficient message distribution to room members
- **Presence Tracking**: Real-time user online/offline status
- **Message Queuing**: Reliable message delivery with acknowledgments

### Message Flow
```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant S as Socket.IO Server
    participant C2 as Client 2
    participant DB as Database
    
    C1->>S: send_message(roomId, body)
    S->>DB: Save message
    DB-->>S: Message saved
    S->>C1: message_ack(id)
    S->>C2: message(data)
    C2-->>S: message_received(id)
```

### Scaling Considerations
- **Horizontal Scaling**: Multiple server instances with Redis adapter
- **Load Balancing**: Sticky sessions for WebSocket connections
- **Message Broadcasting**: Redis pub/sub for cross-instance communication
- **Connection Limits**: Maximum 1000 concurrent connections per instance

## Security Architecture

### Network Security
- **HTTPS Everywhere**: TLS 1.3 for all communications
- **CORS Policy**: Restrictive cross-origin resource sharing
- **CSP Headers**: Content Security Policy to prevent XSS
- **HSTS**: HTTP Strict Transport Security headers

### Application Security
- **Input Validation**: Zod schemas for all API endpoints
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: HTML escaping and CSP headers
- **CSRF Protection**: Double-submit token pattern

### Infrastructure Security
- **Secrets Management**: Environment variables with Render secrets
- **Database Security**: Encrypted connections and access controls
- **API Rate Limiting**: Redis-based rate limiting with IP and user tracking
- **Audit Logging**: Comprehensive security event logging

## Monitoring & Observability

### Application Metrics
- **Response Times**: API endpoint performance tracking
- **WebSocket Metrics**: Connection counts, message rates, error rates
- **Database Metrics**: Query performance, connection pool usage
- **Error Rates**: 4xx and 5xx error tracking

### Business Metrics
- **User Activity**: Daily/monthly active users
- **Room Creation**: New rooms created per day
- **Message Volume**: Messages sent per hour/day
- **Feature Usage**: Command usage statistics

### Alerting
- **Error Rate Alerts**: >5% error rate for 5 minutes
- **Response Time Alerts**: >2s average response time
- **Database Alerts**: Connection pool exhaustion
- **Uptime Alerts**: Service availability monitoring
