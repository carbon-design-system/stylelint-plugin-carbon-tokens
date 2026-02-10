/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { loadTypeTokens } from '../utils/carbon-tokens.js';
import { createCarbonRule } from '../utils/create-rule.js';
import type { TypeRuleOptions } from '../types/index.js';

export const ruleName = 'carbon/type-use';

const defaultOptions: TypeRuleOptions = {
  includeProps: [
    '/^font-/',
    'line-height',
    'letter-spacing',
  ],
  acceptValues: [
    '/inherit|initial|none|unset/',
    '/^0$/',
    '/normal|bold|bolder|lighter/',
  ],
  acceptUndefinedVariables: false,
  acceptCarbonCustomProp: false,
  carbonPrefix: 'cds',
};

export default createCarbonRule({
  ruleName,
  defaultOptions,
  tokenLoader: loadTypeTokens,
});
