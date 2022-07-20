/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Tokens come in an an array not split into type
// here we split based on the name excluding the numeric part.
// This is to maintain the ability to separate out sizes not called out
// on the carbon designs system website.
import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedTokens } from "@carbon/layout";
import { version } from "@carbon/layout/package.json";

const carbonPrefix = "$carbon--";

const doInit = async (testOnlyVersion) => {
  const containerTokens = [];
  const fluidSpacingTokens = [];
  const iconSizeTokens = [];
  const layoutTokens = [];
  const spacingTokens = [];
  const _version = testOnlyVersion || version;
  const isV10 = _version.startsWith("10");
  let tokens;

  if (isV10 && process.env.NODE_ENV === "test") {
    // eslint-disable-next-line
    const module = await import("@carbon/layout-10");

    tokens = module.unstable_tokens;
  } else {
    tokens = installedTokens;
  }

  const functions = isV10 ? ["carbon--mini-units", "mini-units"] : [];

  for (const key in tokens) {
    if (Object.hasOwn(tokens, key)) {
      const token = formatTokenName(tokens[key]);

      const tokenWithoutNumber = token.substr(0, token.lastIndexOf("-"));
      let tokenArray = undefined;

      switch (tokenWithoutNumber) {
        case "container":
          tokenArray = containerTokens;
          break;
        case "fluid-spacing":
          tokenArray = fluidSpacingTokens;
          break;
        case "icon-size":
          tokenArray = iconSizeTokens;
          break;
        case "layout":
          tokenArray = layoutTokens;
          break;
        case "spacing":
          tokenArray = spacingTokens;
          break;
        default:
          if (tokenWithoutNumber.startsWith("size")) {
            tokenArray = containerTokens;
          } else {
            // eslint-disable-next-line no-console
            console.warn(
              `Unexpected token "${token}" found in @carbon/layout - please raise an issue`
            );
          }
      }

      if (tokenArray) {
        tokenArray.push(`$${token}`);

        if (isV10) {
          tokenArray.push(`${carbonPrefix}${token}`);
        }
      }
    }
  }

  return {
    containerTokens,
    fluidSpacingTokens,
    iconSizeTokens,
    layoutFunctions: functions,
    layoutTokens,
    spacingTokens,
    version: _version
  };
};

export { doInit };
