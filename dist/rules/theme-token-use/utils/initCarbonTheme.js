"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeFunctions = exports.themeTokens = void 0;

var _themes = require("@carbon/themes");

// map themes to recognisable tokens
var themeTokens = _themes.tokens.colors.map(function (token) {
  return "$".concat((0, _themes.formatTokenName)(token));
}); // permitted carbon theme functions
// TODO: read this from carbon


exports.themeTokens = themeTokens;
var themeFunctions = ["get-light-value"];
exports.themeFunctions = themeFunctions;