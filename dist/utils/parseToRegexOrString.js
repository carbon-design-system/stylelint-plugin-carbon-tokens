"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = parseToRegexOrString;

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
function parseToRegexOrString(str) {
  /* istanbul ignore next */
  var result =
    str && str.startsWith("/") && str.endsWith("/")
      ? new RegExp(str.slice(1, -1))
      : str;
  return result;
}
