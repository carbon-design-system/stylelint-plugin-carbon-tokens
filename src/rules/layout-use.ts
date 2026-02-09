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
    // Standard box model spacing
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

    // Positioning
    'top',
    'right',
    'bottom',
    'left',

    // Logical properties - inset
    'inset',
    'inset-block',
    'inset-block-start',
    'inset-block-end',
    'inset-inline',
    'inset-inline-start',
    'inset-inline-end',

    // Logical properties - margin
    'margin-block',
    'margin-block-start',
    'margin-block-end',
    'margin-inline',
    'margin-inline-start',
    'margin-inline-end',

    // Logical properties - padding
    'padding-block',
    'padding-block-start',
    'padding-block-end',
    'padding-inline',
    'padding-inline-start',
    'padding-inline-end',

    // Gap properties
    'gap',
    'row-gap',
    'column-gap',

    // direct translate property
    'translate',
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
