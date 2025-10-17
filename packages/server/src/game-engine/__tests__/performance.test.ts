import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { GameStateManager } from '../state-manager.js';
import { GameTickLoop } from '../game-tick-loop.js';
import { ActionProcessor } from '../action-processor.js';
import { GameModel, Player } from '../types.js';

describe('Game Engine Performance & Memory Tests', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;
  let tickLoop: GameTickLoop;
  let actionProcessor: ActionProcessor;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Performance Test Game',
        version: '1.0.0',
        description: 'Test game for performance',
        author: 'Test Author',
        maxPlayers: 100
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
          name: 'increment_power',
          description: 'Increment power by 1',
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 1 }
          ]
        },
        {
          name: 'decrement_power',
          description: 'Decrement power by 1',
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'subtract' as const, value: 1 }
          ]
        },
        {
          name: 'set_temperature',
          description: 'Set temperature',
          effects: [
            { type: 'set_var' as const, target: 'temperature', value: 0 }
          ]
        }
      ],
      rules: [
        {
          trigger: 'tick' as const,
          frequency: 1,
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'subtract' as const, value: 0.1 }
          ]
        }
      ],
      random_events: [
        {
          name: 'Power Surge',
          description: 'Random power increase',
          probability: 0.01,
          effects: [
            { type: 'modify_var' as const, target: 'power', operation: 'add' as const, value: 5 }
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
  });

  afterEach(() => {
    if (tickLoop.getStatusString() === 'running') {
      tickLoop.stop();
    }
  });

  describe('Memory Leak Detection', () => {
    test('should not leak memory with long-running tick loop', { timeout: 10000 }, () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
          
          const finalMemory = process.memoryUsage().heapUsed;
          const memoryIncrease = finalMemory - initialMemory;
          
          // Memory increase should be reasonable (less than 10MB)
          expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
          resolve();
        }, 2000);
      });
    });

    test('should not leak memory with large action history', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process 1000 actions
      for (let i = 0; i < 1000; i++) {
        actionProcessor.processAction('increment_power', 'player1', {});
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });

    test('should not leak memory with many players', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Add 100 players
      for (let i = 0; i < 100; i++) {
        stateManager.addPlayer({
          alias: `player${i}`,
          role: 'engineer',
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          actions: [],
          score: 0
        });
      }
      
      // Process actions for all players
      for (let i = 0; i < 100; i++) {
        actionProcessor.processAction('increment_power', `player${i}`, {});
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 3MB)
      expect(memoryIncrease).toBeLessThan(3 * 1024 * 1024);
    });

    test('should clean up properly when tick loop is destroyed', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Create and destroy multiple tick loops
      for (let i = 0; i < 10; i++) {
        const tempTickLoop = new GameTickLoop(stateManager, gameModel, 16);
        tempTickLoop.start();
        tempTickLoop.stop();
        // Tick loop should be cleaned up automatically
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
    });
  });

  describe('Performance Benchmarks', () => {
    test('should process 1000 actions in reasonable time', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        actionProcessor.processAction('increment_power', 'player1', {});
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should process 1000 actions in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    test('should handle 60 FPS tick loop performance', { timeout: 5000 }, () => {
      let tickCount = 0;
      const startTime = performance.now();
      
      tickLoop.onTick(() => {
        tickCount++;
      });
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          const endTime = performance.now();
          const duration = endTime - startTime;
          const expectedTicks = Math.floor(duration / 16); // 16ms = 60 FPS
          const tolerance = 0.1; // 10% tolerance
          
          expect(tickCount).toBeGreaterThan(expectedTicks * (1 - tolerance));
          expect(tickCount).toBeLessThan(expectedTicks * (1 + tolerance));
          resolve();
        }, 1000);
      });
    });

    test('should handle high-frequency tick loop (120 FPS)', { timeout: 5000 }, () => {
      const highFreqTickLoop = new GameTickLoop(stateManager, gameModel, 8); // 8ms = 120 FPS
      let tickCount = 0;
      const startTime = performance.now();
      
      highFreqTickLoop.onTick(() => {
        tickCount++;
      });
      
      highFreqTickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          highFreqTickLoop.stop();
          
          const endTime = performance.now();
          const duration = endTime - startTime;
          const expectedTicks = Math.floor(duration / 8); // 8ms = 120 FPS
          const tolerance = 0.15; // 15% tolerance for higher frequency
          
          expect(tickCount).toBeGreaterThan(expectedTicks * (1 - tolerance));
          expect(tickCount).toBeLessThan(expectedTicks * (1 + tolerance));
          resolve();
        }, 1000);
      });
    });

    test('should handle concurrent action processing', () => {
      const startTime = performance.now();
      const promises: Promise<any>[] = [];
      
      // Process 100 actions concurrently
      for (let i = 0; i < 100; i++) {
        promises.push(
          new Promise(resolve => {
            setTimeout(() => {
              const result = actionProcessor.processAction('increment_power', 'player1', {});
              resolve(result);
            }, Math.random() * 10); // Random delay 0-10ms
          })
        );
      }
      
      return Promise.all(promises).then(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Should handle 100 concurrent actions in less than 200ms
        expect(duration).toBeLessThan(200);
      });
    });

    test('should handle large state updates efficiently', () => {
      const startTime = performance.now();
      
      // Update 1000 variables
      for (let i = 0; i < 1000; i++) {
        stateManager.setVariable('power', Math.random() * 100);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should update 1000 variables in less than 50ms
      expect(duration).toBeLessThan(50);
    });

    test('should handle large entity updates efficiently', () => {
      const startTime = performance.now();
      
      // Update 1000 entity properties
      for (let i = 0; i < 1000; i++) {
        stateManager.setEntityProperty('reactor', `property${i}`, Math.random());
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should update 1000 entity properties in less than 50ms
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Stress Testing', () => {
    test('should handle rapid start/stop cycles', () => {
      const startTime = performance.now();
      
      // Rapidly start and stop tick loop 100 times
      for (let i = 0; i < 100; i++) {
        tickLoop.start();
        tickLoop.stop();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should handle 100 cycles in less than 1000ms
      expect(duration).toBeLessThan(1000);
      expect(tickLoop.getStatusString()).toBe('stopped');
    });

    test('should handle mixed action types under load', () => {
      const startTime = performance.now();
      const actions = ['increment_power', 'decrement_power', 'set_temperature'];
      
      // Process 500 mixed actions
      for (let i = 0; i < 500; i++) {
        const action = actions[i % actions.length];
        actionProcessor.processAction(action, 'player1', {});
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should process 500 mixed actions in less than 200ms
      expect(duration).toBeLessThan(200);
    });

    test('should handle tick loop with heavy random events', { timeout: 5000 }, () => {
      // Increase random event probability for stress testing
      gameModel.random_events![0].probability = 0.5; // 50% chance
      
      const initialPower = stateManager.getVariable('power') || 0;
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          // Should have triggered some random events (check power increase)
          const finalPower = stateManager.getVariable('power') || 0;
          expect(finalPower).toBeGreaterThan(initialPower);
          resolve();
        }, 1000);
      });
    });

    test('should handle large number of players with actions', () => {
      const startTime = performance.now();
      
      // Add 50 players
      const players: Player[] = [];
      for (let i = 0; i < 50; i++) {
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
      
      // Each player performs 10 actions
      for (const player of players) {
        for (let i = 0; i < 10; i++) {
          actionProcessor.processAction('increment_power', player.id, {});
        }
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should handle 500 actions (50 players * 10 actions) in less than 300ms
      expect(duration).toBeLessThan(300);
      expect(Object.keys(stateManager.getState().players)).toHaveLength(50);
    });
  });

  describe('CPU Usage Optimization', () => {
    test('should not consume excessive CPU during idle tick loop', { timeout: 3000 }, () => {
      const startTime = performance.now();
      let tickCount = 0;
      
      tickLoop.onTick(() => {
        tickCount++;
      });
      
      tickLoop.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          tickLoop.stop();
          
          const endTime = performance.now();
          const duration = endTime - startTime;
          const expectedTicks = Math.floor(duration / 16);
          
          // Tick count should be close to expected (within 20% tolerance)
          expect(tickCount).toBeGreaterThan(expectedTicks * 0.8);
          expect(tickCount).toBeLessThan(expectedTicks * 1.2);
          resolve();
        }, 1000);
      });
    });

    test('should handle tick loop with minimal CPU impact when paused', () => {
      const startTime = performance.now();
      
      // Start and immediately pause
      tickLoop.start();
      tickLoop.pause();
      
      // Wait for a bit
      const waitTime = 100;
      const endTime = performance.now() + waitTime;
      
      while (performance.now() < endTime) {
        // Busy wait to simulate other work
      }
      
      const actualWaitTime = performance.now() - startTime;
      
      // Should not have significant overhead
      expect(actualWaitTime).toBeLessThan(waitTime + 50); // 50ms tolerance
    });
  });
});
