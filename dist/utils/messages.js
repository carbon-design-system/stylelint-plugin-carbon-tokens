"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;

var _stylelint = require("stylelint");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var getMessages = function getMessages(ruleName, label) {
  return _stylelint.utils.ruleMessages(ruleName, {
    rejected: function rejected(property, value) {
      return "Expected carbon "
        .concat(label, ' token, mixin or function for "')
        .concat(property, '" found "')
        .concat(value, '".');
    },
    rejectedUndefinedRange: function rejectedUndefinedRange(
      property,
      value,
      range
    ) {
      return "Expected carbon "
        .concat(label, ' token, mixin or function for "')
        .concat(property, '" found "')
        .concat(value, '" in position(s) "')
        .concat(range, '".');
    },
    rejectedVariable: function rejectedVariable(property, variable, value) {
      return "Expected carbon "
        .concat(label, ' token, mixin or function to be set for variable "')
        .concat(variable, '" used by "')
        .concat(property, '" found "')
        .concat(value, '".');
    },
    rejectedMaths: function rejectedMaths(property, value) {
      return "Expected calc of the form calc(P o $). Where P is a proportional value (vw, vh or %), o is + or - and $ is a carbon "
        .concat(label, ' token, mixin or function for "')
        .concat(property, '" found "')
        .concat(value, '".');
    },
  });
};

var _default = getMessages;
exports["default"] = _default;
