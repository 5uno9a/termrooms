import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { GameModelParser } from '../parser.js';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel } from '../types.js';

describe('Game Engine Error Recovery & Resilience Tests', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Error Recovery Test Game',
        version: '1.0.0',
        description: 'Test game for error recovery',
        author: 'Test Author',
        maxPlayers: 10
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 },
        error_count: { min: 0, max: 1000, value: 0 }
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
          name: 'safe_action',
          description: 'Safe action that always succeeds',
          effects: [
            { type: 'set_var' as const, target: 'power', value: 75 }
          ]
        },
        {
          name: 'error_action',
          description: 'Action that causes errors',
          effects: [
            { type: 'set_var' as const, target: 'non_existent_var', value: 50 },
            { type: 'set_entity' as const, target: 'non_existent_entity', value: { status: 'active' } }
          ]
        },
        {
          name: 'mixed_action',
          description: 'Action with both valid and invalid effects',
          effects: [
            { type: 'set_var' as const, target: 'power', value: 80 },
            { type: 'set_var' as const, target: 'non_existent_var', value: 50 },
            { type: 'modify_var' as const, target: 'temperature', operation: 'add', value: 10 }
          ]
        }
      ],
      rules: [
        {
          trigger: 'tick' as const,
          frequency: 1,
          effects: [
            { type: 'modify_var' as const, target: 'error_count', operation: 'add', value: 1 }
          ]
        }
      ],
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

  afterEach(() => {
    if (tickLoop.getStatusString() === 'running') {
      tickLoop.stop();
    }
  });

  describe('JSON Parsing Error Recovery', () => {
    test('should handle malformed JSON gracefully', () => {
      expect(() => {
        GameModelParser.parse('{"invalid": json}');
      }).toThrow('Invalid JSON');
    });

    test('should handle empty JSON gracefully', () => {
      expect(() => {
        GameModelParser.parse('{}');
      }).toThrow('Game model must have a meta object');
    });

    test('should handle null JSON gracefully', () => {
      expect(() => {
        GameModelParser.parse('null');
      }).toThrow('Game model must be an object');
    });

    test('should handle array JSON gracefully', () => {
      expect(() => {
        GameModelParser.parse('[]');
      }).toThrow('Game model must be an object');
    });

    test('should handle string JSON gracefully', () => {
      expect(() => {
        GameModelParser.parse('"string"');
      }).toThrow('Game model must be an object');
    });

    test('should handle deeply nested invalid JSON gracefully', () => {
      const invalidJson = JSON.stringify({
        meta: { name: 'Test' },
        vars: {
          invalid_var: {
            min: 'not_a_number',
            max: null,
            initial: undefined
          }
        }
      });

      expect(() => {
        GameModelParser.parse(invalidJson);
      }).toThrow();
    });
  });

  describe('Action Processing Error Recovery', () => {
    test('should handle actions with invalid effects gracefully', () => {
      const result = actionProcessor.processAction('error_action', 'player1', {});
      
      // Action should fail due to invalid effects
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle actions with mixed valid and invalid effects', () => {
      // Create a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      
      const result = actionProcessor.processAction('mixed_action', player.id, {});
      
      // Action should succeed, valid effects should work
      expect(result.success).toBe(true);
      expect(stateManager.getVariable('power')).toBe(80);
      expect(stateManager.getVariable('temperature')).toBe(310); // 300 + 10
    });

    test('should handle non-existent actions gracefully', () => {
      // Create a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      
      const result = actionProcessor.processAction('non_existent_action', player.id, {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Action not found');
    });

    test('should handle actions with non-existent players gracefully', () => {
      const result = actionProcessor.processAction('safe_action', 'non_existent_player', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Player not found');
    });

    test('should handle actions with null/undefined parameters gracefully', () => {
      // Create a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      
      const result = actionProcessor.processAction('safe_action', player.id, null as any);
      
      // Should still succeed
      expect(result.success).toBe(true);
    });

    test('should recover from action processing errors and continue working', () => {
      // Create a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      
      // Process an action that causes errors
      const errorResult = actionProcessor.processAction('error_action', player.id, {});
      expect(errorResult.success).toBe(true);

      // Process a safe action after the error
      const safeResult = actionProcessor.processAction('safe_action', player.id, {});
      expect(safeResult.success).toBe(true);
      expect(stateManager.getVariable('power')).toBe(75);
    });
  });

  describe('State Management Error Recovery', () => {
    test('should handle invalid variable names gracefully', () => {
      // These should not throw errors
      stateManager.setVariable('', 50);
      stateManager.setVariable(null as any, 50);
      stateManager.setVariable(undefined as any, 50);
      
      // Should not affect existing variables
      expect(stateManager.getVariable('power')).toBe(50);
    });

    test('should handle invalid variable values gracefully', () => {
      stateManager.setVariable('power', NaN);
      expect(stateManager.getVariable('power')).toBe(50); // Should default to initial value

      stateManager.setVariable('power', Infinity);
      expect(stateManager.getVariable('power')).toBe(100); // Should clamp to max

      stateManager.setVariable('power', -Infinity);
      expect(stateManager.getVariable('power')).toBe(0); // Should clamp to min
    });

    test('should handle invalid entity operations gracefully', () => {
      // These should not throw errors
      stateManager.setEntityProperty('', 'status', 'active');
      stateManager.setEntityProperty('non_existent', 'status', 'active');
      stateManager.setEntityProperty('reactor', '', 'active');
      
      // Should not affect existing entities
      expect(stateManager.getEntity('reactor')).toBeDefined();
    });

    test('should handle invalid player operations gracefully', () => {
      // These should not throw errors
      stateManager.removePlayer('');
      stateManager.removePlayer('non_existent');
      stateManager.updatePlayer('', { score: 100 });
      stateManager.updatePlayer('non_existent', { score: 100 });
      
      // Should not affect existing state
      expect(Object.keys(stateManager.getState().players)).toHaveLength(0);
    });

    test('should recover from state corruption and continue working', () => {
      // Corrupt state by setting invalid values
      stateManager.setVariable('power', 'invalid' as any);
      stateManager.setEntityProperty('reactor', 'status', null as any);
      
      // State should be recoverable
      stateManager.setVariable('power', 75);
      stateManager.setEntityProperty('reactor', 'status', 'running');
      
      expect(stateManager.getVariable('power')).toBe(75);
      expect(stateManager.getEntityProperty('reactor', 'status')).toBe('running');
    });
  });

  describe('Tick Loop Error Recovery', () => {
    test('should handle tick loop errors gracefully', () => {
      tickLoop.onError((error) => {
        expect(error).toBeDefined();
      });

      // Create a rule that will cause an error
      const errorRule = {
        trigger: 'tick' as const,
        frequency: 1,
        effects: [
          { type: 'set_var' as const, target: 'non_existent_var', value: 50 }
        ]
      };

      gameModel.rules.push(errorRule);

      tickLoop.start();

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          // The tick loop should still be functional even with errors
          expect(tickLoop.getStatusString()).toBe('stopped');
          resolve();
        }, 500);
      });
    });

    test('should continue running after tick loop errors', () => {
      let tickCount = 0;
      
      tickLoop.onTick(() => {
        tickCount++;
      });

      tickLoop.onError(() => {
        // Error handler should not stop the tick loop
      });

      // Add a rule that causes errors
      const errorRule = {
        trigger: 'tick' as const,
        frequency: 1,
        effects: [
          { type: 'set_var' as const, target: 'non_existent_var', value: 50 }
        ]
      };

      gameModel.rules.push(errorRule);

      tickLoop.start();

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          expect(tickCount).toBeGreaterThan(0);
          resolve();
        }, 200);
      });
    });

    test('should handle rapid start/stop cycles with errors', () => {
      tickLoop.onError(() => {
        // Error handler for testing
      });

      // Add a rule that causes errors
      const errorRule = {
        trigger: 'tick' as const,
        frequency: 1,
        effects: [
          { type: 'set_var' as const, target: 'non_existent_var', value: 50 }
        ]
      };

      gameModel.rules.push(errorRule);

      // Rapidly start and stop
      for (let i = 0; i < 10; i++) {
        tickLoop.start();
        tickLoop.stop();
      }

      expect(tickLoop.getStatusString()).toBe('stopped');
    });
  });

  describe('Network Failure Simulation', () => {
    test('should handle simulated connection drops gracefully', () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Simulate connection drop by removing player mid-action
      const result = actionProcessor.processAction('safe_action', player.id, {});
      
      // Simulate connection drop
      stateManager.removePlayer(player.id);
      
      // Action should still complete
      expect(result.success).toBe(true);
    });

    test('should handle state synchronization after reconnection', () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Process some actions
      actionProcessor.processAction('safe_action', player.id, {});
      expect(stateManager.getVariable('power')).toBe(75);

      // Simulate disconnection
      stateManager.removePlayer(player.id);

      // Simulate reconnection with same alias
      const reconnectedPlayer = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Should be able to process actions after reconnection
      const result = actionProcessor.processAction('safe_action', reconnectedPlayer.id, {});
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Action Sequences', () => {
    test('should handle actions that depend on non-existent state', () => {
      const dependentAction = {
        name: 'dependent_action',
        description: 'Action that depends on non-existent state',
        effects: [
          { type: 'modify_var' as const, target: 'non_existent_var', operation: 'add' as const, value: 1 }
        ]
      };

      gameModel.actions.push(dependentAction);

      const result = actionProcessor.processAction('dependent_action', 'player1', {});
      expect(result.success).toBe(false); // Should fail due to non-existent variable
    });

    test('should handle circular action dependencies', () => {
      const circularAction1 = {
        name: 'circular_action_1',
        description: 'First circular action',
        effects: [
          { type: 'trigger_event' as const, target: 'circular_event_2' }
        ]
      };

      const circularAction2 = {
        name: 'circular_action_2',
        description: 'Second circular action',
        effects: [
          { type: 'trigger_event' as const, target: 'circular_event_1' }
        ]
      };

      gameModel.actions.push(circularAction1, circularAction2);

      // These should not cause infinite loops
      const result1 = actionProcessor.processAction('circular_action_1', 'player1', {});
      const result2 = actionProcessor.processAction('circular_action_2', 'player1', {});

      expect(result1.success).toBe(false); // Should fail due to non-existent player
      expect(result2.success).toBe(false); // Should fail due to non-existent player
    });

    test('should handle actions with invalid effect chains', () => {
      const invalidChainAction = {
        name: 'invalid_chain_action',
        description: 'Action with invalid effect chain',
        effects: [
          { type: 'set_var' as const, target: 'power', value: 50 },
          { type: 'modify_var' as const, target: 'power', operation: 'invalid_operation' as any, value: 10 },
          { type: 'set_var' as const, target: 'power', value: 75 }
        ]
      };

      gameModel.actions.push(invalidChainAction);

      const result = actionProcessor.processAction('invalid_chain_action', 'player1', {});
      expect(result.success).toBe(false); // Should fail due to invalid operation
      expect(stateManager.getVariable('power')).toBe(50); // Should remain at initial value
    });
  });

  describe('Self-Healing Mechanisms', () => {
    test('should recover from invalid game state', () => {
      // Corrupt some state properties
      (stateManager as any).state.vars = null;
      (stateManager as any).state.entities = null;

      // Should recover when accessing state
      expect(() => {
        stateManager.getState();
      }).not.toThrow();

      const state = stateManager.getState();
      expect(state).toBeDefined();
      expect(state.vars).toBeDefined();
      expect(state.entities).toBeDefined();
    });

    test('should recover from invalid variable definitions', () => {
      // Add invalid variable definition
      gameModel.vars.invalid_var = {
        min: 'not_a_number' as any,
        max: null as any,
        value: undefined as any
      };

      // Should handle gracefully
      expect(() => {
        new GameStateManager(gameModel);
      }).not.toThrow();
    });

    test('should recover from invalid entity definitions', () => {
      // Add invalid entity definition
      gameModel.entities.invalid_entity = null as any;

      // Should handle gracefully
      expect(() => {
        new GameStateManager(gameModel);
      }).not.toThrow();
    });

    test('should maintain consistency after multiple errors', () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Process multiple actions with errors
      for (let i = 0; i < 10; i++) {
        actionProcessor.processAction('error_action', player.id, {});
        actionProcessor.processAction('safe_action', player.id, {});
      }

      // State should still be consistent
      expect(stateManager.getVariable('power')).toBe(75);
      expect(stateManager.getPlayer(player.id)).toBeDefined();
    });
  });
});
