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
import { readdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');
const configPath = join(__dirname, '../../dist/index.js');

// Rule names mapping
const ruleNames = {
  'theme-use': 'carbon/theme-use',
  'layout-use': 'carbon/layout-use',
  'type-use': 'carbon/type-use',
  'motion-duration-use': 'carbon/motion-duration-use',
  'motion-easing-use': 'carbon/motion-easing-use',
};

/**
 * Get all fixture files in a directory
 */
function getFixtureFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((file) => file.endsWith('.css') || file.endsWith('.scss'))
      .map((file) => join(dir, file));
  } catch {
    return [];
  }
}

/**
 * Run fixture tests for a rule
 */
function testRuleFixtures(ruleName: string, ruleKey: keyof typeof ruleNames) {
  const ruleDir = join(fixturesDir, ruleName);
  const validDir = join(ruleDir, 'valid');
  const invalidDir = join(ruleDir, 'invalid');
  const skipDir = join(ruleDir, 'skip');

  describe(`${ruleName} fixtures`, () => {
    // Test valid fixtures
    const validFiles = getFixtureFiles(validDir);
    if (validFiles.length > 0) {
      describe('valid fixtures (should pass)', () => {
        for (const file of validFiles) {
          it(`${file.split('/').pop()}`, async () => {
            const result = await stylelint.lint({
              files: file,
              config: {
                plugins: [configPath],
                rules: {
                  [ruleNames[ruleKey]]: true,
                },
              },
            });

            assert.strictEqual(
              result.errored,
              false,
              `Expected no errors but got: ${JSON.stringify(result.results[0]?.warnings, null, 2)}`
            );
          });
        }
      });
    }

    // Test invalid fixtures
    const invalidFiles = getFixtureFiles(invalidDir);
    if (invalidFiles.length > 0) {
      describe('invalid fixtures (should fail)', () => {
        for (const file of invalidFiles) {
          it(`${file.split('/').pop()}`, async () => {
            const result = await stylelint.lint({
              files: file,
              config: {
                plugins: [configPath],
                rules: {
                  [ruleNames[ruleKey]]: true,
                },
              },
            });

            assert.strictEqual(
              result.errored,
              true,
              'Expected errors but none were reported'
            );
            assert.ok(
              result.results[0]?.warnings.length > 0,
              'Expected warnings but none were found'
            );
          });
        }
      });
    }

    // Document skipped fixtures
    const skipFiles = getFixtureFiles(skipDir);
    if (skipFiles.length > 0) {
      describe('skipped fixtures (not yet supported)', () => {
        for (const file of skipFiles) {
          it.skip(`${file.split('/').pop()} - feature not implemented`, () => {
            // This test is skipped - feature not yet supported in V5
          });
        }
      });
    }
  });
}

// Run tests for all rules
describe('Fixture-based tests', () => {
  testRuleFixtures('theme-use', 'theme-use');
  testRuleFixtures('layout-use', 'layout-use');
  testRuleFixtures('type-use', 'type-use');
  testRuleFixtures('motion-duration-use', 'motion-duration-use');
  testRuleFixtures('motion-easing-use', 'motion-easing-use');
});
