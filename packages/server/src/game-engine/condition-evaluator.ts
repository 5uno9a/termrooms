import { GameState } from './types.js';

/**
 * Evaluate a condition string against the current game state
 * Supports simple comparisons like "temperature > 800", "power < 50", etc.
 */
export function evaluateCondition(condition: string, state: GameState): boolean {
  try {
    // Replace variable names with their values
    let expression = condition;
    
    // Replace all variables in the condition
    for (const [varName, varValue] of Object.entries(state.vars)) {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      expression = expression.replace(regex, String(varValue));
    }
    
    // Replace entity properties
    for (const [entityName, entityData] of Object.entries(state.entities)) {
      for (const [propName, propValue] of Object.entries(entityData)) {
        const fullPropName = `${entityName}.${propName}`;
        const regex = new RegExp(`\\b${fullPropName}\\b`, 'g');
        expression = expression.replace(regex, String(propValue));
      }
    }
    
    // Evaluate the expression safely
    // Only allow basic mathematical and comparison operations
    const allowedChars = /^[0-9+\-*/().<>=!&\| ]+$/;
    if (!allowedChars.test(expression)) {
      console.warn(`Invalid condition expression: ${condition}`);
      return false;
    }
    
    // Use Function constructor for safe evaluation
    const result = new Function('return ' + expression)();
    return Boolean(result);
    
  } catch (error) {
    console.warn(`Error evaluating condition "${condition}":`, error);
    return false;
  }
}

/**
 * Evaluate multiple conditions with AND/OR logic
 */
export function evaluateConditions(conditions: string[], state: GameState, operator: 'AND' | 'OR' = 'AND'): boolean {
  const results = conditions.map(condition => evaluateCondition(condition, state));
  
  if (operator === 'AND') {
    return results.every(result => result);
  } else {
    return results.some(result => result);
  }
}
