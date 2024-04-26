/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import themeUse from "./theme-use/index.js";
import typeUse from "./type-use/index.js";
import motionEasingUse from "./motion-easing-use/index.js";
import motionDurationUse from "./motion-duration-use/index.js";
import layoutUse from "./layout-use/index.js";

export default {
  ["layout-use"]: layoutUse,
  ["motion-duration-use"]: motionDurationUse,
  ["motion-easing-use"]: motionEasingUse,
  ["theme-use"]: themeUse,
  ["type-use"]: typeUse
};
