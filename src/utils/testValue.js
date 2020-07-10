import { isVariable } from "./";

const checkValue = function (value, ruleInfo) {
  const result = { accepted: false, done: false };

  // cope with css variables
  const _value = value.startsWith("var(")
    ? value.substring(4, value.length - 2)
    : value;

  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const regexFuncAndToken = /^((\$[\w-]+)|(([\w-]+)\((['"$\w-]+)\)))/g;

  const matches = regexFuncAndToken.exec(_value);
  const matchVariable = 2;
  const matchFunction = 4;
  // const matchFunctionParam = 5;

  if (matches) {
    // if function check it's in themeFunctions
    if (matches[matchFunction] && matches[matchFunction].length > 0) {
      // // eslint-disable-next-line
      // console.log("It is a function", matches[matchFunction]);

      // // eslint-disable-next-line
      // console.dir(matches);

      for (const funcSet of ruleInfo.functions) {
        // // eslint-disable-next-line
        // console.dir(funcSet);

        const funcSpecs = funcSet.values;
        // // eslint-disable-next-line
        // console.dir(funcSpecs);

        const matchesFuncSpec = funcSpecs.some((funcSpec) => {
          const parts = funcSpec.split(" ");

          if (parts.length === 1) {
            // has no second clause
            return parts[0] === matches[matchFunction];
          } else {
            if (parts[0] === matches[matchFunction]) {
              // TODO: does not support parameter checking
              // for (const tokenSet of ruleInfo.tokens) {
              //   for (const tokenSpecs of tokenSet.values) {
              //     if (tokenSpecs.includes(matches[matchFunctionParam])) {
              //       return true;

              //       // CAN INCLUDE VARIABLES AAAAAGGGGHHHHH
              //       // RETURN THEM FOR PROCESSING BY CHECKRULE?
              //     }
              //   }
              // }
              return true;
            } else {
              return false;
            }
          }
        });

        if (matchesFuncSpec) {
          result.source = funcSet.source;
          result.accepted = funcSet.accept;
          result.done = true; // all tests completed
          break;
        }
      }
    } else if (matches[matchVariable]) {
      for (const tokenSet of ruleInfo.tokens) {
        const tokenSpecs = tokenSet.values;

        if (tokenSpecs.includes(matches[matchVariable])) {
          result.source = tokenSet.source;
          result.accepted = tokenSet.accept;
          result.done = true; // all tests completed
          break;
        }
      }
    }
  }

  // if (
  //   !result.accepted &&
  //   value &&
  //   (value.startsWith("carbon--mini-units") ||
  //     value.startsWith("get-light-value"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     value,
  //     matches,
  //     matches && matches[matchFunction],
  //     matches && matches[matchFunction].length > 0,
  //     regexFuncAndToken
  //   );
  // }

  return result;
};

export default function testValue(value, ruleInfo, options, knownVariables) {
  let result = { done: false };

  let testValue = value;

  while (!result.done) {
    // loop checking testValue;
    result = checkValue(testValue, ruleInfo);

    if (!result.done && isVariable(testValue)) {
      // may be a variable referring to a value
      testValue = knownVariables[testValue];

      if (!testValue) {
        if (options.acceptUnknownVariables) {
          result.accepted = true;
        }

        result.done = true;
      }
    } else {
      result.done = true;
    }
  }

  result.isVariable = isVariable(value); // causes different result message
  result.variableValue = testValue; // last testValue found

  return result;
}
