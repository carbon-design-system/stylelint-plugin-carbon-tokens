"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getTypeInfo;

var _initTypeTokens = require("./initTypeTokens");

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
    functions: [
      {
        source: "Type",
        accept: options.acceptFontWeightFunction,
        values: _initTypeTokens.typeFunctions,
      },
    ],
  };
}
