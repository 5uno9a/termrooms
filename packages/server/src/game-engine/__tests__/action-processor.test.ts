import { describe, test, expect, beforeEach } from 'vitest';
import { ActionProcessor } from '../action-processor.js';
import { GameStateManager } from '../state-manager.js';
import { GameModel, Action, Player } from '../types.js';

describe('ActionProcessor', () => {
  let actionProcessor: ActionProcessor;
  let stateManager: GameStateManager;
  let gameModel: GameModel;
  let mockPlayer: Player;

  beforeEach(() => {
    // Create a realistic game model for testing
    gameModel = {
      meta: {
        name: 'Test Reactor Simulator',
        version: '1.0.0',
        description: 'Test reactor simulation for action processor',
        author: 'Test Author',
        maxPlayers: 4
      },
      vars: {
        power: { value: 50, min: 0, max: 100 },
        temperature: { value: 300, min: 0, max: 1000 },
        pressure: { value: 15, min: 0, max: 50 },
        coolant_level: { value: 80, min: 0, max: 100 }
      },
      entities: {
        reactor: {
          initialState: { 
            control_rods_position: 50,
            coolant_pumps_active: 2,
            emergency_shutdown: false,
            status: 'running'
          },
          properties: {
            control_rods_position: { type: 'number', min: 0, max: 100 },
            coolant_pumps_active: { type: 'number', min: 0, max: 4 },
            emergency_shutdown: { type: 'boolean' },
            status: { type: 'string' }
          }
        }
      },
      actions: [
        {
          name: 'adjust_control_rods',
          description: 'Adjust control rod position',
          effects: [
            {
              type: 'modify_var',
              target: 'power',
              operation: 'add',
              value: 5
            }
          ],
          requirements: []
        },
        {
          name: 'pump_coolant',
          description: 'Activate coolant pumps',
          effects: [
            {
              type: 'modify_var',
              target: 'temperature',
              operation: 'subtract',
              value: 10
            }
          ],
          requirements: []
        },
        {
          name: 'emergency_shutdown',
          description: 'Trigger emergency shutdown',
          effects: [
            {
              type: 'set_entity',
              target: 'reactor',
              value: { emergency_shutdown: true, status: 'shutdown' }
            }
          ],
          requirements: []
        },
        {
          name: 'cooldown_action',
          description: 'Action with cooldown requirement',
          effects: [
            {
              type: 'set_var',
              target: 'pressure',
              value: 20
            }
          ],
          requirements: [
            {
              type: 'cooldown',
              target: 'cooldown_action',
              condition: 'cooldown',
              value: 5000 // 5 seconds
            }
          ]
        },
        {
          name: 'update_player_score',
          description: 'Action that updates player score',
          effects: [
            {
              type: 'update_score',
              playerId: 'player1',
              value: 100
            }
          ],
          requirements: []
        }
      ],
      rules: [],
      random_events: [],
      ui: {
        panels: [],
        layout: {
          type: 'grid',
          gridSize: 12,
          maxPanels: 8
        }
      }
    };

    stateManager = new GameStateManager(gameModel);
    actionProcessor = new ActionProcessor(stateManager, gameModel);

    // Create a mock player
    mockPlayer = {
      id: 'player1',
      alias: 'TestPlayer',
      role: 'engineer',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    };

    // Add player to state
    stateManager.addPlayer(mockPlayer);
  });

  describe('Basic Action Processing', () => {
    test('should process valid action successfully', () => {
      const result = actionProcessor.processAction('adjust_control_rods', 'player1', {});
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(stateManager.getVariable('power')).toBe(55); // 50 + 5
    });

    test('should process multiple effects in action', () => {
      const result = actionProcessor.processAction('pump_coolant', 'player1', {});
      
      expect(result.success).toBe(true);
      expect(stateManager.getVariable('temperature')).toBe(290); // 300 - 10
    });

    test('should process entity modification', () => {
      const result = actionProcessor.processAction('emergency_shutdown', 'player1', {});
      
      expect(result.success).toBe(true);
      const reactorEntity = stateManager.getEntityProperty('reactor', 'emergency_shutdown');
      expect(reactorEntity).toBe(true);
    });

    test('should fail for non-existent action', () => {
      const result = actionProcessor.processAction('non_existent', 'player1', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should fail for non-existent player', () => {
      const result = actionProcessor.processAction('adjust_control_rods', 'non_existent', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Player not found');
    });
  });

  describe('Cooldown System', () => {
    test('should allow action when no cooldown', () => {
      const result = actionProcessor.processAction('cooldown_action', 'player1', {});
      
      expect(result.success).toBe(true);
      expect(stateManager.getVariable('pressure')).toBe(20);
    });

    test('should prevent action during cooldown', () => {
      // First action should succeed
      const firstResult = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(firstResult.success).toBe(true);

      // Second action should fail due to cooldown
      const secondResult = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('cooldown');
    });

    test('should allow action after cooldown expires', async () => {
      // First action
      const firstResult = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(firstResult.success).toBe(true);

      // Manually set cooldown to a past time (6000ms ago, more than the 5000ms cooldown)
      const playerCooldowns = actionProcessor['actionCooldowns'].get('player1');
      if (playerCooldowns) {
        playerCooldowns.set('cooldown_action', Date.now() - 6000);
      }
      
      // Wait a bit to ensure time has passed
      await new Promise(resolve => setTimeout(resolve, 10));

      // Second action should succeed
      const secondResult = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(secondResult.success).toBe(true);
    });
  });

  describe('Action History', () => {
    test('should track action history', () => {
      actionProcessor.processAction('adjust_control_rods', 'player1', {});
      actionProcessor.processAction('pump_coolant', 'player1', {});

      const history = actionProcessor.getActionHistory();
      expect(history).toHaveLength(2);
      expect(history[0].actionName).toBe('adjust_control_rods');
      expect(history[1].actionName).toBe('pump_coolant');
    });

    test('should get player action history', () => {
      actionProcessor.processAction('adjust_control_rods', 'player1', {});
      actionProcessor.processAction('pump_coolant', 'player1', {});

      const playerHistory = actionProcessor.getPlayerActionHistory('player1');
      expect(playerHistory).toHaveLength(2);
    });

    test('should clear action history', () => {
      actionProcessor.processAction('adjust_control_rods', 'player1', {});
      actionProcessor.clearActionHistory();

      const history = actionProcessor.getActionHistory();
      expect(history).toHaveLength(0);
    });
  });

  describe('Cooldown Management', () => {
    test('should get cooldown status', () => {
      actionProcessor.processAction('cooldown_action', 'player1', {});
      
      const cooldownStatus = actionProcessor.getCooldownStatus('cooldown_action', 'player1');
      expect(cooldownStatus).toBeDefined();
      expect(cooldownStatus!.remaining).toBeGreaterThan(0);
    });

    test('should clear player cooldowns', () => {
      actionProcessor.processAction('cooldown_action', 'player1', {});
      actionProcessor.clearPlayerCooldowns('player1');

      const cooldownStatus = actionProcessor.getCooldownStatus('cooldown_action', 'player1');
      expect(cooldownStatus).toBeNull();
    });

    test('should clear all cooldowns', () => {
      actionProcessor.processAction('cooldown_action', 'player1', {});
      actionProcessor.clearAllCooldowns();

      const cooldownStatus = actionProcessor.getCooldownStatus('cooldown_action', 'player1');
      expect(cooldownStatus).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid action effects gracefully', () => {
      // Create an action with invalid effect
      const invalidAction: Action = {
        name: 'invalid_action',
        description: 'Action with invalid effect',
        effects: [
          {
            type: 'modify_var',
            target: 'non_existent_var',
            operation: 'add',
            value: 10
          }
        ],
        requirements: []
      };

      // Add the invalid action to the game model
      gameModel.actions.push(invalidAction);

      const result = actionProcessor.processAction('invalid_action', 'player1', {});
      
      // Should still succeed but log the error
      expect(result.success).toBe(true);
    });

    test('should handle missing player gracefully', () => {
      const result = actionProcessor.processAction('adjust_control_rods', 'missing_player', {});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Player not found');
    });
  });

  describe('Action Validation', () => {
    test('should validate action requirements', () => {
      // Test with action that has cooldown requirement
      const result1 = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(result1.success).toBe(true);

      const result2 = actionProcessor.processAction('cooldown_action', 'player1', {});
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('cooldown');
    });

    test('should validate action exists', () => {
      const result = actionProcessor.processAction('nonexistent', 'player1', {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('State Integration', () => {
    test('should integrate with state manager correctly', () => {
      const initialPower = stateManager.getVariable('power') || 0;
      const initialTemp = stateManager.getVariable('temperature') || 0;

      actionProcessor.processAction('adjust_control_rods', 'player1', {});
      actionProcessor.processAction('pump_coolant', 'player1', {});

      expect(stateManager.getVariable('power')).toBe(initialPower + 5);
      expect(stateManager.getVariable('temperature')).toBe(initialTemp - 10);
    });

    test('should maintain player scores correctly', () => {
      actionProcessor.processAction('update_player_score', 'player1', {});
      
      expect(stateManager.getScore('player1')).toBe(100);
      expect(stateManager.getScores()).toEqual({ player1: 100 });
    });
  });

  describe('Stress Testing', () => {
    test('should handle rapid action execution (1000 actions)', () => {
      const startTime = Date.now();
      
      // Execute 1000 actions rapidly
      for (let i = 0; i < 1000; i++) {
        const result = actionProcessor.processAction('adjust_control_rods', 'player1', {});
        expect(result.success).toBe(true);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
      
      // Power should be at max (100) due to clamping
      expect(stateManager.getVariable('power')).toBe(100);
      
      // Action history should contain all 1000 actions
      const history = actionProcessor.getActionHistory();
      expect(history).toHaveLength(1000);
    });

    test('should handle concurrent actions from multiple players', () => {
      // Add multiple players
      const players = [];
      for (let i = 2; i <= 10; i++) {
        const player: Player = {
          id: `player${i}`,
          alias: `Player${i}`,
          role: 'technician',
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          score: 0,
          actions: []
        };
        stateManager.addPlayer(player);
        players.push(player);
      }

      // All players execute actions simultaneously
      const results = players.map(player => 
        actionProcessor.processAction('adjust_control_rods', player.id, {})
      );

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Power should be high due to clamping (some actions might not process due to timing)
      expect(stateManager.getVariable('power')).toBeGreaterThan(90);
    });

    test('should handle memory pressure with large action history', () => {
      // Clear existing history
      actionProcessor.clearActionHistory();
      
      // Execute 10,000 actions to test memory usage
      for (let i = 0; i < 10000; i++) {
        const result = actionProcessor.processAction('adjust_control_rods', 'player1', {});
        expect(result.success).toBe(true);
      }
      
      // Verify history is manageable
      const history = actionProcessor.getActionHistory();
      expect(history).toHaveLength(10000);
      
      // Test that we can still process new actions
      const newResult = actionProcessor.processAction('pump_coolant', 'player1', {});
      expect(newResult.success).toBe(true);
    });

    test('should handle cooldown system under heavy load', async () => {
      // Create action with very short cooldown
      const fastCooldownAction: Action =         {
          name: 'fast_cooldown',
          description: 'Action with 1ms cooldown',
          effects: [
            {
              type: 'set_var',
              target: 'pressure',
              value: 1
            }
          ],
          requirements: [
            {
              type: 'cooldown',
              target: 'fast_cooldown',
              condition: 'cooldown',
              value: 1 // 1ms cooldown
            }
          ]
        };

      gameModel.actions.push(fastCooldownAction);

      // Execute actions as fast as possible
      const results = [];
      for (let i = 0; i < 100; i++) {
        const result = actionProcessor.processAction('fast_cooldown', 'player1', {});
        results.push(result);
        
        // Small delay to allow cooldown to expire
        if (i % 10 === 0) {
          // Wait for cooldown to expire every 10 actions
          const cooldownStatus = actionProcessor.getCooldownStatus('fast_cooldown', 'player1');
          if (cooldownStatus) {
            // Wait for cooldown to expire
            await new Promise(resolve => setTimeout(resolve, cooldownStatus.remaining + 1));
          }
        }
      }

      // Some actions should succeed (cooldown is very aggressive with 1ms)
      const successCount = results.filter(r => r.success).length;
      expect(successCount).toBeGreaterThan(5); // At least some should succeed
      expect(successCount).toBeLessThan(50); // But not too many due to cooldown
    });

    test('should handle invalid operations gracefully under load', () => {
      // Create multiple invalid actions
      const invalidActions: Action[] = [
        {
          name: 'invalid_op_action',
          description: 'Action with invalid operation',
          effects: [
            {
              type: 'modify_var',
              target: 'power',
              operation: 'invalid_op' as any,
              value: 10
            }
          ],
          requirements: []
        },
        {
          name: 'invalid_target_action',
          description: 'Action with invalid target',
          effects: [
            {
              type: 'set_var',
              target: 'non_existent_var',
              value: 10
            }
          ],
          requirements: []
        },
        {
          name: 'invalid_entity_action',
          description: 'Action with invalid entity',
          effects: [
            {
              type: 'set_entity',
              target: 'non_existent_entity',
              value: { x: 1 }
            }
          ],
          requirements: []
        }
      ];

      gameModel.actions.push(...invalidActions);

      // Execute invalid actions rapidly
      const results = [];
      for (let i = 0; i < 100; i++) {
        const actionName = invalidActions[i % invalidActions.length].name;
        const result = actionProcessor.processAction(actionName, 'player1', {});
        results.push(result);
      }

      // All actions should succeed (but effects should be handled gracefully)
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    test('should handle mixed valid and invalid actions', () => {
      // Mix of valid and invalid actions
      const actions = [
        'adjust_control_rods', // valid
        'pump_coolant', // valid
        'non_existent', // invalid
        'adjust_control_rods', // valid
        'emergency_shutdown', // valid
        'invalid_action', // invalid
      ];

      const results = [];
      for (let i = 0; i < 1000; i++) {
        const actionName = actions[i % actions.length];
        const result = actionProcessor.processAction(actionName, 'player1', {});
        results.push(result);
      }

      // Count successes and failures
      const successes = results.filter(r => r.success).length;
      const failures = results.filter(r => !r.success).length;

      // Should have both successes and failures
      expect(successes).toBeGreaterThan(0);
      expect(failures).toBeGreaterThan(0);
      expect(successes + failures).toBe(1000);
    });

    test('should handle player score updates under load', () => {
      // Add multiple players
      const players = [];
      for (let i = 2; i <= 20; i++) {
        const player: Player = {
          id: `player${i}`,
          alias: `Player${i}`,
          role: 'technician',
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          score: 0,
          actions: []
        };
        stateManager.addPlayer(player);
        players.push(player);
      }

      // Create score update action for each player
      players.forEach(player => {
        const scoreAction: Action = {
          name: `update_score_${player.id}`,
          description: `Update score for ${player.id}`,
          effects: [
            {
              type: 'update_score',
              playerId: player.id,
              value: 100
            }
          ],
          requirements: []
        };
        gameModel.actions.push(scoreAction);
      });

      // Execute score updates for all players
      const results = players.map(player => 
        actionProcessor.processAction(`update_score_${player.id}`, player.id, {})
      );

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // All players should have updated scores
      players.forEach(player => {
        expect(stateManager.getScore(player.id)).toBe(100);
      });
    });

    test('should handle entity modifications under load', () => {
      // Create entity modification action
      const entityAction: Action = {
        name: 'modify_reactor',
        description: 'Modify reactor entity',
        effects: [
          {
            type: 'set_entity',
            target: 'reactor',
            value: { 
              control_rods_position: 75,
              coolant_pumps_active: 3,
              status: 'modified'
            }
          }
        ],
        requirements: []
      };

      gameModel.actions.push(entityAction);

      // Execute entity modifications rapidly
      for (let i = 0; i < 1000; i++) {
        const result = actionProcessor.processAction('modify_reactor', 'player1', {});
        expect(result.success).toBe(true);
      }

      // Verify final entity state
      expect(stateManager.getEntityProperty('reactor', 'control_rods_position')).toBe(75);
      expect(stateManager.getEntityProperty('reactor', 'coolant_pumps_active')).toBe(3);
      expect(stateManager.getEntityProperty('reactor', 'status')).toBe('modified');
    });
  });
});