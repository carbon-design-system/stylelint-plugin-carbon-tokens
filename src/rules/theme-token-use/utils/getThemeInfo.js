/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { carbonColorTokens, ibmColorTokens } from "./initCarbonColor";
import { themeFunctions, themeTokens } from "./initCarbonTheme";
import { sassColorFunctions } from "./initSassFunctions";

export default function getThemeInfo(options) {
  return {
    tokens: [
      {
        source: "Theme",
        accept: true,
        values: themeTokens
      },
      {
        source: "Carbon color",
        accept: options.acceptCarbonColorTokens,
        values: carbonColorTokens
      },
      {
        source: "IBM Color",
        accept: options.acceptIBMColorTokens,
        values: ibmColorTokens
      }
    ],
    functions: [
      {
        source: "Theme",
        accept: true,
        values: themeFunctions
      },
      {
        source: "SASS",
        accept: true,
        values: sassColorFunctions
      }
    ]
  };
}
