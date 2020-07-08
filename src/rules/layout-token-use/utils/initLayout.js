import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const layoutTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const layoutFile = path.join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_layout.scss"
);

const scssFromFile = fs.readFileSync(layoutFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${layoutFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $carbon--layout, $carbon--layout-NN or $layout-NN
  if (/^\$(carbon--){0,1}layout(-[0-9]{2})*/.test(decl.prop)) {
    layoutTokens.push(decl.prop);
  }
});

// permitted carbon layout functions
// TODO: read this from carbon
const layoutFunctions = ["carbon--mini-units"];

export { layoutTokens, layoutFunctions };
