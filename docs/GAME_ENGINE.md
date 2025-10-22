# Game Engine Documentation

## Overview

The TermRooms game engine is a **JSON-based simulation system** that allows users to create complex multiplayer games without writing code. Games are defined using JSON configuration files that specify variables, entities, actions, rules, and UI layouts.

## Core Concepts

### Game Model
A complete game definition containing all game logic and UI configuration.

### Variables
Numeric values that represent game state (power, temperature, pressure, etc.).

### Entities
Objects with properties that can change over time (pumps, valves, players, etc.).

### Actions
Player commands that modify game state (increase power, open valve, etc.).

### Rules
Automated behaviors that trigger based on conditions (random events, tick-based updates).

### UI Panels
Visual containers that display widgets for monitoring and controlling the game.

## JSON Game Model Structure

```json
{
  "meta": {
    "name": "Nuclear Reactor Simulator",
    "version": "1.0.0",
    "description": "Manage a nuclear reactor and prevent meltdowns",
    "author": "System",
    "maxPlayers": 8
  },
  "vars": { ... },
  "entities": { ... },
  "actions": [ ... ],
  "rules": [ ... ],
  "random_events": [ ... ],
  "ui": { ... }
}
```

## Variables

Variables represent numeric game state that can be monitored and modified.

### Definition
```json
{
  "power": {
    "value": 50,
    "min": 0,
    "max": 100,
    "unit": "MW"
  },
  "temperature": {
    "value": 300,
    "min": 0,
    "max": 1000,
    "unit": "°C"
  }
}
```

### Properties
- **value**: Current value
- **min**: Minimum allowed value
- **max**: Maximum allowed value
- **unit**: Display unit (optional)

## Entities

Entities are objects with properties that can change over time.

### Definition
```json
{
  "pump_a": {
    "status": "on",
    "efficiency": 0.8,
    "flow_rate": 100
  },
  "valve_1": {
    "position": 0.5,
    "stuck": false
  }
}
```

### Properties
- Any key-value pairs
- Values can be strings, numbers, or booleans
- Properties can be referenced in actions and rules

## Actions

Actions are player commands that modify game state.

### Definition
```json
{
  "name": "increase_power",
  "description": "Increase reactor power output",
  "allowed_roles": ["chief", "engineer"],
  "effects": [
    {
      "type": "modify_var",
      "target": "power",
      "operation": "add",
      "value": 10
    }
  ]
}
```

### Action Properties
- **name**: Unique action identifier
- **description**: Human-readable description
- **allowed_roles**: Array of roles that can perform this action
- **effects**: Array of effects to apply when action is executed

### Effect Types

#### modify_var
Modify a variable value.
```json
{
  "type": "modify_var",
  "target": "power",
  "operation": "add|subtract|multiply|divide|set",
  "value": 10
}
```

#### set_var
Set a variable to a specific value.
```json
{
  "type": "set_var",
  "target": "power",
  "value": 75
}
```

#### set_entity
Set an entity property value.
```json
{
  "type": "set_entity",
  "target": "pump_a.status",
  "value": "off"
}
```

#### trigger_event
Trigger a random event.
```json
{
  "type": "trigger_event",
  "eventType": "pump_failure"
}
```

#### message
Send a message to all players.
```json
{
  "type": "message",
  "message": "Power increased by 10MW"
}
```

#### update_score
Update a player's score.
```json
{
  "type": "update_score",
  "playerId": "player_1",
  "value": 100
}
```

#### add_log
Add an entry to the game log.
```json
{
  "type": "add_log",
  "message": "Pump A activated"
}
```

#### add_event
Add a game event.
```json
{
  "type": "add_event",
  "eventType": "system_alert",
  "message": "Temperature critical"
}
```

#### set_status
Set a player's status.
```json
{
  "type": "set_status",
  "playerId": "player_1",
  "status": "busy"
}
```

## Rules

Rules define automated behaviors that trigger based on conditions.

### Definition
```json
{
  "trigger": "tick",
  "frequency": 1,
  "condition": "power > 80",
  "effects": [
    {
      "type": "modify_var",
      "target": "temperature",
      "operation": "add",
      "value": 5
    }
  ]
}
```

### Rule Properties
- **trigger**: When to check the rule (`tick`, `action`, `event`, `condition`)
- **frequency**: How often to check (for tick-based rules)
- **condition**: Boolean expression to evaluate
- **effects**: Effects to apply when condition is true

### Trigger Types

#### tick
Triggered every game tick (1 second).
```json
{
  "trigger": "tick",
  "frequency": 1,
  "condition": "power > 80",
  "effects": [...]
}
```

#### action
Triggered when a specific action is performed.
```json
{
  "trigger": "action",
  "action": "increase_power",
  "condition": "power > 90",
  "effects": [...]
}
```

#### event
Triggered when a specific event occurs.
```json
{
  "trigger": "event",
  "eventType": "pump_failure",
  "condition": "true",
  "effects": [...]
}
```

#### condition
Triggered when a condition becomes true.
```json
{
  "trigger": "condition",
  "condition": "temperature > 500",
  "effects": [...]
}
```

## Random Events

Random events add unpredictability to games.

### Definition
```json
{
  "name": "pump_failure",
  "description": "Pump A has failed",
  "probability": 0.1,
  "cooldown": 300,
  "effects": [
    {
      "type": "set_entity",
      "target": "pump_a.status",
      "value": "off"
    },
    {
      "type": "add_log",
      "message": "Pump A failure detected!"
    }
  ]
}
```

### Properties
- **name**: Unique event identifier
- **description**: Human-readable description
- **probability**: Chance of occurring per tick (0-1)
- **cooldown**: Minimum time between occurrences (seconds)
- **effects**: Effects to apply when event triggers

## UI System

The UI system defines how the game is displayed to players.

### Panel Layout
```json
{
  "panels": [
    {
      "id": "overview",
      "title": "⚛ REACTOR STATUS",
      "layout": {
        "x": 0,
        "y": 0,
        "w": 6,
        "h": 8,
        "minW": 3,
        "minH": 4,
        "maxW": 8,
        "maxH": 12
      },
      "widgets": [...],
      "visible": true,
      "resizable": true,
      "draggable": true
    }
  ],
  "layout": {
    "type": "grid",
    "gridSize": 12,
    "maxPanels": 8
  }
}
```

### Widget Types

#### Bar Widget
Display progress bars and gauges.
```json
{
  "type": "bar",
  "title": "Power Level",
  "config": {
    "target": "power",
    "min": 0,
    "max": 100,
    "unit": "MW"
  },
  "bindings": {
    "vars": ["power"]
  }
}
```

#### Schematic Widget
Display ASCII/Unicode diagrams.
```json
{
  "type": "schematic",
  "title": "Coolant Flow",
  "config": {
    "template": "custom",
    "pattern": [
      "    ⚛ Reactor Core",
      "    │ Power: {power}MW",
      "    │ Temp: {temp}°C"
    ],
    "bindings": {
      "power": "vars.power",
      "temp": "vars.temperature"
    }
  }
}
```

#### Log Widget
Display event logs and messages.
```json
{
  "type": "log",
  "title": "System Log",
  "config": {
    "source": "events",
    "maxEntries": 100,
    "format": "[{time}] {level}: {message}"
  }
}
```

#### Checklist Widget
Display task lists and checkboxes.
```json
{
  "type": "checklist",
  "title": "Maintenance Tasks",
  "config": {
    "bindings": {
      "entities": ["tasks"]
    }
  }
}
```

#### Terminal Widget
Display interactive command line.
```json
{
  "type": "terminal",
  "title": "Command Terminal",
  "config": {
    "interactive": true,
    "prompt": "> "
  }
}
```

#### Grid Widget
Display data tables and lists.
```json
{
  "type": "grid",
  "title": "Player List",
  "config": {
    "bindings": {
      "entities": ["players"]
    },
    "columns": ["name", "role", "status"]
  }
}
```

## Condition Evaluation

Conditions use a simple expression language to evaluate game state.

### Operators
- **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`
- **Logical**: `&&`, `||`, `!`
- **Arithmetic**: `+`, `-`, `*`, `/`

### Examples
```javascript
// Simple comparisons
"power > 80"
"temperature < 500"
"pump_a.status == 'on'"

// Complex conditions
"power > 80 && temperature < 500"
"pump_a.status == 'off' || pump_b.status == 'off'"
"!(power > 90 && temperature > 800)"

// Arithmetic expressions
"power * 0.1 > temperature"
"(power + temperature) / 2 > 400"
```

### Variable References
- **Variables**: `power`, `temperature`, `pressure`
- **Entity Properties**: `pump_a.status`, `valve_1.position`
- **Player Properties**: `player_1.score`, `player_2.role`

## Game Lifecycle

### 1. Initialization
- Load game model from JSON
- Initialize variables and entities
- Set up UI panels and widgets
- Create player roles

### 2. Game Start
- Begin tick loop (1 second intervals)
- Start random event processing
- Enable player actions
- Begin real-time updates

### 3. Gameplay
- Players perform actions
- Rules evaluate conditions
- Random events may trigger
- State updates broadcast to all players

### 4. Game End
- Stop tick loop
- Disable player actions
- Calculate final scores
- Save game results

## Best Practices

### Game Design
- **Balance**: Ensure actions have appropriate costs and benefits
- **Clarity**: Use clear variable and entity names
- **Feedback**: Provide immediate feedback for player actions
- **Progression**: Include meaningful progression and goals

### Performance
- **Efficient Rules**: Avoid complex conditions in frequently-triggered rules
- **Reasonable Limits**: Set appropriate min/max values for variables
- **Widget Count**: Limit number of widgets per panel
- **Update Frequency**: Use appropriate frequencies for tick-based rules

### Security
- **Input Validation**: Validate all player inputs
- **Role Restrictions**: Use role-based access control
- **Condition Safety**: Avoid dangerous condition expressions
- **Resource Limits**: Set reasonable limits on game complexity

## Example: Nuclear Reactor Simulator

```json
{
  "meta": {
    "name": "Nuclear Reactor Simulator",
    "version": "1.0.0",
    "description": "Manage a nuclear reactor and prevent meltdowns",
    "author": "System",
    "maxPlayers": 8
  },
  "vars": {
    "power": { "value": 50, "min": 0, "max": 100, "unit": "MW" },
    "temperature": { "value": 300, "min": 0, "max": 1000, "unit": "°C" },
    "pressure": { "value": 50, "min": 0, "max": 100, "unit": "bar" },
    "radiation": { "value": 0, "min": 0, "max": 100, "unit": "mSv/h" }
  },
  "entities": {
    "pump_a": { "status": "on", "efficiency": 0.8 },
    "pump_b": { "status": "off", "efficiency": 0.9 },
    "valve_1": { "position": 0.5, "stuck": false },
    "valve_2": { "position": 0.0, "stuck": false }
  },
  "actions": [
    {
      "name": "increase_power",
      "description": "Increase reactor power output",
      "allowed_roles": ["chief", "engineer"],
      "effects": [
        { "type": "modify_var", "target": "power", "operation": "add", "value": 10 },
        { "type": "add_log", "message": "Power increased by 10MW" }
      ]
    },
    {
      "name": "activate_pump",
      "description": "Activate a pump",
      "allowed_roles": ["chief", "engineer", "technician"],
      "effects": [
        { "type": "set_entity", "target": "pump_a.status", "value": "on" },
        { "type": "add_log", "message": "Pump A activated" }
      ]
    }
  ],
  "rules": [
    {
      "trigger": "tick",
      "frequency": 1,
      "condition": "power > 80",
      "effects": [
        { "type": "modify_var", "target": "temperature", "operation": "add", "value": 5 }
      ]
    },
    {
      "trigger": "tick",
      "frequency": 1,
      "condition": "temperature > 500",
      "effects": [
        { "type": "modify_var", "target": "radiation", "operation": "add", "value": 1 },
        { "type": "add_log", "message": "WARNING: High temperature detected!" }
      ]
    }
  ],
  "random_events": [
    {
      "name": "pump_failure",
      "description": "Pump A has failed",
      "probability": 0.05,
      "cooldown": 300,
      "effects": [
        { "type": "set_entity", "target": "pump_a.status", "value": "off" },
        { "type": "add_log", "message": "CRITICAL: Pump A failure detected!" }
      ]
    }
  ],
  "ui": {
    "panels": [
      {
        "id": "overview",
        "title": "⚛ REACTOR STATUS",
        "layout": { "x": 0, "y": 0, "w": 6, "h": 8, "minW": 3, "minH": 4, "maxW": 8, "maxH": 12 },
        "widgets": [
          {
            "type": "bar",
            "title": "Power Level",
            "config": { "target": "power", "min": 0, "max": 100, "unit": "MW" },
            "bindings": { "vars": ["power"] }
          },
          {
            "type": "bar",
            "title": "Temperature",
            "config": { "target": "temperature", "min": 0, "max": 1000, "unit": "°C" },
            "bindings": { "vars": ["temperature"] }
          }
        ],
        "visible": true,
        "resizable": true,
        "draggable": true
      }
    ],
    "layout": { "type": "grid", "gridSize": 12, "maxPanels": 8 }
  }
}
```

This example demonstrates all the key concepts of the game engine and provides a complete, playable game that players can use to learn the system.
