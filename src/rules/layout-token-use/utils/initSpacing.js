import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const spacingTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const spacingFile = path.join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_spacing.scss"
);

const scssFromFile = fs.readFileSync(spacingFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${spacingFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $carbon--spacing, $carbon--spacing-NN or $spacing-NN
  if (/^\$(carbon--){0,1}spacing(-[0-9]{2})*/.test(decl.prop)) {
    spacingTokens.push(decl.prop);
  }
});

export { spacingTokens };
