import { describe, test, expect, beforeEach } from 'vitest';
import { GameModelParser } from '../parser.js';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel, Player } from '../types.js';

describe('Game Engine Edge Cases & Boundary Conditions', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Edge Case Test Game',
        version: '1.0.0',
        description: 'Test game for edge cases',
        author: 'Test Author',
        maxPlayers: 10
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 },
        pressure: { min: 0, max: 100, value: 50 }
      },
      entities: {
        reactor: {
          status: 'running',
          emergency_shutdown: false,
          control_rods: 50
        }
      },
      actions: [
        {
          name: 'set_power',
          description: 'Set power to specific value',
          effects: [
            { type: 'set_var' as const, target: 'power', value: 0 }
          ]
        },
        {
          name: 'increment_power',
          description: 'Increment power by 1',
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'add', value: 1 }
          ]
        },
        {
          name: 'decrement_power',
          description: 'Decrement power by 1',
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'subtract', value: 1 }
          ]
        }
      ],
      rules: [],
      random_events: [],
      ui: {
        panels: [],
        layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
      }
    };

    stateManager = new GameStateManager(gameModel);
    actionProcessor = new ActionProcessor(stateManager, gameModel);
    tickLoop = new GameTickLoop(stateManager, gameModel, 16);
  });

  describe('Variable Boundary Conditions', () => {
    test('should handle variables at minimum values', () => {
      stateManager.setVariable('power', 0);
      stateManager.setVariable('temperature', 0);
      stateManager.setVariable('pressure', 0);

      expect(stateManager.getVariable('power')).toBe(0);
      expect(stateManager.getVariable('temperature')).toBe(0);
      expect(stateManager.getVariable('pressure')).toBe(0);
    });

    test('should handle variables at maximum values', () => {
      stateManager.setVariable('power', 100);
      stateManager.setVariable('temperature', 1000);
      stateManager.setVariable('pressure', 100);

      expect(stateManager.getVariable('power')).toBe(100);
      expect(stateManager.getVariable('temperature')).toBe(1000);
      expect(stateManager.getVariable('pressure')).toBe(100);
    });

    test('should clamp variables that exceed maximum values', () => {
      stateManager.setVariable('power', 150);
      stateManager.setVariable('temperature', 1500);
      stateManager.setVariable('pressure', 150);

      expect(stateManager.getVariable('power')).toBe(100);
      expect(stateManager.getVariable('temperature')).toBe(1000);
      expect(stateManager.getVariable('pressure')).toBe(100);
    });

    test('should clamp variables that go below minimum values', () => {
      stateManager.setVariable('power', -50);
      stateManager.setVariable('temperature', -100);
      stateManager.setVariable('pressure', -25);

      expect(stateManager.getVariable('power')).toBe(0);
      expect(stateManager.getVariable('temperature')).toBe(0);
      expect(stateManager.getVariable('pressure')).toBe(0);
    });

    test('should handle modify operations at boundaries', () => {
      // Test increment at max
      stateManager.setVariable('power', 100);
      stateManager.modifyVariable('power', 'add', 1);
      expect(stateManager.getVariable('power')).toBe(100); // Should be clamped

      // Test decrement at min
      stateManager.setVariable('power', 0);
      stateManager.modifyVariable('power', 'subtract', 1);
      expect(stateManager.getVariable('power')).toBe(0); // Should be clamped
    });

    test('should handle division by zero in modify operations', () => {
      stateManager.setVariable('power', 50);
      stateManager.modifyVariable('power', 'divide', 0);
      expect(stateManager.getVariable('power')).toBe(50); // Should remain unchanged
    });

    test('should handle very large numbers', () => {
      stateManager.setVariable('power', Number.MAX_SAFE_INTEGER);
      expect(stateManager.getVariable('power')).toBe(100); // Should be clamped

      stateManager.setVariable('power', Number.MIN_SAFE_INTEGER);
      expect(stateManager.getVariable('power')).toBe(0); // Should be clamped
    });
  });

  describe('Player Management Edge Cases', () => {
    test('should handle maximum number of players', () => {
      const players: Player[] = [];
      
      // Add maximum players
      for (let i = 0; i < 10; i++) {
        const player = stateManager.addPlayer({
          alias: `player${i}`,
          role: 'engineer',
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          actions: [],
          score: 0
        });
        players.push(player);
      }

      expect(Object.keys(stateManager.getState().players)).toHaveLength(10);
    });

    test('should handle duplicate player aliases', () => {
      const player1 = stateManager.addPlayer({
        alias: 'duplicate',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const player2 = stateManager.addPlayer({
        alias: 'duplicate',
        role: 'chief',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Both should be added with different IDs
      expect(player1.id).not.toBe(player2.id);
      expect(player1.alias).toBe('duplicate');
      expect(player2.alias).toBe('duplicate');
    });

    test('should handle empty player alias', () => {
      const player = stateManager.addPlayer({
        alias: '',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      expect(player.alias).toBe('');
      expect(player.id).toBeDefined();
    });

    test('should handle very long player aliases', () => {
      const longAlias = 'a'.repeat(1000);
      const player = stateManager.addPlayer({
        alias: longAlias,
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      expect(player.alias).toBe(longAlias);
    });

    test('should handle player removal of non-existent player', () => {
      const result = stateManager.removePlayer('non-existent-id');
      expect(result).toBe(false);
    });

    test('should handle player update of non-existent player', () => {
      const result = stateManager.updatePlayer('non-existent-id', { score: 100 });
      expect(result).toBe(false);
    });
  });

  describe('Action Processing Edge Cases', () => {
    test('should handle action with no effects', () => {
      // Add a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const action = {
        name: 'empty_action',
        description: 'Action with no effects',
        effects: []
      };

      gameModel.actions.push(action);
      const result = actionProcessor.processAction('empty_action', player.id, {});
      expect(result.success).toBe(true);
    });

    test('should handle action with invalid effect type', () => {
      // Add a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const action = {
        name: 'invalid_effect_action',
        description: 'Action with invalid effect',
        effects: [
          { type: 'invalid_effect' as any, target: 'power', value: 50 }
        ]
      };

      gameModel.actions.push(action);
      const result = actionProcessor.processAction('invalid_effect_action', player.id, {});
      expect(result.success).toBe(false);
    });

    test('should handle action with missing target in effect', () => {
      // Add a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const action = {
        name: 'missing_target_action',
        description: 'Action with missing target',
        effects: [
          { type: 'set_var' as const, value: 50 }
        ]
      };

      gameModel.actions.push(action);
      const result = actionProcessor.processAction('missing_target_action', player.id, {});
      expect(result.success).toBe(true); // Should succeed but do nothing
    });

    test('should handle action with non-existent variable target', () => {
      // Add a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const action = {
        name: 'non_existent_var_action',
        description: 'Action targeting non-existent variable',
        effects: [
          { type: 'set_var' as const, target: 'non_existent_var', value: 50 }
        ]
      };

      gameModel.actions.push(action);
      const result = actionProcessor.processAction('non_existent_var_action', player.id, {});
      expect(result.success).toBe(true); // Should succeed but do nothing
    });

    test('should handle action with non-existent entity target', () => {
      // Add a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      const action = {
        name: 'non_existent_entity_action',
        description: 'Action targeting non-existent entity',
        effects: [
          { type: 'set_entity' as const, target: 'non_existent_entity', value: { status: 'active' } }
        ]
      };

      gameModel.actions.push(action);
      const result = actionProcessor.processAction('non_existent_entity_action', player.id, {});
      expect(result.success).toBe(true); // Should succeed but do nothing
    });
  });

  describe('Tick Loop Edge Cases', () => {
    test('should handle tick loop with no rules', () => {
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          expect(stateManager.getState().tick).toBeGreaterThan(0);
          resolve();
        }, 100);
      });
    });

    test('should handle tick loop with empty random events', () => {
      gameModel.random_events = [];
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          expect(stateManager.getState().tick).toBeGreaterThan(0);
          resolve();
        }, 100);
      });
    });

    test('should handle rapid start/stop cycles', () => {
      for (let i = 0; i < 10; i++) {
        tickLoop.start();
        tickLoop.stop();
      }
      
      expect(tickLoop.getStatusString()).toBe('stopped');
    });

    test('should handle starting already running tick loop', () => {
      tickLoop.start();
      tickLoop.start(); // Start again
      
      expect(tickLoop.getStatusString()).toBe('running');
      
      tickLoop.stop();
    });

    test('should handle stopping already stopped tick loop', () => {
      tickLoop.stop(); // Stop when not running
      expect(tickLoop.getStatusString()).toBe('stopped');
    });
  });

  describe('Game Model Edge Cases', () => {
    test('should handle empty game model', () => {
      const emptyModel: GameModel = {
        meta: {
          name: 'Empty',
          version: '1.0.0',
          description: 'Empty model',
          author: 'Test'
        },
        vars: {},
        entities: {},
        actions: [],
        rules: [],
        random_events: [],
        ui: {
          panels: [],
          layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
        }
      };

      const emptyStateManager = new GameStateManager(emptyModel);
      
      expect(emptyStateManager.getState().vars).toEqual({});
      expect(emptyStateManager.getState().entities).toEqual({});
      expect(emptyStateManager.getState().players).toEqual({});
    });

    test('should handle game model with only meta', () => {
      const minimalModel: GameModel = {
        meta: {
          name: 'Minimal',
          version: '1.0.0',
          description: 'Minimal model',
          author: 'Test'
        },
        vars: {},
        entities: {},
        actions: [],
        rules: [],
        random_events: [],
        ui: {
          panels: [],
          layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
        }
      };

      expect(() => {
        new GameStateManager(minimalModel);
      }).not.toThrow();
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    test('should handle large number of variables', () => {
      const largeModel: GameModel = {
        ...gameModel,
        vars: {}
      };

      // Create 1000 variables
      for (let i = 0; i < 1000; i++) {
        largeModel.vars[`var${i}`] = { min: 0, max: 100, value: 50 };
      }

      const largeStateManager = new GameStateManager(largeModel);
      expect(Object.keys(largeStateManager.getState().vars)).toHaveLength(1000);
    });

    test('should handle large number of entities', () => {
      const largeModel: GameModel = {
        ...gameModel,
        entities: {}
      };

      // Create 1000 entities
      for (let i = 0; i < 1000; i++) {
        largeModel.entities[`entity${i}`] = { status: 'active', id: i };
      }

      const largeStateManager = new GameStateManager(largeModel);
      expect(Object.keys(largeStateManager.getState().entities)).toHaveLength(1000);
    });

    test('should handle deep entity nesting', () => {
      const deepEntity = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep'
                }
              }
            }
          }
        }
      };

      stateManager.setEntityProperty('deep_entity', 'nested', deepEntity);
      const retrieved = stateManager.getEntityProperty('deep_entity', 'nested');
      expect(retrieved).toEqual(deepEntity);
    });
  });

  describe('Error Handling Edge Cases', () => {
    test('should handle invalid JSON in game model', () => {
      expect(() => {
        GameModelParser.parse('{"invalid": json}');
      }).toThrow();
    });

    test('should handle malformed game model structure', () => {
      expect(() => {
        GameModelParser.parse('{"meta": "not an object"}');
      }).toThrow();
    });

    test('should handle null/undefined values gracefully', () => {
      stateManager.setVariable('power', null as any);
      expect(stateManager.getVariable('power')).toBe(50); // Should default to initial value

      stateManager.setVariable('power', undefined as any);
      expect(stateManager.getVariable('power')).toBe(50); // Should default to initial value
    });

    test('should handle NaN values gracefully', () => {
      stateManager.setVariable('power', NaN);
      expect(stateManager.getVariable('power')).toBe(50); // Should default to initial value
    });

    test('should handle Infinity values gracefully', () => {
      stateManager.setVariable('power', Infinity);
      expect(stateManager.getVariable('power')).toBe(100); // Should be clamped to max

      stateManager.setVariable('power', -Infinity);
      expect(stateManager.getVariable('power')).toBe(0); // Should be clamped to min
    });
  });
});
