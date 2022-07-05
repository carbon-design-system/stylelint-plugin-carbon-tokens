/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { colors as installedColors } from "@carbon/colors";
// colors comes in as object depth 2
// keys are color names, values are objects
// value objects container key: intensity number, value actual color
import { formatTokenName } from "../../../utils/token-name";
import { version } from "@carbon/colors/package.json";

const carbonColorPrefix = "$carbon--";
const ibmColorPrefix = "$ibm-color__";

const doInitColors = async (testOnlyTarget) => {
  const isV10 = testOnlyTarget === "v10" || version.startsWith("10");
  let colorTokens;
  const carbonColorTokens = [];
  const ibmColorTokens = []; // deprecated

  if (isV10 && process.env.NODE_ENV === "test") {
    // eslint-disable-next-line
    const module = await import("@carbon/colors-10");

    colorTokens = module.colors;
  } else {
    colorTokens = installedColors;
  }

  for (const key in colorTokens) {
    if (Object.hasOwn(colorTokens, key)) {
      const colorMap = colorTokens[key];

      for (const index in colorMap) {
        if (Object.hasOwn(colorMap, index)) {
          const colorName = formatTokenName(`${key}${index}`);

          carbonColorTokens.push(`$${colorName}`);

          if (isV10) {
            carbonColorTokens.push(`${carbonColorPrefix}${colorName}`);
            ibmColorTokens.push(`${ibmColorPrefix}${colorName}`);
          }
        }
      }
    }
  }

  return { carbonColorTokens, ibmColorTokens };
};

export { doInitColors };
