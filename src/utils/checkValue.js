import { tokens, formatTokenName } from "@carbon/themes";

// map themes to recognisable tokens
const themesTokens = tokens.colors.map((token) => formatTokenName(token));
// permitted carbon theme functions
// TODO: read this from carbon
const themeFunctions = ["get-light-value"];

export default function checkValue(val) {
  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const regexFuncAndToken = /^((([a-zA-Z0-9-]*)\(*)|([a-zA-Z0-9- ]*))(\$([A-Z0-9a-z-]+))/g;

  const matches = regexFuncAndToken.exec(val);
  const matchVariable = 6;
  const matchFunction = 3;

  if (matches && matches[matchVariable]) {
    // if function check it's in themeFunctions

    /* istanbul ignore next */
    const passFunctionCheck =
      !matches[matchFunction] ||
      matches[matchFunction].length === 0 ||
      themeFunctions.includes(matches[matchFunction]);

    // check token exists in theme
    return passFunctionCheck && themesTokens.includes(matches[matchVariable]);
  }

  return false;
}
