import { GameStateManager } from './state-manager.js';
import { GameModel, Action, ActionExecution, ActionRequirement, ActionEffect } from './types.js';

export class ActionProcessor {
  private stateManager: GameStateManager;
  private gameModel: GameModel;
  private actionCooldowns: Map<string, Map<string, number>> = new Map(); // playerId -> actionName -> timestamp
  private actionHistory: ActionExecution[] = [];

  constructor(stateManager: GameStateManager, gameModel: GameModel) {
    this.stateManager = stateManager;
    this.gameModel = gameModel;
  }

  /**
   * Process a player action
   */
  processAction(
    actionName: string,
    playerId: string,
    parameters: Record<string, any> = {}
  ): ActionExecution {
    const timestamp = Date.now();
    
    try {
      // Find the action definition
      const action = this.findAction(actionName);
      if (!action) {
        const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, false, undefined, 'Action not found');
        this.actionHistory.push(execution);
        return execution;
      }

      // Validate player exists
      const player = this.stateManager.getPlayer(playerId);
      if (!player) {
        const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, false, undefined, 'Player not found');
        this.actionHistory.push(execution);
        return execution;
      }

      // Validate parameters
      const parameterValidation = this.validateParameters(action, parameters);
      if (!parameterValidation.valid) {
        const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, false, undefined, parameterValidation.error);
        this.actionHistory.push(execution);
        return execution;
      }

      // Check requirements
      const requirementCheck = this.checkRequirements(action, playerId);
      if (!requirementCheck.valid) {
        const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, false, undefined, requirementCheck.error);
        this.actionHistory.push(execution);
        return execution;
      }

      // Note: Cooldown checks are handled in checkRequirements

      // Execute action effects
      const result = this.executeActionEffects(action, parameters);

      // Set cooldown if specified in requirements
      const cooldownRequirement = action.requirements?.find(req => req.type === 'cooldown' && req.target === actionName);
      if (cooldownRequirement) {
        this.setCooldown(actionName, playerId, cooldownRequirement.value as number);
      }

      // Record the action
      const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, true, result);
      this.actionHistory.push(execution);
      this.stateManager.recordAction(execution);

      return execution;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const execution = this.createActionExecution(actionName, parameters, playerId, timestamp, false, undefined, errorMessage);
      this.actionHistory.push(execution);
      return execution;
    }
  }

  /**
   * Find an action by name
   */
  private findAction(actionName: string): Action | undefined {
    return this.gameModel.actions.find(action => action.name === actionName);
  }

  /**
   * Validate action parameters
   */
  private validateParameters(action: Action, parameters: Record<string, any>): { valid: boolean; error?: string } {
    if (!action.parameters) {
      return { valid: true };
    }

    for (const param of action.parameters) {
      const value = parameters[param.name];

      // Check if required parameter is missing
      if (param.required && (value === undefined || value === null)) {
        return { valid: false, error: `Required parameter '${param.name}' is missing` };
      }

      // Skip validation if parameter is not provided and not required
      if (value === undefined || value === null) {
        continue;
      }

      // Type validation
      const typeValidation = this.validateParameterType(param, value);
      if (!typeValidation.valid) {
        return typeValidation;
      }

      // Options validation for select type
      if (param.type === 'select' && param.options) {
        if (!param.options.includes(value)) {
          return { valid: false, error: `Parameter '${param.name}' must be one of: ${param.options.join(', ')}` };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Validate parameter type
   */
  private validateParameterType(param: any, value: any): { valid: boolean; error?: string } {
    switch (param.type) {
      case 'string':
        if (typeof value !== 'string') {
          return { valid: false, error: `Parameter '${param.name}' must be a string` };
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { valid: false, error: `Parameter '${param.name}' must be a number` };
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, error: `Parameter '${param.name}' must be a boolean` };
        }
        break;
      case 'select':
        // Options validation is handled separately
        break;
      default:
        return { valid: false, error: `Unknown parameter type: ${param.type}` };
    }

    return { valid: true };
  }

  /**
   * Check action requirements
   */
  private checkRequirements(action: Action, playerId: string): { valid: boolean; error?: string } {
    if (!action.requirements) {
      return { valid: true };
    }

    for (const requirement of action.requirements) {
      const requirementCheck = this.checkSingleRequirement(requirement, playerId);
      if (!requirementCheck.valid) {
        return requirementCheck;
      }
    }

    return { valid: true };
  }

  /**
   * Check a single requirement
   */
  private checkSingleRequirement(requirement: ActionRequirement, playerId: string): { valid: boolean; error?: string } {
    switch (requirement.type) {
      case 'var_range':
        return this.checkVariableRangeRequirement(requirement);
      case 'entity_state':
        return this.checkEntityStateRequirement(requirement);
      case 'player_role':
        return this.checkPlayerRoleRequirement(requirement, playerId);
      case 'cooldown':
        return this.checkCooldownRequirement(requirement, playerId);
      default:
        return { valid: false, error: `Unknown requirement type: ${requirement.type}` };
    }
  }

  /**
   * Check variable range requirement
   */
  private checkVariableRangeRequirement(requirement: ActionRequirement): { valid: boolean; error?: string } {
    const value = this.stateManager.getVariable(requirement.target);
    if (value === undefined) {
      return { valid: false, error: `Variable '${requirement.target}' not found` };
    }

    // Parse condition (e.g., "> 50", "<= 100", "== 0")
    const condition = requirement.condition;
    const match = condition.match(/^([><=!]+)\s*(.+)$/);
    if (!match) {
      return { valid: false, error: `Invalid condition format: ${condition}` };
    }

    const operator = match[1];
    const targetValue = parseFloat(match[2]);

    if (isNaN(targetValue)) {
      return { valid: false, error: `Invalid target value: ${match[2]}` };
    }

    let isValid = false;
    switch (operator) {
      case '>':
        isValid = value > targetValue;
        break;
      case '>=':
        isValid = value >= targetValue;
        break;
      case '<':
        isValid = value < targetValue;
        break;
      case '<=':
        isValid = value <= targetValue;
        break;
      case '==':
        isValid = value === targetValue;
        break;
      case '!=':
        isValid = value !== targetValue;
        break;
      default:
        return { valid: false, error: `Unknown operator: ${operator}` };
    }

    if (!isValid) {
      return { valid: false, error: `Variable '${requirement.target}' (${value}) does not meet condition: ${condition}` };
    }

    return { valid: true };
  }

  /**
   * Check entity state requirement
   */
  private checkEntityStateRequirement(requirement: ActionRequirement): { valid: boolean; error?: string } {
    const entity = this.stateManager.getEntity(requirement.target);
    if (!entity) {
      return { valid: false, error: `Entity '${requirement.target}' not found` };
    }

    // Simple property check (e.g., "status == active")
    const condition = requirement.condition;
    const match = condition.match(/^(\w+)\s*([><=!]+)\s*(.+)$/);
    if (!match) {
      return { valid: false, error: `Invalid entity condition format: ${condition}` };
    }

    const property = match[1];
    const operator = match[2];
    const targetValue = match[3];

    const actualValue = entity[property];
    if (actualValue === undefined) {
      return { valid: false, error: `Property '${property}' not found on entity '${requirement.target}'` };
    }

    let isValid = false;
    switch (operator) {
      case '==':
        isValid = actualValue == targetValue;
        break;
      case '!=':
        isValid = actualValue != targetValue;
        break;
      default:
        return { valid: false, error: `Unsupported operator for entity state: ${operator}` };
    }

    if (!isValid) {
      return { valid: false, error: `Entity '${requirement.target}.${property}' (${actualValue}) does not meet condition: ${condition}` };
    }

    return { valid: true };
  }

  /**
   * Check player role requirement
   */
  private checkPlayerRoleRequirement(requirement: ActionRequirement, playerId: string): { valid: boolean; error?: string } {
    const player = this.stateManager.getPlayer(playerId);
    if (!player) {
      return { valid: false, error: `Player '${playerId}' not found` };
    }

    const requiredRole = requirement.condition;
    if (player.role !== requiredRole) {
      return { valid: false, error: `Player role '${player.role}' does not match required role '${requiredRole}'` };
    }

    return { valid: true };
  }

  /**
   * Check cooldown requirement
   */
  private checkCooldownRequirement(requirement: ActionRequirement, playerId: string): { valid: boolean; error?: string } {
    const cooldownMs = (requirement.value as number) || 0;
    const lastActionTime = this.getLastActionTime(requirement.target, playerId);
    
    if (lastActionTime && Date.now() - lastActionTime < cooldownMs) {
      const remaining = cooldownMs - (Date.now() - lastActionTime);
      return { valid: false, error: `Action '${requirement.target}' is on cooldown for ${Math.ceil(remaining / 1000)} more seconds` };
    }

    return { valid: true };
  }


  /**
   * Get last action time for a player
   */
  private getLastActionTime(actionName: string, playerId: string): number | undefined {
    const playerCooldowns = this.actionCooldowns.get(playerId);
    return playerCooldowns?.get(actionName);
  }


  /**
   * Execute action effects
   */
  private executeActionEffects(action: Action, _parameters: Record<string, any>): any {
    const results: any[] = [];

    for (const effect of action.effects) {
      const result = this.executeEffect(effect, _parameters);
      results.push(result);
      
      // Only fail if the result explicitly contains an error
      if (result && result.error) {
        throw new Error(result.error);
      }
    }

    return results;
  }

  /**
   * Execute a single effect
   */
  private executeEffect(effect: ActionEffect, _parameters: Record<string, any>): any {
    try {
      // Validate effect type
      const validEffectTypes = ['set_var', 'modify_var', 'set_entity', 'trigger_event', 'message', 'update_score', 'add_log', 'add_event', 'set_status'];
      if (!validEffectTypes.includes(effect.type)) {
        throw new Error(`Invalid effect type: ${effect.type}`);
      }

      switch (effect.type) {
        case 'set_var':
          if (effect.target) {
            this.stateManager.setVariable(effect.target, effect.value);
            return { type: 'set_var', target: effect.target, value: effect.value };
          }
          return { type: 'set_var', skipped: true, reason: 'No target specified' };

        case 'modify_var':
          if (effect.target && effect.operation && this.isValidModifyOperation(effect.operation)) {
            this.stateManager.modifyVariable(effect.target, effect.operation, effect.value);
            return { type: 'modify_var', target: effect.target, operation: effect.operation, value: effect.value };
          }
          return { type: 'modify_var', skipped: true, reason: 'Invalid target or operation' };

        case 'set_entity':
          if (effect.target && effect.value && typeof effect.value === 'object') {
            for (const [key, value] of Object.entries(effect.value)) {
              this.stateManager.setEntityProperty(effect.target, key, value);
            }
            return { type: 'set_entity', target: effect.target, properties: effect.value };
          }
          return { type: 'set_entity', skipped: true, reason: 'Invalid target or value' };

        case 'trigger_event':
          return { type: 'trigger_event', target: effect.target };

        case 'message':
          return { type: 'message', message: effect.message };

        case 'update_score':
          if (effect.playerId && typeof effect.value === 'number') {
            this.stateManager.updateScore(effect.playerId, effect.value);
            return { type: 'update_score', playerId: effect.playerId, value: effect.value };
          }
          return { type: 'update_score', error: 'Invalid playerId or value' };

        default:
          return { type: 'unknown', error: `Unknown effect type: ${effect.type}` };
      }
    } catch (error) {
      return { type: effect.type, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create action execution result
   */
  private createActionExecution(
    actionName: string,
    parameters: Record<string, any>,
    playerId: string,
    timestamp: number,
    success: boolean,
    result?: any,
    error?: string
  ): ActionExecution {
    return {
      actionName,
      parameters,
      playerId,
      timestamp,
      success,
      result,
      error
    };
  }

  /**
   * Get available actions for a player
   */
  getAvailableActions(playerId: string): Action[] {
    const player = this.stateManager.getPlayer(playerId);
    if (!player) {
      return [];
    }

    return this.gameModel.actions.filter(action => {
      // Check if player meets all requirements
      const requirementCheck = this.checkRequirements(action, playerId);
      return requirementCheck.valid;
    });
  }

  /**
   * Get action cooldown status for a player
   */
  getActionCooldowns(playerId: string): Record<string, number> {
    const playerCooldowns = this.actionCooldowns.get(playerId);
    if (!playerCooldowns) {
      return {};
    }

    const now = Date.now();
    const cooldowns: Record<string, number> = {};

    for (const [actionName, lastTime] of playerCooldowns.entries()) {
      const action = this.findAction(actionName);
      if (action && action.cooldown) {
        const remaining = action.cooldown - (now - lastTime);
        if (remaining > 0) {
          cooldowns[actionName] = Math.ceil(remaining / 1000);
        }
      }
    }

    return cooldowns;
  }

  /**
   * Clear all cooldowns for a player
   */
  clearPlayerCooldowns(playerId: string): void {
    this.actionCooldowns.delete(playerId);
  }

  /**
   * Clear all cooldowns
   */
  clearAllCooldowns(): void {
    this.actionCooldowns.clear();
  }

  /**
   * Check if operation is valid for modifyVariable
   */
  private isValidModifyOperation(operation: string): operation is 'add' | 'subtract' | 'multiply' | 'divide' {
    return ['add', 'subtract', 'multiply', 'divide'].includes(operation);
  }

  /**
   * Get action history
   */
  getActionHistory(): ActionExecution[] {
    return [...this.actionHistory];
  }

  /**
   * Get player action history
   */
  getPlayerActionHistory(playerId: string): ActionExecution[] {
    return this.actionHistory.filter(execution => execution.playerId === playerId);
  }

  /**
   * Clear action history
   */
  clearActionHistory(): void {
    this.actionHistory = [];
  }

  /**
   * Get cooldown status for an action
   */
  getCooldownStatus(actionName: string, playerId: string): { remaining: number } | null {
    const playerCooldowns = this.actionCooldowns.get(playerId);
    if (!playerCooldowns) return null;

    const lastActionTime = playerCooldowns.get(actionName);
    if (!lastActionTime) return null;

    // Find the action to get its cooldown requirement
    const action = this.findAction(actionName);
    if (!action) return null;

    const cooldownRequirement = action.requirements?.find(req => req.type === 'cooldown' && req.target === actionName);
    if (!cooldownRequirement) return null;

    const cooldownMs = (cooldownRequirement.value as number) || 0;
    const remaining = Math.max(0, cooldownMs - (Date.now() - lastActionTime));

    return remaining > 0 ? { remaining } : null;
  }

  /**
   * Set cooldown for an action (for testing)
   */
  setCooldown(actionName: string, playerId: string, _cooldownMs: number): void {
    if (!this.actionCooldowns.has(playerId)) {
      this.actionCooldowns.set(playerId, new Map());
    }
    
    const playerCooldowns = this.actionCooldowns.get(playerId)!;
    playerCooldowns.set(actionName, Date.now()); // Set to current time
  }

  /**
   * Clear cooldown for a specific action and player
   */
  clearCooldown(actionName: string, playerId: string): void {
    const playerCooldowns = this.actionCooldowns.get(playerId);
    if (playerCooldowns) {
      playerCooldowns.delete(actionName);
    }
  }

}
