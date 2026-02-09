/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import stylelint from 'stylelint';
import { loadTypeTokens } from '../utils/carbon-tokens.js';
import {
  shouldValidateProperty,
  validateValue,
  parseValue,
} from '../utils/validators.js';
import type { TypeRuleOptions } from '../types/index.js';

const { createPlugin, utils } = stylelint;

export const ruleName = 'carbon/type-use';

export const messages = utils.ruleMessages(ruleName, {
  rejected: (value: string, message: string) => `${message}: "${value}"`,
  expected: (value: string, suggestion: string) =>
    `Expected Carbon token instead of "${value}". Consider using: ${suggestion}`,
});

const meta = {
  url: 'https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/tree/main/src/rules/type-use/README.md',
  fixable: true,
};

const defaultOptions: TypeRuleOptions = {
  includeProps: [
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
  ],
  acceptValues: [
    '/inherit|initial|none|unset/',
    '/^0$/',
    '/normal|bold|bolder|lighter/',
    '/^[1-9]00$/', // font-weight values like 100, 200, etc.
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

const ruleFunction: stylelint.Rule<boolean, TypeRuleOptions> = (
  primaryOption,
  secondaryOptions,
  context
) => {
  return async (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false],
      },
      {
        actual: secondaryOptions,
        possible: {
          includeProps: [(val: unknown) => Array.isArray(val)],
          acceptValues: [(val: unknown) => Array.isArray(val)],
          acceptUndefinedVariables: [(val: unknown) => typeof val === 'boolean'],
          acceptCarbonCustomProp: [(val: unknown) => typeof val === 'boolean'],
          carbonPrefix: [(val: unknown) => typeof val === 'string'],
        },
        optional: true,
      }
    );

    if (!validOptions || !primaryOption) {
      return;
    }

    const options: TypeRuleOptions = {
      ...defaultOptions,
      ...secondaryOptions,
    };

    // Load Carbon type tokens
    const tokens = loadTypeTokens();

    root.walkDecls((decl) => {
      const prop = decl.prop;

      // Check if this property should be validated
      if (!shouldValidateProperty(prop, options.includeProps || [])) {
        return;
      }

      // Parse the value into individual parts
      const values = parseValue(decl.value);

      for (const value of values) {
        const validation = validateValue(value, tokens, {
          acceptUndefinedVariables: options.acceptUndefinedVariables,
          acceptCarbonCustomProp: options.acceptCarbonCustomProp,
          acceptValues: options.acceptValues,
          carbonPrefix: options.carbonPrefix,
        });

        if (!validation.isValid) {
          if (context.fix && validation.suggestedFix) {
            // Apply fix
            decl.value = decl.value.replace(value, validation.suggestedFix);
          } else {
            // Report error
            const message = validation.suggestedFix
              ? messages.expected(value, validation.suggestedFix)
              : messages.rejected(value, validation.message || 'Invalid value');

            utils.report({
              message,
              node: decl,
              result,
              ruleName,
            });
          }
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
