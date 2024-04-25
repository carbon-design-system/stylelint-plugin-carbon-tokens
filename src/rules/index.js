/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import themeTokenUse from "./theme-token-use/index.js";
import typeTokenUse from "./type-token-use/index.js";
import motionEasingUse from "./motion-easing-use/index.js";
import motionDurationUse from "./motion-duration-use/index.js";
import layoutTokenUse from "./layout-token-use/index.js";

export default {
  ["layout-token-use"]: layoutTokenUse,
  ["motion-duration-use"]: motionDurationUse,
  ["motion-easing-use"]: motionEasingUse,
  ["theme-token-use"]: themeTokenUse,
  ["type-token-use"]: typeTokenUse
};
