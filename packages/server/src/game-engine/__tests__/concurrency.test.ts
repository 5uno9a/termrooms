import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel, Player } from '../types.js';

describe('Game Engine Concurrency & Race Condition Tests', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Concurrency Test Game',
        version: '1.0.0',
        description: 'Test game for concurrency',
        author: 'Test Author',
        maxPlayers: 50
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 },
        shared_counter: { min: 0, max: 10000, value: 0 },
        score: { min: 0, max: 10000, value: 0 }
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
          name: 'increment_counter',
          description: 'Increment shared counter',
          effects: [
            { type: 'modify_var', target: 'shared_counter', operation: 'add', value: 1 }
          ]
        },
        {
          name: 'decrement_counter',
          description: 'Decrement shared counter',
          effects: [
            { type: 'modify_var', target: 'shared_counter', operation: 'subtract', value: 1 }
          ]
        },
        {
          name: 'set_power',
          description: 'Set power to specific value',
          effects: [
            { type: 'set_var', target: 'power', value: 0 }
          ]
        },
        {
          name: 'modify_power',
          description: 'Modify power by value',
          effects: [
            { type: 'modify_var', target: 'power', operation: 'add', value: 0 }
          ]
        }
      ],
      rules: [
        {
          trigger: 'tick',
          frequency: 1,
          condition: 'shared_counter >= 100',
          effects: [
            { type: 'set_var', target: 'shared_counter', value: 0 }
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

  describe('Simultaneous Actions', () => {
    test('should handle multiple players acting simultaneously', async () => {
      // Add multiple players
      const players: Player[] = [];
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

      // All players act simultaneously
      const promises = players.map(player => 
        actionProcessor.processAction('increment_counter', player.id, {})
      );

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Counter should be incremented by the number of players
      expect(stateManager.getVariable('shared_counter')).toBe(10);
    });

    test('should handle conflicting actions on same variable', async () => {
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

      // Both players try to modify the same variable simultaneously
      const promises = [
        actionProcessor.processAction('increment_counter', player1.id, {}),
        actionProcessor.processAction('decrement_counter', player2.id, {})
      ];

      const results = await Promise.all(promises);

      // Both actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Counter should be 0 (1 - 1)
      expect(stateManager.getVariable('shared_counter')).toBe(0);
    });

    test('should handle rapid sequential actions from same player', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Process 100 actions rapidly
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          actionProcessor.processAction('increment_counter', player.id, {})
        );
      }

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Counter should be 100
      expect(stateManager.getVariable('shared_counter')).toBe(100);
    });

    test('should handle mixed action types simultaneously', async () => {
      const players: Player[] = [];
      for (let i = 0; i < 5; i++) {
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

      // Mix of increment and decrement actions
      const promises = [
        actionProcessor.processAction('increment_counter', players[0].id, {}),
        actionProcessor.processAction('increment_counter', players[1].id, {}),
        actionProcessor.processAction('decrement_counter', players[2].id, {}),
        actionProcessor.processAction('increment_counter', players[3].id, {}),
        actionProcessor.processAction('decrement_counter', players[4].id, {})
      ];

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Counter should be 1 (3 increments - 2 decrements)
      expect(stateManager.getVariable('shared_counter')).toBe(1);
    });
  });

  describe('Tick Loop Concurrency', () => {
    test('should handle actions during tick processing', async () => {
      let tickCount = 0;
      tickLoop.onTick(() => {
        tickCount++;
      });

      tickLoop.start();

      // Wait for a few ticks, then process actions
      await new Promise(resolve => setTimeout(resolve, 100));

      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Process actions while tick loop is running
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          actionProcessor.processAction('increment_counter', player.id, {})
        );
      }

      const results = await Promise.all(promises);

      // Wait for more ticks
      await new Promise(resolve => setTimeout(resolve, 100));

      tickLoop.stop();

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Should have processed some ticks
      expect(tickCount).toBeGreaterThan(0);
    });

    test('should handle rapid start/stop cycles with concurrent actions', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Rapidly start and stop tick loop while processing actions
      const promises = [];
      for (let i = 0; i < 20; i++) {
        // Start tick loop
        tickLoop.start();
        
        // Process some actions
        promises.push(
          actionProcessor.processAction('increment_counter', player.id, {})
        );
        
        // Stop tick loop
        tickLoop.stop();
      }

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Tick loop should be stopped
      expect(tickLoop.getStatusString()).toBe('stopped');
    });

    test('should handle tick loop state changes during action processing', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      tickLoop.start();

      // Process actions while tick loop is running
      const actionPromise = actionProcessor.processAction('increment_counter', player.id, {});

      // Change tick loop state during action processing
      tickLoop.pause();
      tickLoop.resume();
      tickLoop.pause();
      tickLoop.resume();

      const result = await actionPromise;

      tickLoop.stop();

      // Action should still succeed
      expect(result.success).toBe(true);
    });
  });

  describe('State Consistency', () => {
    test('should maintain state consistency under concurrent modifications', async () => {
      const players: Player[] = [];
      for (let i = 0; i < 20; i++) {
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

      // All players modify the same variable simultaneously
      const promises = players.map(player => 
        actionProcessor.processAction('increment_counter', player.id, {})
      );

      await Promise.all(promises);

      // Counter should be exactly 20
      expect(stateManager.getVariable('shared_counter')).toBe(20);
    });

    test('should handle entity modifications under concurrent access', async () => {
      const players: Player[] = [];
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

      // Create actions that modify entity properties
      const entityAction = {
        name: 'modify_reactor',
        description: 'Modify reactor status',
        effects: [
          { type: 'set_entity' as const, target: 'reactor', value: { status: 'modified' } }
        ]
      };

      gameModel.actions.push(entityAction);

      // All players modify the same entity simultaneously
      const promises = players.map(player => 
        actionProcessor.processAction('modify_reactor', player.id, {})
      );

      await Promise.all(promises);

      // Entity should be in a consistent state
      const reactor = stateManager.getEntity('reactor');
      expect(reactor).toBeDefined();
      expect(reactor.status).toBe('modified');
    });

    test('should handle score updates under concurrent access', async () => {
      const players: Player[] = [];
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

      // Create actions that update scores - each player updates their own score
      const scoreAction = {
        name: 'update_score',
        description: 'Update player score',
        effects: [
          { type: 'modify_var' as const, target: 'score', operation: 'add' as const, value: 10 }
        ]
      };

      gameModel.actions.push(scoreAction);

      // Multiple players try to update the same player's score
      const promises = players.map(player => 
        actionProcessor.processAction('update_score', player.id, {})
      );

      await Promise.all(promises);

      // Score should be consistent - check the global score variable
      const totalScore = stateManager.getVariable('score');
      expect(totalScore).toBe(10 * players.length);
    });
  });

  describe('Player Disconnection Scenarios', () => {
    test('should handle player removal during action processing', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Start processing an action
      const actionPromise = actionProcessor.processAction('increment_counter', player.id, {});

      // Remove player during action processing
      stateManager.removePlayer(player.id);

      const result = await actionPromise;

      // Action should still succeed (player was valid when action started)
      expect(result.success).toBe(true);
    });

    test('should handle multiple players disconnecting simultaneously', async () => {
      const players: Player[] = [];
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

      // All players process actions
      const promises = players.map(player => 
        actionProcessor.processAction('increment_counter', player.id, {})
      );

      // Remove all players during action processing
      players.forEach(player => {
        stateManager.removePlayer(player.id);
      });

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // No players should remain
      expect(Object.keys(stateManager.getState().players)).toHaveLength(0);
    });

    test('should handle player reconnection with same alias', async () => {
      const player1 = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Process some actions
      await actionProcessor.processAction('increment_counter', player1.id, {});

      // Remove player
      stateManager.removePlayer(player1.id);

      // Add player with same alias (different ID)
      const player2 = stateManager.addPlayer({
        alias: 'player1',
        role: 'chief',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 100
      });

      // New player should be able to process actions
      const result = await actionProcessor.processAction('increment_counter', player2.id, {});

      expect(result.success).toBe(true);
      expect(player2.id).not.toBe(player1.id);
      expect(player2.alias).toBe('player1');
    });
  });

  describe('Race Condition Prevention', () => {
    test('should prevent race conditions in variable modifications', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      // Create a custom action that reads and modifies the same variable
      const raceAction = {
        name: 'race_condition_test',
        description: 'Test for race conditions',
        effects: [
          { type: 'modify_var' as const, target: 'shared_counter', operation: 'add' as const, value: 1 },
          { type: 'modify_var' as const, target: 'shared_counter', operation: 'add' as const, value: 1 }
        ]
      };

      gameModel.actions.push(raceAction);

      // Process the action multiple times
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          actionProcessor.processAction('race_condition_test', player.id, {})
        );
      }

      const results = await Promise.all(promises);

      // All actions should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // Counter should be exactly 100 (50 actions * 2 increments each)
      expect(stateManager.getVariable('shared_counter')).toBe(100);
    });

    test('should handle concurrent tick loop and action processing', async () => {
      const player = stateManager.addPlayer({
        alias: 'player1',
        role: 'engineer',
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        actions: [],
        score: 0
      });

      let tickCount = 0;
      tickLoop.onTick(() => {
        tickCount++;
        // Modify state during tick
        stateManager.modifyVariable('shared_counter', 'add', 1);
      });

      tickLoop.start();

      // Process actions concurrently with tick loop
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          actionProcessor.processAction('increment_counter', player.id, {})
        );
      }

      await Promise.all(promises);

      // Wait for more ticks
      await new Promise(resolve => setTimeout(resolve, 200));

      tickLoop.stop();

      // Both tick loop and actions should have modified the counter
      const finalCount = stateManager.getVariable('shared_counter');
      expect(finalCount).toBeGreaterThan(10); // Actions + ticks (more reasonable expectation)
      expect(tickCount).toBeGreaterThan(0);
    });
  });
});
