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

async function lint(
  code: string,
  options?: Record<string, unknown>,
  fix = false
) {
  return stylelint.lint({
    code,
    codeFilename: 'test.scss',
    fix,
    config: {
      plugins: [configPath],
      rules: {
        'carbon/layout-use': [true, options ?? {}],
      },
    },
  });
}

describe('layout-use deprecated tokens', () => {
  const deprecated: Array<[string, string]> = [
    ['layout-01', 'spacing-05'],
    ['layout-02', 'spacing-06'],
    ['layout-03', 'spacing-07'],
    ['layout-04', 'spacing-09'],
    ['layout-05', 'spacing-10'],
    ['layout-06', 'spacing-12'],
    ['layout-07', 'spacing-13'],
  ];

  for (const [token, replacement] of deprecated) {
    it(`should warn that $${token} is replaced by $${replacement}`, async () => {
      const result = await lint(`.test { margin: $${token}; }`, {
        warnDeprecatedTokens: true,
      });
      const [warning] = result.results[0].warnings;

      assert.strictEqual(warning.severity, 'warning');
      assert.ok(warning.text.includes(`$${replacement}`), warning.text);
      // Warnings do not fail the lint run
      assert.strictEqual(result.errored, false);
    });
  }

  it('should not warn by default', async () => {
    const result = await lint('.test { margin: $layout-01; }');
    assert.strictEqual(result.results[0].warnings.length, 0);
  });

  it('should not warn for spacing tokens', async () => {
    const result = await lint('.test { margin: $spacing-05; }', {
      warnDeprecatedTokens: true,
    });
    assert.strictEqual(result.results[0].warnings.length, 0);
  });

  it('should not warn for lookalike names', async () => {
    const result = await lint(
      '$my-layout-01: $spacing-05;\n.test { margin: $my-layout-01; }',
      { warnDeprecatedTokens: true }
    );
    assert.strictEqual(result.results[0].warnings.length, 0);
  });

  it('should warn for CSS custom properties', async () => {
    const result = await lint('.test { margin: var(--cds-layout-02); }', {
      warnDeprecatedTokens: true,
      acceptCarbonCustomProp: true,
    });
    const [warning] = result.results[0].warnings;

    assert.ok(warning.text.includes('--cds-spacing-06'), warning.text);
  });

  it('should warn inside calc() and variable declarations', async () => {
    const result = await lint(
      '$gap: $layout-03;\n.test { width: calc(100% - #{$layout-01}); }',
      { warnDeprecatedTokens: true }
    );

    assert.strictEqual(result.results[0].warnings.length, 2);
  });

  it('should warn for every deprecated token in a value', async () => {
    const result = await lint('.test { margin: $layout-01 $layout-02; }', {
      warnDeprecatedTokens: true,
    });

    assert.strictEqual(result.results[0].warnings.length, 2);
  });

  it('should respect a custom carbon prefix', async () => {
    const result = await lint('.test { margin: var(--my-layout-01); }', {
      warnDeprecatedTokens: true,
      acceptCarbonCustomProp: true,
      carbonPrefix: 'my',
    });

    assert.ok(
      result.results[0].warnings.some((warning) =>
        warning.text.includes('--my-spacing-05')
      )
    );
  });

  it('should auto-fix to the matching spacing tokens', async () => {
    const result = await lint(
      '.test { margin: $layout-01 $layout-04; padding: calc(100% - #{$layout-02}); }',
      { warnDeprecatedTokens: true },
      true
    );

    assert.strictEqual(
      result.code,
      '.test { margin: $spacing-05 $spacing-09; padding: calc(100% - #{$spacing-06}); }'
    );
  });
});
