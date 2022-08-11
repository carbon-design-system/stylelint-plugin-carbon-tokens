/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedLayout } from "@carbon/layout";
import { unstable_tokens as installedType } from "@carbon/type";
import { version as installedVersion } from "@carbon/themes/package.json";
import { white as installedWhite } from "@carbon/themes";
import loadModules from "../../../utils/loadModules";

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

const doInitTheme = async ({ carbonPath, carbonModulePostfix }) => {
  let layoutTokens;
  let typeTokens;
  let tokens;
  let _version;

  if (carbonPath) {

    const { layout, type, themes, pkg } = await loadModules(carbonPath,  [
      "themes",
      "layout",
      "type"
      ], carbonModulePostfix);

    layoutTokens = layout.unstable_tokens;
    typeTokens = type.unstable_tokens;
    tokens = themes.white;

    _version = pkg.version;

  } else {
    layoutTokens = installedLayout;
    typeTokens = installedType;
    tokens = installedWhite;
    _version = installedVersion;
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
