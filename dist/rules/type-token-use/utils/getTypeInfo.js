"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getTypeInfo;

var _initTypeTokens = require("./initTypeTokens");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getTypeInfo(options) {
  return {
    // There are no type tokens that are used directly
    // Types are applied via mixins and functions
    tokens: [
      //   {
      //     source: "Type",
      //     accept: true,
      //     values: typeTokens,
      //   },
    ],
    functions: _initTypeTokens.typeFunctions.map(function (item) {
      var result = {
        source: "Type",
        accept: options[item.accept],
        values: [item.name],
      };
      return result;
    }),
  };
}
