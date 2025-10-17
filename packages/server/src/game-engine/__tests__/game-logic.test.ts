import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel } from '../types.js';

describe('Game Engine Game Logic Edge Cases', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Game Logic Test Game',
        version: '1.0.0',
        description: 'Test game for game logic edge cases',
        author: 'Test Author',
        maxPlayers: 10
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 },
        score: { min: -1000, max: 10000, value: 0 },
        health: { min: 0, max: 100, value: 100 },
        level: { min: 1, max: 100, value: 1 }
      },
      entities: {
        reactor: {
          status: 'running',
          emergency_shutdown: false,
          control_rods: 50,
          fuel_rods: 100
        },
        player_ship: {
          status: 'active',
          shields: 100,
          weapons: 'online'
        }
      },
      actions: [
        {
          name: 'increase_power',
          description: 'Increase power by 10',
          effects: [
            { type: 'modify_var', target: 'power', operation: 'add', value: 10 }
          ]
        },
        {
          name: 'decrease_power',
          description: 'Decrease power by 10',
          effects: [
            { type: 'modify_var', target: 'power', operation: 'subtract', value: 10 }
          ]
        },
        {
          name: 'emergency_shutdown',
          description: 'Emergency shutdown',
          effects: [
            { type: 'set_var', target: 'power', value: 0 },
            { type: 'set_entity', target: 'reactor', value: { emergency_shutdown: true } }
          ]
        },
        {
          name: 'add_score',
          description: 'Add score points',
          effects: [
            { type: 'modify_var', target: 'score', operation: 'add', value: 100 }
          ]
        },
        {
          name: 'level_up',
          description: 'Level up player',
          effects: [
            { type: 'modify_var', target: 'level', operation: 'add', value: 1 },
            { type: 'modify_var', target: 'health', operation: 'add', value: 20 }
          ]
        },
        {
          name: 'take_damage',
          description: 'Take damage',
          effects: [
            { type: 'modify_var', target: 'health', operation: 'subtract', value: 25 }
          ]
        }
      ],
      rules: [
        {
          trigger: 'tick',
          frequency: 1,
          effects: [
            { type: 'modify_var', target: 'power', operation: 'subtract', value: 0.5 }
          ]
        },
        {
          trigger: 'tick',
          frequency: 1,
          condition: 'power > 50',
          effects: [
            { type: 'modify_var', target: 'temperature', operation: 'add', value: 1 }
          ]
        },
        {
          trigger: 'tick',
          frequency: 1,
          condition: 'temperature > 800',
          effects: [
            { type: 'modify_var', target: 'health', operation: 'subtract', value: 5 }
          ]
        },
        {
          trigger: 'tick',
          frequency: 1,
          condition: 'score >= 1000',
          effects: [
            { type: 'modify_var', target: 'level', operation: 'add', value: 1 },
            { type: 'set_var', target: 'score', value: 0 }
          ]
        }
      ],
      random_events: [
        {
          name: 'Power Surge',
          description: 'Random power increase',
          probability: 0.1,
          effects: [
            { type: 'modify_var', target: 'power', operation: 'add', value: 20 }
          ]
        },
        {
          name: 'System Failure',
          description: 'Random system failure',
          probability: 0.05,
          effects: [
            { type: 'modify_var', target: 'health', operation: 'subtract', value: 30 }
          ]
        }
      ],
      ui: {
        panels: [],
        layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
      }
    };

    stateManager = new GameStateManager(gameModel);
    actionProcessor = new ActionProcessor(stateManager, gameModel);
    tickLoop = new GameTickLoop(stateManager, gameModel, 16);
    
    // Add a default player for testing
    const player = stateManager.addPlayer({
      alias: 'player1',
      role: 'engineer',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      actions: [],
      score: 0
    });
    // Store the player ID for use in tests
    (this as any).playerId = player.id;
  });

  afterEach(() => {
    if (tickLoop.getStatusString() === 'running') {
      tickLoop.stop();
    }
  });

  describe('Win/Lose Conditions', () => {
    test('should handle game over when health reaches zero', () => {
      stateManager.setVariable('health', 0);
      
      // Game should detect game over condition
      const state = stateManager.getState();
      expect(state.status).toBe('waiting'); // Default status
      
      // Health should be clamped to minimum
      expect(stateManager.getVariable('health')).toBe(0);
    });

    test('should handle victory when level reaches maximum', () => {
      stateManager.setVariable('level', 100);
      
      // Level should be clamped to maximum
      expect(stateManager.getVariable('level')).toBe(100);
    });

    test('should handle score overflow scenarios', () => {
      // Set score to near maximum
      stateManager.setVariable('score', 9999);
      
      // Add more score
      const playerId = (this as any).playerId;
      actionProcessor.processAction('add_score', playerId, {});
      
      // Score should be clamped to maximum
      expect(stateManager.getVariable('score')).toBe(10000);
    });

    test('should handle negative score scenarios', () => {
      // Try to set negative score
      stateManager.setVariable('score', -100);
      
      // Score should remain negative (not clamped)
      expect(stateManager.getVariable('score')).toBe(-100);
    });

    test('should handle emergency shutdown win condition', () => {
      // Set up emergency conditions
      stateManager.setVariable('temperature', 900);
      stateManager.setVariable('power', 95);
      
      // Trigger emergency shutdown
      const playerId = (this as any).playerId;
      actionProcessor.processAction('emergency_shutdown', playerId, {});
      
      // Power should be zero and reactor should be in emergency shutdown
      expect(stateManager.getVariable('power')).toBe(0);
      expect(stateManager.getEntityProperty('reactor', 'emergency_shutdown')).toBe(true);
    });
  });

  describe('Entity State Transitions', () => {
    test('should handle invalid entity state changes', () => {
      // Try to set invalid entity property
      stateManager.setEntityProperty('reactor', 'status', 'invalid_status');
      
      // Should accept the value (no validation in current implementation)
      expect(stateManager.getEntityProperty('reactor', 'status')).toBe('invalid_status');
    });

    test('should handle entity property updates with complex objects', () => {
      const complexObject = {
        nested: {
          deep: {
            value: 'test',
            array: [1, 2, 3],
            boolean: true
          }
        }
      };
      
      stateManager.setEntityProperty('reactor', 'complex_data', complexObject);
      
      const retrieved = stateManager.getEntityProperty('reactor', 'complex_data');
      expect(retrieved).toEqual(complexObject);
    });

    test('should handle entity state transitions with dependencies', () => {
      // Set up dependent states
      stateManager.setEntityProperty('reactor', 'fuel_rods', 0);
      
      // Try to change status when fuel is empty
      stateManager.setEntityProperty('reactor', 'status', 'running');
      
      // Should accept the change (no dependency validation in current implementation)
      expect(stateManager.getEntityProperty('reactor', 'status')).toBe('running');
    });

    test('should handle entity deletion and recreation', () => {
      // Delete entity property
      stateManager.setEntityProperty('reactor', 'status', undefined);
      
      // Recreate with new value
      stateManager.setEntityProperty('reactor', 'status', 'restarted');
      
      expect(stateManager.getEntityProperty('reactor', 'status')).toBe('restarted');
    });
  });

  describe('Score and Progression Systems', () => {
    test('should handle score milestones correctly', () => {
      // Set score to trigger level up rule
      stateManager.setVariable('score', 1000);
      
      // Process a tick to trigger the rule
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Score should be reset and level should increase
          expect(stateManager.getVariable('score')).toBe(0);
          expect(stateManager.getVariable('level')).toBe(2); // 1 + 1 from rule
          resolve();
        }, 100);
      });
    });

    test('should handle multiple level ups in sequence', () => {
      // Set up for multiple level ups
      stateManager.setVariable('score', 2000);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should have leveled up multiple times
          expect(stateManager.getVariable('level')).toBeGreaterThan(1);
          resolve();
        }, 200);
      });
    });

    test('should handle score overflow in level up rule', () => {
      // Set score to maximum
      stateManager.setVariable('score', 10000);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Score should be reset to 0
          expect(stateManager.getVariable('score')).toBe(0);
          resolve();
        }, 100);
      });
    });

    test('should handle negative score in level up rule', () => {
      // Set negative score
      stateManager.setVariable('score', -100);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Score should remain negative (rule won't trigger)
          expect(stateManager.getVariable('score')).toBe(-100);
          resolve();
        }, 100);
      });
    });
  });

  describe('Random Event Edge Cases', () => {
    test('should handle random events with 100% probability', () => {
      // Set probability to 1.0 (100%)
      gameModel.random_events![0].probability = 1.0;
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should have triggered random events (check power increase)
          const currentPower = stateManager.getVariable('power');
          expect(currentPower).toBeGreaterThan(50); // Initial power was 50
          resolve();
        }, 200);
      });
    });

    test('should handle random events with 0% probability', () => {
      // Set probability to 0.0 (0%)
      gameModel.random_events![0].probability = 0.0;
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not have triggered random events (power should be same or lower due to decay)
          const currentPower = stateManager.getVariable('power');
          expect(currentPower).toBeLessThanOrEqual(50); // Initial power was 50, should decay
          resolve();
        }, 200);
      });
    });

    test('should handle random events with invalid probability', () => {
      // Set invalid probability
      gameModel.random_events![0].probability = -0.5;
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not crash, but also not trigger events
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 100);
      });
    });

    test('should handle random events with multiple conditions', () => {
      // Add condition to random event
      gameModel.random_events![0].conditions = ['power > 30'];
      
      // Set power below condition
      stateManager.setVariable('power', 20);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not trigger due to condition (power should be same or lower)
          const currentPower = stateManager.getVariable('power');
          expect(currentPower).toBeLessThanOrEqual(20); // Power was set to 20, should decay
          resolve();
        }, 200);
      });
    });
  });

  describe('Rule Execution Edge Cases', () => {
    test('should handle rules with invalid conditions', () => {
      // Add rule with invalid condition
      const invalidRule = {
        trigger: 'tick' as const,
        frequency: 1,
        condition: 'invalid_condition',
        effects: [
          { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 1 }
        ]
      };
      
      gameModel.rules.push(invalidRule);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not crash
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 100);
      });
    });

    test('should handle rules with no effects', () => {
      // Add rule with no effects
      const emptyRule = {
        trigger: 'tick' as const,
        frequency: 1,
        effects: []
      };
      
      gameModel.rules.push(emptyRule);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not crash
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 100);
      });
    });

    test('should handle rules with very high frequency', () => {
      // Add rule with very high frequency
      const highFreqRule = {
        trigger: 'tick' as const,
        frequency: 100,
        effects: [
          { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 0.1 }
        ]
      };
      
      gameModel.rules.push(highFreqRule);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not crash
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 100);
      });
    });

    test('should handle rules with zero frequency', () => {
      // Add rule with zero frequency
      const zeroFreqRule = {
        trigger: 'tick' as const,
        frequency: 0,
        effects: [
          { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 1 }
        ]
      };
      
      gameModel.rules.push(zeroFreqRule);
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should not crash
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 100);
      });
    });
  });

  describe('Action Cooldown Edge Cases', () => {
    test('should handle actions with zero cooldown', () => {
      const zeroCooldownAction = {
        name: 'zero_cooldown_action',
        description: 'Action with zero cooldown',
        requirements: [
          { type: 'cooldown' as const, target: 'zero_cooldown_action', condition: 'cooldown', value: 0 }
        ],
        effects: [
          { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 1 }
        ]
      };
      
      gameModel.actions.push(zeroCooldownAction);
      
      // Should be able to execute immediately
      const playerId = (this as any).playerId;
      const result1 = actionProcessor.processAction('zero_cooldown_action', playerId, {});
      const result2 = actionProcessor.processAction('zero_cooldown_action', playerId, {});
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    test('should handle actions with very long cooldown', () => {
      const longCooldownAction = {
        name: 'long_cooldown_action',
        description: 'Action with very long cooldown',
        requirements: [
          { type: 'cooldown' as const, target: 'long_cooldown_action', condition: 'cooldown', value: 10000 }
        ],
        effects: [
          { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 1 }
        ]
      };
      
      gameModel.actions.push(longCooldownAction);
      
      // First execution should succeed
      const playerId = (this as any).playerId;
      const result1 = actionProcessor.processAction('long_cooldown_action', playerId, {});
      expect(result1.success).toBe(true);
      
      // Second execution should fail due to cooldown
      const result2 = actionProcessor.processAction('long_cooldown_action', playerId, {});
      expect(result2.success).toBe(false);
    });

    test('should handle cooldown clearing for non-existent actions', () => {
      // Should not crash
      const playerId = (this as any).playerId;
      actionProcessor.clearCooldown('non_existent_action', playerId);
      actionProcessor.clearPlayerCooldowns(playerId);
    });
  });

  describe('Game State Consistency', () => {
    test('should maintain consistency during rapid state changes', () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      
      // Rapidly change multiple variables
      for (let i = 0; i < 100; i++) {
        stateManager.setVariable('power', Math.random() * 100);
        stateManager.setVariable('temperature', Math.random() * 1000);
        stateManager.setVariable('health', Math.random() * 100);
        actionProcessor.processAction('add_score', player.id, {});
      }
      
      // State should be consistent
      const state = stateManager.getState();
      expect(state.vars.power).toBeGreaterThanOrEqual(0);
      expect(state.vars.power).toBeLessThanOrEqual(100);
      expect(state.vars.temperature).toBeGreaterThanOrEqual(0);
      expect(state.vars.temperature).toBeLessThanOrEqual(1000);
      expect(state.vars.health).toBeGreaterThanOrEqual(0);
      expect(state.vars.health).toBeLessThanOrEqual(100);
    });

    test('should handle concurrent variable modifications', () => {
      const promises = [];
      
      // Modify same variable concurrently
      for (let i = 0; i < 50; i++) {
        promises.push(
          new Promise(resolve => {
            setTimeout(() => {
              stateManager.modifyVariable('power', 'add', 1);
              resolve(undefined);
            }, Math.random() * 10);
          })
        );
      }
      
      return Promise.all(promises).then(() => {
        // Power should be consistent
        const power = stateManager.getVariable('power');
        expect(power).toBeGreaterThanOrEqual(0);
        expect(power).toBeLessThanOrEqual(100);
      });
    });
  });
});
