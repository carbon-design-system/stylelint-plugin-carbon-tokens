"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.spacingTokens = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssScss = _interopRequireDefault(require("postcss-scss"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var spacingTokens = [];
exports.spacingTokens = spacingTokens;

var nodeModulesIndex = __dirname.indexOf("/node_modules/");

var nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : _path["default"].join(__dirname, "../../../../node_modules/");

var spacingFile = _path["default"].join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_spacing.scss"
);

var scssFromFile = _fs["default"].readFileSync(spacingFile, "utf8");

var result = (0, _postcss["default"])().process("".concat(scssFromFile), {
  from: "".concat(spacingFile),
  syntax: _postcssScss["default"],
  stringifier: _postcssScss["default"].stringify,
});
result.root.walkDecls(function (decl) {
  // matches form $carbon--spacing, $carbon--spacing-NN or $spacing-NN
  if (/^\$(carbon--){0,1}spacing(-[0-9]{2})*/.test(decl.prop)) {
    spacingTokens.push(decl.prop);
    spacingTokens.push("-".concat(decl.prop)); // allow negative tokens
  }
});
