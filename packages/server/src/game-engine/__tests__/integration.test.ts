import { describe, test, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel, Player } from '../types.js';

describe('Game Engine Integration Tests', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;
  let players: Player[];

  beforeEach(() => {
    // Create a comprehensive ReactorSim-like game model
    gameModel = {
      meta: {
        name: 'ReactorSim Integration Test',
        version: '1.0.0',
        description: 'Nuclear reactor simulation for integration testing',
        author: 'Test Author',
        maxPlayers: 8
      },
      vars: {
        power: { value: 50, min: 0, max: 100 },
        temperature: { value: 300, min: 0, max: 1000 },
        pressure: { value: 15, min: 0, max: 50 },
        coolant_level: { value: 80, min: 0, max: 100 },
        control_rods: { value: 50, min: 0, max: 100 },
        reactor_status: { value: 1, min: 0, max: 3 }, // 0=off, 1=low, 2=medium, 3=high
        score: { value: 0, min: 0, max: 10000 }
      },
      entities: {
        reactor: {
          initialState: {
            control_rods_position: 50,
            coolant_pumps_active: 2,
            emergency_shutdown: false,
            status: 'running',
            last_inspection: '2024-01-01',
            maintenance_due: false
          },
          properties: {
            control_rods_position: { type: 'number', min: 0, max: 100 },
            coolant_pumps_active: { type: 'number', min: 0, max: 4 },
            emergency_shutdown: { type: 'boolean' },
            status: { type: 'string' },
            last_inspection: { type: 'string' },
            maintenance_due: { type: 'boolean' }
          }
        },
        cooling_system: {
          initialState: {
            pump_1_active: true,
            pump_2_active: true,
            pump_3_active: false,
            pump_4_active: false,
            efficiency: 0.85
          },
          properties: {
            pump_1_active: { type: 'boolean' },
            pump_2_active: { type: 'boolean' },
            pump_3_active: { type: 'boolean' },
            pump_4_active: { type: 'boolean' },
            efficiency: { type: 'number', min: 0, max: 1 }
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
            },
            {
              type: 'set_entity',
              target: 'reactor',
              value: { control_rods_position: 75 }
            }
          ],
          requirements: [
            {
              type: 'cooldown',
              target: 'adjust_control_rods',
              condition: 'cooldown',
              value: 2000 // 2 seconds
            }
          ]
        },
        {
          name: 'pump_coolant',
          description: 'Activate coolant pumps',
          effects: [
            {
              type: 'modify_var',
              target: 'temperature',
              operation: 'subtract',
              value: 15
            },
            {
              type: 'modify_var',
              target: 'coolant_level',
              operation: 'subtract',
              value: 5
            },
            {
              type: 'set_entity',
              target: 'cooling_system',
              value: { pump_3_active: true, pump_4_active: true }
            }
          ],
          requirements: [
            {
              type: 'cooldown',
              target: 'pump_coolant',
              condition: 'cooldown',
              value: 3000 // 3 seconds
            }
          ]
        },
        {
          name: 'emergency_shutdown',
          description: 'Trigger emergency shutdown',
          effects: [
            {
              type: 'set_var',
              target: 'power',
              value: 0
            },
            {
              type: 'set_var',
              target: 'reactor_status',
              value: 0
            },
            {
              type: 'set_entity',
              target: 'reactor',
              value: { 
                emergency_shutdown: true, 
                status: 'shutdown',
                control_rods_position: 100
              }
            },
            {
              type: 'modify_var',
              target: 'power',
              operation: 'set',
              value: 0
            }
          ],
          requirements: []
        },
        {
          name: 'inspect_reactor',
          description: 'Perform reactor inspection',
          effects: [
            {
              type: 'set_entity',
              target: 'reactor',
              value: { 
                last_inspection: new Date().toISOString().split('T')[0],
                maintenance_due: false
              }
            },
            {
              type: 'modify_var',
              target: 'power',
              operation: 'add',
              value: 1
            }
          ],
          requirements: [
            {
              type: 'cooldown',
              target: 'inspect_reactor',
              condition: 'cooldown',
              value: 10000 // 10 seconds
            }
          ]
        },
        {
          name: 'update_player_score',
          description: 'Update player score based on performance',
          effects: [
            {
              type: 'modify_var',
              target: 'score',
              operation: 'add',
              value: 100
            }
          ],
          requirements: []
        }
      ],
      rules: [
        {
          trigger: 'tick',
          effects: [
            {
              type: 'modify_var',
              target: 'power',
              operation: 'subtract',
              value: 0.1
            }
          ]
        },
        {
          trigger: 'tick',
          condition: 'temperature > 800',
          effects: [
            {
              type: 'modify_var',
              target: 'temperature',
              operation: 'add',
              value: 5
            },
            {
              type: 'add_event',
              eventType: 'warning',
              message: 'Temperature critical'
            }
          ]
        },
        {
          trigger: 'tick',
          condition: 'pressure > 40',
          effects: [
            {
              type: 'modify_var',
              target: 'pressure',
              operation: 'add',
              value: 2
            },
            {
              type: 'add_event',
              eventType: 'warning',
              message: 'Pressure critical'
            }
          ]
        },
        {
          trigger: 'tick',
          condition: 'power > 90',
          effects: [
            {
              type: 'modify_var',
              target: 'temperature',
              operation: 'add',
              value: 2
            }
          ]
        }
      ],
      random_events: [
        {
          name: 'Power Surge',
          description: 'Random power increase event',
          probability: 0.1, // 10% chance for testing
          effects: [
            {
              type: 'modify_var',
              target: 'power',
              operation: 'add',
              value: 10
            },
            {
              type: 'modify_var',
              target: 'temperature',
              operation: 'add',
              value: 5
            }
          ]
        },
        {
          name: 'Coolant Leak',
          description: 'Random coolant leak event',
          probability: 0.05,
          effects: [
            {
              type: 'modify_var',
              target: 'coolant_level',
              operation: 'subtract',
              value: 20
            },
            {
              type: 'modify_var',
              target: 'coolant_level',
              operation: 'subtract',
              value: 10
            }
          ]
        }
      ],
      ui: {
        panels: [
          {
            id: 'overview',
            title: 'Reactor Overview',
            layout: {
              x: 0,
              y: 0,
              w: 6,
              h: 4,
              minW: 3,
              minH: 2,
              maxW: 8,
              maxH: 6
            },
            widgets: [
              {
                id: 'power_bar',
                title: 'Power Level',
                type: 'bar',
                config: {
                  target: 'power',
                  min: 0,
                  max: 100
                },
                bindings: {
                  vars: ['power']
                }
              },
              {
                id: 'temperature_bar',
                title: 'Temperature',
                type: 'bar',
                config: {
                  target: 'temperature',
                  min: 0,
                  max: 1000
                },
                bindings: {
                  vars: ['temperature']
                }
              }
            ],
            visible: true,
            resizable: true,
            draggable: true
          }
        ],
        layout: {
          type: 'grid',
          gridSize: 12,
          maxPanels: 8
        }
      }
    };

    // Initialize all components
    stateManager = new GameStateManager(gameModel);
    actionProcessor = new ActionProcessor(stateManager, gameModel);
    tickLoop = new GameTickLoop(stateManager, gameModel, 16); // 60 FPS

    // Create test players
    players = [];
    for (let i = 1; i <= 5; i++) {
      const player: Player = {
        id: `player${i}`,
        alias: `Engineer${i}`,
        role: i === 1 ? 'chief' : 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        score: 0,
        actions: []
      };
      stateManager.addPlayer(player);
      players.push(player);
    }
  });

  describe('Basic Integration', () => {
    test('should initialize all components correctly', () => {
      expect(stateManager).toBeDefined();
      expect(actionProcessor).toBeDefined();
      expect(tickLoop).toBeDefined();
      expect(players).toHaveLength(5);
    });

    test('should process actions and update state', () => {
      // Process an action
      const result = actionProcessor.processAction('adjust_control_rods', 'player1', {});
      expect(result.success).toBe(true);

      // Check state was updated
      expect(stateManager.getVariable('power')).toBe(55); // 50 + 5
      expect(stateManager.getEntityProperty('reactor', 'control_rods_position')).toBe(75);
    });

    test('should execute tick rules', { timeout: 10000 }, () => {
      // Set high temperature to trigger rule
      stateManager.setVariable('temperature', 850);

    // Start tick loop
    tickLoop.start();

    // Wait for a few ticks
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        tickLoop.stop();
        
        // Check that temperature increased due to warning rule
        const temperature = stateManager.getVariable('temperature');
        expect(temperature).toBeGreaterThan(850);
        
        resolve();
      }, 1500); // Wait longer for 1000ms interval
    });
    });
  });

  describe('Multiplayer Integration', () => {
    test('should handle multiple players performing actions', () => {
      // Create players first
      const player1 = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player2 = stateManager.addPlayer({
        alias: 'player2',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player3 = stateManager.addPlayer({
        alias: 'player3',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player4 = stateManager.addPlayer({
        alias: 'player4',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player5 = stateManager.addPlayer({
        alias: 'player5',
        role: 'chief',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // All players perform different actions
      const results = [
        actionProcessor.processAction('adjust_control_rods', player1.id, {}),
        actionProcessor.processAction('pump_coolant', player2.id, {}),
        actionProcessor.processAction('inspect_reactor', player3.id, {}),
        actionProcessor.processAction('update_player_score', player4.id, {}),
        actionProcessor.processAction('emergency_shutdown', player5.id, {})
      ];

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Check final state
      expect(stateManager.getVariable('power')).toBe(0); // Emergency shutdown
      expect(stateManager.getVariable('temperature')).toBe(285); // 300 - 15 from coolant
      expect(stateManager.getEntityProperty('reactor', 'emergency_shutdown')).toBe(true);
      expect(stateManager.getVariable('score')).toBe(100); // Global score from update_player_score action
    });

    test('should handle cooldown conflicts between players', () => {
      // Player 1 uses control rods
      const result1 = actionProcessor.processAction('adjust_control_rods', 'player1', {});
      expect(result1.success).toBe(true);

      // Player 2 tries to use control rods immediately (should succeed - cooldowns are per-player)
      const result2 = actionProcessor.processAction('adjust_control_rods', 'player2', {});
      expect(result2.success).toBe(true);

      // But player 1 tries again immediately (should fail due to cooldown)
      const result3 = actionProcessor.processAction('adjust_control_rods', 'player1', {});
      expect(result3.success).toBe(false);
      expect(result3.error).toContain('cooldown');

      // Player 1 can use different actions
      const result4 = actionProcessor.processAction('pump_coolant', 'player1', {});
      expect(result4.success).toBe(true);
    });
  });

  describe('Stress Testing - Full System', () => {
    test('should handle rapid action execution with tick loop running', async () => {
      // Start tick loop with fast interval for testing
      tickLoop.start();

      // Execute many actions rapidly
      const results = [];
      for (let i = 0; i < 100; i++) {
        const playerId = `player${(i % 5) + 1}`;
        const actionName = i % 2 === 0 ? 'adjust_control_rods' : 'pump_coolant';
        const result = actionProcessor.processAction(actionName, playerId, {});
        results.push(result);
      }

      // Wait for tick loop to process
      await new Promise(resolve => setTimeout(resolve, 200));

      // Stop tick loop
      tickLoop.stop();

      // Some actions should succeed (cooldowns will block many)
      const successCount = results.filter(r => r.success).length;
      expect(successCount).toBeGreaterThan(5);

      // Check that tick loop processed some rules (power should have changed from initial 50)
      const power = stateManager.getVariable('power');
      expect(power).not.toBe(50); // Initial power was 50, should have changed due to rules/events
    });

    test('should handle random events during gameplay', { timeout: 10000 }, () => {
      // Add callback to detect random events
      tickLoop.onTick((_tick, state) => {
        if (state.events && state.events.length > 0) {
          // Random event detected
        }
      });

      // Start tick loop with fast interval for testing
      tickLoop.start();

      // Wait for random events
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Random events should have triggered (check power changes)
          const power = stateManager.getVariable('power');
          expect(power).toBeGreaterThan(50); // Power should have increased from random events
          
          resolve();
        }, 2000); // Wait 2 seconds for random events
      });
    });

    test('should handle complex scenario: reactor overheating', { timeout: 10000 }, () => {
      // Start tick loop
      tickLoop.start();

      // Simulate overheating scenario
      stateManager.setVariable('power', 95); // High power
      stateManager.setVariable('temperature', 800); // High temperature

      // Players try to respond
      actionProcessor.processAction('pump_coolant', 'player2', {});
      actionProcessor.processAction('adjust_control_rods', 'player3', {});
      actionProcessor.processAction('emergency_shutdown', 'player1', {}); // Chief can trigger emergency shutdown

      // Wait for tick processing
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();

          // Check that emergency shutdown worked
          expect(stateManager.getVariable('power')).toBe(0);
          expect(stateManager.getEntityProperty('reactor', 'emergency_shutdown')).toBe(true);

          resolve();
        }, 1000);
      });
    });

    test('should handle memory pressure with large state', () => {
      // Create players first
      const players = [];
      for (let i = 1; i <= 5; i++) {
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

      // Clear action history
      actionProcessor.clearActionHistory();

      // Execute many actions to build up state
      for (let i = 0; i < 1000; i++) {
        const playerId = players[i % 5].id;
        const actionName = ['adjust_control_rods', 'pump_coolant', 'inspect_reactor'][i % 3];
        actionProcessor.processAction(actionName, playerId, {});
      }

      // Verify system is still responsive
      const newResult = actionProcessor.processAction('emergency_shutdown', players[0].id, {});
      expect(newResult.success).toBe(true);

      // Check action history
      const history = actionProcessor.getActionHistory();
      expect(history.length).toBeGreaterThan(1000);
    });

    test('should handle concurrent players with different roles', () => {
      // Create players with different roles
      const player1 = stateManager.addPlayer({
        alias: 'player1',
        role: 'chief',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player2 = stateManager.addPlayer({
        alias: 'player2',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player3 = stateManager.addPlayer({
        alias: 'player3',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player4 = stateManager.addPlayer({
        alias: 'player4',
        role: 'chief',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });
      const player5 = stateManager.addPlayer({
        alias: 'player5',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Simulate realistic multiplayer scenario
      const scenarios = [
        { player: player1.id, action: 'adjust_control_rods' },
        { player: player2.id, action: 'pump_coolant' },
        { player: player3.id, action: 'inspect_reactor' },
        { player: player4.id, action: 'emergency_shutdown' },
        { player: player5.id, action: 'update_player_score' }
      ];

      // Execute all scenarios simultaneously
      const results = scenarios.map(scenario => 
        actionProcessor.processAction(scenario.action, scenario.player, {})
      );

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Check final state is consistent
      expect(stateManager.getVariable('power')).toBe(0); // Emergency shutdown
      expect(stateManager.getEntityProperty('reactor', 'emergency_shutdown')).toBe(true);
    });
  });

  describe('Error Recovery', () => {
    test('should recover from invalid actions gracefully', () => {
      // Create a player first
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Mix valid and invalid actions
      const actions = [
        'adjust_control_rods', // valid
        'invalid_action', // invalid
        'pump_coolant', // valid
        'non_existent', // invalid
        'emergency_shutdown' // valid
      ];

      const results = actions.map(action => 
        actionProcessor.processAction(action, player.id, {})
      );

      // Valid actions should succeed, invalid should fail
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
      expect(results[3].success).toBe(false);
      expect(results[4].success).toBe(true);
    });

    test('should handle tick loop errors gracefully', { timeout: 10000 }, () => {
      // Create a rule that might cause errors
      const problematicRule = {
        trigger: 'tick' as const,
        condition: 'invalid_condition',
        effects: [
          {
            type: 'set_var' as const,
            target: 'power',
            value: 50
          }
        ]
      };

      // Add the problematic rule
      gameModel.rules.push(problematicRule);

      // Start tick loop
      tickLoop.start();

      // Should not crash
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Create a player and test system functionality
          const player = stateManager.addPlayer({
            alias: 'player1',
            role: 'engineer',
            joinedAt: Date.now(),
            lastSeen: Date.now(),
            actions: [],
            score: 0
          });
          
          // System should still be functional
          const result = actionProcessor.processAction('emergency_shutdown', player.id, {});
          expect(result.success).toBe(true);
          resolve();
        }, 500);
      });
    });
  });

  describe('Performance Benchmarks', () => {
    test('should process 1000 actions in reasonable time', () => {
      const startTime = Date.now();

      // Execute 1000 actions
      for (let i = 0; i < 1000; i++) {
        const playerId = `player${(i % 5) + 1}`;
        const actionName = ['adjust_control_rods', 'pump_coolant', 'inspect_reactor'][i % 3];
        actionProcessor.processAction(actionName, playerId, {});
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (< 2 seconds)
      expect(duration).toBeLessThan(2000);

      // Verify all actions were processed
      const history = actionProcessor.getActionHistory();
      expect(history.length).toBeGreaterThanOrEqual(1000);
    });

    test('should handle tick loop with high frequency', { timeout: 10000 }, () => {
      // Create high-frequency tick loop
      const fastTickLoop = new GameTickLoop(stateManager, gameModel, 8); // 120 FPS

      const startTime = Date.now();
      fastTickLoop.start();

      // Let it run for 1 second
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          fastTickLoop.stop();
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Should have run for about 1 second
          expect(duration).toBeGreaterThan(900);
          expect(duration).toBeLessThan(1100);

          // Should have processed many ticks
          const tickCount = fastTickLoop.getCurrentTick();
          expect(tickCount).toBeGreaterThan(50);

          resolve();
        }, 1000);
      });
    });
  });
});
