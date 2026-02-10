/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loadMotionTokens } from '../utils/carbon-tokens.js';
import { createCarbonRule } from '../utils/create-rule.js';
import type { MotionEasingRuleOptions, TokenCollection } from '../types/index.js';

export const ruleName = 'carbon/motion-easing-use';

const defaultOptions: MotionEasingRuleOptions = {
  includeProps: [
    '/timing-function$/',
  ],
  acceptValues: [
    '/inherit|initial|none|unset/',
    '/linear|ease|ease-in|ease-out|ease-in-out/',
    '/step-start|step-end/',
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

export default createCarbonRule({
  ruleName,
  defaultOptions,
  tokenLoader: loadMotionTokens,
  // Extract easing tokens from the motion collection
  extractTokens: (tokens) => {
    const collection = tokens as TokenCollection;
    return collection.easing;
  },
});
