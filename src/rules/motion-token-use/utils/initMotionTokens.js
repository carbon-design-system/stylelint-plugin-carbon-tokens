/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedTokens } from "@carbon/motion";
import { version } from "@carbon/motion/package.json";

const doInit = async (testOnlyTarget) => {
  const motionTokens = [];
  const motionFunctions = ["motion"];

  const isV10 = testOnlyTarget === "v10" || version.startsWith("10");
  const durationPrefix = "$duration--";
  let tokens;

  if (isV10 && process.env.NODE_ENV === "test") {
    motionFunctions.push("carbon--motion");

    // eslint-disable-next-line
    const module = await import("@carbon/motion-10");

    tokens = module.unstable_tokens;
  } else {
    tokens = installedTokens;
  }

  for (const key in tokens) {
    if (Object.hasOwn(tokens, key)) {
      const token = formatTokenName(tokens[key]);

      motionTokens.push(`${durationPrefix}${token}`);
    }
  }

  return { motionTokens, motionFunctions };
};

export { doInit };
