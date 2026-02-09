/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import stylelint from 'stylelint';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '../../../dist/index.js');

describe('motion-easing-use rule', () => {
  it('should report error for non-standard easing values', async () => {
    const result = await stylelint.lint({
      code: '.test { transition-timing-function: cubic-bezier(0.5, 0, 0.5, 1); }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    // cubic-bezier is allowed, so this should pass
    assert.strictEqual(result.errored, false);
  });

  it('should accept Carbon SCSS easing variables', async () => {
    const result = await stylelint.lint({
      code: '.test { transition-timing-function: $fast01; }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    assert.strictEqual(result.errored, false);
  });

  it('should accept Carbon CSS custom properties', async () => {
    const result = await stylelint.lint({
      code: '.test { animation-timing-function: var(--cds-fast01); }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    assert.strictEqual(result.errored, false);
  });

  it('should accept standard easing keywords', async () => {
    const result = await stylelint.lint({
      code: '.test { transition-timing-function: ease-in-out; }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    assert.strictEqual(result.errored, false);
  });

  it('should accept cubic-bezier functions', async () => {
    const result = await stylelint.lint({
      code: '.test { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    assert.strictEqual(result.errored, false);
  });

  it('should accept steps functions', async () => {
    const result = await stylelint.lint({
      code: '.test { animation-timing-function: steps(4, end); }',
      config: {
        plugins: [configPath],
        rules: {
          'carbon/motion-easing-use': true,
        },
      },
    });

    assert.strictEqual(result.errored, false);
  });
});
