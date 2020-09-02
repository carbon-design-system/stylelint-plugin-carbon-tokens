"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fluidSpacingTokens = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssScss = _interopRequireDefault(require("postcss-scss"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fluidSpacingTokens = [];
exports.fluidSpacingTokens = fluidSpacingTokens;

var nodeModulesIndex = __dirname.indexOf("/node_modules/");

var nodeModulesPath = nodeModulesIndex > -1 ? __dirname.substr(0, nodeModulesIndex + 14) : _path["default"].join(__dirname, "../../../../node_modules/");

var fluidSpacingFile = _path["default"].join(nodeModulesPath, "@carbon/layout/scss/generated/_fluid-spacing.scss");

var scssFromFile = _fs["default"].readFileSync(fluidSpacingFile, "utf8");

var result = (0, _postcss["default"])().process("".concat(scssFromFile), {
  from: "".concat(fluidSpacingFile),
  syntax: _postcssScss["default"],
  stringifier: _postcssScss["default"].stringify
});
result.root.walkDecls(function (decl) {
  // matches form $carbon--fluid-spacing, $carbon--fluid-spacing-NN or $fluid-spacing-NN
  if (/^\$(carbon--){0,1}fluid-spacing(-[0-9]{2})*/.test(decl.prop)) {
    fluidSpacingTokens.push(decl.prop);
    fluidSpacingTokens.push("-".concat(decl.prop)); // allow negative tokens
  }
});