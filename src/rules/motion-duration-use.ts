/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loadMotionTokens } from '../utils/carbon-tokens.js';
import { createCarbonRule } from '../utils/create-rule.js';
import type { MotionDurationRuleOptions, TokenCollection } from '../types/index.js';

export const ruleName = 'carbon/motion-duration-use';

const defaultOptions: MotionDurationRuleOptions = {
  includeProps: [
    'transition-duration',
    'animation-duration',
  ],
  acceptValues: [
    '/inherit|initial|none|unset/',
    '/^0s?$/', // 0 or 0s
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

export default createCarbonRule({
  ruleName,
  defaultOptions,
  tokenLoader: loadMotionTokens,
  // Extract duration tokens from the motion collection
  extractTokens: (tokens) => {
    const collection = tokens as TokenCollection;
    return collection.duration;
  },
});
