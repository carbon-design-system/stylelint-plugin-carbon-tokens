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

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(property, value) {
    return 'Expected carbon motion token or function for "'
      .concat(property, '" found "')
      .concat(value, '".');
  },
  rejectedUndefinedRange: function rejectedUndefinedRange(
    property,
    value,
    range
  ) {
    return 'Expected carbon motion token or function for "'
      .concat(property, '" found "')
      .concat(value, '" in position(s) "')
      .concat(range, '".');
  },
  rejectedVariable: function rejectedVariable(property, variable, value) {
    return 'Expected carbon motion token or function to be set for variable "'
      .concat(variable, '" used by "')
      .concat(property, '" found "')
      .concat(value, '".');
  },
});

exports.messages = messages;
var isValidIgnoreValues = _utils.isValidOption;
var isValidIncludeProps = _utils.isValidOption;
var defaultOptions = {
  // include standard color properites
  // "/^border$/<1 -2>", // Borders and shadows are often 1px
  // "/^border-/",
  // "/^box-shadow$/<1 -2>",
  includeProps: [
    "transition<2>", // preferred definition order fails otherwise
    "transition-duration",
    "animation<2>", // preferred definition order fails otherwise
    "animation-duration",
  ],
  // ignore transparent, common reset values, 0, proportioanl values,
  ignoreValues: ["/inherit|initial/"],
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
          ignoreValues: [isValidIgnoreValues],
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
