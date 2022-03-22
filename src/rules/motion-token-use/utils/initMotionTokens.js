/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { unstable_tokens as tokens } from "@carbon/motion";
import { formatTokenName } from "@carbon/themes";

const durationPrefix = "$duration--";

const motionTokens = [];

for (const key in tokens) {
  const token = formatTokenName(tokens[key]);

  motionTokens.push(`${durationPrefix}${token}`);
}

// permitted carbon motion functions
const motionFunctions = ["motion", "carbon--motion"];

export { motionTokens, motionFunctions };
