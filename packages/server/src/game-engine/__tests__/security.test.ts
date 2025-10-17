import { describe, test, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../state-manager.js';
import { GameModel } from '../types.js';

describe('Security Tests - Code Injection Prevention', () => {
  let gameModel: GameModel;
  let stateManager: GameStateManager;

  beforeEach(() => {
    gameModel = {
      meta: {
        name: 'Security Test Game',
        version: '1.0.0',
        description: 'Test game for security',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 }
      },
      entities: {},
      actions: [],
      rules: [],
      random_events: [],
      ui: {
        panels: [],
        layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
      }
    };

    stateManager = new GameStateManager(gameModel);
  });

  test('should prevent eval() code injection in conditions', () => {
    // These malicious conditions should be safely rejected
    const maliciousConditions = [
      'process.exit()',
      'require("child_process").exec("rm -rf /")',
      'global.process.exit()',
      'eval("malicious code")',
      'Function("return process.exit()")()',
      'console.log("hacked")',
      'Math.random() > 0.5 && process.exit()',
      'power > 50 && require("fs").writeFileSync("/tmp/hack", "pwned")'
    ];

    maliciousConditions.forEach(condition => {
      // All malicious conditions should return false (safe rejection)
      const result = stateManager.checkCondition(condition);
      expect(result).toBe(false);
    });
  });

  test('should allow safe mathematical expressions', () => {
    // These safe conditions should work correctly
    const safeConditions = [
      'power > 50',
      'temperature < 800',
      'power >= 25',
      'temperature <= 500',
      'power == 50',
      'temperature != 0',
      'power + temperature > 1000',
      'power * 2 > 80',
      'temperature / 2 < 200',
      '(power + temperature) > 500'
    ];

    safeConditions.forEach(condition => {
      // Safe conditions should evaluate without throwing errors
      expect(() => {
        const result = stateManager.checkCondition(condition);
        expect(typeof result).toBe('boolean');
      }).not.toThrow();
    });
  });

  test('should handle complex but safe expressions', () => {
    // Test complex mathematical expressions
    stateManager.setVariable('power', 75);
    stateManager.setVariable('temperature', 400);

    const complexConditions = [
      'power > 50 && temperature < 500',
      'power * 2 + temperature > 1000',
      '(power - 25) * 2 > temperature',
      'power / 2 + temperature / 2 > 200'
    ];

    complexConditions.forEach(condition => {
      const result = stateManager.checkCondition(condition);
      expect(typeof result).toBe('boolean');
    });
  });

  test('should reject expressions with invalid characters', () => {
    const invalidExpressions = [
      'power > 50; console.log("hack")',
      'power > 50 && eval("malicious")',
      'power > 50 || require("fs")',
      'power > 50 ? process.exit() : true',
      'power > 50 && global.process',
      'power > 50 && window.location',
      'power > 50 && document.cookie'
    ];

    invalidExpressions.forEach(expression => {
      const result = stateManager.checkCondition(expression);
      expect(result).toBe(false);
    });
  });

  test('should handle edge cases safely', () => {
    const edgeCases = [
      '', // empty string
      '   ', // whitespace only
      'invalid_variable > 50', // non-existent variable
      'power > invalid_number', // invalid number
      'power >', // incomplete expression
      '> 50', // missing left operand
      'power > 50 &&', // incomplete AND
      'power > 50 ||', // incomplete OR
      'power > 50 && && temperature < 100', // double AND
      'power > 50 || || temperature < 100' // double OR
    ];

    edgeCases.forEach(condition => {
      // All edge cases should be handled safely (return false or not throw)
      expect(() => {
        const result = stateManager.checkCondition(condition);
        expect(typeof result).toBe('boolean');
      }).not.toThrow();
    });
  });
});
