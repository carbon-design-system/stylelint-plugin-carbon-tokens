/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isScssVariable,
  isCssCustomProperty,
  isCarbonCustomProperty,
  extractCssVarName,
  matchesAcceptedValue,
  shouldValidateProperty,
  parseValue,
} from '../validators.js';

describe('validators', () => {
  describe('isScssVariable', () => {
    it('should identify SCSS variables', () => {
      assert.strictEqual(isScssVariable('$spacing-05'), true);
      assert.strictEqual(isScssVariable('$background'), true);
      assert.strictEqual(isScssVariable('16px'), false);
      assert.strictEqual(isScssVariable('var(--cds-spacing-05)'), false);
    });
  });

  describe('isCssCustomProperty', () => {
    it('should identify CSS custom properties', () => {
      assert.strictEqual(isCssCustomProperty('var(--cds-spacing-05)'), true);
      assert.strictEqual(isCssCustomProperty('var(--my-var)'), true);
      assert.strictEqual(isCssCustomProperty('$spacing-05'), false);
      assert.strictEqual(isCssCustomProperty('16px'), false);
    });
  });

  describe('isCarbonCustomProperty', () => {
    it('should identify Carbon CSS custom properties', () => {
      assert.strictEqual(
        isCarbonCustomProperty('var(--cds-spacing-05)', 'cds'),
        true
      );
      assert.strictEqual(
        isCarbonCustomProperty('var(--cds-background)', 'cds'),
        true
      );
      assert.strictEqual(
        isCarbonCustomProperty('var(--my-var)', 'cds'),
        false
      );
      assert.strictEqual(isCarbonCustomProperty('$spacing-05', 'cds'), false);
    });

    it('should support custom prefixes', () => {
      assert.strictEqual(
        isCarbonCustomProperty('var(--custom-spacing-05)', 'custom'),
        true
      );
      assert.strictEqual(
        isCarbonCustomProperty('var(--cds-spacing-05)', 'custom'),
        false
      );
    });
  });

  describe('extractCssVarName', () => {
    it('should extract CSS variable names', () => {
      assert.strictEqual(
        extractCssVarName('var(--cds-spacing-05)'),
        '--cds-spacing-05'
      );
      assert.strictEqual(extractCssVarName('var(--my-var)'), '--my-var');
      assert.strictEqual(extractCssVarName('$spacing-05'), null);
      assert.strictEqual(extractCssVarName('16px'), null);
    });
  });

  describe('matchesAcceptedValue', () => {
    it('should match exact values', () => {
      assert.strictEqual(matchesAcceptedValue('transparent', ['transparent']), true);
      assert.strictEqual(matchesAcceptedValue('inherit', ['inherit', 'initial']), true);
      assert.strictEqual(matchesAcceptedValue('16px', ['transparent']), false);
    });

    it('should match regex patterns', () => {
      assert.strictEqual(matchesAcceptedValue('0', ['/^0$/']), true);
      assert.strictEqual(matchesAcceptedValue('0px', ['/^0[a-z]*$/']), true);
      assert.strictEqual(matchesAcceptedValue('16px', ['/^0[a-z]*$/']), false);
    });

    it('should match multiple patterns', () => {
      const patterns = ['transparent', '/^0[a-z]*$/', 'inherit'];
      assert.strictEqual(matchesAcceptedValue('transparent', patterns), true);
      assert.strictEqual(matchesAcceptedValue('0px', patterns), true);
      assert.strictEqual(matchesAcceptedValue('inherit', patterns), true);
      assert.strictEqual(matchesAcceptedValue('16px', patterns), false);
    });
  });

  describe('shouldValidateProperty', () => {
    it('should match exact property names', () => {
      assert.strictEqual(shouldValidateProperty('color', ['color']), true);
      assert.strictEqual(
        shouldValidateProperty('background-color', ['background-color']),
        true
      );
      assert.strictEqual(shouldValidateProperty('margin', ['color']), false);
    });

    it('should match regex patterns', () => {
      assert.strictEqual(shouldValidateProperty('color', ['/color$/']), true);
      assert.strictEqual(
        shouldValidateProperty('background-color', ['/color$/']),
        true
      );
      assert.strictEqual(shouldValidateProperty('margin', ['/color$/']), false);
    });

    it('should match wildcard', () => {
      assert.strictEqual(shouldValidateProperty('color', ['*']), true);
      assert.strictEqual(shouldValidateProperty('margin', ['*']), true);
      assert.strictEqual(shouldValidateProperty('anything', ['*']), true);
    });
  });

  describe('parseValue', () => {
    it('should parse single values', () => {
      assert.deepStrictEqual(parseValue('16px'), ['16px']);
      assert.deepStrictEqual(parseValue('$spacing-05'), ['$spacing-05']);
      assert.deepStrictEqual(parseValue('transparent'), ['transparent']);
    });

    it('should parse multiple values', () => {
      assert.deepStrictEqual(parseValue('16px 24px'), ['16px', '24px']);
      assert.deepStrictEqual(parseValue('0 auto'), ['0', 'auto']);
    });

    it('should handle extra whitespace', () => {
      assert.deepStrictEqual(parseValue('  16px  24px  '), ['16px', '24px']);
    });
  });
});
