/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import stylelint from 'stylelint';
import { loadLayoutTokens } from '../utils/carbon-tokens.js';
import {
  shouldValidateProperty,
  validateValue,
  parseValue,
} from '../utils/validators.js';
import type { LayoutRuleOptions, CarbonToken } from '../types/index.js';

const { createPlugin, utils } = stylelint;

export const ruleName = 'carbon/layout-use';

export const messages = utils.ruleMessages(ruleName, {
  rejected: (value: string, message: string) => `${message}: "${value}"`,
  expected: (value: string, suggestion: string) =>
    `Expected Carbon token instead of "${value}". Consider using: ${suggestion}`,
});

const meta = {
  url: 'https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/tree/main/src/rules/layout-use/README.md',
  fixable: true,
};

const defaultOptions: LayoutRuleOptions = {
  includeProps: [
    '/^margin$/',
    '/^margin-/',
    '/^padding$/',
    '/^padding-/',
    'top',
    'right',
    'bottom',
    'left',
    'gap',
    'row-gap',
    'column-gap',
    'transform',
  ],
  acceptValues: ['/inherit|initial/', '/^0[a-z]*$/', '/^[0-9]*(%|vw|vh)$/'],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

const ruleFunction: stylelint.Rule<boolean, LayoutRuleOptions> = (
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

    const options: LayoutRuleOptions = {
      ...defaultOptions,
      ...secondaryOptions,
    };

    // Load Carbon layout tokens (spacing primarily)
    const tokenCollection = loadLayoutTokens();
    const tokens: CarbonToken[] = [
      ...tokenCollection.spacing,
      ...tokenCollection.layout,
    ];

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
