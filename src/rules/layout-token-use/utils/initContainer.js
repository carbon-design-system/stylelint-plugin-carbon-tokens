import postcss from "postcss";
import scss from "postcss-scss";
import fs from "fs";
import path from "path";

const containerTokens = [];

const nodeModulesIndex = __dirname.indexOf("/node_modules/");
const nodeModulesPath =
  nodeModulesIndex > -1
    ? __dirname.substr(0, nodeModulesIndex + 14)
    : path.join(__dirname, "../../../../node_modules/");

const containerFile = path.join(
  nodeModulesPath,
  "@carbon/layout/scss/generated/_container.scss"
);

const scssFromFile = fs.readFileSync(containerFile, "utf8");

const result = postcss().process(`${scssFromFile}`, {
  from: `${containerFile}`,
  syntax: scss,
  stringifier: scss.stringify,
});

result.root.walkDecls((decl) => {
  // matches form $carbon--container, $carbon--container-NN or $container-NN
  if (/^\$(carbon--){0,1}container(-[0-9]{2})*/.test(decl.prop)) {
    containerTokens.push(decl.prop);
    containerTokens.push(`-${decl.prop}`); // allow negative tokens
  }
});

export { containerTokens };
