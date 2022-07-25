/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedTokens } from "@carbon/motion";
import { version as installedVersion } from "@carbon/motion/package.json";

const doInit = async ({ carbonPath }) => {
  const motionTokens = [];
  const motionFunctions = ["motion"];

  let tokens;
  let _version;

  if (carbonPath) {
    // eslint-disable-next-line
    const module = await import(carbonPath);
    // eslint-disable-next-line
    const pkg = await import(`${carbonPath}/package.json`);

    _version = pkg.version;
    tokens = module.unstable_tokens;
  } else {
    tokens = installedTokens;
    _version = installedVersion;
  }

  const isV10 = _version.startsWith("10");
  const durationPrefix = isV10 ? "$duration--" : "$duration-";

  for (const key in tokens) {
    if (Object.hasOwn(tokens, key)) {
      const token = formatTokenName(tokens[key]);

      motionTokens.push(`${durationPrefix}${token}`);
    }
  }

  return { motionTokens, motionFunctions, version: _version };
};

export { doInit };
