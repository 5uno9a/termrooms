import { describe, test, expect } from 'vitest';
import { GameModelParser } from '../parser.js';

describe('Parser Effect Types Validation', () => {
  test('should accept all valid effect types in actions', () => {
    const gameModelJson = {
      meta: {
        name: 'Effect Types Test',
        version: '1.0.0',
        description: 'Test all effect types',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 },
        temperature: { min: 0, max: 1000, value: 300 }
      },
      entities: {
        reactor: { status: 'running' }
      },
      actions: [
        {
          name: 'test_all_effects',
          description: 'Test action with all effect types',
          effects: [
            { type: 'set_var', target: 'power', value: 75 },
            { type: 'modify_var', target: 'power', operation: 'add', value: 10 },
            { type: 'set_entity', target: 'reactor', value: { status: 'stopped' } },
            { type: 'trigger_event', target: 'power_surge' },
            { type: 'message', message: 'Power surge detected!' },
            { type: 'update_score', playerId: 'player1', value: 100 },
            { type: 'add_log', message: 'Action executed successfully' },
            { type: 'add_event', eventType: 'system_alert', message: 'System alert triggered' },
            { type: 'set_status', status: 'paused' }
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

    expect(() => {
      const result = GameModelParser.parse(JSON.stringify(gameModelJson));
      expect(result.actions[0].effects).toHaveLength(9);
    }).not.toThrow();
  });

  test('should accept all valid effect types in rules', () => {
    const gameModelJson = {
      meta: {
        name: 'Rule Effects Test',
        version: '1.0.0',
        description: 'Test all effect types in rules',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 }
      },
      entities: {},
      actions: [],
      rules: [
        {
          trigger: 'tick',
          effects: [
            { type: 'set_var', target: 'power', value: 60 },
            { type: 'modify_var', target: 'power', operation: 'subtract', value: 5 },
            { type: 'add_log', message: 'Tick processed' },
            { type: 'set_status', status: 'running' }
          ]
        }
      ],
      random_events: [],
      ui: {
        panels: [],
        layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
      }
    };

    expect(() => {
      const result = GameModelParser.parse(JSON.stringify(gameModelJson));
      expect(result.rules[0].effects).toHaveLength(4);
    }).not.toThrow();
  });

  test('should accept all valid effect types in random events', () => {
    const gameModelJson = {
      meta: {
        name: 'Random Event Effects Test',
        version: '1.0.0',
        description: 'Test all effect types in random events',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 }
      },
      entities: {},
      actions: [],
      rules: [],
      random_events: [
        {
          name: 'Power Surge',
          description: 'Random power increase',
          probability: 0.1,
          effects: [
            { type: 'modify_var', target: 'power', operation: 'add', value: 20 },
            { type: 'add_log', message: 'Power surge occurred!' },
            { type: 'add_event', eventType: 'power_surge', message: 'System experienced power surge' }
          ]
        }
      ],
      ui: {
        panels: [],
        layout: { type: 'grid', gridSize: 12, maxPanels: 8 }
      }
    };

    expect(() => {
      const result = GameModelParser.parse(JSON.stringify(gameModelJson));
      expect(result.random_events![0].effects).toHaveLength(3);
    }).not.toThrow();
  });

  test('should require target for effects that need it', () => {
    const gameModelJson = {
      meta: {
        name: 'Required Target Test',
        version: '1.0.0',
        description: 'Test required target validation',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 }
      },
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required target',
          effects: [
            { type: 'set_var', value: 75 } // Missing target
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].target is required for set_var effects');
  });

  test('should require operation for modify_var effects', () => {
    const gameModelJson = {
      meta: {
        name: 'Required Operation Test',
        version: '1.0.0',
        description: 'Test required operation validation',
        author: 'Test Author'
      },
      vars: {
        power: { min: 0, max: 100, value: 50 }
      },
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required operation',
          effects: [
            { type: 'modify_var', target: 'power', value: 10 } // Missing operation
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].operation is required for modify_var effects');
  });

  test('should require message for message and add_log effects', () => {
    const gameModelJson = {
      meta: {
        name: 'Required Message Test',
        version: '1.0.0',
        description: 'Test required message validation',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required message',
          effects: [
            { type: 'message' } // Missing message
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].message is required for message effects');
  });

  test('should require playerId for update_score effects', () => {
    const gameModelJson = {
      meta: {
        name: 'Required PlayerId Test',
        version: '1.0.0',
        description: 'Test required playerId validation',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required playerId',
          effects: [
            { type: 'update_score', value: 100 } // Missing playerId
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].playerId is required for update_score effects');
  });

  test('should require eventType for add_event effects', () => {
    const gameModelJson = {
      meta: {
        name: 'Required EventType Test',
        version: '1.0.0',
        description: 'Test required eventType validation',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required eventType',
          effects: [
            { type: 'add_event', message: 'Event occurred' } // Missing eventType
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].eventType is required for add_event effects');
  });

  test('should require status for set_status effects', () => {
    const gameModelJson = {
      meta: {
        name: 'Required Status Test',
        version: '1.0.0',
        description: 'Test required status validation',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action missing required status',
          effects: [
            { type: 'set_status' } // Missing status
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].status is required for set_status effects');
  });

  test('should validate status values', () => {
    const gameModelJson = {
      meta: {
        name: 'Status Validation Test',
        version: '1.0.0',
        description: 'Test status value validation',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action with invalid status',
          effects: [
            { type: 'set_status', status: 'invalid_status' }
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].status must be one of: running, paused, ended, waiting, finished');
  });

  test('should reject invalid effect types', () => {
    const gameModelJson = {
      meta: {
        name: 'Invalid Effect Type Test',
        version: '1.0.0',
        description: 'Test invalid effect type rejection',
        author: 'Test Author'
      },
      vars: {},
      entities: {},
      actions: [
        {
          name: 'invalid_action',
          description: 'Action with invalid effect type',
          effects: [
            { type: 'invalid_effect', target: 'power', value: 50 }
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

    expect(() => {
      GameModelParser.parse(JSON.stringify(gameModelJson));
    }).toThrow('action[0].effects[0].type must be one of: set_var, modify_var, set_entity, trigger_event, message, update_score, add_log, add_event, set_status');
  });
});
