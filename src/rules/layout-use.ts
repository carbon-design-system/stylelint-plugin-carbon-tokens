/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loadLayoutTokens } from '../utils/carbon-tokens.js';
import { createCarbonRule } from '../utils/create-rule.js';
import type { LayoutRuleOptions, TokenCollection } from '../types/index.js';

export const ruleName = 'carbon/layout-use';

const defaultOptions: LayoutRuleOptions = {
  includeProps: [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'gap',
    'row-gap',
    'column-gap',
    'width',
    'height',
    'min-width',
    'min-height',
    'max-width',
    'max-height',
  ],
  acceptValues: [
    '/inherit|initial|none|unset|auto/',
    '/^0$/',
    '/^100%$/',
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

export default createCarbonRule({
  ruleName,
  defaultOptions,
  tokenLoader: loadLayoutTokens,
  // Extract all layout tokens from the collection
  extractTokens: (tokens) => {
    const collection = tokens as TokenCollection;
    return [
      ...collection.spacing,
      ...collection.layout,
      ...collection.container,
      ...collection.fluidSpacing,
      ...collection.iconSize,
    ];
  },
});
