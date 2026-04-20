/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';

const config = {
  plugins: ['./dist/index.js'],
  rules: {},
};

describe('theme-use rule - gradient validation modes', () => {
  describe('validateGradients: false (light-touch)', () => {
    it('should not validate gradient color stops when disabled', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            /* Gradients are accepted as-is without validating color stops */
            background: linear-gradient(to right, $layer-01, $layer-02);
            background: radial-gradient(circle, $blue-90, rgba(128, 128, 128, 0.5));
            background: linear-gradient(90deg, $layer-01, rgba(255, 255, 255, 0.5));
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: false }],
          },
        },
      });

      // With validateGradients: false, gradients are not validated at all
      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });
  });

  describe('validateGradients: "recommended"', () => {
    it('should accept gradients with Carbon tokens', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, $layer-02);
            background: radial-gradient(circle, $background, $layer-03);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with transparent', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, transparent);
            background: radial-gradient(circle, transparent, $layer-02);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [
              true,
              {
                validateGradients: 'recommended',
                acceptValues: ['/transparent/'],
              },
            ],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with rgba white - old syntax', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, rgba(255, 255, 255, 0.5));
            background: radial-gradient(closest-side, $layer-01 40%, rgba(255, 255, 255, 0) 100%);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with rgba black - old syntax', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to bottom, $layer-01, rgba(0, 0, 0, 0.5));
            background: radial-gradient(circle, rgba(0, 0, 0, 0.3), $layer-02);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with rgb white - new syntax', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, rgb(255 255 255 / 50%));
            background: radial-gradient(closest-side, $layer-01 40%, rgb(255 255 255 / 0%) 100%);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with rgb black - new syntax', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to bottom, $layer-01, rgb(0 0 0 / 50%));
            background: radial-gradient(circle, rgb(0 0 0 / 30%), $layer-02);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should reject gradients with hard-coded color keywords', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, red);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
      assert.ok(result.results[0].warnings[0].text.includes('red'));
    });

    it('should reject gradients with gray rgba', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, rgba(128, 128, 128, 0.5));
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });

    it('should reject gradients with hex colors', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, #ff0000);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'recommended' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });
  });

  describe('validateGradients: "strict"', () => {
    it('should accept gradients with Carbon tokens', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, $layer-02);
            background: radial-gradient(circle, $background, $layer-03);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should accept gradients with transparent', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, transparent);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [
              true,
              {
                validateGradients: 'strict',
                acceptValues: ['/transparent/'],
              },
            ],
          },
        },
      });

      assert.equal(result.errored, false);
      assert.equal(result.results[0].warnings.length, 0);
    });

    it('should reject gradients with rgba white', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, rgba(255, 255, 255, 0.5));
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });

    it('should reject gradients with rgba black', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, rgba(0, 0, 0, 0.5));
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });

    it('should reject gradients with rgb white - new syntax', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: radial-gradient(circle, rgb(255 255 255 / 50%), $layer-02);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });

    it('should reject gradients with hard-coded colors', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(to right, $layer-01, red);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, true);
      assert.equal(result.results[0].warnings.length, 1);
    });
  });

  describe('gradient types', () => {
    it('should validate linear gradients', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: linear-gradient(90deg, $background 0%, $layer-01 100%);
            background: linear-gradient(to bottom, $layer-01, $layer-02);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, false);
    });

    it('should validate radial gradients', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: radial-gradient(circle, $layer-01, $layer-02);
            background: radial-gradient(closest-side, $background 40%, $layer-03 100%);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, false);
    });

    it('should validate conic gradients', async () => {
      const result = await stylelint.lint({
        code: `
          .test {
            background: conic-gradient(from 45deg, $background, $layer-01);
            background: conic-gradient($layer-01, $layer-02, $layer-01);
          }
        `,
        config: {
          ...config,
          rules: {
            'carbon/theme-use': [true, { validateGradients: 'strict' }],
          },
        },
      });

      assert.equal(result.errored, false);
    });
  });
});
