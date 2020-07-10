import { themeTokens, themeFunctions } from "./initCarbonTheme";
import { ibmColorTokens, carbonColorTokens } from "./initCarbonColor";

export default function getThemeInfo(options) {
  return {
    tokens: [
      {
        source: "Theme",
        accept: true,
        values: themeTokens,
      },
      {
        source: "Carbon color",
        accept: options.acceptCarbonColorTokens,
        values: carbonColorTokens,
      },
      {
        source: "IBM Color",
        accept: options.acceptIBMColorTokens,
        values: ibmColorTokens,
      },
    ],
    functions: [
      {
        source: "Theme",
        accept: true,
        values: themeFunctions,
      },
    ],
  };
}
