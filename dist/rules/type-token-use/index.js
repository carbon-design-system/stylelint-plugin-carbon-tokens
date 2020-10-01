"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = rule;
exports.messages = exports.ruleName = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var _utils2 = require("./utils");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
// import valueParser from "postcss-value-parser";
var ruleName = (0, _utils.namespace)("type-token-use");
exports.ruleName = ruleName;
var messages = (0, _utils.getMessages)(ruleName, "type");
exports.messages = messages;
var isValidAcceptValues = _utils.isValidOption;
var isValidIncludeProps = _utils.isValidOption;
var defaultOptions = {
  // include standard type properites
  includeProps: ["font", "/^font-*/", "line-height", "letterSpacing"],
  acceptValues: ["/inherit|initial|none|unset/"],
  acceptCarbonFontWeightFunction: false,
  // permit use of carbon font weight function
  acceptCarbonTypeScaleFunction: false, // permit use of carbon type scale function
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
          acceptCarbonFontWeightFunction: function acceptCarbonFontWeightFunction(
            val
          ) {
            return val === undefined || typeof val === "boolean";
          },
          acceptCarbonTypeScaleFunction: function acceptCarbonTypeScaleFunction(
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
      _utils2.getTypeInfo
    );
  };
}
