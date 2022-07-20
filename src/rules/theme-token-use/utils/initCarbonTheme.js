/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedLayout } from "@carbon/layout";
import { unstable_tokens as installedType } from "@carbon/type";
import { white as installedWhite } from "@carbon/themes";
import { version } from "@carbon/themes/package.json";

const missingButtonTokens = [
  "button-danger-active",
  "button-danger-hover",
  "button-danger-primary",
  "button-danger-secondary",
  "button-disabled",
  "button-primary",
  "button-primary-active",
  "button-primary-hover",
  "button-secondary",
  "button-secondary-active",
  "button-secondary-hover",
  "button-separator",
  "button-tertiary",
  "button-tertiary-active",
  "button-tertiary-hover"
];

const doInitTheme = async (testOnlyVersion) => {
  const _version = testOnlyVersion || version;
  const isV10 = _version.startsWith("10");
  let layoutTokens;
  let typeTokens;
  let tokens;

  if (isV10 && process.env.NODE_ENV === "test") {
    // eslint-disable-next-line
    const layoutModule = await import("@carbon/layout-10");
    // eslint-disable-next-line
    const typeModule = await import("@carbon/type-10");
    // eslint-disable-next-line
    const themeModule = await import("@carbon/themes-10");

    layoutTokens = layoutModule.unstable_tokens;
    typeTokens = typeModule.unstable_tokens;
    tokens = themeModule.white;
  } else {
    layoutTokens = installedLayout;
    typeTokens = installedType;
    tokens = installedWhite;
  }

  // map themes to recognizable tokens
  const themeTokens = Object.keys(tokens)
    .filter(
      (token) => !layoutTokens.includes(token) && !typeTokens.includes(token)
    )
    .map((token) => `$${formatTokenName(token)}`);

  // TODO remove when available in @carbon/themes
  missingButtonTokens.forEach((token) => {
    themeTokens.push(`$${formatTokenName(token)}`);
  });

  // permitted carbon theme functions
  // TODO: read this from carbon
  const themeFunctions = ["get-light-value"];

  return { themeTokens, themeFunctions, version: _version };
};

export { doInitTheme };
