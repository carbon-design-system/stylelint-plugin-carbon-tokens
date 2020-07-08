import { containerTokens } from "./initContainer";
import { fluidSpacingTokens } from "./initFluidSpacing";
import { iconSizeTokens } from "./initIconSize";
import { layoutTokens, layoutFunctions } from "./initLayout";
import { spacingTokens } from "./initSpacing";
import { checkValue } from "../../../utils";

export default function checkLayoutValue(val) {
  const acceptableFunctions = [layoutFunctions];
  const acceptableTokens = [
    containerTokens,
    fluidSpacingTokens,
    iconSizeTokens,
    layoutTokens,
    spacingTokens,
  ];

  // // eslint-disable-next-line
  // console.log("checklayoutval", val, acceptableFunctions, acceptableTokens);

  return checkValue(val, acceptableFunctions, acceptableTokens);
}
