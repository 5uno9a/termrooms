# 13 — Game Engine Specifications

## Game Engine Architecture

### Core Components
1. **State Store** — Authoritative game state (variables, entities, players, log)
2. **Interpreter** — Applies actions and rules to state
3. **Tick Loop** — Periodic evaluation and random events
4. **Sync Layer** — Real-time state synchronization via WebSocket
5. **Model Loader** — JSON-based game model parsing and validation

### Game Model Schema

```typescript
interface GameModel {
  meta: {
    name: string;
    version: string;
    description: string;
    author: string;
    seed?: number;
  };
  vars: Record<string, Variable>;
  entities: Record<string, Entity>;
  actions: Action[];
  rules: Rule[];
  init_random?: RandomInit;
  random_events?: RandomEvent[];
}

interface Variable {
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface Entity {
  [key: string]: string | number | boolean;
}

interface Action {
  name: string;
  description: string;
  allowed_roles?: string[];
  conditions?: Condition[];
  effects: Effect[];
  cooldown?: number;
}

interface Rule {
  trigger: 'tick' | 'event' | 'action';
  conditions?: Condition[];
  effects: Effect[];
  frequency?: number; // ticks between executions
}

interface Effect {
  type: 'set' | 'delta' | 'log' | 'event';
  path: string;
  value?: any;
  amount?: number;
  message?: string;
}

interface Condition {
  type: 'var_range' | 'entity_exists' | 'action_count';
  path: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: any;
}
```

## ReactorSim Game Model

### Core Variables
```json
{
  "vars": {
    "core_temp": { "value": 50, "unit": "°C", "min": 0, "max": 100 },
    "pressure": { "value": 100, "unit": "bar", "min": 0, "max": 200 },
    "power_output": { "value": 0, "unit": "MW", "min": 0, "max": 1000 },
    "coolant_level": { "value": 80, "unit": "%", "min": 0, "max": 100 },
    "radiation_level": { "value": 5, "unit": "mSv/h", "min": 0, "max": 1000 }
  }
}
```

### System Entities
```json
{
  "entities": {
    "pump_a": { "status": "off", "health": 100, "flow_rate": 0 },
    "pump_b": { "status": "off", "health": 100, "flow_rate": 0 },
    "control_rods": { "position": 100, "inserted": true },
    "turbine": { "status": "off", "efficiency": 0.85 },
    "emergency_system": { "active": false, "last_test": null }
  }
}
```

### Player Actions
```json
{
  "actions": [
    {
      "name": "pump_on",
      "description": "Turn on coolant pump",
      "allowed_roles": ["operator", "engineer"],
      "effects": [
        { "type": "set", "path": "entities.pump_a.status", "value": "on" },
        { "type": "set", "path": "entities.pump_a.flow_rate", "value": 50 },
        { "type": "log", "message": "Pump A activated" }
      ]
    },
    {
      "name": "control_rods_out",
      "description": "Extract control rods to increase reactivity",
      "allowed_roles": ["operator"],
      "conditions": [
        { "type": "var_range", "path": "vars.core_temp", "operator": "<", "value": 80 }
      ],
      "effects": [
        { "type": "delta", "path": "vars.core_temp", "amount": 5 },
        { "type": "delta", "path": "vars.power_output", "amount": 100 },
        { "type": "log", "message": "Control rods extracted - power increasing" }
      ]
    },
    {
      "name": "emergency_shutdown",
      "description": "Emergency reactor shutdown",
      "allowed_roles": ["operator", "engineer"],
      "effects": [
        { "type": "set", "path": "entities.control_rods.inserted", "value": true },
        { "type": "set", "path": "vars.power_output", "value": 0 },
        { "type": "log", "message": "EMERGENCY SHUTDOWN ACTIVATED" }
      ]
    }
  ]
}
```

### Simulation Rules
```json
{
  "rules": [
    {
      "trigger": "tick",
      "frequency": 1,
      "effects": [
        { "type": "delta", "path": "vars.core_temp", "amount": 0.1 },
        { "type": "log", "message": "Core temperature: {core_temp}°C" }
      ]
    },
    {
      "trigger": "tick",
      "conditions": [
        { "type": "var_range", "path": "vars.core_temp", "operator": ">", "value": 90 }
      ],
      "effects": [
        { "type": "delta", "path": "vars.radiation_level", "amount": 10 },
        { "type": "log", "message": "WARNING: High temperature detected!" }
      ]
    }
  ]
}
```

### Random Events
```json
{
  "random_events": [
    {
      "chance": 0.05,
      "effects": [
        { "type": "delta", "path": "vars.pressure", "amount": 20 },
        { "type": "log", "message": "Pressure spike detected!" }
      ]
    },
    {
      "chance": 0.02,
      "effects": [
        { "type": "set", "path": "entities.pump_a.health", "value": 50 },
        { "type": "log", "message": "Pump A malfunction - reduced efficiency" }
      ]
    }
  ]
}
```

## Multi-Panel Visualization System

### Panel Layout
The ReactorSim game uses a multi-panel layout to display different aspects of the simulation:

#### Overview Panel
- **Core Temperature**: Real-time gauge with color coding
- **Power Output**: Current power generation in MW
- **Radiation Level**: Safety monitoring with alert thresholds
- **Pressure**: System pressure in bars
- **Status Indicators**: Overall reactor health

#### Coolant Network Panel
- **Pump Status**: Visual representation of pump states
- **Flow Rates**: Real-time flow monitoring
- **Pipe Network**: ASCII/Unicode schematic of cooling system
- **Temperature Zones**: Heat distribution visualization

#### Events Panel
- **System Logs**: Chronological event history
- **Alert Levels**: Color-coded severity (INFO, WARN, ERROR, CRITICAL)
- **Real-time Updates**: Live event streaming
- **Filter Options**: Filter by severity or source

#### Commands Panel
- **Action History**: Recent player actions
- **System Responses**: Command execution results
- **Role-based Actions**: Available actions per user role
- **Command Queue**: Pending actions waiting for execution

#### Players Panel
- **Online Users**: Real-time presence tracking
- **Role Assignment**: Operator, Engineer, Observer roles
- **Action Permissions**: Role-based action availability
- **Collaboration Status**: Who's doing what

### ASCII/Unicode Visualization

#### Reactor Schematic
```
    ⚛ Reactor Core
    │ Temperature: 65°C
    │ Power: 450MW
    │
    ────┼──── Coolant Loop
    │    │
    ◉ Pump A    ◉ Pump B
    │ ON 50%     │ OFF 0%
    │            │
    ────┘    ────┘
    │
    ⚙ Turbine
    │ Efficiency: 85%
    │
    ⚡ Generator
    │ Output: 450MW
```

#### Status Indicators
- **Normal**: `●` Green
- **Warning**: `▲` Yellow  
- **Error**: `✕` Red
- **Critical**: `⚠` Blinking Red

#### Progress Bars
- **Temperature**: `[████████░░] 80°C`
- **Power**: `[██████░░░░] 450MW`
- **Coolant**: `[██████████] 100%`

## Real-Time Synchronization

### State Updates
- **Tick Rate**: 1 second intervals
- **Broadcast**: All state changes sent to all connected players
- **Panel Updates**: Individual panels update based on relevant state changes
- **Deterministic**: Same seed produces identical results
- **Conflict Resolution**: Server state is authoritative

### WebSocket Events

#### Game State Events
```typescript
// Server → Client
interface GameStateUpdate {
  type: 'game_state_update';
  gameId: string;
  state: {
    vars: Record<string, any>;
    entities: Record<string, any>;
    players: Player[];
    tick: number;
    timestamp: number;
  };
}

interface GameActionResult {
  type: 'action_result';
  actionId: string;
  success: boolean;
  message: string;
  cooldown?: number;
}

interface GameEvent {
  type: 'game_event';
  event: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}
```

#### Client → Server
```typescript
interface GameAction {
  type: 'game_action';
  action: string;
  parameters?: Record<string, any>;
}

interface JoinGame {
  type: 'join_game';
  gameId: string;
  role: string;
}

interface LeaveGame {
  type: 'leave_game';
  gameId: string;
}
```

## Dev Sandbox Features

### JSON Model Editor
- **Syntax Highlighting**: JSON validation and formatting
- **Live Preview**: Real-time simulation preview
- **Validation**: Schema validation with error highlighting
- **Templates**: Pre-built game templates
- **Export/Import**: Save and load game models

### Game Testing
- **Single Player Mode**: Test games without multiplayer
- **Debug Mode**: Step-through simulation with detailed logging
- **Performance Metrics**: Track simulation performance
- **Replay System**: Record and replay game sessions

### Sharing System
- **Public Library**: Share games with the community
- **Private Games**: Keep games private to specific users
- **Version Control**: Track changes and updates
- **Rating System**: Community feedback on games

## Performance Requirements

### Simulation Performance
- **Tick Rate**: 1 second minimum, 0.1 second maximum
- **State Size**: < 10KB per game state
- **Update Latency**: < 100ms for state broadcasts
- **Concurrent Games**: Support 100+ simultaneous games

### Memory Management
- **State Cleanup**: Automatic cleanup of old game states
- **Entity Limits**: Maximum 1000 entities per game
- **History Limit**: Keep last 1000 state snapshots
- **Garbage Collection**: Regular cleanup of unused data

## Security Considerations

### Game Model Validation
- **Schema Validation**: Strict JSON schema enforcement
- **Action Limits**: Prevent infinite loops and resource exhaustion
- **Value Ranges**: Enforce min/max constraints on variables
- **Rate Limiting**: Limit action frequency per player

### Multiplayer Security
- **Role Verification**: Server-side role checking
- **Action Validation**: Validate all actions before execution
- **State Integrity**: Prevent client-side state manipulation
- **Audit Logging**: Track all game actions and events
