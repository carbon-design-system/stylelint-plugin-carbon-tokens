/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isTransformFunction,
  extractFunctionParams,
  isValidSpacingValue,
  validateTransformFunction,
} from '../validators.js';
import type { CarbonToken } from '../../types/index.js';

// Mock Carbon tokens for testing
const mockTokens: CarbonToken[] = [
  { name: '$spacing-01', value: '0.125rem', type: 'scss' },
  { name: '$spacing-05', value: '1rem', type: 'scss' },
  { name: '--cds-spacing-01', value: '0.125rem', type: 'css-custom-prop' },
  { name: '--cds-spacing-05', value: '1rem', type: 'css-custom-prop' },
];

describe('isTransformFunction', () => {
  it('should detect translate function', () => {
    assert.strictEqual(isTransformFunction('translate(10px, 20px)'), true);
  });

  it('should detect translateX function', () => {
    assert.strictEqual(isTransformFunction('translateX(10px)'), true);
  });

  it('should detect translateY function', () => {
    assert.strictEqual(isTransformFunction('translateY(10px)'), true);
  });

  it('should detect translate3d function', () => {
    assert.strictEqual(isTransformFunction('translate3d(10px, 20px, 30px)'), true);
  });

  it('should not detect non-transform functions', () => {
    assert.strictEqual(isTransformFunction('rotate(45deg)'), false);
    assert.strictEqual(isTransformFunction('scale(1.5)'), false);
    assert.strictEqual(isTransformFunction('calc(100% - 10px)'), false);
  });

  it('should not detect plain values', () => {
    assert.strictEqual(isTransformFunction('10px'), false);
    assert.strictEqual(isTransformFunction('$spacing-01'), false);
  });
});

describe('extractFunctionParams', () => {
  it('should extract single parameter', () => {
    const result = extractFunctionParams('translateX(10px)');
    assert.deepStrictEqual(result, {
      name: 'translateX',
      params: ['10px'],
    });
  });

  it('should extract multiple parameters', () => {
    const result = extractFunctionParams('translate(10px, 20px)');
    assert.deepStrictEqual(result, {
      name: 'translate',
      params: ['10px', '20px'],
    });
  });

  it('should extract three parameters', () => {
    const result = extractFunctionParams('translate3d(10px, 20px, 30px)');
    assert.deepStrictEqual(result, {
      name: 'translate3d',
      params: ['10px', '20px', '30px'],
    });
  });

  it('should handle nested calc() in parameters', () => {
    const result = extractFunctionParams('translate(calc(100% - 10px), 20px)');
    assert.deepStrictEqual(result, {
      name: 'translate',
      params: ['calc(100% - 10px)', '20px'],
    });
  });

  it('should handle whitespace', () => {
    const result = extractFunctionParams('translate( 10px , 20px )');
    assert.deepStrictEqual(result, {
      name: 'translate',
      params: ['10px', '20px'],
    });
  });

  it('should return null for invalid syntax', () => {
    assert.strictEqual(extractFunctionParams('not-a-function'), null);
    assert.strictEqual(extractFunctionParams('translate('), null);
  });
});

describe('isValidSpacingValue', () => {
  it('should accept unitless zero', () => {
    assert.strictEqual(isValidSpacingValue('0', mockTokens), true);
  });

  it('should accept Carbon SCSS variables', () => {
    assert.strictEqual(isValidSpacingValue('$spacing-01', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('$spacing-05', mockTokens), true);
  });

  it('should accept Carbon CSS custom properties', () => {
    assert.strictEqual(isValidSpacingValue('var(--cds-spacing-01)', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('var(--cds-spacing-05)', mockTokens), true);
  });

  it('should accept relative units', () => {
    assert.strictEqual(isValidSpacingValue('50%', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('100vw', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('50vh', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('10svw', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('10lvw', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('10dvw', mockTokens), true);
  });

  it('should accept valid calc() expressions', () => {
    assert.strictEqual(isValidSpacingValue('calc(100vw - #{$spacing-01})', mockTokens), true);
    assert.strictEqual(isValidSpacingValue('calc(-1 * #{$spacing-05})', mockTokens), true);
  });

  it('should reject hard-coded pixel values', () => {
    assert.strictEqual(isValidSpacingValue('10px', mockTokens), false);
    assert.strictEqual(isValidSpacingValue('1rem', mockTokens), false);
    assert.strictEqual(isValidSpacingValue('2em', mockTokens), false);
  });

  it('should reject unknown tokens', () => {
    assert.strictEqual(isValidSpacingValue('$unknown-token', mockTokens), false);
    assert.strictEqual(isValidSpacingValue('var(--unknown-token)', mockTokens), false);
  });
});

describe('validateTransformFunction', () => {
  describe('translateX', () => {
    it('should accept valid Carbon token', () => {
      const result = validateTransformFunction('translateX($spacing-01)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should accept relative units', () => {
      const result = validateTransformFunction('translateX(50%)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should accept calc() expression', () => {
      const result = validateTransformFunction(
        'translateX(calc(100vw - #{$spacing-01}))',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should accept zero', () => {
      const result = validateTransformFunction('translateX(0)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should reject hard-coded pixel value', () => {
      const result = validateTransformFunction('translateX(10px)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('must be a Carbon spacing token'));
    });

    it('should reject wrong number of parameters', () => {
      const result = validateTransformFunction('translateX(10px, 20px)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('requires exactly 1 parameter'));
    });
  });

  describe('translateY', () => {
    it('should accept valid Carbon token', () => {
      const result = validateTransformFunction('translateY($spacing-05)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should reject hard-coded value', () => {
      const result = validateTransformFunction('translateY(20px)', mockTokens);
      assert.strictEqual(result.isValid, false);
    });
  });

  describe('translate', () => {
    it('should accept two valid Carbon tokens', () => {
      const result = validateTransformFunction(
        'translate($spacing-01, $spacing-05)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should accept mix of token and relative unit', () => {
      const result = validateTransformFunction('translate($spacing-01, 50%)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should accept calc() in parameters', () => {
      const result = validateTransformFunction(
        'translate(calc(100vw - #{$spacing-01}), $spacing-05)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should reject if first parameter is invalid', () => {
      const result = validateTransformFunction('translate(10px, $spacing-05)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('parameter 1'));
    });

    it('should reject if second parameter is invalid', () => {
      const result = validateTransformFunction('translate($spacing-01, 20px)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('parameter 2'));
    });

    it('should reject wrong number of parameters', () => {
      const result = validateTransformFunction('translate($spacing-01)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('requires exactly 2 parameters'));
    });
  });

  describe('translate3d', () => {
    it('should accept valid first two parameters (z-axis not validated)', () => {
      const result = validateTransformFunction(
        'translate3d($spacing-01, $spacing-05, 100px)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should accept relative units for x and y', () => {
      const result = validateTransformFunction('translate3d(50%, 25vh, 0)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should reject if first parameter is invalid', () => {
      const result = validateTransformFunction(
        'translate3d(10px, $spacing-05, 0)',
        mockTokens
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('parameter 1'));
    });

    it('should reject if second parameter is invalid', () => {
      const result = validateTransformFunction(
        'translate3d($spacing-01, 20px, 0)',
        mockTokens
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('parameter 2'));
    });

    it('should reject wrong number of parameters', () => {
      const result = validateTransformFunction('translate3d($spacing-01, $spacing-05)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('requires exactly 3 parameters'));
    });
  });

  describe('unsupported functions', () => {
    it('should reject rotate function', () => {
      const result = validateTransformFunction('rotate(45deg)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('Not a transform function'));
    });

    it('should reject scale function', () => {
      const result = validateTransformFunction('scale(1.5)', mockTokens);
      assert.strictEqual(result.isValid, false);
    });
  });
});
