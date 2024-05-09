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
import { getLayoutInfo } from './utils/index.js';
import stylelint from 'stylelint';
const { utils } = stylelint;

export const ruleName = namespace('layout-use');
export const messages = getMessages(ruleName, 'layout');
const meta = {
  fixable: true,
  url: 'https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/tree/main/src/rules/layout-use/README.md',
};

const isValidAcceptValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard layout properties
  includeProps: [
    '/^margin$/<1 4>',
    '/^margin-/',
    '/^padding$/<1 4>',
    '/^padding-/',
    'left',
    'top',
    'bottom',
    'right',
    'transform[/^translate/]',
    // logical properties
    '/^inset$/<1 4>',
    '/^inset-(block|inline)$/<1 2>',
    '/^inset-(block|inline)-/',
    '/^margin-(block|inline)$/<1 2>',
    '/^margin-(block|inline)-/',
    '/^padding-(block|inline)$/<1 2>',
    '/^padding-(block|inline)-/',
    '/^gap$/<1 2>',

    // the following are not really layout or spacing
    // // Widths, heights, borders, shadows and there logical equivalents are ignored.
    // "height",
    // "width",
    // "/^border$/<1 -2>",
    // "/^border-/",
    // "/^box-shadow$/<1 -2>",
  ],
  // Accept transparent, common reset values, 0, proportional values,
  acceptValues: [
    '/inherit|initial|auto|none|unset/',
    '/^0[a-z]*$/',
    '/^-{0,1}[0-9]*(%|vw|vh)$/',
  ],
  acceptUndefinedVariables: false,
  acceptCarbonMiniUnitsFunction: false,
  acceptScopes: ['layout'],
  carbonPath: undefined,
  carbonModulePostfix: undefined,
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
          acceptUndefinedVariables: (val) =>
            val === undefined || typeof val === 'boolean',
          acceptCarbonMiniUnitsFunction: (val) =>
            val === undefined || typeof val === 'boolean',
          carbonPath: (val) => val === undefined || val.indexOf('@carbon') > -1,
          carbonModulePostfix: (val) =>
            val === undefined || typeof val === 'string',
          enforceScopes: (val) => val === undefined || typeof val === 'boolean',
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
      getLayoutInfo,
      context
    );
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default ruleFunction;
