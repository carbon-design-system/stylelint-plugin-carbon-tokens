/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CarbonToken, ValidationResult } from '../types/index.js';

/**
 * Check if a value is a SCSS variable
 */
export function isScssVariable(value: string): boolean {
  return value.startsWith('$');
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
  const match = value.match(/var\(--([^)]+)\)/);
  if (!match) return false;
  return match[1].startsWith(`${carbonPrefix}-`);
}

/**
 * Extract variable name from CSS custom property
 */
export function extractCssVarName(value: string): string | null {
  const match = value.match(/var\(--([^)]+)\)/);
  return match ? `--${match[1]}` : null;
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
  } = {}
): ValidationResult {
  const {
    acceptUndefinedVariables = false,
    acceptCarbonCustomProp = false,
    acceptValues = [],
    carbonPrefix = 'cds',
  } = options;

  // Check if value matches accepted patterns
  if (matchesAcceptedValue(value, acceptValues)) {
    return { isValid: true };
  }

  // Check if it's a SCSS variable
  if (isScssVariable(value)) {
    const isCarbon = tokens.some(
      (token) => token.type === 'scss' && token.name === value
    );
    if (isCarbon) {
      return { isValid: true };
    }
    if (acceptUndefinedVariables) {
      return { isValid: true };
    }
    return {
      isValid: false,
      message: `SCSS variable "${value}" is not a Carbon token`,
      suggestedFix: findClosestToken(value, tokens, 'scss'),
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
    if (isCarbon) {
      return { isValid: true };
    }

    if (acceptCarbonCustomProp && varName.startsWith(`--${carbonPrefix}-`)) {
      return { isValid: true };
    }

    if (acceptUndefinedVariables) {
      return { isValid: true };
    }

    return {
      isValid: false,
      message: `CSS custom property "${value}" is not a Carbon token`,
      suggestedFix: findClosestToken(varName, tokens, 'css-custom-prop'),
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
        values.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(current.trim());
  }

  return values.filter((v) => v.length > 0);
}
