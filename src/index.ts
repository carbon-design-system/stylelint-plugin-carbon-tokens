/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import themeUse from './rules/theme-use.js';
import layoutUse from './rules/layout-use.js';

const plugins = [themeUse, layoutUse];

export default plugins;

// Export individual rules for direct access
export { themeUse, layoutUse };
