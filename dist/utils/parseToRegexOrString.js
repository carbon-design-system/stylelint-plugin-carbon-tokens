"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = parseToRegexOrString;

function parseToRegexOrString(str) {
  /* istanbul ignore next */
  var result =
    str.startsWith("/") && str.endsWith("/")
      ? new RegExp(str.slice(1, -1))
      : str; // // eslint-disable-next-line
  // console.log(str, result);

  return result;
}
