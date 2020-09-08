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
var ruleName = (0, _utils.namespace)("layout-token-use");
exports.ruleName = ruleName;
var messages = (0, _utils.getMessages)(ruleName, "layout");
exports.messages = messages;
var isValidAcceptValues = _utils.isValidOption;
var isValidIncludeProps = _utils.isValidOption;
var defaultOptions = {
  // include standard layout properites
  includeProps: [
    "/^margin$/<1 4>",
    "/^margin-/",
    "/^padding$/<1 4>",
    "/^padding-/",
    "left",
    "top",
    "bottom",
    "right",
    "transform[/^translate/]", // the following are not really layout or spacing
    // "height",
    // "width",
    // "/^border$/<1 -2>",
    // "/^border-/",
    // "/^box-shadow$/<1 -2>",
  ],
  // Accept transparent, common reset values, 0, proportioanl values,
  acceptValues: [
    "/inherit|initial|auto|none|unset/",
    "/^0[a-z]*$/",
    "/^[0-9]*(%|vw|vh)$/",
  ],
  acceptUndefinedVariables: true,
  acceptContainerTokens: false,
  acceptIconSizeTokens: false,
  acceptFluidSpacingTokens: false,
  acceptCarbonMiniUnitsFunction: false,
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
          acceptContainerTokens: function acceptContainerTokens(val) {
            return val === undefined || typeof val === "boolean";
          },
          acceptIconSizeTokens: function acceptIconSizeTokens(val) {
            return val === undefined || typeof val === "boolean";
          },
          acceptFluidSpacingTokens: function acceptFluidSpacingTokens(val) {
            return val === undefined || typeof val === "boolean";
          },
          acceptCarbonMiniUnitsFunction: function acceptCarbonMiniUnitsFunction(
            val
          ) {
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
      _utils2.getLayoutInfo
    );
  };
}
