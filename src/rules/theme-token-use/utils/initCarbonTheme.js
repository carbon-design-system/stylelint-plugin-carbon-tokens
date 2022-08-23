/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  unstable_metadata as installedMetadata,
  white as installedWhite
} from "@carbon/themes";
import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as installedLayout } from "@carbon/layout";
import { unstable_tokens as installedType } from "@carbon/type";
import { version as installedVersion } from "@carbon/themes/package.json";
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
  let unstable_metadata;

  if (carbonPath) {
    const { layout, type, themes, pkg } = await loadModules(
      carbonPath,
      ["themes", "layout", "type"],
      carbonModulePostfix
    );

    layoutTokens = layout.unstable_tokens;
    typeTokens = type.unstable_tokens;
    tokens = themes.white;
    unstable_metadata = themes.unstable_metadata;

    _version = pkg.version;
  } else {
    layoutTokens = installedLayout;
    typeTokens = installedType;
    tokens = installedWhite;
    unstable_metadata = installedMetadata;
    _version = installedVersion;
  }

  let themeTokens;

  if (unstable_metadata) {
    // prefer to installedWhite.
    themeTokens = unstable_metadata.v11
      .filter((token) => token.type === "color")
      .map((token) => `$${token.name}`);
  } else {
    // map themes to recognizable tokens
    themeTokens = Object.keys(tokens)
      .filter(
        (token) => !layoutTokens.includes(token) && !typeTokens.includes(token)
      )
      .map((token) => `$${formatTokenName(token)}`);

    if (!_version.startsWith("10")) {
      // TODO remove when available in @carbon/themes
      missingButtonTokens.forEach((token) => {
        themeTokens.push(`$${formatTokenName(token)}`);
      });
    }
  }

  // permitted carbon theme functions
  // TODO: read this from carbon
  const themeFunctions = ["get-light-value"];

  return { themeTokens, themeFunctions, version: _version };
};

export { doInitTheme };
