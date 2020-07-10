export default function checkValue(
  value,
  acceptableFunctionArrays,
  acceptableTokenArrays,
  rejectableTokenArrayss
) {
  // cope with css variables
  const _value = value.startsWith("var(")
    ? value.substring(4, value.length - 2)
    : value;

  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const regexFuncAndToken = /^((\$[\w-]+)|(([\w-]+)\(((\$*)[\w-]+)\)))/g;

  const matches = regexFuncAndToken.exec(_value);
  const matchVariable = 2;
  const matchFunction = 4;
  const matchFunctionParam = 5;
  // const matchFunctionParamDollar = 6;

  let result = false;

  if (matches) {
    // if function check it's in themeFunctions

    if (matches[matchFunction] && matches[matchFunction].length > 0) {
      // eslint-disable-next-line
      console.log("It is a function", matches[matchFunction]);

      for (const acceptableFunctions of acceptableFunctionArrays) {
        const passFunctionCheck = acceptableFunctions.some((item) => {
          const parts = item.split(" ");

          // eslint-disable-next-line
          console.log(
            parts,
            matches[matchFunction],
            matches[matchFunctionParam]
          );

          if (parts.length === 1) {
            return item === matches[matchFunction];
          } else {
            if (parts[0] === matches[matchFunction]) {
              for (const tokens of acceptableTokenArrays) {
                result = tokens.includes(matches[matchFunctionParam]);

                if (result) {
                  return true;
                }
              }
            } else {
              return false;
            }
          }
        });

        if (passFunctionCheck) {
          break;
        }
      }
    } else if (matches[matchVariable]) {
      for (const tokens of acceptableTokenArrays) {
        result = tokens.includes(matches[matchVariable]);

        if (result) {
          break;
        }
      }
    }
  }

  // if (
  //   !result &&
  //   value &&
  //   (value.startsWith("carbon--mini-units") || value.startsWith("get-light-value"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     value,
  //     acceptableFunctionArrays,
  //     matches,
  //     matches[matchFunction],
  //     matches[matchFunction].length > 0,
  //     regexFuncAndToken
  //   );
  // }

  return result;
}
