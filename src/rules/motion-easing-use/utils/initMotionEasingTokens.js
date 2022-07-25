/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { version as installedVersion } from "@carbon/motion/package.json";

const doInit = async ({ carbonPath }) => {
  const baseTokens = ["ease-in", "ease-out", "standard-easing"];
  const motionFunctions = ["motion"];
  let motionTokens;
  let _version;

  if (carbonPath) {
    // eslint-disable-next-line
    const module = await import(carbonPath);

    // eslint-disable-next-line
    const pkg = await import(`${carbonPath}/package.json`);

    _version = pkg.version;
  } else {
    _version = installedVersion;
  }

  const isV10 = _version.startsWith("10");

  if (isV10) {
    motionFunctions.push("carbon--motion");
    motionTokens = baseTokens.map((token) => `$carbon--${token}`);
  } else {
    motionTokens = baseTokens.map((token) => `$${token}`);
  }

  return { motionTokens, motionFunctions, version: _version };
};

export { doInit };
