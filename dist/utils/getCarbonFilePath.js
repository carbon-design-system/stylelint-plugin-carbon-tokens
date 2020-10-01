"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var modulesPathIndex = __dirname.indexOf("/node_modules/");

var inNodeModules = modulesPathIndex > -1; //

var modulesPath = inNodeModules
  ? __dirname.substr(0, modulesPathIndex + 14) // in node modules
  : _path["default"].join(__dirname, "../../../"); //

var packagesInfo = {
  layout: {
    nodeModules: "@carbon/layout/scss/generated/",
    srcModules: "layout/scss/generated",
  },
};

var getCarbonFilePath = function getCarbonFilePath(pkg, file) {
  var packageInfo = packagesInfo[pkg];

  var packagePath = _path["default"].join(
    modulesPath,
    "".concat(inNodeModules ? packageInfo.nodeModules : packageInfo.srcModules)
  );

  var filePart = (packageInfo.file && packageInfo.file[file]) || file;
  return _path["default"].join(packagePath, filePart);
};

var _default = getCarbonFilePath;
exports["default"] = _default;
