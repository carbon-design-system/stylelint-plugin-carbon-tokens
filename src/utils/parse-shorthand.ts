/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { parseValue } from './validators.js';

/**
 * Check if a value is a timing function (keyword or function)
 */
function isTimingFunction(value: string): boolean {
  const keywords = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'step-start',
    'step-end',
  ];
  return (
    keywords.includes(value) ||
    value.startsWith('cubic-bezier(') ||
    value.startsWith('steps(') ||
    value.startsWith('motion(')
  );
}

/**
 * Check if a value is a time duration (ends with s or ms)
 */
function isTimeDuration(value: string): boolean {
  return /^\d+\.?\d*(m?s)$/.test(value);
}

/**
 * Parse transition shorthand into components
 * Format: <property> <duration> <timing-function> <delay>
 * Example: "opacity 200ms ease-in 0s"
 */
export function parseTransition(value: string): {
  property?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
} {
  const parts = parseValue(value);
  const result: {
    property?: string;
    duration?: string;
    timingFunction?: string;
    delay?: string;
  } = {};

  for (const part of parts) {
    // Duration/delay: ends with 's' or 'ms'
    if (isTimeDuration(part)) {
      if (!result.duration) {
        result.duration = part;
      } else if (!result.delay) {
        result.delay = part;
      }
    }
    // Timing function: keyword or function
    else if (isTimingFunction(part)) {
      result.timingFunction = part;
    }
    // Property name: everything else (first non-time, non-function value)
    else if (!result.property) {
      result.property = part;
    }
  }

  return result;
}

/**
 * Parse animation shorthand into components
 * Format: <name> <duration> <timing-function> <delay> <iteration-count> <direction> <fill-mode> <play-state>
 * Example: "slide 300ms ease-out 0s infinite normal forwards running"
 */
export function parseAnimation(value: string): {
  name?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
  playState?: string;
} {
  const parts = parseValue(value);
  const result: {
    name?: string;
    duration?: string;
    timingFunction?: string;
    delay?: string;
    iterationCount?: string;
    direction?: string;
    fillMode?: string;
    playState?: string;
  } = {};

  for (const part of parts) {
    // Duration/delay
    if (isTimeDuration(part)) {
      if (!result.duration) {
        result.duration = part;
      } else if (!result.delay) {
        result.delay = part;
      }
    }
    // Timing function
    else if (isTimingFunction(part)) {
      result.timingFunction = part;
    }
    // Iteration count
    else if (/^\d+$/.test(part) || part === 'infinite') {
      result.iterationCount = part;
    }
    // Direction
    else if (
      ['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(part)
    ) {
      result.direction = part;
    }
    // Fill mode
    else if (['none', 'forwards', 'backwards', 'both'].includes(part)) {
      result.fillMode = part;
    }
    // Play state
    else if (['running', 'paused'].includes(part)) {
      result.playState = part;
    }
    // Animation name (first non-keyword value)
    else if (!result.name) {
      result.name = part;
    }
  }

  return result;
}

/**
 * Parse font shorthand into components
 * Format: <font-style> <font-variant> <font-weight> <font-size>/<line-height> <font-family>
 * Example: "italic small-caps bold 16px/1.5 Arial, sans-serif"
 *
 * Note: font-size and font-family are required, others are optional
 */
export function parseFont(value: string): {
  style?: string;
  variant?: string;
  weight?: string;
  size?: string;
  lineHeight?: string;
  family?: string;
} {
  const result: {
    style?: string;
    variant?: string;
    weight?: string;
    size?: string;
    lineHeight?: string;
    family?: string;
  } = {};

  // Split by spaces, but preserve quoted strings
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
      current += char;
    } else if (char === ' ' && !inQuotes) {
      if (current.trim()) {
        parts.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  let i = 0;

  // Optional: font-style
  if (i < parts.length && ['italic', 'oblique', 'normal'].includes(parts[i])) {
    result.style = parts[i++];
  }

  // Optional: font-variant
  if (i < parts.length && ['small-caps', 'normal'].includes(parts[i])) {
    result.variant = parts[i++];
  }

  // Optional: font-weight
  if (
    i < parts.length &&
    (['bold', 'bolder', 'lighter', 'normal'].includes(parts[i]) ||
      /^\d{3}$/.test(parts[i]))
  ) {
    result.weight = parts[i++];
  }

  // Required: font-size (and optional line-height)
  if (i < parts.length) {
    const sizeHeight = parts[i++].split('/');
    result.size = sizeHeight[0];
    if (sizeHeight[1]) {
      result.lineHeight = sizeHeight[1];
    }
  }

  // Required: font-family (rest of the string, may include commas)
  if (i < parts.length) {
    result.family = parts.slice(i).join(' ');
  }

  return result;
}

/**
 * Parse border shorthand into components
 * Format: <width> <style> <color>
 * Example: "1px solid #000000"
 *
 * All values are optional and can appear in any order
 */
export function parseBorder(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  const parts = parseValue(value);
  const result: {
    width?: string;
    style?: string;
    color?: string;
  } = {};

  const borderStyles = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
  ];

  for (const part of parts) {
    // Width: ends with length unit or is a keyword
    if (
      /^\d+\.?\d*(px|em|rem|%|pt|cm|mm|in|pc|ex|ch|vw|vh|vmin|vmax)$/.test(
        part
      ) ||
      ['thin', 'medium', 'thick'].includes(part)
    ) {
      result.width = part;
    }
    // Style: border style keywords
    else if (borderStyles.includes(part)) {
      result.style = part;
    }
    // Color: everything else (hex, rgb, rgba, named colors, variables, etc.)
    else {
      result.color = part;
    }
  }

  return result;
}

/**
 * Parse outline shorthand into components
 * Format: <width> <style> <color>
 * Example: "2px solid #ff0000"
 *
 * Same format as border
 */
export function parseOutline(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  // Outline has the same format as border
  return parseBorder(value);
}

/**
 * Split a value by commas, respecting parentheses and quotes
 * Used for handling multiple transitions/animations
 */
export function splitByComma(value: string): string[] {
  const results: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
      current += char;
    } else if (char === '(' && !inQuotes) {
      depth++;
      current += char;
    } else if (char === ')' && !inQuotes) {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0 && !inQuotes) {
      if (current.trim()) {
        results.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    results.push(current.trim());
  }

  return results;
}
