"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getThemeInfo;

var _initCarbonTheme = require("./initCarbonTheme");

var _initCarbonColor = require("./initCarbonColor");

var _initSassFunctions = require("./initSassFunctions");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getThemeInfo(options) {
  return {
    tokens: [
      {
        source: "Theme",
        accept: true,
        values: _initCarbonTheme.themeTokens,
      },
      {
        source: "Carbon color",
        accept: options.acceptCarbonColorTokens,
        values: _initCarbonColor.carbonColorTokens,
      },
      {
        source: "IBM Color",
        accept: options.acceptIBMColorTokens,
        values: _initCarbonColor.ibmColorTokens,
      },
    ],
    functions: [
      {
        source: "Theme",
        accept: true,
        values: _initCarbonTheme.themeFunctions,
      },
      {
        source: "SASS",
        accept: true,
        values: _initSassFunctions.sassColorFunctions,
      },
    ],
  };
}
