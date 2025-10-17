import { describe, test, expect, beforeEach } from 'vitest';
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
    },
    pump: {
      status: 'off',
      pressure: 0
    }
  },
  actions: [],
  rules: [],
  ui: {
    panels: [],
    layout: {
      type: 'grid',
      gridSize: 12,
      maxPanels: 8
    }
  }
};

describe('GameStateManager', () => {
  let stateManager: GameStateManager;

  beforeEach(() => {
    stateManager = new GameStateManager(testGameModel);
  });

  test('should initialize with default state', () => {
    const state = stateManager.getState();
    
    expect(state.vars.power).toBe(50);
    expect(state.vars.temperature).toBe(25);
    expect(state.entities.reactor.status).toBe('active');
    expect(Object.keys(state.players)).toHaveLength(0);
    expect(state.tick).toBe(0);
    expect(state.status).toBe('waiting');
  });

  test('should add and remove players', () => {
    const player = stateManager.addPlayer({
      alias: 'TestPlayer',
      role: 'operator',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    });

    expect(player.id).toBeDefined();
    expect(player.alias).toBe('TestPlayer');
    expect(player.role).toBe('operator');
    expect(Object.keys(stateManager.getState().players)).toHaveLength(1);

    const removed = stateManager.removePlayer(player.id);
    expect(removed).toBe(true);
    expect(Object.keys(stateManager.getState().players)).toHaveLength(0);
  });

  test('should update variables', () => {
    stateManager.setVariable('power', 75);
    expect(stateManager.getVariable('power')).toBe(75);

    stateManager.modifyVariable('power', 'add', 10);
    expect(stateManager.getVariable('power')).toBe(85);

    stateManager.modifyVariable('power', 'subtract', 5);
    expect(stateManager.getVariable('power')).toBe(80);
  });

  test('should clamp variables to min/max range', () => {
    stateManager.setVariable('power', 150); // Above max (100)
    expect(stateManager.getVariable('power')).toBe(100);

    stateManager.setVariable('power', -10); // Below min (0)
    expect(stateManager.getVariable('power')).toBe(0);
  });

  test('should update entity properties', () => {
    stateManager.setEntityProperty('reactor', 'status', 'critical');
    expect(stateManager.getEntity('reactor').status).toBe('critical');

    stateManager.setEntityProperty('pump', 'pressure', 50);
    expect(stateManager.getEntity('pump').pressure).toBe(50);
  });

  test('should manage game status', () => {
    expect(stateManager.getState().status).toBe('waiting');

    stateManager.startGame();
    expect(stateManager.getState().status).toBe('running');
    expect(stateManager.getState().tick).toBe(0);

    stateManager.pauseGame();
    expect(stateManager.getState().status).toBe('paused');

    stateManager.resumeGame();
    expect(stateManager.getState().status).toBe('running');

    stateManager.endGame('TestPlayer');
    expect(stateManager.getState().status).toBe('finished');
    expect(stateManager.getState().winner).toBe('TestPlayer');
  });

  test('should handle ticks', () => {
    stateManager.startGame();
    expect(stateManager.getState().tick).toBe(0);

    stateManager.incrementTick();
    expect(stateManager.getState().tick).toBe(1);

    stateManager.incrementTick();
    expect(stateManager.getState().tick).toBe(2);
  });

  test('should record actions', () => {
    const player = stateManager.addPlayer({
      alias: 'TestPlayer',
      role: 'operator',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    });

    const action = {
      actionName: 'test_action',
      parameters: { test: 'value' },
      playerId: player.id,
      timestamp: Date.now(),
      success: true
    };

    stateManager.recordAction(action);
    
    const history = stateManager.getActionHistory();
    expect(history).toHaveLength(1);
    expect(history[0].actionName).toBe('test_action');
    expect(stateManager.getState().lastAction).toBe('test_action');
  });

  test('should manage scores', () => {
    const player = stateManager.addPlayer({
      alias: 'TestPlayer',
      role: 'operator',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    });

    stateManager.updateScore(player.id, 100);
    expect(stateManager.getScore(player.id)).toBe(100);

    const scores = stateManager.getScores();
    expect(scores[player.id]).toBe(100);
  });

  test('should check conditions', () => {
    stateManager.setVariable('power', 80);
    stateManager.setVariable('temperature', 30);

    expect(stateManager.checkCondition('power > 70')).toBe(true);
    expect(stateManager.checkCondition('power < 50')).toBe(false);
    expect(stateManager.checkCondition('temperature > 25')).toBe(true);
  });

  test('should reset state', () => {
    stateManager.addPlayer({ 
      alias: 'TestPlayer', 
      role: 'operator',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    });
    stateManager.setVariable('power', 90);
    stateManager.startGame();
    stateManager.incrementTick();

    stateManager.reset();

    const state = stateManager.getState();
    expect(Object.keys(state.players)).toHaveLength(0);
    expect(state.vars.power).toBe(50); // Back to initial value
    expect(state.tick).toBe(0);
    expect(state.status).toBe('waiting');
  });

  test('should get state summary', () => {
    stateManager.addPlayer({ 
      alias: 'TestPlayer', 
      role: 'operator',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      score: 0,
      actions: []
    });
    stateManager.startGame();

    const summary = stateManager.getStateSummary();
    expect(summary.status).toBe('running');
    expect(summary.playerCount).toBe(1);
    expect(summary.variableCount).toBe(2);
    expect(summary.entityCount).toBe(2);
  });
});
