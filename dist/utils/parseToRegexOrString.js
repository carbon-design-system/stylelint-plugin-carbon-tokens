"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = parseToRegexOrString;

function parseToRegexOrString(str) {
  /* istanbul ignore next */
  var result =
    str && str.startsWith("/") && str.endsWith("/")
      ? new RegExp(str.slice(1, -1))
      : str;
  return result;
}
