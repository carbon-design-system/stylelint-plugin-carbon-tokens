/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isCarbonTypeFunction,
  validateCarbonTypeFunction,
} from '../validators.js';

describe('isCarbonTypeFunction', () => {
  describe('type-scale()', () => {
    it('should detect type-scale function', () => {
      assert.strictEqual(isCarbonTypeFunction('type-scale(1)'), true);
      assert.strictEqual(isCarbonTypeFunction('type-scale(5)'), true);
    });

    it('should handle whitespace', () => {
      assert.strictEqual(isCarbonTypeFunction('  type-scale(1)  '), true);
      assert.strictEqual(isCarbonTypeFunction('type-scale( 1 )'), true);
    });
  });

  describe('font-family()', () => {
    it('should detect font-family function', () => {
      assert.strictEqual(isCarbonTypeFunction('font-family(1)'), true);
      assert.strictEqual(isCarbonTypeFunction('font-family("sans")'), true);
    });

    it('should handle whitespace', () => {
      assert.strictEqual(isCarbonTypeFunction('  font-family(1)  '), true);
    });
  });

  describe('font-weight()', () => {
    it('should detect font-weight function', () => {
      assert.strictEqual(isCarbonTypeFunction('font-weight("bold")'), true);
      assert.strictEqual(isCarbonTypeFunction("font-weight('regular')"), true);
    });

    it('should handle whitespace', () => {
      assert.strictEqual(isCarbonTypeFunction('  font-weight("bold")  '), true);
    });
  });

  describe('negative cases', () => {
    it('should not detect V10 functions (not supported in V5)', () => {
      assert.strictEqual(isCarbonTypeFunction('carbon--type-scale(1)'), false);
      assert.strictEqual(isCarbonTypeFunction('carbon--font-family(1)'), false);
      assert.strictEqual(
        isCarbonTypeFunction('carbon--font-weight("bold")'),
        false
      );
    });

    it('should not detect non-Carbon functions', () => {
      assert.strictEqual(isCarbonTypeFunction('rgba(255, 0, 0, 0.5)'), false);
      assert.strictEqual(isCarbonTypeFunction('calc(100% - 10px)'), false);
      assert.strictEqual(isCarbonTypeFunction('translate(10px, 20px)'), false);
    });

    it('should not detect plain values', () => {
      assert.strictEqual(isCarbonTypeFunction('16px'), false);
      assert.strictEqual(isCarbonTypeFunction('$font-size-01'), false);
      assert.strictEqual(isCarbonTypeFunction('Arial, sans-serif'), false);
      assert.strictEqual(isCarbonTypeFunction('bold'), false);
    });
  });
});

describe('validateCarbonTypeFunction', () => {
  describe('type-scale()', () => {
    it('should accept type-scale with numeric parameter', () => {
      const result = validateCarbonTypeFunction('type-scale(1)');
      assert.strictEqual(result.isValid, true);
    });

    it('should accept type-scale with any parameter (no validation)', () => {
      // Parameters are not validated - Sass will handle that
      assert.strictEqual(
        validateCarbonTypeFunction('type-scale(1)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('type-scale(5)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('type-scale(999)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('type-scale("invalid")').isValid,
        true
      );
    });
  });

  describe('font-family()', () => {
    it('should accept font-family with any parameter', () => {
      assert.strictEqual(
        validateCarbonTypeFunction('font-family(1)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('font-family("sans")').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('font-family("mono")').isValid,
        true
      );
    });
  });

  describe('font-weight()', () => {
    it('should accept font-weight with string parameter', () => {
      assert.strictEqual(
        validateCarbonTypeFunction('font-weight("bold")').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction("font-weight('regular')").isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction("font-weight('light')").isValid,
        true
      );
    });

    it('should accept font-weight with any parameter', () => {
      // Parameters are not validated
      assert.strictEqual(
        validateCarbonTypeFunction('font-weight(400)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('font-weight("invalid")').isValid,
        true
      );
    });
  });

  describe('invalid cases', () => {
    it('should reject V10 functions', () => {
      const result = validateCarbonTypeFunction('carbon--type-scale(1)');
      assert.strictEqual(result.isValid, false);
      assert.ok(result.message?.includes('Not a Carbon type function'));
    });

    it('should reject non-Carbon functions', () => {
      assert.strictEqual(
        validateCarbonTypeFunction('rgba(255, 0, 0, 0.5)').isValid,
        false
      );
      assert.strictEqual(
        validateCarbonTypeFunction('calc(100% - 10px)').isValid,
        false
      );
    });

    it('should reject plain values', () => {
      assert.strictEqual(validateCarbonTypeFunction('16px').isValid, false);
      assert.strictEqual(
        validateCarbonTypeFunction('$font-size-01').isValid,
        false
      );
      assert.strictEqual(validateCarbonTypeFunction('Arial').isValid, false);
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace', () => {
      assert.strictEqual(
        validateCarbonTypeFunction('  type-scale(1)  ').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('font-family( 1 )').isValid,
        true
      );
    });

    it('should handle complex parameters', () => {
      // Complex parameters are accepted - Sass will validate
      assert.strictEqual(
        validateCarbonTypeFunction('type-scale($var)').isValid,
        true
      );
      assert.strictEqual(
        validateCarbonTypeFunction('font-family(map-get($map, key))').isValid,
        true
      );
    });
  });
});
