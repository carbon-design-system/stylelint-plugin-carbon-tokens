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

async function lint(code: string, options?: Record<string, unknown>) {
  return stylelint.lint({
    code,
    codeFilename: 'test.scss',
    config: {
      plugins: [configPath],
      rules: {
        'carbon/border-radius-use': options ? [true, options] : true,
      },
    },
  });
}

describe('border-radius-use rule', () => {
  describe('valid values', () => {
    const valid = [
      '.test { border-radius: $border-radius-04; }',
      '.test { border-radius: $border-radius-max; }',
      '.test { border-radius: $spacing-03; }',
      '.test { border-radius: 0; }',
      '.test { border-radius: 50%; }',
      '.test { border-radius: inherit; }',
      '.test { border-radius: $border-radius-08 0 0 $border-radius-08; }',
      '.test { border-radius: $border-radius-08 / $border-radius-16; }',
      '.test { border-top-left-radius: $border-radius-02; }',
      '.test { border-start-end-radius: $border-radius-02; }',
      '.test { border-radius: var(--cds-border-radius-04); }',
      '.test { border-radius: var(--cds-border-radius-max); }',
      '.test { border-radius: calc($border-radius-08 - 1px); }',
      '.test { border-radius: calc(#{$border-radius-08} - $spacing-01); }',
    ];

    for (const code of valid) {
      it(`should accept: ${code}`, async () => {
        const result = await lint(code);
        assert.strictEqual(
          result.errored,
          false,
          JSON.stringify(result.results[0].warnings)
        );
      });
    }
  });

  describe('invalid values', () => {
    const invalid = [
      '.test { border-radius: 4px; }',
      '.test { border-radius: 0.5rem; }',
      '.test { border-radius: 4px 0 0 4px; }',
      '.test { border-radius: 4px / 8px; }',
      '.test { border-top-left-radius: 8px; }',
      '.test { border-end-start-radius: 8px; }',
      '.test { border-radius: $my-radius; }',
      '.test { border-radius: var(--my-radius); }',
      '.test { border-radius: var(--cds-border-radius-05); }',
      '.test { border-radius: var(--cds-button-radius); }',
      '.test { border-radius: var(--cds-button-radius-ss); }',
      '.test { border-radius: var(--cds-popover-border-radius); }',
      '.test { border-radius: calc(8px - 1px); }',
      '.test { border-radius: calc($my-radius - 1px); }',
      '.test { border-radius: calc($border-radius-08 * 2); }',
    ];

    for (const code of invalid) {
      it(`should reject: ${code}`, async () => {
        const result = await lint(code);
        assert.strictEqual(result.errored, true);
      });
    }
  });

  it('should suggest the matching radius token', async () => {
    const result = await lint('.test { border-radius: 4px; }');
    const text = result.results[0].warnings[0].text;
    assert.ok(text.includes('$border-radius-04'), text);
  });

  it('should suggest the max radius token', async () => {
    const result = await lint('.test { border-radius: 999999px; }');
    const text = result.results[0].warnings[0].text;
    assert.ok(text.includes('$border-radius-max'), text);
  });

  it('should auto-fix a hard-coded radius', async () => {
    const result = await stylelint.lint({
      code: '.test { border-radius: 8px; }',
      codeFilename: 'test.scss',
      fix: true,
      config: {
        plugins: [configPath],
        rules: { 'carbon/border-radius-use': true },
      },
    });
    assert.strictEqual(
      result.code,
      '.test { border-radius: $border-radius-08; }'
    );
  });

  it('should only check radius properties', async () => {
    const result = await lint('.test { margin: 4px; border-width: 4px; }');
    assert.strictEqual(result.errored, false);
  });

  it('should resolve file-level variables', async () => {
    const result = await lint(
      '$inner: $border-radius-04;\n.test { border-radius: $inner; }'
    );
    assert.strictEqual(result.errored, false);
  });

  it('should require acceptCarbonCustomProp for spacing custom properties', async () => {
    const rejected = await lint(
      '.test { border-radius: var(--cds-spacing-03); }'
    );
    assert.strictEqual(rejected.errored, true);

    const accepted = await lint(
      '.test { border-radius: var(--cds-spacing-03); }',
      { acceptCarbonCustomProp: true }
    );
    assert.strictEqual(accepted.errored, false);
  });

  it('should be disabled when set to null', async () => {
    const result = await stylelint.lint({
      code: '.test { border-radius: 4px; }',
      codeFilename: 'test.scss',
      config: {
        plugins: [configPath],
        rules: { 'carbon/border-radius-use': null },
      },
    });
    assert.strictEqual(result.errored, false);
  });
});
