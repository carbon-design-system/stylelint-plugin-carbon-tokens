/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as tokens } from "@carbon/motion";

const durationPrefix = "$duration--";

const motionTokens = [];

for (const key in tokens) {
  if (Object.hasOwn(tokens, key)) {
    const token = formatTokenName(tokens[key]);

    motionTokens.push(`${durationPrefix}${token}`);
  }
}

// permitted carbon motion functions
const motionFunctions = ["motion", "carbon--motion"];

export { motionTokens, motionFunctions };
