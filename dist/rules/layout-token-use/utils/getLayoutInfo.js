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
    ],
  };
}
