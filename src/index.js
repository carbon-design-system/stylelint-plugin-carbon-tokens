/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import stylelint from "stylelint";
import rules from "./rules/index.js";

const NAMESPACE = "carbon";

const rulesPlugins = Object.keys(rules).map((ruleName) => {
  return stylelint.createPlugin(`${NAMESPACE}/${ruleName}`, rules[ruleName]);
});

export default rulesPlugins;
