import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { TickLoop } from '../tick-loop.js';
import { GameStateManager } from '../state-manager.js';
import { GameModel } from '../types.js';

const testGameModel: GameModel = {
  meta: {
    name: 'Test Game',
    version: '1.0.0',
    description: 'A test game',
    author: 'Test Author'
  },
  vars: {
    power: {
      value: 50,
      min: 0,
      max: 100,
      unit: 'MW',
      label: 'Power Output'
    },
    temperature: {
      value: 25,
      min: 0,
      max: 100,
      unit: '°C',
      label: 'Temperature'
    }
  },
  entities: {
    reactor: {
      status: 'active',
      temperature: 300
    }
  },
  actions: [],
  rules: [
    {
      trigger: 'tick',
      effects: [
        {
          type: 'modify_var',
          target: 'power',
          operation: 'subtract',
          value: 1
        }
      ]
    },
    {
      trigger: 'tick',
      frequency: 2, // Every 2 ticks
      effects: [
        {
          type: 'modify_var',
          target: 'temperature',
          operation: 'add',
          value: 5
        }
      ]
    }
  ],
  random_events: [
    {
      name: 'Power Surge',
      description: 'Random power increase',
      probability: 0, // Disabled for this test
      effects: [
        {
          type: 'modify_var',
          target: 'power',
          operation: 'add',
          value: 10
        }
      ]
    }
  ],
  ui: {
    panels: [],
    layout: {
      type: 'grid',
      gridSize: 12,
      maxPanels: 8
    }
  }
};

describe('TickLoop', () => {
  let stateManager: GameStateManager;
  let tickLoop: TickLoop;

  beforeEach(() => {
    stateManager = new GameStateManager(testGameModel);
    tickLoop = new TickLoop(stateManager);
  });

  afterEach(() => {
    tickLoop.destroy();
  });

  test('should start and stop tick loop', () => {
    expect(tickLoop.isTickLoopRunning()).toBe(false);

    tickLoop.start(100); // 100ms interval for testing
    expect(tickLoop.isTickLoopRunning()).toBe(true);

    tickLoop.stop();
    expect(tickLoop.isTickLoopRunning()).toBe(false);
  });

  test('should pause and resume tick loop', () => {
    tickLoop.start(100);
    expect(tickLoop.isTickLoopRunning()).toBe(true);

    tickLoop.pause();
    expect(tickLoop.isTickLoopRunning()).toBe(false);
    expect(stateManager.getState().status).toBe('paused');

    tickLoop.resume(100);
    expect(tickLoop.isTickLoopRunning()).toBe(true);
  });

  test('should execute tick rules', async () => {
    tickLoop.start(50); // Fast interval for testing
    
    // Wait for a few ticks
    await new Promise(resolve => setTimeout(resolve, 200));
    
    tickLoop.stop();
    
    const state = stateManager.getState();
    expect(state.tick).toBeGreaterThan(0);
    expect(state.vars.power).toBeLessThan(50); // Should have decreased
  });

  test('should execute frequency-based rules', async () => {
    tickLoop.start(50);
    
    // Wait for multiple ticks
    await new Promise(resolve => setTimeout(resolve, 300));
    
    tickLoop.stop();
    
    const state = stateManager.getState();
    expect(state.tick).toBeGreaterThan(2);
    // Temperature should have increased (every 2 ticks)
    expect(state.vars.temperature).toBeGreaterThan(25);
  });

  test('should handle tick callbacks', async () => {
    let callbackCount = 0;
    
    return new Promise<void>((resolve) => {
      tickLoop.onTick((tick, state) => {
        callbackCount++;
        if (callbackCount >= 2) {
          expect(tick).toBeGreaterThan(0);
          expect(state.vars.power).toBeDefined();
          tickLoop.stop();
          resolve();
        }
      });

      tickLoop.start(50);
    });
  });

  test('should handle error callbacks', async () => {
    return new Promise<void>((resolve) => {
      tickLoop.onError((error) => {
        expect(error).toBeInstanceOf(Error);
        resolve();
      });

      // Mock the stateManager to throw an error
      const originalSetEntityProperty = stateManager.setEntityProperty;
      stateManager.setEntityProperty = () => {
        throw new Error('Test error for callback');
      };
      
      // This should trigger an error
      (tickLoop as any).executeEffect({
        type: 'set_entity',
        target: 'reactor',
        value: { status: 'broken' }
      });
      
      // Restore the original method
      stateManager.setEntityProperty = originalSetEntityProperty;
    });
  });

  test('should get current tick', () => {
    expect(tickLoop.getCurrentTick()).toBe(0);

    tickLoop.forceTick();
    expect(tickLoop.getCurrentTick()).toBe(1);

    tickLoop.forceTick();
    expect(tickLoop.getCurrentTick()).toBe(2);
  });

  test('should get status', () => {
    const status = tickLoop.getStatus();
    expect(status.running).toBe(false);
    expect(status.currentTick).toBe(0);
    expect(status.gameStatus).toBe('waiting');

    tickLoop.start(100);
    const runningStatus = tickLoop.getStatus();
    expect(runningStatus.running).toBe(true);
  });

  test('should get tick statistics', () => {
    const stats = tickLoop.getTickStats();
    expect(stats.currentTick).toBe(0);
    expect(stats.isRunning).toBe(false);
    expect(stats.callbackCount).toBe(0);
    expect(stats.errorCallbackCount).toBe(0);

    // Add callbacks
    const tickCallback = () => {};
    const errorCallback = () => {};
    
    tickLoop.onTick(tickCallback);
    tickLoop.onError(errorCallback);

    const updatedStats = tickLoop.getTickStats();
    expect(updatedStats.callbackCount).toBe(1);
    expect(updatedStats.errorCallbackCount).toBe(1);
  });

  test('should remove callbacks', () => {
    const tickCallback = () => {};
    const errorCallback = () => {};

    tickLoop.onTick(tickCallback);
    tickLoop.onError(errorCallback);

    expect(tickLoop.getTickStats().callbackCount).toBe(1);
    expect(tickLoop.getTickStats().errorCallbackCount).toBe(1);

    tickLoop.removeTickCallback(tickCallback);
    tickLoop.removeErrorCallback(errorCallback);

    expect(tickLoop.getTickStats().callbackCount).toBe(0);
    expect(tickLoop.getTickStats().errorCallbackCount).toBe(0);
  });

  test('should set tick interval', () => {
    tickLoop.start(100);
    expect(tickLoop.isTickLoopRunning()).toBe(true);

    tickLoop.setTickInterval(200);
    expect(tickLoop.isTickLoopRunning()).toBe(true);

    tickLoop.stop();
  });

  test('should force execute tick', () => {
    const initialTick = tickLoop.getCurrentTick();
    
    tickLoop.forceTick();
    expect(tickLoop.getCurrentTick()).toBe(initialTick + 1);

    tickLoop.forceTick();
    expect(tickLoop.getCurrentTick()).toBe(initialTick + 2);
  });

  test('should clean up on destroy', () => {
    const tickCallback = () => {};
    const errorCallback = () => {};

    tickLoop.onTick(tickCallback);
    tickLoop.onError(errorCallback);
    tickLoop.start(100);

    tickLoop.destroy();

    expect(tickLoop.isTickLoopRunning()).toBe(false);
    expect(tickLoop.getTickStats().callbackCount).toBe(0);
    expect(tickLoop.getTickStats().errorCallbackCount).toBe(0);
  });
});
