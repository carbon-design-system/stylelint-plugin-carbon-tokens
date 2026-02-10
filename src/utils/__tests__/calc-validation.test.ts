/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isCalcExpression,
  extractCalcContents,
  validateCalcExpression,
} from '../validators.js';
import type { CarbonToken } from '../../types/index.js';

// Mock Carbon tokens for testing
const mockTokens: CarbonToken[] = [
  { name: '$spacing-01', value: '0.125rem', type: 'scss' },
  { name: '$spacing-05', value: '1rem', type: 'scss' },
  { name: '$spacing-04', value: '0.75rem', type: 'scss' },
  { name: '--cds-spacing-01', value: '0.125rem', type: 'css-custom-prop' },
  { name: '--cds-spacing-05', value: '1rem', type: 'css-custom-prop' },
];

describe('isCalcExpression', () => {
  it('should identify calc() expressions', () => {
    assert.strictEqual(isCalcExpression('calc(100vw - 1rem)'), true);
    assert.strictEqual(isCalcExpression('calc(100% + 2px)'), true);
    assert.strictEqual(isCalcExpression('  calc(50vh - 10px)  '), true);
  });

  it('should reject non-calc expressions', () => {
    assert.strictEqual(isCalcExpression('100vw'), false);
    assert.strictEqual(isCalcExpression('$spacing-05'), false);
    assert.strictEqual(isCalcExpression('var(--cds-spacing-05)'), false);
    assert.strictEqual(isCalcExpression('1rem'), false);
  });
});

describe('extractCalcContents', () => {
  it('should extract calc contents', () => {
    assert.strictEqual(
      extractCalcContents('calc(100vw - 1rem)'),
      '100vw - 1rem'
    );
    assert.strictEqual(extractCalcContents('calc(100% + 2px)'), '100% + 2px');
    assert.strictEqual(
      extractCalcContents('calc(-1 * $spacing-05)'),
      '-1 * $spacing-05'
    );
  });

  it('should handle whitespace', () => {
    assert.strictEqual(
      extractCalcContents('calc(  100vw - 1rem  )'),
      '100vw - 1rem'
    );
  });

  it('should return null for invalid syntax', () => {
    assert.strictEqual(extractCalcContents('100vw - 1rem'), null);
    assert.strictEqual(extractCalcContents('calc(100vw'), null);
  });
});

describe('validateCalcExpression - Proportional Math', () => {
  it('should accept calc with vw + token', () => {
    const result = validateCalcExpression(
      'calc(100vw - #{$spacing-01})',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc with vh + token', () => {
    const result = validateCalcExpression(
      'calc(100vh - #{$spacing-05})',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc with % + token', () => {
    const result = validateCalcExpression(
      'calc(100% + #{$spacing-01})',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc with token without #{} wrapper', () => {
    const result = validateCalcExpression(
      'calc(100vw - $spacing-01)',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc with CSS custom property', () => {
    const result = validateCalcExpression(
      'calc(100vw - var(--cds-spacing-01))',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should reject calc with px instead of proportional unit', () => {
    const result = validateCalcExpression(
      'calc(100px - #{$spacing-01})',
      mockTokens
    );
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('calc(P O token)'));
  });

  it('should reject calc with non-Carbon token', () => {
    const result = validateCalcExpression(
      'calc(100vw - #{$unknown-token})',
      mockTokens
    );
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('Carbon spacing token'));
  });

  it('should reject calc with two tokens', () => {
    const result = validateCalcExpression(
      'calc(#{$spacing-01} + #{$spacing-05})',
      mockTokens
    );
    assert.strictEqual(result.isValid, false);
  });
});

describe('validateCalcExpression - Token Negation', () => {
  it('should accept calc(-1 * token)', () => {
    const result = validateCalcExpression(
      'calc(-1 * #{$spacing-04})',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc(token / -1)', () => {
    const result = validateCalcExpression(
      'calc(#{$spacing-01} / -1)',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept calc(token * -1)', () => {
    const result = validateCalcExpression(
      'calc(#{$spacing-04} * -1)',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should accept negation without #{} wrapper', () => {
    const result = validateCalcExpression('calc($spacing-01 / -1)', mockTokens);
    assert.strictEqual(result.isValid, true);
  });

  it('should accept negation with CSS custom property', () => {
    const result = validateCalcExpression(
      'calc(-1 * var(--cds-spacing-05))',
      mockTokens
    );
    assert.strictEqual(result.isValid, true);
  });

  it('should reject calc with non--1 multiplier', () => {
    const result = validateCalcExpression(
      'calc(#{$spacing-01} * 1.5)',
      mockTokens
    );
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('calc(P O token)'));
  });

  it('should reject negation with non-Carbon token', () => {
    const result = validateCalcExpression('calc(-1 * #{$unknown})', mockTokens);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('Carbon spacing token'));
  });
});

describe('validateCalcExpression - Invalid Patterns', () => {
  it('should reject non-calc expressions', () => {
    const result = validateCalcExpression('100vw - 1rem', mockTokens);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('Not a calc()'));
  });

  it('should reject invalid calc syntax', () => {
    const result = validateCalcExpression('calc(100vw', mockTokens);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('Invalid calc() syntax'));
  });

  it('should reject complex expressions', () => {
    const result = validateCalcExpression(
      'calc(100vw - 10px + #{$spacing-01})',
      mockTokens
    );
    assert.strictEqual(result.isValid, false);
  });

  it('should provide helpful error message', () => {
    const result = validateCalcExpression('calc(50% - 8px)', mockTokens);
    assert.strictEqual(result.isValid, false);
    assert.ok(result.message?.includes('calc(P O token)'));
    assert.ok(result.message?.includes('viewport/percentage unit'));
  });
});
