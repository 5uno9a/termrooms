import { GameStateManager } from './state-manager.js';
import { GameModel, ActionEffect, GameState } from './types.js';
import { evaluateCondition } from './condition-evaluator.js';

/**
 * Fixed timestep tick loop implementation for responsive game updates
 * Based on the "Fix Your Timestep!" approach by Glenn Fiedler
 */
export class GameTickLoop {
  private stateManager: GameStateManager;
  private gameModel: GameModel;
  private timeoutId: NodeJS.Timeout | null = null;
  private fixedTimestep: number = 16; // 16ms = ~60 FPS
  private maxTimestep: number = 50; // Cap at 50ms to prevent spiral of death
  private accumulator: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private tickCallbacks: ((tick: number, state: GameState) => void)[] = [];
  private errorCallbacks: ((error: Error) => void)[] = [];
  private currentTick: number = 0;

  constructor(stateManager: GameStateManager, gameModel: GameModel, fixedTimestep: number = 16) {
    this.stateManager = stateManager;
    this.gameModel = gameModel;
    this.fixedTimestep = fixedTimestep;
  }

  /**
   * Start the fixed timestep tick loop
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.accumulator = 0;
    this.lastTime = performance.now();
    this.stateManager.setStatus('running');
    
    console.log(`🎮 Fixed timestep tick loop started (${this.fixedTimestep}ms timestep)`);
    
    this.tick();
  }

  /**
   * Stop the tick loop
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.stateManager.setStatus('paused');
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    console.log('⏸️ Fixed timestep tick loop stopped');
  }

  /**
   * Pause the tick loop
   */
  pause(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.stateManager.setStatus('paused');
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    console.log('⏸️ Fixed timestep tick loop paused');
  }

  /**
   * Resume the tick loop
   */
  resume(): void {
    if (this.isRunning) {
      return;
    }

    this.start();
  }

  /**
   * Main tick loop using requestAnimationFrame
   */
  private tick(): void {
    if (!this.isRunning) {
      return;
    }

    const currentTime = performance.now();
    let frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap frame time to prevent spiral of death
    if (frameTime > this.maxTimestep) {
      frameTime = this.maxTimestep;
    }

    this.accumulator += frameTime;

    // Process fixed timestep updates
    while (this.accumulator >= this.fixedTimestep) {
      this.executeTick();
      this.accumulator -= this.fixedTimestep;
    }

    // Continue the loop with setTimeout for Node.js compatibility
    this.timeoutId = setTimeout(() => this.tick(), 1);
  }

  /**
   * Execute a single tick
   */
  private executeTick(): void {
    try {
      this.currentTick++;
      this.stateManager.incrementTick();
      
      // Process tick rules
      this.processTickRules();
      
      // Process random events
      this.processRandomEvents();
      
      // Notify callbacks
      this.notifyTickCallbacks();
      
    } catch (error) {
      console.error('❌ Error in tick execution:', error);
      this.notifyErrorCallbacks(error as Error);
    }
  }

  /**
   * Process tick-based rules
   */
  private processTickRules(): void {
    const tickRules = this.gameModel.rules.filter(rule => rule.trigger === 'tick');
    
    for (const rule of tickRules) {
      // Check frequency (run every N ticks)
      if (rule.frequency && this.currentTick % rule.frequency !== 0) {
        continue;
      }

      // Check condition if specified
      if (rule.condition && !evaluateCondition(rule.condition, this.stateManager.getState())) {
        continue;
      }

      // Execute rule effects
      this.executeEffects(rule.effects);
    }
  }

  /**
   * Process random events
   */
  private processRandomEvents(): void {
    // Don't process random events if reactor is in emergency shutdown
    const reactorEntity = this.stateManager.getEntity('reactor');
    if (reactorEntity && reactorEntity.emergency_shutdown) {
      return;
    }

    for (const event of this.gameModel.random_events || []) {
      // Check if event should trigger
      if (Math.random() > event.probability) {
        continue;
      }

      // Check conditions if specified
      if (event.conditions) {
        const allConditionsMet = event.conditions.every(condition => 
          evaluateCondition(condition, this.stateManager.getState())
        );
        if (!allConditionsMet) {
          continue;
        }
      }

      // Execute event effects
      console.log(`🎲 Random event triggered: ${event.name}`);
      this.executeEffects(event.effects);
    }
  }

  /**
   * Execute a list of effects
   */
  private executeEffects(effects: ActionEffect[]): void {
    for (const effect of effects) {
      this.executeEffect(effect);
    }
  }

  /**
   * Execute a single effect
   */
  private executeEffect(effect: ActionEffect): void {
    try {
      switch (effect.type) {
        case 'set_var':
          if (effect.target) {
            this.stateManager.setVariable(effect.target, effect.value);
          }
          break;
          
        case 'modify_var':
          if (effect.target && effect.operation && this.isValidOperation(effect.operation)) {
            this.stateManager.modifyVariable(effect.target, effect.operation, effect.value);
          }
          break;
          
        case 'set_entity':
          if (effect.target && effect.value && typeof effect.value === 'object') {
            for (const [key, value] of Object.entries(effect.value)) {
              this.stateManager.setEntityProperty(effect.target, key, value);
            }
          }
          break;
          
        case 'trigger_event':
          console.log(`🔔 Event triggered: ${effect.target || 'unknown'}`);
          break;
          
        case 'message':
          if (effect.message) {
            console.log(`💬 Game message: ${effect.message}`);
          }
          break;
          
        case 'add_log':
          if (effect.message) {
            this.stateManager.addLog(effect.message);
          }
          break;
          
        case 'add_event':
          if (effect.eventType && effect.message) {
            this.stateManager.addEvent({
              type: effect.eventType,
              message: effect.message,
              timestamp: new Date().toISOString()
            });
          }
          break;
          
        case 'update_score':
          if (effect.playerId && typeof effect.value === 'number') {
            this.stateManager.updateScore(effect.playerId, effect.value);
          }
          break;
          
        default:
          console.warn(`⚠️ Unknown effect type: ${effect.type}`);
      }
    } catch (error) {
      console.error(`❌ Error executing effect ${effect.type}:`, error);
    }
  }

  /**
   * Check if operation is valid for modifyVariable
   */
  private isValidOperation(operation: string): operation is 'add' | 'subtract' | 'multiply' | 'divide' {
    return ['add', 'subtract', 'multiply', 'divide'].includes(operation);
  }

  /**
   * Notify tick callbacks
   */
  private notifyTickCallbacks(): void {
    const state = this.stateManager.getState();
    this.tickCallbacks.forEach(callback => {
      try {
        callback(this.currentTick, state);
      } catch (error) {
        console.error('❌ Error in tick callback:', error);
        this.notifyErrorCallbacks(error as Error);
      }
    });
  }

  /**
   * Notify error callbacks
   */
  private notifyErrorCallbacks(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('❌ Error in error callback:', callbackError);
      }
    });
  }

  /**
   * Add a callback to be called on each tick
   */
  onTick(callback: (tick: number, state: GameState) => void): void {
    this.tickCallbacks.push(callback);
  }

  /**
   * Add an error callback
   */
  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Remove a tick callback
   */
  removeTickCallback(callback: (tick: number, state: GameState) => void): void {
    const index = this.tickCallbacks.indexOf(callback);
    if (index > -1) {
      this.tickCallbacks.splice(index, 1);
    }
  }

  /**
   * Remove an error callback
   */
  removeErrorCallback(callback: (error: Error) => void): void {
    const index = this.errorCallbacks.indexOf(callback);
    if (index > -1) {
      this.errorCallbacks.splice(index, 1);
    }
  }

  /**
   * Get current tick count
   */
  getCurrentTick(): number {
    return this.currentTick;
  }

  /**
   * Check if tick loop is running
   */
  isTickLoopRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get tick loop status
   */
  getStatus(): {
    running: boolean;
    currentTick: number;
    gameStatus: string;
    timestep: number;
    fps: number;
  } {
    return {
      running: this.isRunning,
      currentTick: this.currentTick,
      gameStatus: this.stateManager.getState().status,
      timestep: this.fixedTimestep,
      fps: Math.round(1000 / this.fixedTimestep)
    };
  }

  /**
   * Get current status as string
   */
  getStatusString(): string {
    return this.isRunning ? 'running' : 'stopped';
  }

  /**
   * Get tick statistics
   */
  getTickStats(): {
    currentTick: number;
    isRunning: boolean;
    callbackCount: number;
    errorCallbackCount: number;
    timestep: number;
    fps: number;
  } {
    return {
      currentTick: this.currentTick,
      isRunning: this.isRunning,
      callbackCount: this.tickCallbacks.length,
      errorCallbackCount: this.errorCallbacks.length,
      timestep: this.fixedTimestep,
      fps: Math.round(1000 / this.fixedTimestep)
    };
  }

  /**
   * Set the fixed timestep
   */
  setFixedTimestep(timestepMs: number): void {
    this.fixedTimestep = Math.max(1, Math.min(100, timestepMs)); // Clamp between 1ms and 100ms
  }

  /**
   * Force execute a tick (for testing)
   */
  forceTick(): void {
    this.executeTick();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.tickCallbacks = [];
    this.errorCallbacks = [];
    this.currentTick = 0;
  }
}
