import { describe, test, expect } from 'vitest';
import { GameModelParser } from '../parser.js';

describe('GameModelParser', () => {
  const validGameModel = {
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
      }
    },
    entities: {
      reactor: {
        status: 'active',
        temperature: 300
      }
    },
    actions: [
      {
        name: 'increase_power',
        description: 'Increase power output',
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
      }
    ],
    ui: {
      panels: [
        {
          id: 'main',
          title: 'Main Panel',
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
              config: {},
              bindings: {
                vars: ['power']
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

  test('should parse valid game model', () => {
    const result = GameModelParser.parse(JSON.stringify(validGameModel));
    
    expect(result.meta.name).toBe('Test Game');
    expect(result.vars.power.value).toBe(50);
    expect(result.actions).toHaveLength(1);
    expect(result.rules).toHaveLength(1);
    expect(result.ui.panels).toHaveLength(1);
  });

  test('should throw error for invalid JSON', () => {
    expect(() => {
      GameModelParser.parse('invalid json');
    }).toThrow('Invalid JSON');
  });

  test('should throw error for missing meta', () => {
    const invalidModel = { ...validGameModel };
    // Remove meta property by creating a new object without it
    const { meta, ...invalidModelWithoutMeta } = invalidModel;
    
    expect(() => {
      GameModelParser.parse(JSON.stringify(invalidModelWithoutMeta));
    }).toThrow('Game model must have a meta object');
  });

  test('should throw error for invalid var', () => {
    const invalidModel = {
      ...validGameModel,
      vars: {
        power: {
          value: 'invalid', // Should be number
          min: 0,
          max: 100
        }
      }
    };
    
    expect(() => {
      GameModelParser.parse(JSON.stringify(invalidModel));
    }).toThrow('var.power.value must be a valid number');
  });

  test('should throw error for invalid action', () => {
    const invalidModel = {
      ...validGameModel,
      actions: [
        {
          name: 'test_action',
          effects: [
            {
              type: 'invalid_type', // Invalid effect type
              target: 'power'
            }
          ]
        }
      ]
    };
    
    expect(() => {
      GameModelParser.parse(JSON.stringify(invalidModel));
    }).toThrow('action[0].effects[0].type must be one of: set_var, modify_var, set_entity, trigger_event, message');
  });
});
