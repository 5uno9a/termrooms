import { GameModel, Variable, Entity, Action, Rule, RandomInit, RandomEvent, PanelLayout, Widget } from './types.js';

export class GameModelParser {
  /**
   * Parse and validate a JSON game model
   */
  static parse(jsonString: string): GameModel {
    try {
      const data = JSON.parse(jsonString);

      // Check if data is null or not an object
      if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Game model must be an object');
      }

      return this.validateAndNormalize(data);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game model must be an object') {
        throw error;
      }
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate and normalize a game model object
   */
  static validateAndNormalize(data: any): GameModel {
    // Validate meta
    if (!data.meta || typeof data.meta !== 'object') {
      throw new Error('Game model must have a meta object');
    }

    const meta = {
      name: this.validateString(data.meta.name, 'meta.name'),
      version: this.validateString(data.meta.version, 'meta.version'),
      description: this.validateString(data.meta.description, 'meta.description'),
      author: this.validateString(data.meta.author, 'meta.author'),
      seed: data.meta.seed ? this.validateNumber(data.meta.seed, 'meta.seed') : undefined
    };

    // Validate vars
    const vars = this.validateVars(data.vars || {});

    // Validate entities
    const entities = this.validateEntities(data.entities || {});

    // Validate actions
    const actions = this.validateActions(data.actions || []);

    // Validate rules
    const rules = this.validateRules(data.rules || []);

    // Validate random initialization
    const init_random = data.init_random ? this.validateRandomInit(data.init_random) : undefined;

    // Validate random events
    const random_events = data.random_events ? this.validateRandomEvents(data.random_events) : undefined;

    // Validate UI
    const ui = this.validateUI(data.ui || {});

    return {
      meta,
      vars,
      entities,
      actions,
      rules,
      init_random,
      random_events,
      ui
    };
  }

  private static validateString(value: any, path: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${path} must be a non-empty string`);
    }
    return value.trim();
  }

  private static validateNumber(value: any, path: string): number {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`${path} must be a valid number`);
    }
    return value;
  }

  private static validateVars(vars: any): Record<string, Variable> {
    if (typeof vars !== 'object' || vars === null) {
      throw new Error('vars must be an object');
    }

    const result: Record<string, Variable> = {};
    for (const [key, value] of Object.entries(vars)) {
      if (typeof value !== 'object' || value === null) {
        throw new Error(`var.${key} must be an object`);
      }

      const varObj = value as any;
      result[key] = {
        value: this.validateNumber(varObj.value, `var.${key}.value`),
        min: this.validateNumber(varObj.min, `var.${key}.min`),
        max: this.validateNumber(varObj.max, `var.${key}.max`),
        unit: varObj.unit ? this.validateString(varObj.unit, `var.${key}.unit`) : undefined,
        label: varObj.label ? this.validateString(varObj.label, `var.${key}.label`) : undefined,
        description: varObj.description ? this.validateString(varObj.description, `var.${key}.description`) : undefined
      };
    }

    return result;
  }

  private static validateEntities(entities: any): Record<string, Entity> {
    if (typeof entities !== 'object' || entities === null) {
      throw new Error('entities must be an object');
    }

    const result: Record<string, Entity> = {};
    for (const [key, value] of Object.entries(entities)) {
      if (typeof value !== 'object' || value === null) {
        throw new Error(`entity.${key} must be an object`);
      }
      result[key] = value as Entity;
    }

    return result;
  }

  private static validateActions(actions: any): Action[] {
    if (!Array.isArray(actions)) {
      throw new Error('actions must be an array');
    }

    return actions.map((action, index) => {
      if (typeof action !== 'object' || action === null) {
        throw new Error(`action[${index}] must be an object`);
      }

      return {
        name: this.validateString(action.name, `action[${index}].name`),
        description: action.description ? this.validateString(action.description, `action[${index}].description`) : undefined,
        parameters: action.parameters ? this.validateActionParameters(action.parameters, index) : undefined,
        effects: this.validateActionEffects(action.effects, index),
        requirements: action.requirements ? this.validateActionRequirements(action.requirements, index) : undefined,
        cooldown: action.cooldown ? this.validateNumber(action.cooldown, `action[${index}].cooldown`) : undefined
      };
    });
  }

  private static validateActionParameters(parameters: any, actionIndex: number): any[] {
    if (!Array.isArray(parameters)) {
      throw new Error(`action[${actionIndex}].parameters must be an array`);
    }

    return parameters.map((param, index) => {
      if (typeof param !== 'object' || param === null) {
        throw new Error(`action[${actionIndex}].parameters[${index}] must be an object`);
      }

      return {
        name: this.validateString(param.name, `action[${actionIndex}].parameters[${index}].name`),
        type: this.validateActionParameterType(param.type, `action[${actionIndex}].parameters[${index}].type`),
        required: typeof param.required === 'boolean' ? param.required : false,
        options: param.options ? this.validateStringArray(param.options, `action[${actionIndex}].parameters[${index}].options`) : undefined,
        default: param.default
      };
    });
  }

  private static validateActionParameterType(type: any, path: string): string {
    const validTypes = ['string', 'number', 'boolean', 'select'];
    if (!validTypes.includes(type)) {
      throw new Error(`${path} must be one of: ${validTypes.join(', ')}`);
    }
    return type;
  }

  private static validateStringArray(value: any, path: string): string[] {
    if (!Array.isArray(value)) {
      throw new Error(`${path} must be an array`);
    }
    return value.map((item, index) => this.validateString(item, `${path}[${index}]`));
  }

  private static validateActionEffects(effects: any, actionIndex: number): any[] {
    if (!Array.isArray(effects)) {
      throw new Error(`action[${actionIndex}].effects must be an array`);
    }

    return effects.map((effect, index) => {
      if (typeof effect !== 'object' || effect === null) {
        throw new Error(`action[${actionIndex}].effects[${index}] must be an object`);
      }

      const effectType = this.validateActionEffectType(effect.type, `action[${actionIndex}].effects[${index}].type`);

      // Validate target - required for some effects, optional for others
      let target = undefined;
      if (effect.target !== undefined) {
        target = this.validateString(effect.target, `action[${actionIndex}].effects[${index}].target`);
      } else if (['set_var', 'modify_var', 'set_entity'].includes(effectType)) {
        throw new Error(`action[${actionIndex}].effects[${index}].target is required for ${effectType} effects`);
      }

      // Validate value
      let value = undefined;
      if (effect.value !== undefined) {
        value = effect.value;
      }

      // Validate operation - required for modify_var
      let operation = undefined;
      if (effect.operation !== undefined) {
        operation = this.validateOperation(effect.operation, `action[${actionIndex}].effects[${index}].operation`);
      } else if (effectType === 'modify_var') {
        throw new Error(`action[${actionIndex}].effects[${index}].operation is required for modify_var effects`);
      }

      // Validate message - required for message and add_log effects
      let message = undefined;
      if (effect.message !== undefined) {
        message = this.validateString(effect.message, `action[${actionIndex}].effects[${index}].message`);
      } else if (['message', 'add_log'].includes(effectType)) {
        throw new Error(`action[${actionIndex}].effects[${index}].message is required for ${effectType} effects`);
      }

      // Validate playerId - required for update_score
      let playerId = undefined;
      if (effect.playerId !== undefined) {
        playerId = this.validateString(effect.playerId, `action[${actionIndex}].effects[${index}].playerId`);
      } else if (effectType === 'update_score') {
        throw new Error(`action[${actionIndex}].effects[${index}].playerId is required for update_score effects`);
      }

      // Validate eventType - required for add_event
      let eventType = undefined;
      if (effect.eventType !== undefined) {
        eventType = this.validateString(effect.eventType, `action[${actionIndex}].effects[${index}].eventType`);
      } else if (effectType === 'add_event') {
        throw new Error(`action[${actionIndex}].effects[${index}].eventType is required for add_event effects`);
      }

      // Validate status - required for set_status
      let status = undefined;
      if (effect.status !== undefined) {
        const validStatuses = ['running', 'paused', 'ended', 'waiting', 'finished'];
        if (!validStatuses.includes(effect.status)) {
          throw new Error(`action[${actionIndex}].effects[${index}].status must be one of: ${validStatuses.join(', ')}`);
        }
        status = effect.status;
      } else if (effectType === 'set_status') {
        throw new Error(`action[${actionIndex}].effects[${index}].status is required for set_status effects`);
      }

      return {
        type: effectType,
        target,
        value,
        operation,
        message,
        playerId,
        eventType,
        status
      };
    });
  }

  private static validateActionEffectType(type: any, path: string): string {
    const validTypes = ['set_var', 'modify_var', 'set_entity', 'trigger_event', 'message', 'update_score', 'add_log', 'add_event', 'set_status'];
    if (!validTypes.includes(type)) {
      throw new Error(`${path} must be one of: ${validTypes.join(', ')}`);
    }
    return type;
  }

  private static validateOperation(operation: any, path: string): string {
    const validOps = ['set', 'add', 'subtract', 'multiply', 'divide'];
    if (!validOps.includes(operation)) {
      throw new Error(`${path} must be one of: ${validOps.join(', ')}`);
    }
    return operation;
  }

  private static validateActionRequirements(requirements: any, actionIndex: number): any[] {
    if (!Array.isArray(requirements)) {
      throw new Error(`action[${actionIndex}].requirements must be an array`);
    }

    return requirements.map((req, index) => {
      if (typeof req !== 'object' || req === null) {
        throw new Error(`action[${actionIndex}].requirements[${index}] must be an object`);
      }

      return {
        type: this.validateRequirementType(req.type, `action[${actionIndex}].requirements[${index}].type`),
        target: this.validateString(req.target, `action[${actionIndex}].requirements[${index}].target`),
        condition: this.validateString(req.condition, `action[${actionIndex}].requirements[${index}].condition`),
        value: req.value
      };
    });
  }

  private static validateRequirementType(type: any, path: string): string {
    const validTypes = ['var_range', 'entity_state', 'player_role', 'cooldown'];
    if (!validTypes.includes(type)) {
      throw new Error(`${path} must be one of: ${validTypes.join(', ')}`);
    }
    return type;
  }

  private static validateRules(rules: any): Rule[] {
    if (!Array.isArray(rules)) {
      throw new Error('rules must be an array');
    }

    return rules.map((rule, index) => {
      if (typeof rule !== 'object' || rule === null) {
        throw new Error(`rule[${index}] must be an object`);
      }

      return {
        trigger: this.validateRuleTrigger(rule.trigger, `rule[${index}].trigger`),
        condition: rule.condition ? this.validateString(rule.condition, `rule[${index}].condition`) : undefined,
        effects: this.validateActionEffects(rule.effects, index),
        frequency: rule.frequency ? this.validateNumber(rule.frequency, `rule[${index}].frequency`) : undefined
      };
    });
  }

  private static validateRuleTrigger(trigger: any, path: string): 'tick' | 'action' | 'event' | 'condition' {
    const validTriggers = ['tick', 'action', 'event', 'condition'];
    if (!validTriggers.includes(trigger)) {
      throw new Error(`${path} must be one of: ${validTriggers.join(', ')}`);
    }
    return trigger as 'tick' | 'action' | 'event' | 'condition';
  }

  private static validateRandomInit(init: any): RandomInit {
    if (typeof init !== 'object' || init === null) {
      throw new Error('init_random must be an object');
    }

    const result: RandomInit = {};

    if (init.vars) {
      result.vars = {};
      for (const [key, value] of Object.entries(init.vars)) {
        if (typeof value !== 'object' || value === null) {
          throw new Error(`init_random.vars.${key} must be an object`);
        }
        const varInit = value as any;
        result.vars[key] = {
          min: this.validateNumber(varInit.min, `init_random.vars.${key}.min`),
          max: this.validateNumber(varInit.max, `init_random.vars.${key}.max`)
        };
      }
    }

    if (init.entities) {
      result.entities = {};
      for (const [key, value] of Object.entries(init.entities)) {
        if (typeof value !== 'object' || value === null) {
          throw new Error(`init_random.entities.${key} must be an object`);
        }
        result.entities[key] = value as any;
      }
    }

    return result;
  }

  private static validateRandomEvents(events: any): RandomEvent[] {
    if (!Array.isArray(events)) {
      throw new Error('random_events must be an array');
    }

    return events.map((event, index) => {
      if (typeof event !== 'object' || event === null) {
        throw new Error(`random_events[${index}] must be an object`);
      }

      return {
        name: this.validateString(event.name, `random_events[${index}].name`),
        description: this.validateString(event.description, `random_events[${index}].description`),
        probability: this.validateNumber(event.probability, `random_events[${index}].probability`),
        conditions: event.conditions ? this.validateStringArray(event.conditions, `random_events[${index}].conditions`) : undefined,
        effects: this.validateActionEffects(event.effects, index),
        cooldown: event.cooldown ? this.validateNumber(event.cooldown, `random_events[${index}].cooldown`) : undefined
      };
    });
  }

  private static validateUI(ui: any): any {
    if (typeof ui !== 'object' || ui === null) {
      throw new Error('ui must be an object');
    }

    return {
      panels: this.validatePanels(ui.panels || []),
      layout: this.validateLayout(ui.layout || {})
    };
  }

  private static validatePanels(panels: any): PanelLayout[] {
    if (!Array.isArray(panels)) {
      throw new Error('ui.panels must be an array');
    }

    return panels.map((panel, index) => {
      if (typeof panel !== 'object' || panel === null) {
        throw new Error(`ui.panels[${index}] must be an object`);
      }

      return {
        id: this.validateString(panel.id, `ui.panels[${index}].id`),
        title: this.validateString(panel.title, `ui.panels[${index}].title`),
        layout: this.validatePanelLayout(panel.layout, index),
        widgets: this.validateWidgets(panel.widgets || [], index),
        visible: typeof panel.visible === 'boolean' ? panel.visible : true,
        resizable: typeof panel.resizable === 'boolean' ? panel.resizable : true,
        draggable: typeof panel.draggable === 'boolean' ? panel.draggable : true
      };
    });
  }

  private static validatePanelLayout(layout: any, panelIndex: number): any {
    if (typeof layout !== 'object' || layout === null) {
      throw new Error(`ui.panels[${panelIndex}].layout must be an object`);
    }

    return {
      x: this.validateNumber(layout.x, `ui.panels[${panelIndex}].layout.x`),
      y: this.validateNumber(layout.y, `ui.panels[${panelIndex}].layout.y`),
      w: this.validateNumber(layout.w, `ui.panels[${panelIndex}].layout.w`),
      h: this.validateNumber(layout.h, `ui.panels[${panelIndex}].layout.h`),
      minW: this.validateNumber(layout.minW, `ui.panels[${panelIndex}].layout.minW`),
      minH: this.validateNumber(layout.minH, `ui.panels[${panelIndex}].layout.minH`),
      maxW: this.validateNumber(layout.maxW, `ui.panels[${panelIndex}].layout.maxW`),
      maxH: this.validateNumber(layout.maxH, `ui.panels[${panelIndex}].layout.maxH`)
    };
  }

  private static validateWidgets(widgets: any, panelIndex: number): Widget[] {
    if (!Array.isArray(widgets)) {
      throw new Error(`ui.panels[${panelIndex}].widgets must be an array`);
    }

    return widgets.map((widget, index) => {
      if (typeof widget !== 'object' || widget === null) {
        throw new Error(`ui.panels[${panelIndex}].widgets[${index}] must be an object`);
      }

      return {
        id: this.validateString(widget.id, `ui.panels[${panelIndex}].widgets[${index}].id`),
        title: this.validateString(widget.title, `ui.panels[${panelIndex}].widgets[${index}].title`),
        type: this.validateWidgetType(widget.type, `ui.panels[${panelIndex}].widgets[${index}].type`),
        config: widget.config || {},
        bindings: this.validateWidgetBindings(widget.bindings || {}, panelIndex, index)
      };
    });
  }

  private static validateWidgetType(type: any, path: string): 'bar' | 'schematic' | 'log' | 'checklist' | 'terminal' | 'grid' {
    const validTypes = ['bar', 'schematic', 'log', 'checklist', 'terminal', 'grid'];
    if (!validTypes.includes(type)) {
      throw new Error(`${path} must be one of: ${validTypes.join(', ')}`);
    }
    return type as 'bar' | 'schematic' | 'log' | 'checklist' | 'terminal' | 'grid';
  }

  private static validateWidgetBindings(bindings: any, panelIndex: number, widgetIndex: number): any {
    if (typeof bindings !== 'object' || bindings === null) {
      throw new Error(`ui.panels[${panelIndex}].widgets[${widgetIndex}].bindings must be an object`);
    }

    return {
      vars: bindings.vars ? this.validateStringArray(bindings.vars, `ui.panels[${panelIndex}].widgets[${widgetIndex}].bindings.vars`) : undefined,
      entities: bindings.entities ? this.validateStringArray(bindings.entities, `ui.panels[${panelIndex}].widgets[${widgetIndex}].bindings.entities`) : undefined,
      events: bindings.events ? this.validateStringArray(bindings.events, `ui.panels[${panelIndex}].widgets[${widgetIndex}].bindings.events`) : undefined
    };
  }

  private static validateLayout(layout: any): any {
    if (typeof layout !== 'object' || layout === null) {
      throw new Error('ui.layout must be an object');
    }

    return {
      type: this.validateLayoutType(layout.type || 'grid', 'ui.layout.type'),
      gridSize: this.validateNumber(layout.gridSize || 12, 'ui.layout.gridSize'),
      maxPanels: this.validateNumber(layout.maxPanels || 8, 'ui.layout.maxPanels')
    };
  }

  private static validateLayoutType(type: any, path: string): string {
    const validTypes = ['grid', 'vertical', 'horizontal'];
    if (!validTypes.includes(type)) {
      throw new Error(`${path} must be one of: ${validTypes.join(', ')}`);
    }
    return type;
  }
}
