/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { doInit } from "./initMotionTokens";

export default async function getMotionInfo(options) {
  const { motionTokens, motionFunctions } = await doInit(options.target);

  return {
    tokens: [
      {
        source: "Motion",
        accept: true,
        values: motionTokens
      }
    ],
    functions: [
      {
        source: "Motion",
        accept: true,
        values: motionFunctions
      }
    ]
  };
}
