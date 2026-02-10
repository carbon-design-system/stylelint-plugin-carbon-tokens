/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  reconstructTransition,
  reconstructAnimation,
  reconstructFont,
  reconstructBorder,
  reconstructOutline,
} from '../parse-shorthand.js';

describe('reconstructTransition', () => {
  it('should reconstruct transition with all components', () => {
    const result = reconstructTransition({
      property: 'opacity',
      duration: '300ms',
      timingFunction: 'ease-in',
      delay: '100ms',
    });
    assert.strictEqual(result, 'opacity 300ms ease-in 100ms');
  });

  it('should reconstruct transition with only property and duration', () => {
    const result = reconstructTransition({
      property: 'opacity',
      duration: '300ms',
    });
    assert.strictEqual(result, 'opacity 300ms');
  });

  it('should reconstruct transition with property, duration, and timing', () => {
    const result = reconstructTransition({
      property: 'all',
      duration: '200ms',
      timingFunction: 'ease-out',
    });
    assert.strictEqual(result, 'all 200ms ease-out');
  });

  it('should handle empty object', () => {
    const result = reconstructTransition({});
    assert.strictEqual(result, '');
  });

  it('should handle partial components', () => {
    const result = reconstructTransition({
      duration: '500ms',
      timingFunction: 'linear',
    });
    assert.strictEqual(result, '500ms linear');
  });
});

describe('reconstructAnimation', () => {
  it('should reconstruct animation with all components', () => {
    const result = reconstructAnimation({
      name: 'slide',
      duration: '300ms',
      timingFunction: 'ease-in',
      delay: '100ms',
      iterationCount: 'infinite',
      direction: 'alternate',
      fillMode: 'forwards',
      playState: 'running',
    });
    assert.strictEqual(
      result,
      'slide 300ms ease-in 100ms infinite alternate forwards running'
    );
  });

  it('should reconstruct animation with minimal components', () => {
    const result = reconstructAnimation({
      name: 'fade',
      duration: '1s',
    });
    assert.strictEqual(result, 'fade 1s');
  });

  it('should reconstruct animation with name, duration, and timing', () => {
    const result = reconstructAnimation({
      name: 'bounce',
      duration: '500ms',
      timingFunction: 'ease-out',
    });
    assert.strictEqual(result, 'bounce 500ms ease-out');
  });

  it('should handle iteration count', () => {
    const result = reconstructAnimation({
      name: 'spin',
      duration: '2s',
      iterationCount: '3',
    });
    assert.strictEqual(result, 'spin 2s 3');
  });

  it('should handle direction and fill mode', () => {
    const result = reconstructAnimation({
      name: 'slide',
      duration: '1s',
      direction: 'reverse',
      fillMode: 'both',
    });
    assert.strictEqual(result, 'slide 1s reverse both');
  });

  it('should handle empty object', () => {
    const result = reconstructAnimation({});
    assert.strictEqual(result, '');
  });
});

describe('reconstructFont', () => {
  it('should reconstruct font with all components', () => {
    const result = reconstructFont({
      style: 'italic',
      variant: 'small-caps',
      weight: 'bold',
      size: '16px',
      lineHeight: '1.5',
      family: 'Arial',
    });
    assert.strictEqual(result, 'italic small-caps bold 16px/1.5 Arial');
  });

  it('should reconstruct font with size and family only', () => {
    const result = reconstructFont({
      size: '14px',
      family: 'Helvetica',
    });
    assert.strictEqual(result, '14px Helvetica');
  });

  it('should reconstruct font with size/line-height and family', () => {
    const result = reconstructFont({
      size: '16px',
      lineHeight: '1.6',
      family: '"Times New Roman"',
    });
    assert.strictEqual(result, '16px/1.6 "Times New Roman"');
  });

  it('should reconstruct font with weight, size, and family', () => {
    const result = reconstructFont({
      weight: '600',
      size: '18px',
      family: 'sans-serif',
    });
    assert.strictEqual(result, '600 18px sans-serif');
  });

  it('should reconstruct font with style and weight', () => {
    const result = reconstructFont({
      style: 'italic',
      weight: 'bold',
      size: '16px',
      family: 'Georgia',
    });
    assert.strictEqual(result, 'italic bold 16px Georgia');
  });

  it('should handle size without line-height', () => {
    const result = reconstructFont({
      size: '20px',
      family: 'monospace',
    });
    assert.strictEqual(result, '20px monospace');
  });

  it('should handle empty object', () => {
    const result = reconstructFont({});
    assert.strictEqual(result, '');
  });
});

describe('reconstructBorder', () => {
  it('should reconstruct border with all components', () => {
    const result = reconstructBorder({
      width: '2px',
      style: 'solid',
      color: '#ff0000',
    });
    assert.strictEqual(result, '2px solid #ff0000');
  });

  it('should reconstruct border with width and style', () => {
    const result = reconstructBorder({
      width: '1px',
      style: 'dashed',
    });
    assert.strictEqual(result, '1px dashed');
  });

  it('should reconstruct border with style and color', () => {
    const result = reconstructBorder({
      style: 'dotted',
      color: 'blue',
    });
    assert.strictEqual(result, 'dotted blue');
  });

  it('should reconstruct border with only style', () => {
    const result = reconstructBorder({
      style: 'solid',
    });
    assert.strictEqual(result, 'solid');
  });

  it('should reconstruct border with keyword width', () => {
    const result = reconstructBorder({
      width: 'thick',
      style: 'double',
      color: 'green',
    });
    assert.strictEqual(result, 'thick double green');
  });

  it('should handle empty object', () => {
    const result = reconstructBorder({});
    assert.strictEqual(result, '');
  });
});

describe('reconstructOutline', () => {
  it('should reconstruct outline with all components', () => {
    const result = reconstructOutline({
      width: '3px',
      style: 'solid',
      color: 'red',
    });
    assert.strictEqual(result, '3px solid red');
  });

  it('should reconstruct outline with width and style', () => {
    const result = reconstructOutline({
      width: '2px',
      style: 'dashed',
    });
    assert.strictEqual(result, '2px dashed');
  });

  it('should work same as border reconstruction', () => {
    const borderResult = reconstructBorder({
      width: '1px',
      style: 'solid',
      color: '#000',
    });
    const outlineResult = reconstructOutline({
      width: '1px',
      style: 'solid',
      color: '#000',
    });
    assert.strictEqual(outlineResult, borderResult);
  });

  it('should handle empty object', () => {
    const result = reconstructOutline({});
    assert.strictEqual(result, '');
  });
});
