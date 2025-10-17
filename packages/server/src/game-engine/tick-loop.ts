import { GameStateManager } from './state-manager.js';
import { GameModel, ActionEffect } from './types.js';
import { evaluateCondition } from './condition-evaluator.js';

export class TickLoop {
  private stateManager: GameStateManager;
  private gameModel: GameModel;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private tickCallbacks: ((tick: number, state: any) => void)[] = [];
  private errorCallbacks: ((error: Error) => void)[] = [];

  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
    this.gameModel = stateManager.getGameModel();
  }

  /**
   * Start the tick loop
   */
  start(intervalMs: number = 1000): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.stateManager.setStatus('running');
    
    this.intervalId = setInterval(() => {
      this.executeTick();
    }, intervalMs);

    console.log(`🎮 Tick loop started with ${intervalMs}ms interval`);
  }

  /**
   * Stop the tick loop
   */
  stop(): void {
    if (!this.isRunning || !this.intervalId) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
    this.stateManager.setStatus('paused');

    console.log('⏸️ Tick loop stopped');
  }

  /**
   * Pause the tick loop
   */
  pause(): void {
    this.stop();
    this.stateManager.setStatus('paused');
  }

  /**
   * Resume the tick loop
   */
  resume(intervalMs: number = 1000): void {
    this.start(intervalMs);
  }

  /**
   * Execute a single tick
   */
  executeTick(): void {
    try {
      const currentTick = this.stateManager.getState().tick;
      
      // Process tick-based rules
      this.processTickRules(currentTick);
      
      // Process random events
      this.processRandomEvents();
      
      // Increment tick counter
      this.stateManager.incrementTick();
      
      // Notify callbacks
      this.notifyTickCallbacks(currentTick + 1, this.stateManager.getState());
      
    } catch (error) {
      console.error('❌ Error in tick execution:', error);
      this.notifyErrorCallbacks(error as Error);
    }
  }

  /**
   * Process rules that trigger on tick
   */
  private processTickRules(currentTick: number): void {
    const tickRules = this.gameModel.rules.filter(rule => rule.trigger === 'tick');
    
    for (const rule of tickRules) {
      // Check frequency (run every N ticks)
      if (rule.frequency && currentTick % rule.frequency !== 0) {
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
    if (!this.gameModel.random_events) {
      return;
    }

    for (const event of this.gameModel.random_events) {
      // Check if event should trigger
      if (Math.random() > event.probability) {
        continue;
      }

      // Check conditions if specified
      if (event.conditions) {
        const allConditionsMet = event.conditions.every(condition => 
          this.stateManager.checkCondition(condition)
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
          // This could trigger other events or callbacks
          console.log(`🔔 Event triggered: ${effect.target || 'unknown'}`);
          break;
          
        case 'message':
          // This could be logged or sent to players
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
      // Call error callbacks
      this.errorCallbacks.forEach(callback => {
        try {
          callback(error instanceof Error ? error : new Error(String(error)));
        } catch (callbackError) {
          console.error('Error in error callback:', callbackError);
        }
      });
    }
  }

  /**
   * Add a callback to be called on each tick
   */
  onTick(callback: (tick: number, state: any) => void): void {
    this.tickCallbacks.push(callback);
  }

  /**
   * Remove a tick callback
   */
  removeTickCallback(callback: (tick: number, state: any) => void): void {
    const index = this.tickCallbacks.indexOf(callback);
    if (index !== -1) {
      this.tickCallbacks.splice(index, 1);
    }
  }

  /**
   * Add an error callback
   */
  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Remove an error callback
   */
  removeErrorCallback(callback: (error: Error) => void): void {
    const index = this.errorCallbacks.indexOf(callback);
    if (index !== -1) {
      this.errorCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify all tick callbacks
   */
  private notifyTickCallbacks(tick: number, state: any): void {
    for (const callback of this.tickCallbacks) {
      try {
        callback(tick, state);
      } catch (error) {
        console.error('❌ Error in tick callback:', error);
        this.notifyErrorCallbacks(error as Error);
      }
    }
  }

  /**
   * Notify all error callbacks
   */
  private notifyErrorCallbacks(error: Error): void {
    for (const callback of this.errorCallbacks) {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('❌ Error in error callback:', callbackError);
      }
    }
  }

  /**
   * Get current tick
   */
  getCurrentTick(): number {
    return this.stateManager.getState().tick;
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
  } {
    return {
      running: this.isRunning,
      currentTick: this.getCurrentTick(),
      gameStatus: this.stateManager.getState().status
    };
  }

  /**
   * Force execute a tick (for testing or manual control)
   */
  forceTick(): void {
    this.executeTick();
  }

  /**
   * Set tick interval (restart if running)
   */
  setTickInterval(intervalMs: number): void {
    if (this.isRunning) {
      this.stop();
      this.start(intervalMs);
    }
  }

  /**
   * Get tick statistics
   */
  getTickStats(): {
    currentTick: number;
    isRunning: boolean;
    callbackCount: number;
    errorCallbackCount: number;
  } {
    return {
      currentTick: this.getCurrentTick(),
      isRunning: this.isRunning,
      callbackCount: this.tickCallbacks.length,
      errorCallbackCount: this.errorCallbacks.length
    };
  }

  /**
   * Check if operation is valid for modifyVariable
   */
  private isValidOperation(operation: string): operation is 'add' | 'subtract' | 'multiply' | 'divide' {
    return ['add', 'subtract', 'multiply', 'divide'].includes(operation);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.tickCallbacks = [];
    this.errorCallbacks = [];
  }
}
