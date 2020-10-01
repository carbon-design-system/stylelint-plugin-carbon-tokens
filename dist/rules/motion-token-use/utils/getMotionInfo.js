"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getMotionInfo;

var _initMotionTokens = require("./initMotionTokens");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getMotionInfo() {
  return {
    tokens: [
      {
        source: "Motion",
        accept: true,
        values: _initMotionTokens.motionTokens,
      },
    ],
    functions: [
      //   {
      //     source: "Motion",
      //     accept: true,
      //     values: motionFunctions,
      //   },
    ],
  };
}
