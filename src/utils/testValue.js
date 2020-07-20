import { isVariable, parseRangeValue } from "./";

const checkVariable = function (variable, ruleInfo) {
  const result = { accepted: false, done: false };

  for (const tokenSet of ruleInfo.tokens) {
    const tokenSpecs = tokenSet.values;

    if (tokenSpecs.includes(variable)) {
      result.source = tokenSet.source;
      result.accepted = tokenSet.accept;
      result.done = true; // all tests completed
      break;
    }
  }

  return result;
};

const checkValue = function (value, ruleInfo) {
  const result = { accepted: false, done: false };

  if (value === undefined) {
    // do not accept undefined
    result.done = true;

    return result;
  }

  // cope with css variables
  const _value = value.startsWith("var(")
    ? value.substring(4, value.length - 2)
    : value;

  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const regexFuncAndToken = /^((\$[\w-]+)|(([\w-]+)\((['"$\w-, .]+)\)))/g;

  const matches = regexFuncAndToken.exec(_value);
  const matchVariable = 2;
  const matchFunction = 4;
  const matchFunctionParams = 5;

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
          const parts = funcSpec.split("<");

          if (parts.length === 1) {
            // has no range
            return parts[0] === matches[matchFunction];
          } else {
            if (parts[0] === matches[matchFunction]) {
              const paramParts = matches[matchFunctionParams].split(",");

              let [start, end] = parts[1]
                .substring(0, parts[1].length - 1)
                .split(" ");

              start = parseRangeValue(start, paramParts.length);
              end = parseRangeValue(end, paramParts.length) || start; // start if end empty

              for (let pos = start; pos <= end; pos++) {
                const variableResult = checkVariable(
                  paramParts[pos].trim(),
                  ruleInfo
                );

                if (!variableResult.accepted) {
                  return false;
                }
              }

              // all variables in function passed so return true
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
      const variableResult = checkVariable(matches[matchVariable], ruleInfo);

      result.soruce = variableResult.source;
      result.accepted = variableResult.accepted;
      result.done = variableResult.done;
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

  while (testValue && !result.done) {
    // loop checking testValue;
    result = checkValue(testValue, ruleInfo);

    if (!result.done && isVariable(testValue)) {
      // may be a variable referring to a value
      testValue = knownVariables[testValue];

      if (!testValue) {
        if (options.acceptUndefinedVariables) {
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

  // if (90 < parseInt(value, 10)) {
  //   // eslint-disable-next-line
  //   console.log(result, testValue, value);
  // }

  return result;
}
