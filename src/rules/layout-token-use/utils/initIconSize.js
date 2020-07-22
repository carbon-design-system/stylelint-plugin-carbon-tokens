import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const iconSizeTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const iconSizeFile = path.join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_icon-size.scss"
);

const scssFromFile = fs.readFileSync(iconSizeFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${iconSizeFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $carbon--iconSize, $carbon--iconSize-NN or $iconSize-NN
  if (/^\$(carbon--){0,1}icon-size(-[0-9]{2})*/.test(decl.prop)) {
    iconSizeTokens.push(decl.prop);
    iconSizeTokens.push(`-${decl.prop}`); // allow negative tokens
  }
});

export { iconSizeTokens };
