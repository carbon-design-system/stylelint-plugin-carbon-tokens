import { themeTokens, themeFunctions } from "./initCarbonTheme";
import { ibmColorTokens, carbonColorTokens } from "./initCarbonColor";
import { checkValue } from "../../../utils";

export default function checkThemeValue(
  val,
  acceptCarbonColorTokens,
  acceptIBMColorTokens
) {
  const acceptableFunctions = [themeFunctions];
  const acceptableTokens = [themeTokens];

  if (acceptCarbonColorTokens) {
    acceptableTokens.push(carbonColorTokens);
  }

  if (acceptIBMColorTokens) {
    acceptableTokens.push(ibmColorTokens);
  }

  // // eslint-disable-next-line
  // console.log(val, acceptableFunctions, acceptableTokens);

  return checkValue(val, acceptableFunctions, acceptableTokens);
}
