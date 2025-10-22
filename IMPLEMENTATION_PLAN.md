# Visualization System Implementation Plan

## Scope Limitation Decision

**DECISION**: Focus on core game functionality first, push ALL widget rendering to post-launch expansion phase.

**RATIONALE**: 
- Core game functionality is more important than visual widgets
- Widgets are nice-to-have features that can be added later
- Focus on MVP: game rooms, multiplayer, game library, basic UI
- Reduces complexity and gets to working product faster

**CURRENT FOCUS (Phase 1)**:
- Game Engine (✅ 207 tests passing)
- Frontend UI (✅ all pages working)
- Game Library (✅ PowerGrid, ReactorSim)
- Dev Sandbox (✅ JSON editor, schematic tools)
- Multiplayer infrastructure
- Game Room functionality
- WebSocket integration
- Game state synchronization

**MOVED TO EXPANSION (Phase 3)**:
- Bar Widget (EASY) - Progress bars and gauges
- Log Widget (EASY) - Event logs and messages
- Schematic Widget (MEDIUM) - ASCII/Unicode diagrams
- Grid Widget (MEDIUM) - Data tables and lists
- Terminal Widget (HARD) - Interactive command line
- Checklist Widget (HARD) - Dynamic task management

## Implementation Phases

### Phase 1: Core Game Functionality (CURRENT FOCUS)
**Complexity**: EASY-MEDIUM
**Estimated Effort**: 2-3 development sessions
**Status**: In Progress

#### 1.1 Game Engine Integration
- ✅ Game Engine (207 tests passing)
- ✅ Frontend UI (all pages working)
- 🔄 WebSocket integration for real-time updates
- 🔄 Game state synchronization between client/server

#### 1.2 Game Room Functionality
- 🔄 Create/Join/Leave room functionality
- 🔄 Player management and synchronization
- 🔄 Game instance management
- 🔄 Real-time game state updates

#### 1.3 Game Library Management
- ✅ PowerGrid and ReactorSim games
- ✅ Dev Sandbox with JSON editor
- 🔄 Game publishing workflow
- 🔄 Public/private game management

#### 1.4 Basic UI Polish
- ✅ Responsive design
- ✅ Accessibility standards
- ✅ Consistent styling
- 🔄 Error handling and loading states

### Phase 2: Multiplayer Features
**Complexity**: MEDIUM
**Estimated Effort**: 2-3 development sessions
**Status**: Not Started

#### 2.1 Real-time Synchronization
- WebSocket connection management
- Game state broadcasting
- Player action synchronization
- Conflict resolution

#### 2.2 Room Management
- Room creation and joining
- Player limits and permissions
- Room persistence
- Spectator mode

#### 2.3 Game Controls
- Action queuing system
- Turn-based vs real-time modes
- Input validation
- Action history

### Phase 3: Widget Rendering System (EXPANSION)
**Complexity**: EASY-MEDIUM
**Estimated Effort**: 3-4 development sessions
**Status**: Future

#### 3.1 Basic Widgets
- Bar Widget (progress bars, gauges)
- Log Widget (event logs, messages)
- Grid Widget (data tables, lists)

#### 3.2 Advanced Widgets
- Schematic Widget (ASCII/Unicode diagrams)
- Terminal Widget (interactive command line)
- Checklist Widget (dynamic task management)

#### 3.3 Visualization System
- Widget Registry and State Binding
- Panel Rendering System
- Template System
- Real-time Visual Updates

## Technical Architecture

### Widget Registry Pattern
```typescript
interface WidgetRenderer {
  render(widget: Widget, gameState: GameState): string;
  validate(config: WidgetConfig): boolean;
}

class WidgetRegistry {
  private renderers = new Map<string, WidgetRenderer>();
  
  register(type: string, renderer: WidgetRenderer): void;
  render(widget: Widget, gameState: GameState): string;
  validate(widget: Widget): boolean;
}
```

### State Binding System
```typescript
class StateBinder {
  static getValue(gameState: GameState, path: string): any;
  static bindVariables(widget: Widget, gameState: GameState): any;
  static resolveEntityProperty(gameState: GameState, entityPath: string): any;
}
```

### Widget Renderer Interface
```typescript
abstract class BaseWidgetRenderer implements WidgetRenderer {
  abstract render(widget: Widget, gameState: GameState): string;
  abstract validate(config: WidgetConfig): boolean;
  
  protected getValue(gameState: GameState, path: string): any;
  protected formatValue(value: any, format?: string): string;
}
```

## File Structure

### New Files to Create
```
packages/client/src/
├── visualization/
│   ├── WidgetRegistry.ts
│   ├── StateBinder.ts
│   ├── renderers/
│   │   ├── BaseWidgetRenderer.ts
│   │   ├── BarWidgetRenderer.ts
│   │   ├── LogWidgetRenderer.ts
│   │   ├── SchematicWidgetRenderer.ts
│   │   └── GridWidgetRenderer.ts
│   ├── templates/
│   │   ├── TemplateManager.ts
│   │   └── templates/
│   │       ├── reactor-power.json
│   │       ├── coolant-flow.json
│   │       └── system-log.json
│   └── PanelRenderer.ts
```

### Frontend Integration Points

### Game Room Page Integration
The visualization system will be integrated into the Game Room page where players actually play games.

**Current State**: `packages/client/src/pages/GameRoomPage.tsx`
```typescript
// Current placeholder
<div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20 min-h-[500px] flex items-center justify-center">
  <div className="text-center">
    <p className="text-white text-opacity-60 mb-4">Game visualization will appear here</p>
  </div>
</div>
```

**After Integration**: Replace with actual game panels
```typescript
// New implementation with visualization system
<GameVisualization 
  gameModel={gameModel}
  gameState={gameState}
  onStateUpdate={handleStateUpdate}
/>
```

### Gridstack Component Integration
The existing Gridstack component will be enhanced to display actual game widgets.

**Current State**: `packages/client/src/components/ui/Gridstack.tsx`
- Only shows placeholder content
- No actual widget rendering

**After Integration**: 
```typescript
// Enhanced Gridstack with widget rendering
<GameGridstack
  panels={gamePanels}
  gameState={gameState}
  widgetRegistry={widgetRegistry}
  onPanelChange={handlePanelChange}
/>
```

### WebSocket Integration
Real-time updates will be handled through WebSocket connections.

**New Component**: `packages/client/src/services/GameWebSocket.ts`
```typescript
class GameWebSocket {
  connect(instanceId: string): void;
  onStateUpdate(callback: (state: GameState) => void): void;
  sendAction(action: GameAction): void;
  disconnect(): void;
}
```

### Game State Management
State will be managed using React hooks and context.

**New Context**: `packages/client/src/contexts/GameContext.tsx`
```typescript
interface GameContextType {
  gameState: GameState;
  gameModel: GameModel;
  updateState: (newState: GameState) => void;
  performAction: (action: GameAction) => void;
}
```

## Complete Frontend Flow

### 1. User Visits Game Room Page
```
User clicks "Game Room" → GameRoomPage loads → Shows placeholder content
```

### 2. Game Instance Creation
```
User clicks "Create Room" → WebSocket connects → Game instance created → Game model loaded
```

### 3. Visualization System Initialization
```
GameVisualization component mounts → WidgetRegistry initialized → Panels rendered with widgets
```

### 4. Real-time Updates
```
WebSocket receives state update → GameContext updates → Widgets re-render → User sees changes
```

### 5. User Interaction
```
User performs action → WebSocket sends action → Server processes → State updates → UI updates
```

## Frontend Component Hierarchy

```
App
├── Router
    └── Layout
        ├── Navigation
        └── Outlet (Page Components)
            └── GameRoomPage
                └── GameVisualization
                    ├── GameContext.Provider
                    ├── GameWebSocket
                    └── GameGridstack
                        └── GamePanel (for each panel)
                            └── Widget (for each widget)
                                ├── BarWidget
                                ├── LogWidget
                                ├── SchematicWidget
                                └── GridWidget
```

## Data Flow in Frontend

### 1. Initial Load
```
GameRoomPage → Load Game Model → Initialize Game State → Render Panels → Display Widgets
```

### 2. State Update
```
WebSocket Message → GameContext.updateState() → Widget Re-render → Visual Update
```

### 3. User Action
```
User Input → GameContext.performAction() → WebSocket.sendAction() → Server Processing
```

## Visual Output Examples

### Bar Widget in Browser
```
┌─────────────────────────────────┐
│ ⚛ REACTOR STATUS               │
├─────────────────────────────────┤
│ Power Level                     │
│ [████████░░] 75MW              │
│                                 │
│ Temperature                     │
│ [██████░░░░] 60°C              │
└─────────────────────────────────┘
```

### Schematic Widget in Browser
```
┌─────────────────────────────────┐
│ COOLANT FLOW                    │
├─────────────────────────────────┤
│     ⚛ Reactor Core             │
│     │ Power: 75MW              │
│     │ Temp: 60°C               │
│     │                          │
│     ────┼──── Coolant Loop     │
│     │    │                     │
│     ◉ ON     ◉ OFF             │
└─────────────────────────────────┘
```

### Log Widget in Browser
```
┌─────────────────────────────────┐
│ SYSTEM LOG                      │
├─────────────────────────────────┤
│ [12:34:56] Power increased      │
│ [12:35:01] Temperature rising   │
│ [12:35:15] Pump A activated     │
│ [12:35:30] Warning: High temp   │
└─────────────────────────────────┘
```

## Implementation Details

### Bar Widget Implementation
```typescript
class BarWidgetRenderer extends BaseWidgetRenderer {
  render(widget: Widget, gameState: GameState): string {
    const { target, min, max, unit } = widget.config;
    const value = this.getValue(gameState, `vars.${target}`);
    const percentage = ((value - min) / (max - min)) * 100;
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${value}${unit || ''}`;
  }
  
  validate(config: WidgetConfig): boolean {
    return config.target && 
           config.min !== undefined && 
           config.max !== undefined;
  }
}
```

### Schematic Widget Implementation
```typescript
class SchematicWidgetRenderer extends BaseWidgetRenderer {
  render(widget: Widget, gameState: GameState): string {
    const pattern = widget.config.pattern;
    const bindings = widget.config.bindings || {};
    
    let output = Array.isArray(pattern) ? pattern.join('\n') : pattern;
    
    Object.entries(bindings).forEach(([key, path]) => {
      const value = this.getValue(gameState, path);
      const regex = new RegExp(`{${key}}`, 'g');
      output = output.replace(regex, String(value));
    });
    
    return output;
  }
}
```

### State Binding Implementation
```typescript
class StateBinder {
  static getValue(gameState: GameState, path: string): any {
    const parts = path.split('.');
    let current = gameState;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  }
}
```

## Testing Strategy

### Unit Tests
- Test each widget renderer individually
- Mock game state for consistent testing
- Test error handling and edge cases
- Validate output format

### Integration Tests
- Test widget rendering with real game state
- Test panel rendering system
- Test real-time updates
- Test template system

### Visual Tests
- Screenshot comparisons for ASCII output
- Manual testing of different game states
- Cross-browser compatibility testing
- Performance testing with large datasets

## Success Criteria

### Phase 1 Complete
- [ ] Bar widget renders progress bars correctly
- [ ] Log widget displays events properly
- [ ] Widget registry manages renderers
- [ ] State binding resolves variables

### Phase 2 Complete
- [ ] Schematic widget renders ASCII art
- [ ] Grid widget displays tabular data
- [ ] All widgets handle missing data gracefully
- [ ] Template system loads pre-defined templates

### Phase 3 Complete
- [ ] Panel system displays widgets correctly
- [ ] Real-time updates work smoothly
- [ ] WebSocket integration functions
- [ ] Performance is acceptable

## Risk Mitigation

### Technical Risks
- **State Binding Complexity**: Start with simple variable access
- **Performance Issues**: Implement caching and optimization
- **WebSocket Integration**: Use proven Socket.IO library
- **Template Validation**: Add comprehensive error handling

### Scope Risks
- **Feature Creep**: Stick to defined scope
- **Over-Engineering**: Keep initial implementation simple
- **Timeline Pressure**: Focus on core functionality first

## Future Enhancements

### Phase 4 (Future)
- Terminal Widget implementation
- Checklist Widget implementation
- Advanced animations
- Custom widget types
- Performance optimizations

### Phase 5 (Future)
- Visual editor for ASCII art
- Template marketplace
- Advanced theming
- Export/import functionality

## Context Tracking

### Decision Log Updates
- Log all architectural decisions
- Document scope limitations
- Track implementation choices
- Record lessons learned

### Progress Tracking
- Update TODO list regularly
- Mark completed tasks
- Document blockers and solutions
- Track performance metrics

### Code Quality
- Maintain test coverage
- Follow coding standards
- Document complex logic
- Regular code reviews

This implementation plan provides a clear roadmap for building the visualization system while maintaining focus on achievable goals and avoiding over-engineering.
