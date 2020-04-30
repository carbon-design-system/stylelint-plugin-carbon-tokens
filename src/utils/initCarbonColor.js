import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const carbonColorsMixin = "carbon--colors()";
const ibmColorsMixin = "ibm--colors()";
let carbonColorTokens = [];
let ibmColorTokens = []; // deprecated

const colorFile = path.join(
  __dirname,
  "../../node_modules/@carbon/colors/scss/mixins.scss"
);

const scssFromFile = fs.readFileSync(colorFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${colorFile}`,
  syntax: scss,
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
