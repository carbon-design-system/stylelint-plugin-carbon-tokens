/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import stylelint from 'stylelint';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configDir = join(__dirname, '../../config');
const pluginPath = join(__dirname, '../../dist/index.js');

interface Preset {
  plugins?: string[];
  rules: Record<string, unknown>;
}

async function loadPreset(name: string): Promise<Preset> {
  const module = await import(
    pathToFileURL(join(configDir, `${name}.js`)).href
  );
  return module.default as Preset;
}

describe('presets', () => {
  for (const name of ['recommended', 'strict', 'light-touch']) {
    describe(`${name}-v12`, () => {
      it('should enable every rule of the base preset', async () => {
        const base = await loadPreset(name);
        const v12 = await loadPreset(`${name}-v12`);

        for (const [rule, config] of Object.entries(base.rules)) {
          assert.deepStrictEqual(v12.rules[rule], config, rule);
        }
      });

      it('should enable carbon/border-radius-use', async () => {
        const base = await loadPreset(name);
        const v12 = await loadPreset(`${name}-v12`);

        assert.ok(v12.rules['carbon/border-radius-use']);
        assert.strictEqual(base.rules['carbon/border-radius-use'], undefined);
      });

      it('should report hard-coded radii', async () => {
        const v12 = await loadPreset(`${name}-v12`);
        const result = await stylelint.lint({
          code: '.test { border-radius: 4px; }',
          codeFilename: 'test.scss',
          config: { plugins: [pluginPath], rules: v12.rules },
        });

        assert.ok(
          result.results[0].warnings.some(
            (warning) => warning.rule === 'carbon/border-radius-use'
          )
        );
      });
    });
  }
});
