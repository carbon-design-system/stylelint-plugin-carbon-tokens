/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import stylelint from 'stylelint';
import {
  shouldValidateProperty,
  validateValue,
  parseValue,
} from './validators.js';
import type { CarbonToken, TokenCollection, BaseRuleOptions } from '../types/index.js';

const { createPlugin, utils } = stylelint;

export interface RuleConfig<T extends BaseRuleOptions = BaseRuleOptions> {
  /** Rule name (e.g., 'carbon/theme-use') */
  ruleName: string;

  /** Default options for the rule */
  defaultOptions: T;

  /** Function to load tokens for this rule */
  tokenLoader: () => CarbonToken[] | TokenCollection;

  /** Optional function to check if a value should be skipped before validation */
  shouldSkipValue?: (value: string, prop: string) => boolean;

  /** Optional function to extract tokens from TokenCollection */
  extractTokens?: (tokens: CarbonToken[] | TokenCollection) => CarbonToken[];
}

/**
 * Create a Carbon token validation rule with standard behavior
 */
export function createCarbonRule<T extends BaseRuleOptions = BaseRuleOptions>(
  config: RuleConfig<T>
): stylelint.Plugin {
  const { ruleName, defaultOptions, tokenLoader, shouldSkipValue, extractTokens } = config;

  const messages = utils.ruleMessages(ruleName, {
    rejected: (prop: string, value: string, message: string) => `${prop}: ${message}: "${value}"`,
    expected: (prop: string, value: string, suggestion: string) =>
      `${prop}: Expected Carbon token instead of "${value}". Consider using: ${suggestion}`,
  });

  const meta = {
    url: `https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/tree/main/src/rules/${ruleName.replace('carbon/', '')}/README.md`,
    fixable: true,
  };

  const ruleFunction: stylelint.Rule<boolean, T> = (
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
            includeProps: [() => true],
            acceptValues: [() => true],
            acceptUndefinedVariables: [() => true],
            acceptCarbonCustomProp: [() => true],
            carbonPrefix: [() => true],
          },
          optional: true,
        }
      );

      if (!validOptions || !primaryOption) {
        return;
      }

      const options: T = {
        ...defaultOptions,
        ...secondaryOptions,
      } as T;

      // Load tokens
      const loadedTokens = tokenLoader();
      const tokens = extractTokens ? extractTokens(loadedTokens) : (loadedTokens as CarbonToken[]);

      root.walkDecls((decl) => {
        const prop = decl.prop;

        // Check if this property should be validated
        if (!shouldValidateProperty(prop, options.includeProps || [])) {
          return;
        }

        // Parse the value into individual parts
        const values = parseValue(decl.value);

        for (const value of values) {
          // Allow rule-specific skipping logic
          if (shouldSkipValue && shouldSkipValue(value, prop)) {
            continue;
          }

          const validation = validateValue(value, tokens, {
            acceptUndefinedVariables: options.acceptUndefinedVariables,
            acceptCarbonCustomProp: options.acceptCarbonCustomProp,
            acceptValues: options.acceptValues,
            carbonPrefix: options.carbonPrefix,
          });

          if (!validation.isValid) {
            // Report error with fix callback
            const message = validation.suggestedFix
              ? messages.expected(prop, value, validation.suggestedFix)
              : messages.rejected(prop, value, validation.message || 'Invalid value');

            utils.report({
              message,
              node: decl,
              result,
              ruleName,
              fix: validation.suggestedFix && context.fix
                ? () => {
                    const newValue = decl.value.replace(value, validation.suggestedFix!);
                    decl.value = newValue;
                  }
                : undefined,
            });
          }
        }
      });
    };
  };

  ruleFunction.ruleName = ruleName;
  ruleFunction.messages = messages;
  ruleFunction.meta = meta;

  return createPlugin(ruleName, ruleFunction);
}
