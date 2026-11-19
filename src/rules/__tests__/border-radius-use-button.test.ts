/**
 * Copyright IBM Corp. 2026
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

async function lint(code: string, options: Record<string, unknown> = {}) {
  return stylelint.lint({
    code,
    codeFilename: 'test.scss',
    customSyntax: 'postcss-scss',

    config: {
      plugins: [configPath],
      rules: {
        'carbon/border-radius-use': [
          true,
          { flagButtonRadiusOverride: true, ...options },
        ],
      },
    },
  });
}

describe('border-radius-use button radius override', () => {
  const flagged = [
    ['.cds--btn { border-radius: 0; }', '--cds-button-radius'],
    ['.cds--btn { border-radius: $border-radius-04; }', '--cds-button-radius'],
    [
      '.cds--btn--primary { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.cds--btn.cds--btn--sm { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.cds--btn:hover { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.toolbar .cds--btn { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.toolbar > .cds--btn { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.#{$prefix}--btn { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.other, .cds--btn { border-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
    [
      '.cds--btn { border-start-start-radius: $border-radius-04; }',
      '--cds-button-radius-ss',
    ],
    [
      '.cds--btn { border-start-end-radius: $border-radius-04; }',
      '--cds-button-radius-se',
    ],
    [
      '.cds--btn { border-end-start-radius: $border-radius-04; }',
      '--cds-button-radius-es',
    ],
    [
      '.cds--btn { border-end-end-radius: $border-radius-04; }',
      '--cds-button-radius-ee',
    ],
    [
      '.cds--btn { border-top-left-radius: $border-radius-04; }',
      '--cds-button-radius',
    ],
  ];

  for (const [code, suggestion] of flagged) {
    it(`should flag: ${code}`, async () => {
      const result = await lint(code);
      const warnings = result.results[0].warnings;

      assert.strictEqual(warnings.length, 1, JSON.stringify(warnings));
      assert.ok(
        warnings[0].text.includes(`Set ${suggestion} `),
        warnings[0].text
      );
    });
  }

  const notFlagged = [
    '.cds--btn-set { border-radius: $border-radius-04; }',
    '.cds--btn__icon { border-radius: $border-radius-04; }',
    '.cds--btn .icon { border-radius: $border-radius-04; }',
    '.card { border-radius: $border-radius-04; }',
    '.cds--btn { border-radius: var(--cds-button-radius); }',
    '.cds--btn { margin: 4px; }',
  ];

  for (const code of notFlagged) {
    it(`should not flag: ${code}`, async () => {
      const result = await lint(code);
      assert.strictEqual(result.errored, false);
    });
  }

  it('should report a single problem for a hard-coded radius on a button', async () => {
    const result = await lint('.cds--btn { border-radius: 4px; }');
    assert.strictEqual(result.results[0].warnings.length, 1);
  });

  it('should not flag by default', async () => {
    const result = await lint(
      '.cds--btn { border-radius: $border-radius-04; }',
      {
        flagButtonRadiusOverride: false,
      }
    );
    assert.strictEqual(result.errored, false);
  });

  it('should respect a custom carbon prefix', async () => {
    const result = await lint(
      '.my--btn { border-radius: $border-radius-04; }',
      {
        carbonPrefix: 'my',
      }
    );

    assert.ok(
      result.results[0].warnings[0].text.includes('--my-button-radius')
    );
  });
});
