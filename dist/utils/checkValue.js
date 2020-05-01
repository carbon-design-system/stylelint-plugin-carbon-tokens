"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = checkValue;

var _initCarbonTheme = require("./initCarbonTheme");

var _initCarbonColor = require("./initCarbonColor");

function checkValue(val, acceptCarbonColorTokens, acceptIBMColorTokens) {
  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  var regexFuncAndToken = /^((([a-zA-Z0-9-_]*)\(*)|([a-zA-Z0-9-_ ]*))((\$[A-Z0-9a-z-_]+))/g;
  var matches = regexFuncAndToken.exec(val);
  var matchVariable = 6;
  var matchFunction = 3;
  var result = false;

  if (matches && matches[matchVariable]) {
    // if function check it's in themeFunctions

    /* istanbul ignore next */
    var passFunctionCheck =
      !matches[matchFunction] ||
      matches[matchFunction].length === 0 ||
      _initCarbonTheme.themeFunctions.includes(matches[matchFunction]); // check token exists in theme

    result =
      passFunctionCheck &&
      (_initCarbonTheme.themeTokens.includes(matches[matchVariable]) ||
        (acceptCarbonColorTokens &&
          _initCarbonColor.carbonColorTokens.includes(
            matches[matchVariable]
          )) ||
        (acceptIBMColorTokens &&
          _initCarbonColor.ibmColorTokens.includes(matches[matchVariable])));
  }

  return result;
}
