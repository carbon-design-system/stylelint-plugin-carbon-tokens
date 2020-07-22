import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const fluidSpacingTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const fluidSpacingFile = path.join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_fluid-spacing.scss"
);

const scssFromFile = fs.readFileSync(fluidSpacingFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${fluidSpacingFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $carbon--fluid-spacing, $carbon--fluid-spacing-NN or $fluid-spacing-NN
  if (/^\$(carbon--){0,1}fluid-spacing(-[0-9]{2})*/.test(decl.prop)) {
    fluidSpacingTokens.push(decl.prop);
    fluidSpacingTokens.push(`-${decl.prop}`); // allow negative tokens
  }
});

export { fluidSpacingTokens };
