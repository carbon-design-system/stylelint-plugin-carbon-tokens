"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ibmColorTokens = exports.carbonColorTokens = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssScss = _interopRequireDefault(require("postcss-scss"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var carbonColorsMixin = "carbon--colors()";
var ibmColorsMixin = "ibm--colors()";
var carbonColorTokens = [];
exports.carbonColorTokens = carbonColorTokens;
var ibmColorTokens = []; // deprecated

exports.ibmColorTokens = ibmColorTokens;

var nodeModulesIndex = __dirname.indexOf("/node_modules/");

var nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(nodeModulesIndex + 14)
    : _path["default"].join(__dirname, "../../node_modules/");

var colorFile = _path["default"].join(
  nodeModulesPath,
  "@carbon/colors/scss/mixins.scss"
);

var scssFromFile = _fs["default"].readFileSync(colorFile, "utf8");

var result = (0, _postcss["default"])().process("".concat(scssFromFile), {
  from: "".concat(colorFile),
  syntax: _postcssScss["default"],
});
result.root.walkAtRules(function (atRule) {
  if (atRule.name === "mixin") {
    if ([ibmColorsMixin, carbonColorsMixin].includes(atRule.params)) {
      var processedResults = [];
      atRule.each(function (rule) {
        processedResults.push(rule.prop);
      });

      if (atRule.params === ibmColorsMixin) {
        exports.ibmColorTokens = ibmColorTokens = processedResults;
      } else {
        exports.carbonColorTokens = carbonColorTokens = processedResults;
      }
    }
  }
});
