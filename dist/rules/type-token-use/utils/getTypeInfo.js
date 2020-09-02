"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getTypeInfo;

var _initTypeTokens = require("./initTypeTokens");

function getTypeInfo(options) {
  return {
    // There are no type tokens that are used directly
    // Types are applied via mixins and functions
    tokens: [//   {
      //     source: "Type",
      //     accept: true,
      //     values: typeTokens,
      //   },
    ],
    functions: _initTypeTokens.typeFunctions.map(function (item) {
      var result = {
        source: "Type",
        accept: options[item.accept],
        values: [item.name]
      };
      return result;
    })
  };
}