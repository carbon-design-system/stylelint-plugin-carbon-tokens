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
var messages = (0, _utils.getMessages)(ruleName, "theme");
exports.messages = messages;
var isValidAcceptValues = _utils.isValidOption;
var isValidIncludeProps = _utils.isValidOption;
var defaultOptions = {
  // include standard color properites
  includeProps: [
    "/color$/",
    "/shadow$/<-1>",
    "border<-1>",
    "outline<-1>",
    "fill",
    "stroke",
  ],
  // Accept transparent, common reset values and 0 on its own
  acceptValues: [
    "/transparent|inherit|initial|none|unset/",
    "/^0$/",
    "currentColor",
  ],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokens: false,
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
