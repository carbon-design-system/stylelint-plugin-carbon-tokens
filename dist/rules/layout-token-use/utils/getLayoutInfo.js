"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = getLayoutInfo;

var _initContainer = require("./initContainer");

var _initFluidSpacing = require("./initFluidSpacing");

var _initIconSize = require("./initIconSize");

var _initLayout = require("./initLayout");

var _initSpacing = require("./initSpacing");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getLayoutInfo(options) {
  return {
    tokens: [
      {
        source: "Container",
        accept: options.acceptContainerTokens,
        values: _initContainer.containerTokens,
      },
      {
        source: "Fluid spacing",
        accept: options.acceptFluidSpacingTokens,
        values: _initFluidSpacing.fluidSpacingTokens,
      },
      {
        source: "Icon size",
        accept: options.acceptIconSizeTokens,
        values: _initIconSize.iconSizeTokens,
      },
      {
        source: "Layout",
        accept: true,
        values: _initLayout.layoutTokens,
      },
      {
        source: "Spacing",
        accept: true,
        values: _initSpacing.spacingTokens,
      },
    ],
    functions: [
      {
        source: "Layout",
        accept: options.acceptCarbonMiniUnitsFunction,
        values: _initLayout.layoutFunctions,
      },
      {
        source: "CSS",
        accept: true,
        values: ["translate(1 2)", "translateX(1)", "translateY(1)"],
      },
      {
        source: "CSS",
        accept: true,
        values: ["calc(1)"],
      },
    ],
  };
}
