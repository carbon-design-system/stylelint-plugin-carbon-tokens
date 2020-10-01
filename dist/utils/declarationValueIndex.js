"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = declarationValueIndex;

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Get the index of a declaration's value
 *
 * @param {Decl} decl
 * @return {int} The index
 */
function declarationValueIndex(decl) {
  var beforeColon = decl.toString().indexOf(":");
  var afterColon =
    decl.raw("between").length - decl.raw("between").indexOf(":");
  return beforeColon + afterColon;
}
