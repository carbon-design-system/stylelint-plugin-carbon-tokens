import { themeTokens, themeFunctions } from "./initCarbonTheme";
import { ibmColorTokens, carbonColorTokens } from "./initCarbonColor";
import { checkValue } from "../../../utils";

export default function checkThemeValue(val, options) {
  const acceptableFunctions = [themeFunctions];
  const acceptableTokens = [themeTokens];
  const rejectableTokens = [];

  if (options.acceptCarbonColorTokens) {
    acceptableTokens.push(carbonColorTokens);
  } else {
    rejectableTokens.push(carbonColorTokens);
  }

  if (options.acceptIBMColorTokens) {
    acceptableTokens.push(ibmColorTokens);
  } else {
    rejectableTokens.push(ibmColorTokens);
  }

  // // eslint-disable-next-line
  // console.log(val, acceptableFunctions, acceptableTokens);

  return checkValue(
    val,
    acceptableFunctions,
    acceptableTokens,
    rejectableTokens
  );
}
