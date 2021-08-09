/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  containerTokens,
  fluidSpacingTokens,
  iconSizeTokens,
  layoutTokens,
  layoutFunctions,
  spacingTokens,
} from "./initAll";

export default function getLayoutInfo(options) {
  return {
    tokens: [
      {
        source: "Container",
        accept: options.acceptContainerTokens,
        values: containerTokens,
      },
      {
        source: "Fluid spacing",
        accept: options.acceptFluidSpacingTokens,
        values: fluidSpacingTokens,
      },
      {
        source: "Icon size",
        accept: options.acceptIconSizeTokens,
        values: iconSizeTokens,
      },
      {
        source: "Layout",
        accept: true,
        values: layoutTokens,
      },
      {
        source: "Spacing",
        accept: true,
        values: spacingTokens,
      },
    ],
    functions: [
      {
        source: "Layout",
        accept: options.acceptCarbonMiniUnitsFunction,
        values: layoutFunctions,
      },
      {
        source: "CSS",
        accept: true,
        values: [
          "translate(1 2)",
          "translateX(1)",
          "translateY(1)",
          "translate3d(1 2)",
        ],
      },
      { source: "CSS", accept: true, values: ["calc(1)"] },
    ],
  };
}
