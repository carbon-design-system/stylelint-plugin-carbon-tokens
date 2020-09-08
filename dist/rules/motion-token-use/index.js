"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = rule;
exports.messages = exports.ruleName = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var _utils2 = require("./utils");

// import valueParser from "postcss-value-parser";
var ruleName = (0, _utils.namespace)("motion-token-use");
exports.ruleName = ruleName;
var messages = (0, _utils.getMessages)(ruleName, "motion");
exports.messages = messages;
var isValidAcceptValues = _utils.isValidOption;
var isValidIncludeProps = _utils.isValidOption;
var defaultOptions = {
  // include standard motion properites
  includeProps: [
    "transition<2>", // only permitted definition order fails otherwise
    "transition-duration",
    "animation<1>", // only permitted definition order fails otherwise
    "animation-duration",
  ],
  //  Accept reset values
  acceptValues: ["/$0s?/", "/inherit|initial|none|unset/"],
  acceptUndefinedVariables: true,
};

function rule(primaryOptions, secondaryOptions) {
  var options = (0, _utils.parseOptions)(secondaryOptions, defaultOptions);
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOptions,
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidIncludeProps],
          acceptValues: [isValidAcceptValues],
          acceptUndefinedVariables: function acceptUndefinedVariables(val) {
            return val === undefined || typeof val === "boolean";
          },
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    (0, _utils.checkRule)(
      root,
      result,
      ruleName,
      options,
      messages,
      _utils2.getMotionInfo
    );
  };
}
