"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _themeTokenUse = _interopRequireDefault(require("./theme-token-use"));

var _layoutTokenUse = _interopRequireDefault(require("./layout-token-use"));

var _motionTokenUse = _interopRequireDefault(require("./motion-token-use"));

var _typeTokenUse = _interopRequireDefault(require("./type-token-use"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  "theme-token-use": _themeTokenUse["default"],
  "layout-token-use": _layoutTokenUse["default"],
  "motion-token-use": _motionTokenUse["default"],
  "type-token-use": _typeTokenUse["default"]
};
exports["default"] = _default;