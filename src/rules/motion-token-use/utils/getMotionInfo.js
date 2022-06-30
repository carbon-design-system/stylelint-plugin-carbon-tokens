/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { motionFunctions, motionTokens } from "./initMotionTokens";

export default function getMotionInfo() {
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
