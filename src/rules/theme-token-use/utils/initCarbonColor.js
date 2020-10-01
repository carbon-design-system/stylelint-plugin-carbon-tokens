/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const carbonColorsMixin = "carbon--colors()";
const ibmColorsMixin = "ibm--colors()";
let carbonColorTokens = [];
let ibmColorTokens = []; // deprecated

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const colorFile = path.join(nodeModulesPath, "@carbon/colors/scss/mixins.scss");

const scssFromFile = fs.readFileSync(colorFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${colorFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkAtRules((atRule) => {
  if (atRule.name === "mixin") {
    if ([ibmColorsMixin, carbonColorsMixin].includes(atRule.params)) {
      const processedResults = [];

      atRule.each((rule) => {
        processedResults.push(rule.prop);
      });

      if (atRule.params === ibmColorsMixin) {
        ibmColorTokens = processedResults;
      } else {
        carbonColorTokens = processedResults;
      }
    }
  }
});

export { carbonColorTokens, ibmColorTokens };
