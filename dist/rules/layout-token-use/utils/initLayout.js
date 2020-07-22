"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.layoutFunctions = exports.layoutTokens = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssScss = _interopRequireDefault(require("postcss-scss"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var layoutTokens = [];
exports.layoutTokens = layoutTokens;

var nodeModulesIndex = __dirname.indexOf("/node_modules/");

var nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : _path["default"].join(__dirname, "../../../../node_modules/");

var layoutFile = _path["default"].join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_layout.scss"
);

var scssFromFile = _fs["default"].readFileSync(layoutFile, "utf8");

var result = (0, _postcss["default"])().process("".concat(scssFromFile), {
  from: "".concat(layoutFile),
  syntax: _postcssScss["default"],
  stringifier: _postcssScss["default"].stringify,
});
result.root.walkDecls(function (decl) {
  // matches form $carbon--layout, $carbon--layout-NN or $layout-NN
  if (/^\$(carbon--){0,1}layout(-[0-9]{2})*/.test(decl.prop)) {
    layoutTokens.push(decl.prop);
    layoutTokens.push("-".concat(decl.prop)); // allow negative tokens
  }
}); // permitted carbon layout functions
// TODO: read this from carbon

var layoutFunctions = ["carbon--mini-units"];
exports.layoutFunctions = layoutFunctions;
