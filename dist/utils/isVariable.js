"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isVariable;

var _tokenizeValue = require("./tokenizeValue");

function isVariable(val) {
  if (typeof val === "string") {
    return val !== undefined && (val.startsWith("$") || val.startsWith("--") || val.startsWith("var(--"));
  } else {
    // is tokenized
    if (val.type === _tokenizeValue.TOKEN_TYPES.SCSS_VAR) {
      return true;
    } else {
      return val.type === _tokenizeValue.TOKEN_TYPES.FUNCTION && val.value === "var";
    }
  }
}