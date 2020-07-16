"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getMotionInfo;

var _initMotionTokens = require("./initMotionTokens");

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
