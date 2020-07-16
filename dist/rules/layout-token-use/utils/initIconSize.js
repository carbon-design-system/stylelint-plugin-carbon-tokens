"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.iconSizeTokens = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssScss = _interopRequireDefault(require("postcss-scss"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var iconSizeTokens = [];
exports.iconSizeTokens = iconSizeTokens;

var nodeModulesIndex = __dirname.indexOf("/node_modules/");

var nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : _path["default"].join(__dirname, "../../../../node_modules/");

var iconSizeFile = _path["default"].join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_icon-size.scss"
);

var scssFromFile = _fs["default"].readFileSync(iconSizeFile, "utf8");

var result = (0, _postcss["default"])().process("".concat(scssFromFile), {
  from: "".concat(iconSizeFile),
  syntax: _postcssScss["default"],
  stringifier: _postcssScss["default"].stringify,
});
result.root.walkDecls(function (decl) {
  // matches form $carbon--iconSize, $carbon--iconSize-NN or $iconSize-NN
  if (/^\$(carbon--){0,1}icon-size(-[0-9]{2})*/.test(decl.prop)) {
    iconSizeTokens.push(decl.prop);
  }
});
