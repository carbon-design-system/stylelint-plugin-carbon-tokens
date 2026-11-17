/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loadLayoutTokens, loadRadiusTokens } from '../utils/carbon-tokens.js';
import { createCarbonRule } from '../utils/create-rule.js';
import type { BaseRuleOptions, CarbonToken } from '../types/index.js';

export const ruleName = 'carbon/border-radius-use';

const defaultOptions: BaseRuleOptions = {
  includeProps: [
    // Shorthand
    'border-radius',

    // Physical and logical corner properties,
    // for example border-top-left-radius and border-start-start-radius
    '/^border-.*-radius$/',
  ],
  acceptValues: [
    '/^(inherit|initial|unset|revert|revert-layer)$/', // CSS-wide keywords
    '/^0$/',
    '/^\\/$/', // Separator between horizontal and vertical radii
    '/^\\d*\\.?\\d+%$/', // Percentages, for example 50% for a circle
    '/^var\\(--cds-[a-z0-9-]*radius/', // Component radius custom properties, for example --cds-button-radius
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

export default createCarbonRule({
  ruleName,
  defaultOptions,
  tokenLoader: loadRadiusTokens,
  // Radius tokens come first so suggested fixes prefer $border-radius-*.
  // Carbon also uses $spacing-* for some radii, so those are accepted.
  extractTokens: (tokens) => [
    ...(tokens as CarbonToken[]),
    ...loadLayoutTokens().spacing,
  ],
});
