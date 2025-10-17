// Game Engine Types
export interface GameModel {
  meta: {
    name: string;
    version: string;
    description: string;
    author: string;
    seed?: number;
    maxPlayers?: number;
  };
  vars: Record<string, Variable>;
  entities: Record<string, Entity>;
  actions: Action[];
  rules: Rule[];
  init_random?: RandomInit;
  random_events?: RandomEvent[];
  ui: {
    panels: PanelLayout[];
    layout: {
      type: 'grid' | 'vertical' | 'horizontal';
      gridSize: number;
      maxPanels: number;
    };
  };
}

export interface Variable {
  value: number;
  min: number;
  max: number;
  unit?: string;
  label?: string;
  description?: string;
}

export interface Entity {
  [key: string]: any;
}

export interface Action {
  name: string;
  description?: string;
  parameters?: ActionParameter[];
  effects: ActionEffect[];
  requirements?: ActionRequirement[];
  cooldown?: number;
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
  default?: any;
}

export interface ActionEffect {
  type: 'set_var' | 'modify_var' | 'set_entity' | 'trigger_event' | 'message' | 'update_score' | 'add_log' | 'add_event' | 'set_status';
  target?: string; // Optional for effects that don't need a target
  value?: any;
  operation?: 'set' | 'add' | 'subtract' | 'multiply' | 'divide';
  message?: string;
  playerId?: string; // For update_score effect
  eventType?: string; // For add_event effect
  status?: 'running' | 'paused' | 'ended' | 'waiting' | 'finished'; // For set_status effect
}

export interface ActionRequirement {
  type: 'var_range' | 'entity_state' | 'player_role' | 'cooldown';
  target: string;
  condition: string;
  value?: any;
}

export interface Rule {
  trigger: 'tick' | 'action' | 'event' | 'condition';
  condition?: string;
  effects: ActionEffect[];
  frequency?: number; // For tick rules, how often to run (every N ticks)
}

export interface RandomInit {
  vars?: Record<string, { min: number; max: number }>;
  entities?: Record<string, { [key: string]: any }>;
}

export interface RandomEvent {
  name: string;
  description: string;
  probability: number; // 0-1
  conditions?: string[];
  effects: ActionEffect[];
  cooldown?: number;
}

export interface PanelLayout {
  id: string;
  title: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW: number;
    minH: number;
    maxW: number;
    maxH: number;
  };
  widgets: Widget[];
  visible: boolean;
  resizable: boolean;
  draggable: boolean;
}

export interface Widget {
  id: string;
  title: string;
  type: 'bar' | 'schematic' | 'log' | 'checklist' | 'terminal' | 'grid';
  config: WidgetConfig;
  bindings: {
    vars?: string[];
    entities?: string[];
    events?: string[];
  };
}

export interface WidgetConfig {
  [key: string]: any;
}

// Game State Types
export interface GameEvent {
  type: string;
  message: string;
  timestamp: string;
}

export interface GameState {
  vars: Record<string, number>;
  entities: Record<string, any>;
  players: Record<string, Player>;
  events: GameEvent[];
  logs: string[];
  tick: number;
  status: 'waiting' | 'running' | 'paused' | 'finished';
  winner?: string;
  score?: Record<string, number>;
  lastAction?: string;
  lastActionTime?: number;
}

export interface Player {
  id: string;
  alias: string;
  role: string;
  joinedAt: number;
  lastSeen: number;
  actions: string[];
  score?: number;
}

// Action Execution Types
export interface ActionExecution {
  actionName: string;
  parameters: Record<string, any>;
  playerId: string;
  timestamp: number;
  result?: any;
  success: boolean;
  error?: string;
}
