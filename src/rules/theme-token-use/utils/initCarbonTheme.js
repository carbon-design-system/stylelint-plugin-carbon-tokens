/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { formatTokenName } from "../../../utils/token-name";
import { unstable_tokens as layout } from "@carbon/layout";
import { white as tokens } from "@carbon/themes";
import { unstable_tokens as types } from "@carbon/type";

// map themes to recognizable tokens

const themeTokens = Object.keys(tokens)
  .filter((token) => !types.includes(token) && !layout.includes(token))
  .map((token) => `$${formatTokenName(token)}`);

// permitted carbon theme functions
// TODO: read this from carbon
const themeFunctions = ["get-light-value"];

export { themeTokens, themeFunctions };
