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
    // Custom property form of the radius tokens, for example
    // var(--cds-border-radius-04). Carbon does not emit these, but projects can
    // define them. Component properties such as --cds-button-radius and
    // --cds-popover-border-radius are not accepted: they are set on containers
    // rather than read in a border-radius value.
    '/^var\\(--cds-border-radius-(00|02|04|08|16|24|max)\\)$/',
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
