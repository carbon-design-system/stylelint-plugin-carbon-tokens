import { containerTokens } from "./initContainer";
import { fluidSpacingTokens } from "./initFluidSpacing";
import { iconSizeTokens } from "./initIconSize";
import { layoutTokens, layoutFunctions } from "./initLayout";
import { spacingTokens } from "./initSpacing";

export default function getLayoutInfo() {
  return {
    tokens: [
      {
        source: "Container",
        accept: true,
        values: containerTokens,
      },
      {
        source: "Fluid spacing",
        accept: true,
        values: fluidSpacingTokens,
      },
      {
        source: "Icon size",
        accept: true,
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
        accept: true,
        values: layoutFunctions,
      },
    ],
  };
}
