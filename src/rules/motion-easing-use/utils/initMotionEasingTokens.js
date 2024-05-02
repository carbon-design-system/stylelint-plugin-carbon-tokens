/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loadModules, { loadPackageJson } from "../../../utils/loadModules.js";

const doInit = async ({ carbonPath, carbonModulePostfix }) => {
  const baseTokens = ["ease-in", "ease-out", "standard-easing"];
  const motionFunctions = ["motion"];
  let motionTokens;
  let _version;

  if (carbonPath) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { pkg } = await loadModules(
      carbonPath,
      ["motion"],
      carbonModulePostfix
    );

    _version = pkg.version;
  } else {
    const pkg = loadPackageJson("@carbon/motion");
    _version = pkg.version;
  }

  const isV10 = _version.startsWith("10");

  if (isV10) {
    motionFunctions.push("carbon--motion");
    motionTokens = baseTokens.map((token) => `$carbon--${token}`);
  } else {
    motionFunctions.push("motion");
    motionTokens = baseTokens.map((token) => `$${token}`);
  }

  return { motionTokens, motionFunctions, version: _version };
};

export { doInit };
