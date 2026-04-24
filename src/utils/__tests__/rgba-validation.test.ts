/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isRgbaFunction, validateRgbaFunction } from '../validators.js';
import type { CarbonToken } from '../../types/index.js';

// Mock Carbon theme tokens for testing
const mockTokens: CarbonToken[] = [
  { name: '$layer-01', value: '#f4f4f4', type: 'scss' },
  { name: '$background', value: '#ffffff', type: 'scss' },
  { name: '$text-primary', value: '#161616', type: 'scss' },
  { name: '--cds-layer-01', value: '#f4f4f4', type: 'css-custom-prop' },
  { name: '--cds-background', value: '#ffffff', type: 'css-custom-prop' },
];

describe('isRgbaFunction', () => {
  it('should detect rgba() function', () => {
    assert.strictEqual(isRgbaFunction('rgba($layer-01, 0.5)'), true);
    assert.strictEqual(isRgbaFunction('rgba(var(--cds-layer-01), 0.5)'), true);
    assert.strictEqual(isRgbaFunction('rgba(100, 100, 255, 0.5)'), true);
  });

  it('should handle whitespace', () => {
    assert.strictEqual(isRgbaFunction('  rgba($layer-01, 0.5)  '), true);
    assert.strictEqual(isRgbaFunction('rgba( $layer-01 , 0.5 )'), true);
  });

  it('should not detect non-rgba functions', () => {
    assert.strictEqual(isRgbaFunction('rgb(100, 100, 255)'), false);
    assert.strictEqual(isRgbaFunction('hsla(120, 100%, 50%, 0.5)'), false);
    assert.strictEqual(isRgbaFunction('$layer-01'), false);
    assert.strictEqual(isRgbaFunction('#ffffff'), false);
  });
});

describe('validateRgbaFunction', () => {
  describe('valid usage', () => {
    it('should accept Carbon SCSS variable as color', () => {
      const result = validateRgbaFunction('rgba($layer-01, 0.5)', mockTokens);
      assert.strictEqual(result.isValid, true);
    });

    it('should accept Carbon CSS custom property as color', () => {
      const result = validateRgbaFunction(
        'rgba(var(--cds-layer-01), 0.5)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should accept different alpha values', () => {
      assert.strictEqual(
        validateRgbaFunction('rgba($background, 0)', mockTokens).isValid,
        true
      );
      assert.strictEqual(
        validateRgbaFunction('rgba($background, 0.25)', mockTokens).isValid,
        true
      );
      assert.strictEqual(
        validateRgbaFunction('rgba($background, 0.5)', mockTokens).isValid,
        true
      );
      assert.strictEqual(
        validateRgbaFunction('rgba($background, 1)', mockTokens).isValid,
        true
      );
    });

    it('should accept percentage alpha values', () => {
      const result = validateRgbaFunction(
        'rgba($text-primary, 50%)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should not validate alpha parameter', () => {
      // Any alpha value is accepted - we only validate the color parameter
      const result = validateRgbaFunction(
        'rgba($layer-01, invalid-alpha)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });
  });

  describe('invalid usage', () => {
    it('should reject RGB numeric values', () => {
      const result = validateRgbaFunction(
        'rgba(100, 100, 255, 0.5)',
        mockTokens
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('Use rgba($token, alpha) format'));
    });

    it('should reject unknown SCSS variable', () => {
      const result = validateRgbaFunction(
        'rgba($custom-color, 0.5)',
        mockTokens
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('must be a Carbon theme token'));
    });

    it('should reject unknown CSS custom property', () => {
      const result = validateRgbaFunction(
        'rgba(var(--custom-color), 0.5)',
        mockTokens
      );
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('must be a Carbon theme token'));
    });

    it('should reject hex color', () => {
      const result = validateRgbaFunction('rgba(#ffffff, 0.5)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('must be a Carbon theme token'));
    });

    it('should reject color keywords', () => {
      const result = validateRgbaFunction('rgba(white, 0.5)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('must be a Carbon theme token'));
    });

    it('should reject insufficient parameters', () => {
      const result = validateRgbaFunction('rgba($layer-01)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('requires at least 2 parameters'));
    });

    it('should reject non-rgba function', () => {
      const result = validateRgbaFunction('rgb(100, 100, 255)', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('Not an rgba() function'));
    });

    it('should reject invalid syntax', () => {
      const result = validateRgbaFunction('rgba($layer-01', mockTokens);
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('Invalid rgba() syntax'));
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace in parameters', () => {
      const result = validateRgbaFunction(
        'rgba( $layer-01 , 0.5 )',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should handle extra parameters (only validates first)', () => {
      // rgba() with more than 2 parameters - we only validate the first (color)
      const result = validateRgbaFunction(
        'rgba($layer-01, 0.5, extra)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });

    it('should handle nested var() in CSS custom property', () => {
      const result = validateRgbaFunction(
        'rgba(var(--cds-background), 0.8)',
        mockTokens
      );
      assert.strictEqual(result.isValid, true);
    });
  });
});
