import { GameState } from './types.js';

/**
 * Safely evaluate a mathematical expression without using eval() or Function()
 * Supports basic arithmetic and comparison operations
 */
function evaluateExpression(expression: string): number | boolean {
  // Remove all whitespace
  expression = expression.replace(/\s/g, '');
  
  // Handle comparison operators
  if (expression.includes('>=')) {
    const parts = expression.split('>=');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) >= evaluateArithmetic(parts[1]);
    }
  }
  if (expression.includes('<=')) {
    const parts = expression.split('<=');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) <= evaluateArithmetic(parts[1]);
    }
  }
  if (expression.includes('==')) {
    const parts = expression.split('==');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) === evaluateArithmetic(parts[1]);
    }
  }
  if (expression.includes('!=')) {
    const parts = expression.split('!=');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) !== evaluateArithmetic(parts[1]);
    }
  }
  if (expression.includes('>')) {
    const parts = expression.split('>');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) > evaluateArithmetic(parts[1]);
    }
  }
  if (expression.includes('<')) {
    const parts = expression.split('<');
    if (parts.length === 2) {
      return evaluateArithmetic(parts[0]) < evaluateArithmetic(parts[1]);
    }
  }
  
  // If no comparison operators, evaluate as arithmetic
  return evaluateArithmetic(expression);
}

/**
 * Safely evaluate arithmetic expressions
 */
function evaluateArithmetic(expression: string): number {
  // Handle parentheses first
  while (expression.includes('(')) {
    const start = expression.lastIndexOf('(');
    const end = expression.indexOf(')', start);
    if (end === -1) throw new Error('Mismatched parentheses');
    
    const inner = expression.substring(start + 1, end);
    const result = evaluateArithmetic(inner);
    expression = expression.substring(0, start) + result + expression.substring(end + 1);
  }
  
  // Handle multiplication and division
  while (expression.includes('*') || expression.includes('/')) {
    const mulIndex = expression.indexOf('*');
    const divIndex = expression.indexOf('/');
    const opIndex = (mulIndex !== -1 && divIndex !== -1) ? Math.min(mulIndex, divIndex) : 
                   (mulIndex !== -1) ? mulIndex : divIndex;
    
    const left = getLeftOperand(expression, opIndex);
    const right = getRightOperand(expression, opIndex);
    const operator = expression[opIndex];
    
    const result = operator === '*' ? left * right : left / right;
    expression = expression.substring(0, opIndex - left.toString().length) + 
                result + 
                expression.substring(opIndex + right.toString().length + 1);
  }
  
  // Handle addition and subtraction
  while (expression.includes('+') || (expression.includes('-') && expression.indexOf('-') > 0)) {
    const addIndex = expression.indexOf('+');
    const subIndex = expression.indexOf('-', 1); // Skip negative sign at start
    const opIndex = (addIndex !== -1 && subIndex !== -1) ? Math.min(addIndex, subIndex) : 
                   (addIndex !== -1) ? addIndex : subIndex;
    
    const left = getLeftOperand(expression, opIndex);
    const right = getRightOperand(expression, opIndex);
    const operator = expression[opIndex];
    
    const result = operator === '+' ? left + right : left - right;
    expression = expression.substring(0, opIndex - left.toString().length) + 
                result + 
                expression.substring(opIndex + right.toString().length + 1);
  }
  
  return parseFloat(expression);
}

function getLeftOperand(expression: string, opIndex: number): number {
  let start = opIndex - 1;
  while (start >= 0 && /[0-9.]/.test(expression[start])) {
    start--;
  }
  return parseFloat(expression.substring(start + 1, opIndex));
}

function getRightOperand(expression: string, opIndex: number): number {
  let end = opIndex + 1;
  while (end < expression.length && /[0-9.]/.test(expression[end])) {
    end++;
  }
  return parseFloat(expression.substring(opIndex + 1, end));
}

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
    
    // Evaluate the expression safely using a simple parser
    // Only allow basic mathematical and comparison operations
    const allowedChars = /^[0-9+\-*/().<>=!&\| ]+$/;
    if (!allowedChars.test(expression)) {
      console.warn(`Invalid condition expression: ${condition}`);
      return false;
    }
    
    // Parse and evaluate the expression safely
    const result = evaluateExpression(expression);
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
