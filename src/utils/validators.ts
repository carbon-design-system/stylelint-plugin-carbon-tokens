/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CarbonToken, ValidationResult } from '../types/index.js';

/**
 * Check if a value is a SCSS variable (including negative variables)
 * Examples: $spacing-05, -$spacing-05
 */
export function isScssVariable(value: string): boolean {
  return value.startsWith('$') || value.startsWith('-$');
}

/**
 * Clean SCSS value by removing interpolation and namespaces
 * Examples:
 *   #{$spacing-04} → $spacing-04
 *   spacing.$spacing-04 → $spacing-04
 *   theme.$layer → $layer
 *   -$spacing-05 → -$spacing-05 (preserved)
 *   -#{$spacing-05} → -$spacing-05
 */
export function cleanScssValue(value: string): string {
  let cleaned = value.trim();

  // Handle negative values
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1); // Remove leading '-'
  }

  // Remove interpolation: #{$token} → $token
  cleaned = cleaned.replace(/^#\{|\}$/g, '');

  // Remove namespace: module.$token → $token
  // Match: word.$token → $token
  cleaned = cleaned.replace(/^[a-zA-Z_][\w-]*\.\$/, '$');

  // Restore negative sign if present
  if (isNegative) {
    cleaned = '-' + cleaned;
  }

  return cleaned;
}

/**
 * Resolve SCSS variables in a value using file-level variable declarations
 * Supports:
 * - Simple variables: $indicator-width → $spacing-02
 * - Variables in calc(): calc(-1 * $indicator-width) → calc(-1 * $spacing-02)
 * - Multiple variables: $a $b → $spacing-05 $spacing-03
 * - Negative variables: -$indicator-width → -$spacing-02
 *
 * @param value The value to resolve
 * @param fileVariables Map of variable names to their resolved values
 * @returns The value with variables resolved
 */
export function resolveFileVariables(
  value: string,
  fileVariables: Map<string, string>
): string {
  if (fileVariables.size === 0) {
    return value; // No variables to resolve
  }

  let resolved = value;

  // Match SCSS variables: $variable-name or -$variable-name
  // Use word boundary to avoid matching partial variable names
  const varRegex = /(-?\$[\w-]+)/g;
  const matches = value.match(varRegex);

  if (matches) {
    for (const match of matches) {
      // Handle negative variables
      const isNegative = match.startsWith('-$');
      const varName = isNegative ? match.substring(1) : match; // Remove leading '-' for lookup

      const varValue = fileVariables.get(varName);
      if (varValue) {
        // Replace variable with its value
        // If original was negative, prepend '-' to the resolved value
        const replacement = isNegative ? `-${varValue}` : varValue;
        resolved = resolved.replace(match, replacement);
      }
      // If variable not found, leave as-is (will fail validation later)
    }
  }

  return resolved;
}

/**
 * Check if a declaration is a SCSS variable declaration
 * @param prop The property name (e.g., "$indicator-width")
 * @returns True if this is a variable declaration
 */
export function isVariableDeclaration(prop: string): boolean {
  return prop.startsWith('$');
}

/**
 * Check if a value is a CSS custom property
 */
export function isCssCustomProperty(value: string): boolean {
  return value.trim().startsWith('var(--');
}

/**
 * Check if a value is a Carbon CSS custom property
 */
export function isCarbonCustomProperty(
  value: string,
  carbonPrefix = 'cds'
): boolean {
  // Match var(--name) or var(--name, fallback)
  // Capture only the variable name, not the fallback
  const match = value.match(/var\(--([^,)]+)/);
  if (!match) return false;
  return match[1].trim().startsWith(`${carbonPrefix}-`);
}

/**
 * Extract variable name from CSS custom property
 * Handles fallback values: var(--name, fallback) → --name
 */
export function extractCssVarName(value: string): string | null {
  // Match var(--name) or var(--name, fallback)
  // Capture only the variable name, not the fallback
  const match = value.match(/var\(--([^,)]+)/);
  return match ? `--${match[1].trim()}` : null;
}

/**
 * Check if value matches any of the accepted patterns
 */
export function matchesAcceptedValue(
  value: string,
  acceptedValues: string[]
): boolean {
  for (const pattern of acceptedValues) {
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      // Regex pattern
      const regex = new RegExp(pattern.slice(1, -1));
      if (regex.test(value)) return true;
    } else if (pattern === value) {
      // Exact match
      return true;
    }
  }
  return false;
}

/**
 * Check if a property should be validated
 */
export function shouldValidateProperty(
  prop: string,
  includeProps: string[]
): boolean {
  for (const pattern of includeProps) {
    if (pattern === '*') return true;

    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      // Regex pattern
      const regex = new RegExp(pattern.slice(1, -1));
      if (regex.test(prop)) return true;
    } else if (pattern === prop) {
      // Exact match
      return true;
    }
  }
  return false;
}

/**
 * Validate a value against Carbon tokens
 */
export function validateValue(
  value: string,
  tokens: CarbonToken[],
  options: {
    acceptUndefinedVariables?: boolean;
    acceptCarbonCustomProp?: boolean;
    acceptValues?: string[];
    carbonPrefix?: string;
    validateVariables?: string[];
    validateGradients?: 'recommended' | 'strict';
  } = {}
): ValidationResult {
  const {
    acceptUndefinedVariables = false,
    acceptCarbonCustomProp: _acceptCarbonCustomProp = false,
    acceptValues = [],
    carbonPrefix: _carbonPrefix = 'cds',
    validateVariables = [],
  } = options;

  // Check if value matches accepted patterns
  if (matchesAcceptedValue(value, acceptValues)) {
    return { isValid: true };
  }

  // Validate gradient functions based on mode
  if (isGradientFunction(value)) {
    return validateGradientFunction(value, tokens, options);
  }

  // Clean SCSS value (remove interpolation and namespaces)
  const cleanValue = cleanScssValue(value);

  // Check if it's a SCSS variable (after cleaning)
  if (isScssVariable(cleanValue)) {
    // For negative variables, check the token without the minus sign
    const tokenToCheck = cleanValue.startsWith('-$')
      ? cleanValue.substring(1) // Remove leading '-' for token lookup
      : cleanValue;

    const isCarbon = tokens.some(
      (token) => token.type === 'scss' && token.name === tokenToCheck
    );
    if (isCarbon) {
      return { isValid: true };
    }
    if (acceptUndefinedVariables) {
      return { isValid: true };
    }

    // Check if this SCSS variable matches validateVariables (for component-specific variables)
    if (shouldValidateProperty(cleanValue, validateVariables)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      message: `SCSS variable "${value}" is not a Carbon token`,
      suggestedFix: findClosestToken(cleanValue, tokens, 'scss'),
    };
  }

  // Check if it's a CSS custom property
  if (isCssCustomProperty(value)) {
    const varName = extractCssVarName(value);
    if (!varName) {
      return { isValid: false, message: 'Invalid CSS custom property syntax' };
    }

    const isCarbon = tokens.some(
      (token) => token.type === 'css-custom-prop' && token.name === varName
    );

    // If it's a known Carbon token, check if acceptCarbonCustomProp is enabled
    if (isCarbon && _acceptCarbonCustomProp) {
      return { isValid: true };
    }

    // If acceptUndefinedVariables is enabled, accept any CSS custom property
    if (acceptUndefinedVariables) {
      return { isValid: true };
    }

    // Check if this CSS custom property matches validateVariables (for component-specific properties)
    if (!isCarbon && shouldValidateProperty(varName, validateVariables)) {
      return { isValid: true };
    }

    // Reject CSS custom properties when acceptCarbonCustomProp is false
    return {
      isValid: false,
      message: isCarbon
        ? `CSS custom property "${value}" requires acceptCarbonCustomProp: true`
        : `CSS custom property "${value}" is not a Carbon token`,
      suggestedFix: isCarbon
        ? undefined
        : findClosestToken(varName, tokens, 'css-custom-prop'),
    };
  }

  // Check if it's a hard-coded value that matches a token
  const matchingToken = tokens.find((token) => token.value === value);
  if (matchingToken) {
    return {
      isValid: false,
      message: `Use Carbon token instead of hard-coded value "${value}"`,
      suggestedFix: matchingToken.name,
    };
  }

  return {
    isValid: false,
    message: `Value "${value}" should use a Carbon token`,
  };
}

/**
 * Find the closest matching token (simple implementation)
 */
function findClosestToken(
  value: string,
  tokens: CarbonToken[],
  type: 'scss' | 'css-custom-prop'
): string | undefined {
  const relevantTokens = tokens.filter((token) => token.type === type);

  // Simple exact match first
  const exactMatch = relevantTokens.find((token) => token.name === value);
  if (exactMatch) return exactMatch.name;

  // Return first token as suggestion (could be improved with fuzzy matching)
  return relevantTokens[0]?.name;
}

/**
 * Parse a CSS value into individual values
 */
export function parseValue(value: string): string[] {
  const values: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ' ' && depth === 0) {
      if (current.trim()) {
        // Remove trailing punctuation (commas, semicolons) from values
        const cleaned = current.trim().replace(/[,;]+$/, '');
        if (cleaned) {
          values.push(cleaned);
        }
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    // Remove trailing punctuation from final value
    const cleaned = current.trim().replace(/[,;]+$/, '');
    if (cleaned) {
      values.push(cleaned);
    }
  }

  return values.filter((v) => v.length > 0);
}

/**
 * Check if a value contains a calc() function
 */
export function isCalcExpression(value: string): boolean {
  return value.trim().startsWith('calc(');
}

/**
 * Extract the contents of a calc() expression
 */
export function extractCalcContents(value: string): string | null {
  const match = value.match(/^calc\((.*)\)$/);
  return match ? match[1].trim() : null;
}

/**
 * Validate calc() expression for proportional math
 * Pattern: calc(P O token) where P is viewport/percentage unit, O is +/-
 * Supports: vw, vh, %, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax
 */
function validateProportionalCalc(
  contents: string,
  tokens: CarbonToken[]
): ValidationResult {
  // Match: 100vw - #{$spacing-01} or 100% + $spacing-01
  // Supports all viewport units: vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax, %
  const proportionalPattern =
    /^(\d+(?:\.\d+)?)(vw|vh|svw|lvw|dvw|svh|lvh|dvh|vi|vb|vmin|vmax|%)\s*([+-])\s*(.+)$/;
  const match = contents.match(proportionalPattern);

  if (!match) return { isValid: false };

  const [, , , , tokenPart] = match;

  // Validate the token part (could be #{$token} or $token or var(--token))
  const cleanToken = cleanScssValue(tokenPart);

  // Check if it's a valid Carbon token
  const isValidToken =
    isScssVariable(cleanToken) &&
    tokens.some((token) => token.type === 'scss' && token.name === cleanToken);

  if (isValidToken) {
    return { isValid: true };
  }

  // Check CSS custom property
  if (isCssCustomProperty(cleanToken)) {
    const varName = extractCssVarName(cleanToken);
    const isValidCssToken = tokens.some(
      (token) => token.type === 'css-custom-prop' && token.name === varName
    );
    if (isValidCssToken) {
      return { isValid: true };
    }
  }

  return {
    isValid: false,
    message: `Token in calc() must be a Carbon spacing token`,
  };
}

/**
 * Validate calc() expression for token negation
 * Pattern: calc(-1 * token) or calc(token / -1) or calc(token * -1)
 */
function validateNegationCalc(
  contents: string,
  tokens: CarbonToken[]
): ValidationResult {
  // Match: -1 * #{$token} or #{$token} / -1 or #{$token} * -1
  const negationPattern1 = /^(-1)\s*([*/])\s*(.+)$/;
  const negationPattern2 = /^(.+?)\s*([*/])\s*(-1)$/;

  let match = contents.match(negationPattern1);
  let tokenPart: string;

  if (match) {
    const [, , , token] = match;
    tokenPart = token;
  } else {
    match = contents.match(negationPattern2);
    if (!match) return { isValid: false };
    const [, token] = match;
    tokenPart = token;
  }

  // Clean the token (remove #{} wrapper and namespace if present)
  const cleanToken = cleanScssValue(tokenPart);

  // Check if it's a valid Carbon token
  const isValidToken =
    isScssVariable(cleanToken) &&
    tokens.some((token) => token.type === 'scss' && token.name === cleanToken);

  if (isValidToken) {
    return { isValid: true };
  }

  // Check CSS custom property
  if (isCssCustomProperty(cleanToken)) {
    const varName = extractCssVarName(cleanToken);
    const isValidCssToken = tokens.some(
      (token) => token.type === 'css-custom-prop' && token.name === varName
    );
    if (isValidCssToken) {
      return { isValid: true };
    }
  }

  return {
    isValid: false,
    message: `Token in calc() must be a Carbon spacing token`,
  };
}

/**
 * Validate calc() expression according to V4 rules
 * Supports:
 * 1. Proportional math: calc(100vw - #{$spacing-01})
 * 2. Token negation: calc(-1 * #{$spacing-01}) or calc(#{$spacing-01} / -1)
 */
export function validateCalcExpression(
  value: string,
  tokens: CarbonToken[]
): ValidationResult {
  if (!isCalcExpression(value)) {
    return { isValid: false, message: 'Not a calc() expression' };
  }

  const contents = extractCalcContents(value);
  if (!contents) {
    return { isValid: false, message: 'Invalid calc() syntax' };
  }

  // Try proportional math validation first
  const proportionalResult = validateProportionalCalc(contents, tokens);
  if (proportionalResult.isValid) {
    return proportionalResult;
  }

  // Try negation math validation
  const negationResult = validateNegationCalc(contents, tokens);
  if (negationResult.isValid) {
    return negationResult;
  }

  // If neither pattern matches, return error with helpful message
  return {
    isValid: false,
    message: `Expected calc() of the form calc(P O token) or calc(-1 * token) where P is a viewport/percentage unit (vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax, %), O is +/-, and token is a Carbon spacing token. Found "${value}"`,
  };
}

/**
 * Check if value is a transform function (translate, translateX, translateY, translate3d)
 */
export function isTransformFunction(value: string): boolean {
  return /^translate(X|Y|3d)?\s*\(/.test(value.trim());
}

/**
 * Check if a transform function should be validated for spacing
 * Only translate functions use spacing values
 */
export function isSpacingTransformFunction(value: string): boolean {
  return /^translate(X|Y|3d)?\s*\(/.test(value.trim());
}

/**
 * Check if value is a gradient function
 */
export function isGradientFunction(value: string): boolean {
  return /^(linear|radial|conic)-gradient\s*\(/.test(value.trim());
}

/**
 * Extract function name and parameters from a function call
 * Returns null if not a valid function
 */
export function extractFunctionParams(value: string): {
  name: string;
  params: string[];
} | null {
  const match = value.match(/^([a-zA-Z0-9-]+)\((.*)\)$/s);
  if (!match) return null;

  const [, name, paramsStr] = match;

  // Split by comma, but respect nested parentheses (for calc() inside transform)
  const params: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < paramsStr.length; i++) {
    const char = paramsStr[i];

    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      params.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    params.push(current.trim());
  }

  return { name, params };
}

/**
 * Check if a parameter is a gradient direction or angle
 * Examples: 'to right', '90deg', 'to bottom right', 'at center', 'closest-side'
 */
export function isDirectionOrAngle(param: string): boolean {
  const trimmed = param.trim();

  // Angle units: deg, grad, rad, turn
  if (/^\d+\.?\d*(deg|grad|rad|turn)$/.test(trimmed)) {
    return true;
  }

  // Direction keywords: to right, to bottom, etc.
  if (/^to\s+(top|bottom|left|right)/.test(trimmed)) {
    return true;
  }

  // Radial gradient position: at center, at top left, etc.
  if (/^at\s+/.test(trimmed)) {
    return true;
  }

  // Radial gradient size: closest-side, farthest-corner, etc.
  if (/^(closest|farthest)-(side|corner)$/.test(trimmed)) {
    return true;
  }

  // Radial gradient shape: circle, ellipse
  if (/^(circle|ellipse)$/.test(trimmed)) {
    return true;
  }

  // Conic gradient angle: from 45deg
  if (/^from\s+\d+\.?\d*(deg|grad|rad|turn)$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Parse a gradient color stop to extract the color value
 * Examples:
 *   '$blue-90 0%' -> { color: '$blue-90', positions: ['0%'] }
 *   'rgba(255, 255, 255, 0.5)' -> { color: 'rgba(255, 255, 255, 0.5)', positions: [] }
 *   'red 10% 20%' -> { color: 'red', positions: ['10%', '20%'] }
 */
export function parseGradientColorStop(param: string): {
  color: string;
  positions: string[];
} {
  const trimmed = param.trim();

  // Handle function colors (rgb, rgba, hsl, hsla, var)
  if (trimmed.includes('(')) {
    // Find the closing parenthesis
    let depth = 0;
    let endIndex = -1;

    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '(') depth++;
      if (trimmed[i] === ')') {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex !== -1) {
      const color = trimmed.substring(0, endIndex + 1);
      const rest = trimmed.substring(endIndex + 1).trim();
      const positions = rest ? rest.split(/\s+/).filter((p) => p) : [];
      return { color, positions };
    }
  }

  // Handle simple colors (keywords, hex, variables)
  const parts = trimmed.split(/\s+/);
  return {
    color: parts[0],
    positions: parts.slice(1),
  };
}

/**
 * Check if an rgba/rgb function uses white or black
 * Accepts both old and new syntax:
 * - rgba(255, 255, 255, 0.5) or rgba(white, 0.5)
 * - rgb(255 255 255 / 50%) or rgb(0 0 0 / 50%)
 */
export function isWhiteOrBlackRgba(value: string): boolean {
  const trimmed = value.trim();

  // Check for rgba/rgb function
  if (!/^rgba?\s*\(/.test(trimmed)) {
    return false;
  }

  const parsed = extractFunctionParams(trimmed);
  if (!parsed || parsed.params.length === 0) {
    return false;
  }

  const firstParam = parsed.params[0].trim();

  // Check for color keywords
  if (firstParam === 'white' || firstParam === 'black') {
    return true;
  }

  // Check for RGB values
  // Old syntax: rgba(255, 255, 255, 0.5) or rgba(0, 0, 0, 0.5)
  if (parsed.params.length >= 4) {
    const r = parseInt(parsed.params[0].trim(), 10);
    const g = parseInt(parsed.params[1].trim(), 10);
    const b = parseInt(parsed.params[2].trim(), 10);

    // White: 255, 255, 255
    if (r === 255 && g === 255 && b === 255) {
      return true;
    }

    // Black: 0, 0, 0
    if (r === 0 && g === 0 && b === 0) {
      return true;
    }
  }

  // New syntax: rgb(255 255 255 / 50%) or rgb(0 0 0 / 50%)
  // The first parameter contains all RGB values separated by spaces
  const rgbMatch = firstParam.match(
    /^(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*[\d.]+%?)?$/
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);

    // White: 255 255 255
    if (r === 255 && g === 255 && b === 255) {
      return true;
    }

    // Black: 0 0 0
    if (r === 0 && g === 0 && b === 0) {
      return true;
    }
  }

  return false;
}

/**
 * Validate gradient function color stops based on validation mode
 * @param value - The gradient function value
 * @param tokens - Available Carbon tokens
 * @param options - Validation options including validateGradients mode
 */
export function validateGradientFunction(
  value: string,
  tokens: CarbonToken[],
  options: {
    acceptUndefinedVariables?: boolean;
    acceptCarbonCustomProp?: boolean;
    acceptValues?: string[];
    carbonPrefix?: string;
    validateGradients?: 'recommended' | 'strict';
  } = {}
): ValidationResult {
  const { validateGradients } = options;

  // If validation is disabled (undefined), accept all gradients
  if (!validateGradients) {
    return { isValid: true };
  }

  if (!isGradientFunction(value)) {
    return { isValid: false, message: 'Not a gradient function' };
  }

  const parsed = extractFunctionParams(value);
  if (!parsed) {
    return { isValid: false, message: 'Invalid gradient syntax' };
  }

  // Determine where color stops start (skip direction/angle if present)
  const startIndex =
    parsed.params.length > 0 && isDirectionOrAngle(parsed.params[0]) ? 1 : 0;

  // Validate each color stop
  for (let i = startIndex; i < parsed.params.length; i++) {
    const { color } = parseGradientColorStop(parsed.params[i]);

    // In recommended mode, allow semi-transparent white/black via rgba()
    if (validateGradients === 'recommended' && isWhiteOrBlackRgba(color)) {
      continue; // Accept this color stop
    }

    // Validate the color using standard validation
    const validation = validateValue(color, tokens, {
      ...options,
      validateGradients: undefined, // Prevent infinite recursion
    });

    if (!validation.isValid) {
      return {
        isValid: false,
        message: `Gradient color stop "${color}" ${validation.message || 'is invalid'}`,
        suggestedFix: validation.suggestedFix,
      };
    }
  }

  return { isValid: true };
}

/**
 * Check if a value is valid for spacing (layout) properties
 * Valid values:
 * - Carbon tokens (SCSS variables or CSS custom properties)
 * - Relative units: %, vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax
 * - calc() expressions
 * - 0 (unitless zero)
 */
export function isValidSpacingValue(
  value: string,
  tokens: CarbonToken[]
): boolean {
  const trimmed = value.trim();

  // Check for unitless zero
  if (trimmed === '0') return true;

  // Check for calc() expression
  if (isCalcExpression(trimmed)) {
    const result = validateCalcExpression(trimmed, tokens);
    return result.isValid;
  }

  // Check for relative units
  const relativeUnitPattern =
    /^-?\d*\.?\d+(vw|vh|svw|lvw|dvw|svh|lvh|dvh|vi|vb|vmin|vmax|%)$/;
  if (relativeUnitPattern.test(trimmed)) return true;

  // Check for Carbon SCSS variable (clean first to handle interpolation/namespaces)
  const cleanValue = cleanScssValue(trimmed);
  if (isScssVariable(cleanValue)) {
    // For negative variables, check the token without the minus sign
    const tokenToCheck = cleanValue.startsWith('-$')
      ? cleanValue.substring(1) // Remove leading '-' for token lookup
      : cleanValue;

    return tokens.some(
      (token) => token.type === 'scss' && token.name === tokenToCheck
    );
  }

  // Check for Carbon CSS custom property
  if (isCssCustomProperty(trimmed)) {
    const varName = extractCssVarName(trimmed);
    return tokens.some(
      (token) => token.type === 'css-custom-prop' && token.name === varName
    );
  }

  return false;
}

/**
 * Validate transform function according to V4 rules
 * Supports:
 * - translate(x, y) - validates both parameters
 * - translateX(x) - validates single parameter
 * - translateY(y) - validates single parameter
 * - translate3d(x, y, z) - validates only first 2 parameters (z-axis not validated)
 */
export function validateTransformFunction(
  value: string,
  tokens: CarbonToken[]
): ValidationResult {
  if (!isTransformFunction(value)) {
    return { isValid: false, message: 'Not a transform function' };
  }

  const parsed = extractFunctionParams(value);
  if (!parsed) {
    return { isValid: false, message: 'Invalid function syntax' };
  }

  const { name, params } = parsed;

  // Validate based on function type
  switch (name) {
    case 'translateX':
    case 'translateY':
      if (params.length !== 1) {
        return {
          isValid: false,
          message: `${name}() requires exactly 1 parameter, found ${params.length}`,
        };
      }
      if (!isValidSpacingValue(params[0], tokens)) {
        return {
          isValid: false,
          message: `${name}() parameter must be a Carbon spacing token, relative unit (%, vw, vh, etc.), calc() expression, or 0. Found "${params[0]}"`,
        };
      }
      return { isValid: true };

    case 'translate':
      if (params.length !== 2) {
        return {
          isValid: false,
          message: `translate() requires exactly 2 parameters, found ${params.length}`,
        };
      }
      // Validate both parameters
      for (let i = 0; i < 2; i++) {
        if (!isValidSpacingValue(params[i], tokens)) {
          return {
            isValid: false,
            message: `translate() parameter ${i + 1} must be a Carbon spacing token, relative unit (%, vw, vh, etc.), calc() expression, or 0. Found "${params[i]}"`,
          };
        }
      }
      return { isValid: true };

    case 'translate3d':
      if (params.length !== 3) {
        return {
          isValid: false,
          message: `translate3d() requires exactly 3 parameters, found ${params.length}`,
        };
      }
      // Only validate first 2 parameters (x and y), z-axis is not validated
      for (let i = 0; i < 2; i++) {
        if (!isValidSpacingValue(params[i], tokens)) {
          return {
            isValid: false,
            message: `translate3d() parameter ${i + 1} must be a Carbon spacing token, relative unit (%, vw, vh, etc.), calc() expression, or 0. Found "${params[i]}"`,
          };
        }
      }
      return { isValid: true };

    default:
      return {
        isValid: false,
        message: `Unsupported transform function: ${name}()`,
      };
  }
}

/**
 * Check if value is an rgba() function
 */
export function isRgbaFunction(value: string): boolean {
  return /^rgba\s*\(/.test(value.trim());
}

/**
 * Validate rgba() function according to V4 rules
 * Only validates the first parameter (color) - must be a Carbon theme token
 * Alpha and other parameters are not validated
 */
export function validateRgbaFunction(
  value: string,
  tokens: CarbonToken[]
): ValidationResult {
  if (!isRgbaFunction(value)) {
    return { isValid: false, message: 'Not an rgba() function' };
  }

  const parsed = extractFunctionParams(value);
  if (!parsed) {
    return { isValid: false, message: 'Invalid rgba() syntax' };
  }

  const { params } = parsed;

  // rgba() requires at least 2 parameters (color, alpha)
  // Can have 4 parameters (r, g, b, alpha) but we reject that form
  if (params.length < 2) {
    return {
      isValid: false,
      message: `rgba() requires at least 2 parameters, found ${params.length}`,
    };
  }

  // Only validate the first parameter (color)
  const colorParam = params[0];

  // Check if it's a Carbon SCSS variable
  if (isScssVariable(colorParam)) {
    const isValidToken = tokens.some(
      (token) => token.type === 'scss' && token.name === colorParam
    );
    if (isValidToken) {
      return { isValid: true };
    }
    return {
      isValid: false,
      message: `rgba() color parameter must be a Carbon theme token. Found "${colorParam}"`,
    };
  }

  // Check if it's a Carbon CSS custom property
  if (isCssCustomProperty(colorParam)) {
    const varName = extractCssVarName(colorParam);
    const isValidToken = tokens.some(
      (token) => token.type === 'css-custom-prop' && token.name === varName
    );
    if (isValidToken) {
      return { isValid: true };
    }
    return {
      isValid: false,
      message: `rgba() color parameter must be a Carbon theme token. Found "${colorParam}"`,
    };
  }

  // If it's a number, it's the old rgba(r, g, b, a) format - reject
  if (/^\d+$/.test(colorParam.trim())) {
    return {
      isValid: false,
      message: `rgba() color parameter must be a Carbon theme token, not RGB values. Use rgba($token, alpha) format instead of rgba(r, g, b, alpha)`,
    };
  }

  // Any other format is invalid
  return {
    isValid: false,
    message: `rgba() color parameter must be a Carbon theme token. Found "${colorParam}"`,
  };
}

/**
 * Check if value is a Carbon type function (type-scale, font-family, font-weight)
 * These are SCSS functions that return Carbon typography values
 */
export function isCarbonTypeFunction(value: string): boolean {
  return /^(type-scale|font-family|font-weight)\s*\(/.test(value.trim());
}

/**
 * Validate Carbon type function
 * These functions are accepted as-is without parameter validation
 * Parameter correctness is validated by Sass at compile time
 */
export function validateCarbonTypeFunction(value: string): ValidationResult {
  if (!isCarbonTypeFunction(value)) {
    return { isValid: false, message: 'Not a Carbon type function' };
  }

  // Carbon type functions are always valid - no parameter validation needed
  // The Sass compiler will validate parameters at compile time
  return { isValid: true };
}

/**
 * Check if value is a Carbon motion function
 * motion(easing_type, motion_style) returns a cubic-bezier() easing curve
 */
export function isCarbonMotionFunction(value: string): boolean {
  return /\bmotion\s*\(/.test(value);
}

/**
 * Validate Carbon motion function parameters
 * Signature: motion(easing_type, motion_style) or motion(easing_type)
 * - easing_type: 'standard' | 'entrance' | 'exit'
 * - motion_style: 'productive' | 'expressive' (optional)
 * SCSS processes motion(standard) as a string, so shorthand is permitted
 */
export function validateCarbonMotionFunction(value: string): ValidationResult {
  if (!isCarbonMotionFunction(value)) {
    return { isValid: false, message: 'Not a Carbon motion function' };
  }

  // Match full syntax: motion(easing_type, motion_style) with optional quotes
  const fullMatch = value.match(
    /\bmotion\s*\(\s*['"]?(standard|entrance|exit)['"]?\s*,\s*['"]?(productive|expressive)['"]?\s*\)/
  );

  if (fullMatch) {
    return { isValid: true };
  }

  // Allow shorthand syntax: motion(standard) without quotes
  // SCSS processes this as a string
  const shorthandMatch = value.match(
    /\bmotion\s*\(\s*(standard|entrance|exit)\s*\)/
  );

  if (shorthandMatch) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message:
      "Invalid motion() parameters. Expected: motion('standard'|'entrance'|'exit', 'productive'|'expressive') or motion(standard|entrance|exit)",
  };
}
