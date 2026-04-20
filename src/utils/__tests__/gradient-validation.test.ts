/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isDirectionOrAngle,
  parseGradientColorStop,
  isWhiteOrBlackRgba,
  validateGradientFunction,
} from '../validators.js';
import type { CarbonToken } from '../../types/index.js';

// Mock tokens for testing
const mockTokens: CarbonToken[] = [
  { name: '$layer-01', value: '#f4f4f4', type: 'scss' },
  { name: '$layer-02', value: '#ffffff', type: 'scss' },
  { name: '$blue-90', value: '#001d6c', type: 'scss' },
  { name: '$purple-70', value: '#8a3ffc', type: 'scss' },
  { name: '--cds-layer-01', value: '#f4f4f4', type: 'css-custom-prop' },
];

describe('Gradient validation', () => {
  describe('isDirectionOrAngle', () => {
    it('should identify angle values', () => {
      assert.equal(isDirectionOrAngle('90deg'), true);
      assert.equal(isDirectionOrAngle('45deg'), true);
      assert.equal(isDirectionOrAngle('1.5rad'), true);
      assert.equal(isDirectionOrAngle('0.25turn'), true);
      assert.equal(isDirectionOrAngle('100grad'), true);
    });

    it('should identify direction keywords', () => {
      assert.equal(isDirectionOrAngle('to right'), true);
      assert.equal(isDirectionOrAngle('to bottom'), true);
      assert.equal(isDirectionOrAngle('to top left'), true);
      assert.equal(isDirectionOrAngle('to bottom right'), true);
    });

    it('should identify radial gradient positions', () => {
      assert.equal(isDirectionOrAngle('at center'), true);
      assert.equal(isDirectionOrAngle('at top left'), true);
      assert.equal(isDirectionOrAngle('at 50% 50%'), true);
    });

    it('should identify radial gradient sizes', () => {
      assert.equal(isDirectionOrAngle('closest-side'), true);
      assert.equal(isDirectionOrAngle('farthest-corner'), true);
      assert.equal(isDirectionOrAngle('closest-corner'), true);
      assert.equal(isDirectionOrAngle('farthest-side'), true);
    });

    it('should identify conic gradient angles', () => {
      assert.equal(isDirectionOrAngle('from 45deg'), true);
      assert.equal(isDirectionOrAngle('from 0deg'), true);
    });

    it('should reject color values', () => {
      assert.equal(isDirectionOrAngle('$layer-01'), false);
      assert.equal(isDirectionOrAngle('red'), false);
      assert.equal(isDirectionOrAngle('#ffffff'), false);
      assert.equal(isDirectionOrAngle('rgba(255, 255, 255, 0.5)'), false);
    });
  });

  describe('parseGradientColorStop', () => {
    it('should parse simple color stops', () => {
      const result = parseGradientColorStop('$blue-90 0%');
      assert.equal(result.color, '$blue-90');
      assert.deepEqual(result.positions, ['0%']);
    });

    it('should parse color stops with multiple positions', () => {
      const result = parseGradientColorStop('red 10% 20%');
      assert.equal(result.color, 'red');
      assert.deepEqual(result.positions, ['10%', '20%']);
    });

    it('should parse color stops without positions', () => {
      const result = parseGradientColorStop('$layer-01');
      assert.equal(result.color, '$layer-01');
      assert.deepEqual(result.positions, []);
    });

    it('should parse rgba() function colors', () => {
      const result = parseGradientColorStop('rgba(255, 255, 255, 0.5)');
      assert.equal(result.color, 'rgba(255, 255, 255, 0.5)');
      assert.deepEqual(result.positions, []);
    });

    it('should parse rgba() with position', () => {
      const result = parseGradientColorStop('rgba($layer-01, 0.5) 50%');
      assert.equal(result.color, 'rgba($layer-01, 0.5)');
      assert.deepEqual(result.positions, ['50%']);
    });

    it('should parse rgb() new syntax', () => {
      const result = parseGradientColorStop('rgb(0 0 0 / 50%) 100%');
      assert.equal(result.color, 'rgb(0 0 0 / 50%)');
      assert.deepEqual(result.positions, ['100%']);
    });

    it('should parse var() function colors', () => {
      const result = parseGradientColorStop('var(--cds-layer-01) 25%');
      assert.equal(result.color, 'var(--cds-layer-01)');
      assert.deepEqual(result.positions, ['25%']);
    });
  });

  describe('isWhiteOrBlackRgba', () => {
    it('should identify white rgba - old syntax', () => {
      assert.equal(isWhiteOrBlackRgba('rgba(255, 255, 255, 0.5)'), true);
      assert.equal(isWhiteOrBlackRgba('rgba(255, 255, 255, 1)'), true);
    });

    it('should identify black rgba - old syntax', () => {
      assert.equal(isWhiteOrBlackRgba('rgba(0, 0, 0, 0.5)'), true);
      assert.equal(isWhiteOrBlackRgba('rgba(0, 0, 0, 0)'), true);
    });

    it('should identify white rgb - new syntax', () => {
      assert.equal(isWhiteOrBlackRgba('rgb(255 255 255 / 50%)'), true);
      assert.equal(isWhiteOrBlackRgba('rgb(255 255 255 / 0%)'), true);
    });

    it('should identify black rgb - new syntax', () => {
      assert.equal(isWhiteOrBlackRgba('rgb(0 0 0 / 50%)'), true);
      assert.equal(isWhiteOrBlackRgba('rgb(0 0 0 / 100%)'), true);
    });

    it('should identify white/black keywords', () => {
      assert.equal(isWhiteOrBlackRgba('rgba(white, 0.5)'), true);
      assert.equal(isWhiteOrBlackRgba('rgba(black, 0.5)'), true);
    });

    it('should reject other colors', () => {
      assert.equal(isWhiteOrBlackRgba('rgba(128, 128, 128, 0.5)'), false);
      assert.equal(isWhiteOrBlackRgba('rgba(255, 0, 0, 0.5)'), false);
      assert.equal(isWhiteOrBlackRgba('rgb(100 100 100 / 50%)'), false);
    });

    it('should reject non-rgba functions', () => {
      assert.equal(isWhiteOrBlackRgba('$layer-01'), false);
      assert.equal(isWhiteOrBlackRgba('#ffffff'), false);
      assert.equal(isWhiteOrBlackRgba('white'), false);
    });
  });

  describe('validateGradientFunction', () => {
    describe('validateGradients: undefined (light-touch)', () => {
      it('should accept all gradients', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, red, blue)',
          mockTokens,
          {} // validateGradients is undefined
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with hard-coded colors', () => {
        const result = validateGradientFunction(
          'linear-gradient(90deg, #ff0000, #0000ff)',
          mockTokens,
          {} // validateGradients is undefined
        );
        assert.equal(result.isValid, true);
      });
    });

    describe('validateGradients: "strict"', () => {
      it('should accept gradients with Carbon tokens', () => {
        const result = validateGradientFunction(
          'linear-gradient(90deg, $blue-90 0%, $purple-70 100%)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with transparent', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, transparent)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should reject gradients with hard-coded colors', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, black)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, false);
        assert.ok(result.message?.includes('black'));
      });

      it('should reject gradients with rgba white/black', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, rgba(255, 255, 255, 0.5))',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, false);
      });
    });

    describe('validateGradients: "recommended"', () => {
      it('should accept gradients with Carbon tokens', () => {
        const result = validateGradientFunction(
          'linear-gradient(90deg, $blue-90 0%, $purple-70 100%)',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with transparent', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, transparent)',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with rgba white', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, rgba(255, 255, 255, 0.5))',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with rgba black', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, rgba(0, 0, 0, 0.5))',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with rgb white - new syntax', () => {
        const result = validateGradientFunction(
          'radial-gradient(closest-side, $layer-01 40%, rgb(255 255 255 / 0%) 100%)',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should accept gradients with rgb black - new syntax', () => {
        const result = validateGradientFunction(
          'radial-gradient(closest-side, $layer-01 40%, rgb(0 0 0 / 50%) 100%)',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should reject gradients with other hard-coded colors', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, red)',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, false);
        assert.ok(result.message?.includes('red'));
      });

      it('should reject gradients with gray rgba', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, rgba(128, 128, 128, 0.5))',
          mockTokens,
          { validateGradients: 'recommended', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, false);
      });
    });

    describe('gradient types', () => {
      it('should validate linear gradients', () => {
        const result = validateGradientFunction(
          'linear-gradient(to bottom, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should validate radial gradients', () => {
        const result = validateGradientFunction(
          'radial-gradient(circle, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should validate conic gradients', () => {
        const result = validateGradientFunction(
          'conic-gradient(from 45deg, $blue-90, $purple-70)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });
    });

    describe('direction/angle handling', () => {
      it('should skip direction parameter in linear gradients', () => {
        const result = validateGradientFunction(
          'linear-gradient(to right, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should skip angle parameter in linear gradients', () => {
        const result = validateGradientFunction(
          'linear-gradient(90deg, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should skip size parameter in radial gradients', () => {
        const result = validateGradientFunction(
          'radial-gradient(closest-side, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });

      it('should skip from angle in conic gradients', () => {
        const result = validateGradientFunction(
          'conic-gradient(from 45deg, $layer-01, $layer-02)',
          mockTokens,
          { validateGradients: 'strict', acceptValues: ['/transparent/'] }
        );
        assert.equal(result.isValid, true);
      });
    });
  });
});
