# 04 — Data Model

## Core Entities

### Games
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  author_id UUID NOT NULL,
  game_data JSONB NOT NULL,  -- Complete game model
  is_public BOOLEAN DEFAULT false,
  password_hash VARCHAR(255),  -- For private games
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Game Instances
```sql
CREATE TABLE game_instances (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  instance_id VARCHAR(20) UNIQUE NOT NULL,  -- Human-readable ID
  password_hash VARCHAR(255),  -- Optional password
  state JSONB NOT NULL,  -- Current game state
  status VARCHAR(20) DEFAULT 'waiting',  -- waiting, running, finished
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);
```

### Players
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY,
  instance_id UUID REFERENCES game_instances(id),
  user_id UUID,  -- Optional, for registered users
  alias VARCHAR(50) NOT NULL,
  role VARCHAR(20) DEFAULT 'player',
  joined_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW()
);
```

### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  instance_id UUID REFERENCES game_instances(id),
  player_id UUID REFERENCES players(id),
  type VARCHAR(20) NOT NULL,  -- chat, command, system
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Actions
```sql
CREATE TABLE actions (
  id UUID PRIMARY KEY,
  instance_id UUID REFERENCES game_instances(id),
  player_id UUID REFERENCES players(id),
  action_name VARCHAR(50) NOT NULL,
  parameters JSONB,
  processed_at TIMESTAMP DEFAULT NOW(),
  result JSONB
);
```

## Game State Structure
```typescript
interface GameState {
  vars: Record<string, number>;
  entities: Record<string, any>;
  players: Player[];
  tick: number;
  status: 'waiting' | 'running' | 'paused' | 'finished';
  winner?: string;
  score?: Record<string, number>;
}
```

## Indexes for Performance
```sql
-- Game discovery
CREATE INDEX idx_games_public ON games(is_public, created_at DESC);
CREATE INDEX idx_games_author ON games(author_id);

-- Instance management
CREATE INDEX idx_instances_game ON game_instances(game_id);
CREATE INDEX idx_instances_status ON game_instances(status);

-- Player tracking
CREATE INDEX idx_players_instance ON players(instance_id);
CREATE INDEX idx_players_last_seen ON players(last_seen);

-- Message history
CREATE INDEX idx_messages_instance ON messages(instance_id, created_at DESC);

-- Action processing
CREATE INDEX idx_actions_instance ON actions(instance_id, processed_at);
```