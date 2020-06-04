export default function checkValue(
  val,
  acceptableFunctionArrays,
  acceptableTokenArrays
) {
  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const regexFuncAndToken = /^((([a-zA-Z0-9-_]*)\(*)|([a-zA-Z0-9-_ ]*))((\$[A-Z0-9a-z-_]+))/g;

  const matches = regexFuncAndToken.exec(val);
  const matchVariable = 6;
  const matchFunction = 3;
  let result = false;

  if (matches && matches[matchVariable]) {
    // if function check it's in themeFunctions

    /* istanbul ignore next */
    let passFunctionCheck =
      !matches[matchFunction] || matches[matchFunction].length === 0;

    if (!passFunctionCheck) {
      for (const acceptableFunctions of acceptableFunctionArrays) {
        passFunctionCheck = acceptableFunctions.includes(
          matches[matchFunction]
        );

        if (passFunctionCheck) {
          break;
        }
      }
    }

    // check token exists in theme
    if (passFunctionCheck) {
      for (const tokens of acceptableTokenArrays) {
        result = tokens.includes(matches[matchVariable]);

        if (result) {
          break;
        }
      }
    }
  }

  return result;
}
