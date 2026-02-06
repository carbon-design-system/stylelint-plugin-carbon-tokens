/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  checkRule,
  getMessages,
  isValidOption,
  namespace,
  parseOptions,
} from '../../utils/index.js';
import { getThemeInfo } from './utils/index.js';
import stylelint from 'stylelint';
const { utils } = stylelint;

export const ruleName = namespace('theme-use');
export const messages = getMessages(ruleName, 'theme');
const meta = {
  fixable: true,
  url: 'https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/tree/main/src/rules/theme-use/README.md',
};

const isValidAcceptValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard color properties
  includeProps: [
    '/color$/',
    '/shadow$/<-1>',
    'border<-1>',
    'outline<-1>',
    'fill',
    'stroke',
  ],
  // Accept transparent, common reset values and 0 on its own
  acceptValues: [
    '/inherit|initial|none|unset/',
    '/^0$/',
    '/currentColor|transparent/',
  ],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokensCarbonV10Only: false,
  acceptUndefinedVariables: false,
  acceptScopes: ['theme', 'vars'],
  enforceScopes: false, // TODO: default in v3
  // preferContextFixes: false,
  carbonPath: undefined,
  carbonModulePostfix: undefined,
  experimentalFixTheme: undefined,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

const ruleFunction = (primaryOptions, secondaryOptions, context) => {
  const options = parseOptions(secondaryOptions, defaultOptions);

  return async (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOptions,
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidIncludeProps],
          acceptValues: [isValidAcceptValues],
          acceptScopes: [isValidAcceptValues],
          acceptCarbonColorTokens: (val) =>
            val === undefined || typeof val === 'boolean',
          acceptIBMColorTokensCarbonV10Only: (val) =>
            val === undefined || typeof val === 'boolean',
          acceptUndefinedVariables: (val) =>
            val === undefined || typeof val === 'boolean',
          carbonPath: (val) => val === undefined || val.indexOf('@carbon') > -1,
          carbonModulePostfix: (val) =>
            val === undefined || typeof val === 'string',
          enforceScopes: (val) => val === undefined || typeof val === 'boolean',
          // preferContextFixes: (val) =>
          //   val === undefined || typeof val === "boolean"
          experimentalFixTheme: (val) =>
            val === undefined || ['white', 'g10', 'g90', 'g100'].includes(val),
          acceptCarbonCustomProp: (val) =>
            val === undefined || typeof val === 'boolean',
          carbonPrefix: (val) => val === undefined || typeof val === 'string',
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    await checkRule(
      root,
      result,
      ruleName,
      options,
      messages,
      getThemeInfo,
      context
    );
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default ruleFunction;
