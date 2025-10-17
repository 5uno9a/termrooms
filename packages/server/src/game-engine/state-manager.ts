import { GameModel, GameState, Player, ActionExecution, GameEvent } from './types.js';

export class GameStateManager {
  private state: GameState;
  private gameModel: GameModel;
  private actionHistory: ActionExecution[] = [];
  private lastTickTime: number = 0;
  private tickInterval: number = 1000; // 1 second default

  constructor(gameModel: GameModel, initialState?: Partial<GameState>) {
    this.gameModel = gameModel;
    this.state = this.initializeState(initialState);
  }

  /**
   * Initialize game state from model and optional initial state
   */
  private initializeState(initialState?: Partial<GameState>): GameState {
    const now = Date.now();
    
    // Initialize variables from model
    const vars: Record<string, number> = {};
    for (const [key, variable] of Object.entries(this.gameModel.vars)) {
      vars[key] = variable.value;
    }

    // Initialize entities from model
    const entities: Record<string, any> = {};
    for (const [key, entity] of Object.entries(this.gameModel.entities)) {
      entities[key] = { ...entity };
    }

    // Apply random initialization if specified
    if (this.gameModel.init_random) {
      this.applyRandomInitialization(vars, entities);
    }

    return {
      vars: initialState?.vars || vars,
      entities: initialState?.entities || entities,
      players: initialState?.players || {},
      events: initialState?.events || [],
      logs: initialState?.logs || [],
      tick: initialState?.tick || 0,
      status: initialState?.status || 'waiting',
      winner: initialState?.winner,
      score: initialState?.score || {},
      lastAction: initialState?.lastAction,
      lastActionTime: initialState?.lastActionTime || now
    };
  }

  /**
   * Apply random initialization to variables and entities
   */
  private applyRandomInitialization(vars: Record<string, number>, entities: Record<string, any>): void {
    if (this.gameModel.init_random?.vars) {
      for (const [key, range] of Object.entries(this.gameModel.init_random.vars)) {
        if (this.gameModel.vars[key]) {
          const min = range.min;
          const max = range.max;
          vars[key] = Math.random() * (max - min) + min;
        }
      }
    }

    if (this.gameModel.init_random?.entities) {
      for (const [key, randomProps] of Object.entries(this.gameModel.init_random.entities)) {
        if (entities[key]) {
          entities[key] = { ...entities[key], ...randomProps };
        }
      }
    }
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get current game state (mutable reference for internal use)
   */
  getMutableState(): GameState {
    return this.state;
  }

  /**
   * Update game state
   */
  updateState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Add a player to the game
   */
  addPlayer(player: Omit<Player, 'id'>): Player {
    const newPlayer: Player = {
      id: this.generatePlayerId(),
      ...player,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      actions: []
    };

    this.state.players[newPlayer.id] = newPlayer;
    return newPlayer;
  }

  /**
   * Remove a player from the game
   */
  removePlayer(playerId: string): boolean {
    if (this.state.players[playerId]) {
      delete this.state.players[playerId];
      return true;
    }
    return false;
  }

  /**
   * Update player information
   */
  updatePlayer(playerId: string, updates: Partial<Player>): boolean {
    const player = this.state.players[playerId];
    if (player) {
      Object.assign(player, updates);
      player.lastSeen = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Get a player by ID
   */
  getPlayer(playerId: string): Player | undefined {
    return this.state.players[playerId];
  }

  /**
   * Set a variable value
   */
  setVariable(name: string, value: number | null | undefined): boolean {
    if (this.gameModel.vars[name]) {
      const variable = this.gameModel.vars[name];
      
      // Handle null, undefined, NaN and Infinity values
      let processedValue = value;
      if (value === null || value === undefined || isNaN(value as number)) {
        processedValue = variable.value; // Default to initial value for invalid values
      } else if (value === Infinity) {
        processedValue = variable.max;
      } else if (value === -Infinity) {
        processedValue = variable.min;
      }
      
      // Clamp value to min/max range
      const clampedValue = Math.max(variable.min, Math.min(variable.max, processedValue as number));
      this.state.vars[name] = clampedValue;
      return true;
    }
    return false;
  }

  /**
   * Modify a variable value
   */
  modifyVariable(name: string, operation: 'add' | 'subtract' | 'multiply' | 'divide', value: number): boolean {
    if (this.gameModel.vars[name]) {
      const currentValue = this.state.vars[name] || 0;
      let newValue: number;

      switch (operation) {
        case 'add':
          newValue = currentValue + value;
          break;
        case 'subtract':
          newValue = currentValue - value;
          break;
        case 'multiply':
          newValue = currentValue * value;
          break;
        case 'divide':
          newValue = value !== 0 ? currentValue / value : currentValue;
          break;
        default:
          return false;
      }

      return this.setVariable(name, newValue);
    }
    return false;
  }

  /**
   * Get a variable value
   */
  getVariable(name: string): number | undefined {
    return this.state.vars[name];
  }

  /**
   * Set an entity property
   */
  setEntityProperty(entityName: string, property: string, value: any): boolean {
    // Create entity if it doesn't exist
    if (!this.state.entities[entityName]) {
      this.state.entities[entityName] = {};
    }
    
    this.state.entities[entityName][property] = value;
    return true;
  }

  /**
   * Get an entity
   */
  getEntity(entityName: string): any {
    return this.state.entities[entityName];
  }

  /**
   * Set game status
   */
  setStatus(status: GameState['status']): void {
    this.state.status = status;
    
    if (status === 'running' && this.state.status !== 'running') {
      this.lastTickTime = Date.now();
    }
  }

  /**
   * Start the game
   */
  startGame(): void {
    this.setStatus('running');
    this.state.tick = 0;
  }

  /**
   * Pause the game
   */
  pauseGame(): void {
    this.setStatus('paused');
  }

  /**
   * Resume the game
   */
  resumeGame(): void {
    this.setStatus('running');
  }

  /**
   * End the game
   */
  endGame(winner?: string): void {
    this.setStatus('finished');
    if (winner) {
      this.state.winner = winner;
    }
  }

  /**
   * Increment game tick
   */
  incrementTick(): void {
    this.state.tick++;
    this.lastTickTime = Date.now();
  }

  /**
   * Check if it's time for the next tick
   */
  shouldTick(): boolean {
    if (this.state.status !== 'running') {
      return false;
    }
    
    const now = Date.now();
    return now - this.lastTickTime >= this.tickInterval;
  }

  /**
   * Set tick interval in milliseconds
   */
  setTickInterval(interval: number): void {
    this.tickInterval = interval;
  }

  /**
   * Record an action execution
   */
  recordAction(action: ActionExecution): void {
    this.actionHistory.push(action);
    this.state.lastAction = action.actionName;
    this.state.lastActionTime = action.timestamp;

    // Update player's action list
    const player = this.getPlayer(action.playerId);
    if (player) {
      player.actions.push(action.actionName);
    }
  }

  /**
   * Get action history
   */
  getActionHistory(): ActionExecution[] {
    return [...this.actionHistory];
  }

  /**
   * Get recent actions (last N actions)
   */
  getRecentActions(count: number = 10): ActionExecution[] {
    return this.actionHistory.slice(-count);
  }

  /**
   * Clear action history
   */
  clearActionHistory(): void {
    this.actionHistory = [];
  }

  /**
   * Update player score
   */
  updateScore(playerId: string, score: number): void {
    if (!this.state.score) {
      this.state.score = {};
    }
    this.state.score[playerId] = score;
  }

  /**
   * Get player score
   */
  getScore(playerId: string): number {
    return this.state.score?.[playerId] || 0;
  }

  /**
   * Get all scores
   */
  getScores(): Record<string, number> {
    return { ...(this.state.score || {}) };
  }

  /**
   * Get entity property value
   */
  getEntityProperty(entityName: string, propertyName: string): any {
    const entity = this.state.entities[entityName];
    return entity ? entity[propertyName] : undefined;
  }

  /**
   * Get all logs
   */
  getLogs(): string[] {
    return [...this.state.logs];
  }

  /**
   * Get all events
   */
  getEvents(): GameEvent[] {
    return [...this.state.events];
  }

  /**
   * Add a log message
   */
  addLog(message: string): void {
    this.state.logs.push(message);
  }

  /**
   * Add a game event
   */
  addEvent(event: GameEvent): void {
    this.state.events.push(event);
  }

  /**
   * Reset game state to initial state
   */
  reset(): void {
    this.state = this.initializeState();
    this.actionHistory = [];
    this.lastTickTime = 0;
  }

  /**
   * Generate a unique player ID
   */
  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get game model
   */
  getGameModel(): GameModel {
    return this.gameModel;
  }

  /**
   * Check if a condition is met
   */
  checkCondition(condition: string): boolean {
    // Simple condition evaluation
    // This could be expanded to support more complex expressions
    try {
      // Replace variable names with their values
      let expression = condition;
      for (const [name, value] of Object.entries(this.state.vars)) {
        expression = expression.replace(new RegExp(`\\b${name}\\b`, 'g'), value.toString());
      }

      // Evaluate the expression
      // Note: In a real implementation, you'd want a safer expression evaluator
      return eval(expression) === true;
    } catch {
      return false;
    }
  }

  /**
   * Get state summary for debugging
   */
  getStateSummary(): any {
    return {
      status: this.state.status,
      tick: this.state.tick,
      playerCount: Object.keys(this.state.players).length,
      variableCount: Object.keys(this.state.vars).length,
      entityCount: Object.keys(this.state.entities).length,
      actionCount: this.actionHistory.length,
      lastAction: this.state.lastAction,
      lastActionTime: this.state.lastActionTime
    };
  }
}
