/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseTransition,
  parseAnimation,
  parseFont,
  parseBorder,
  parseOutline,
  splitByComma,
} from '../parse-shorthand.js';

describe('parseTransition', () => {
  it('should parse basic transition', () => {
    const result = parseTransition('opacity 200ms ease-in');
    assert.strictEqual(result.property, 'opacity');
    assert.strictEqual(result.duration, '200ms');
    assert.strictEqual(result.timingFunction, 'ease-in');
  });

  it('should parse transition with motion() function', () => {
    const result = parseTransition(
      'opacity 200ms motion(standard, productive)'
    );
    assert.strictEqual(result.property, 'opacity');
    assert.strictEqual(result.duration, '200ms');
    assert.strictEqual(result.timingFunction, 'motion(standard, productive)');
  });

  it('should parse transition with delay', () => {
    const result = parseTransition('opacity 200ms ease-in 100ms');
    assert.strictEqual(result.property, 'opacity');
    assert.strictEqual(result.duration, '200ms');
    assert.strictEqual(result.timingFunction, 'ease-in');
    assert.strictEqual(result.delay, '100ms');
  });

  it('should parse transition with only duration', () => {
    const result = parseTransition('opacity 200ms');
    assert.strictEqual(result.property, 'opacity');
    assert.strictEqual(result.duration, '200ms');
    assert.strictEqual(result.timingFunction, undefined);
  });

  it('should parse transition with cubic-bezier', () => {
    const result = parseTransition(
      'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)'
    );
    assert.strictEqual(result.timingFunction, 'cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('should parse transition with steps', () => {
    const result = parseTransition('opacity 200ms steps(4, end)');
    assert.strictEqual(result.timingFunction, 'steps(4, end)');
  });

  it('should handle all property', () => {
    const result = parseTransition('all 300ms ease-out');
    assert.strictEqual(result.property, 'all');
    assert.strictEqual(result.duration, '300ms');
  });
});

describe('parseAnimation', () => {
  it('should parse basic animation', () => {
    const result = parseAnimation('slide 300ms ease-out');
    assert.strictEqual(result.name, 'slide');
    assert.strictEqual(result.duration, '300ms');
    assert.strictEqual(result.timingFunction, 'ease-out');
  });

  it('should parse animation with iteration count', () => {
    const result = parseAnimation('slide 300ms ease-out infinite');
    assert.strictEqual(result.name, 'slide');
    assert.strictEqual(result.duration, '300ms');
    assert.strictEqual(result.iterationCount, 'infinite');
  });

  it('should parse animation with numeric iteration count', () => {
    const result = parseAnimation('slide 300ms ease-out 3');
    assert.strictEqual(result.iterationCount, '3');
  });

  it('should parse animation with direction', () => {
    const result = parseAnimation('slide 300ms ease-out alternate');
    assert.strictEqual(result.direction, 'alternate');
  });

  it('should parse animation with fill mode', () => {
    const result = parseAnimation('slide 300ms ease-out forwards');
    assert.strictEqual(result.fillMode, 'forwards');
  });

  it('should parse animation with play state', () => {
    const result = parseAnimation('slide 300ms ease-out paused');
    assert.strictEqual(result.playState, 'paused');
  });

  it('should parse animation with delay', () => {
    const result = parseAnimation('slide 300ms ease-out 100ms');
    assert.strictEqual(result.duration, '300ms');
    assert.strictEqual(result.delay, '100ms');
  });

  it('should parse complex animation', () => {
    const result = parseAnimation(
      'slide 300ms ease-out 100ms infinite alternate forwards'
    );
    assert.strictEqual(result.name, 'slide');
    assert.strictEqual(result.duration, '300ms');
    assert.strictEqual(result.timingFunction, 'ease-out');
    assert.strictEqual(result.delay, '100ms');
    assert.strictEqual(result.iterationCount, 'infinite');
    assert.strictEqual(result.direction, 'alternate');
    assert.strictEqual(result.fillMode, 'forwards');
  });

  it('should parse animation with motion() function', () => {
    const result = parseAnimation('slide 300ms motion(entrance, expressive)');
    assert.strictEqual(result.timingFunction, 'motion(entrance, expressive)');
  });
});

describe('parseFont', () => {
  it('should parse basic font', () => {
    const result = parseFont('16px Arial');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.family, 'Arial');
  });

  it('should parse font with line-height', () => {
    const result = parseFont('16px/1.5 Arial');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.lineHeight, '1.5');
    assert.strictEqual(result.family, 'Arial');
  });

  it('should parse font with style', () => {
    const result = parseFont('italic 16px Arial');
    assert.strictEqual(result.style, 'italic');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.family, 'Arial');
  });

  it('should parse font with weight', () => {
    const result = parseFont('bold 16px Arial');
    assert.strictEqual(result.weight, 'bold');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.family, 'Arial');
  });

  it('should parse font with numeric weight', () => {
    const result = parseFont('700 16px Arial');
    assert.strictEqual(result.weight, '700');
    assert.strictEqual(result.size, '16px');
  });

  it('should parse font with variant', () => {
    const result = parseFont('small-caps 16px Arial');
    assert.strictEqual(result.variant, 'small-caps');
    assert.strictEqual(result.size, '16px');
  });

  it('should parse font with all properties', () => {
    const result = parseFont(
      'italic small-caps bold 16px/1.5 Arial, sans-serif'
    );
    assert.strictEqual(result.style, 'italic');
    assert.strictEqual(result.variant, 'small-caps');
    assert.strictEqual(result.weight, 'bold');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.lineHeight, '1.5');
    assert.strictEqual(result.family, 'Arial, sans-serif');
  });

  it('should parse font with quoted family', () => {
    const result = parseFont('16px "Times New Roman", Times, serif');
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.family, '"Times New Roman", Times, serif');
  });

  it('should parse font with single-quoted family', () => {
    const result = parseFont("16px 'IBM Plex Sans', sans-serif");
    assert.strictEqual(result.size, '16px');
    assert.strictEqual(result.family, "'IBM Plex Sans', sans-serif");
  });
});

describe('parseBorder', () => {
  it('should parse basic border', () => {
    const result = parseBorder('1px solid #000000');
    assert.strictEqual(result.width, '1px');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.color, '#000000');
  });

  it('should parse border with named color', () => {
    const result = parseBorder('2px dashed red');
    assert.strictEqual(result.width, '2px');
    assert.strictEqual(result.style, 'dashed');
    assert.strictEqual(result.color, 'red');
  });

  it('should parse border with keyword width', () => {
    const result = parseBorder('thin solid black');
    assert.strictEqual(result.width, 'thin');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.color, 'black');
  });

  it('should parse border with rgb color', () => {
    const result = parseBorder('1px solid rgb(255, 0, 0)');
    assert.strictEqual(result.width, '1px');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.color, 'rgb(255, 0, 0)');
  });

  it('should parse border with variable', () => {
    const result = parseBorder('1px solid $color-border');
    assert.strictEqual(result.color, '$color-border');
  });

  it('should parse border with CSS custom property', () => {
    const result = parseBorder('1px solid var(--cds-border-subtle)');
    assert.strictEqual(result.color, 'var(--cds-border-subtle)');
  });

  it('should parse border in any order', () => {
    const result = parseBorder('solid #000000 1px');
    assert.strictEqual(result.width, '1px');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.color, '#000000');
  });

  it('should parse border with only style', () => {
    const result = parseBorder('solid');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.width, undefined);
    assert.strictEqual(result.color, undefined);
  });

  it('should parse border with different units', () => {
    const result = parseBorder('0.5em dotted blue');
    assert.strictEqual(result.width, '0.5em');
    assert.strictEqual(result.style, 'dotted');
  });
});

describe('parseOutline', () => {
  it('should parse basic outline', () => {
    const result = parseOutline('2px solid #ff0000');
    assert.strictEqual(result.width, '2px');
    assert.strictEqual(result.style, 'solid');
    assert.strictEqual(result.color, '#ff0000');
  });

  it('should parse outline with named color', () => {
    const result = parseOutline('3px dashed blue');
    assert.strictEqual(result.width, '3px');
    assert.strictEqual(result.style, 'dashed');
    assert.strictEqual(result.color, 'blue');
  });

  it('should work same as border', () => {
    const borderResult = parseBorder('1px solid black');
    const outlineResult = parseOutline('1px solid black');
    assert.deepStrictEqual(borderResult, outlineResult);
  });
});

describe('splitByComma', () => {
  it('should split simple comma-separated values', () => {
    const result = splitByComma('opacity 200ms, transform 300ms');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'opacity 200ms');
    assert.strictEqual(result[1], 'transform 300ms');
  });

  it('should respect parentheses', () => {
    const result = splitByComma(
      'opacity 200ms motion(standard, productive), transform 300ms'
    );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'opacity 200ms motion(standard, productive)');
    assert.strictEqual(result[1], 'transform 300ms');
  });

  it('should respect nested parentheses', () => {
    const result = splitByComma(
      'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms'
    );
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('should respect quotes', () => {
    const result = splitByComma('16px "Times New Roman, Times", 14px Arial');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '16px "Times New Roman, Times"');
    assert.strictEqual(result[1], '14px Arial');
  });

  it('should handle single value', () => {
    const result = splitByComma('opacity 200ms ease-in');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], 'opacity 200ms ease-in');
  });

  it('should handle empty string', () => {
    const result = splitByComma('');
    assert.strictEqual(result.length, 0);
  });

  it('should trim whitespace', () => {
    const result = splitByComma('  opacity 200ms  ,  transform 300ms  ');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'opacity 200ms');
    assert.strictEqual(result[1], 'transform 300ms');
  });
});
