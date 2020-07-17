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
var ruleName = (0, _utils.namespace)("theme-token-use");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(property, value) {
    return 'Expected carbon theme token, mixin or function for "'
      .concat(property, '" found "')
      .concat(value, '."');
  },
  rejectedUndefinedRange: function rejectedUndefinedRange(
    property,
    value,
    range
  ) {
    return 'Expected carbon theme token, mixin or function for "'
      .concat(property, '" found "')
      .concat(value, ' in position(s) "')
      .concat(range, '"."');
  },
  rejectedVariable: function rejectedVariable(property, variable, value) {
    return 'Expected carbon theme token, mixin or function to be set for variable "'
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
  includeProps: ["/color$/", "/shadow$/<-1>", "border<-1>", "outline<-1>"],
  // ignore transparent, common reset values and 0 on its own
  ignoreValues: ["/transparent|inherit|initial/", "/^0$/", "^none$/"],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokens: false,
  acceptUndefinedVariables: true,
};

function rule(primaryOptions, secondaryOptions) {
  // // eslint-disable-next-line
  // console.log(primaryOptions, secondaryOptions);
  var options = (0, _utils.parseOptions)(secondaryOptions, defaultOptions); // // eslint-disable-next-line
  // console.log("after options parse");

  return function (root, result) {
    // // eslint-disable-next-line
    // console.log(typeof options.acceptCarbonColorTokens);
    // // eslint-disable-next-line
    // console.log(typeof options.acceptIBMColorTokens);
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
          acceptCarbonColorTokens: function acceptCarbonColorTokens(val) {
            return val === undefined || typeof val === "boolean";
          },
          acceptIBMColorTokens: function acceptIBMColorTokens(val) {
            return val === undefined || typeof val === "boolean";
          },
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
      _utils2.getThemeInfo
    );
  };
}
