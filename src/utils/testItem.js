/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  isVariable,
  normalizeVariableName,
  parseRangeValue,
  parseToRegexOrString,
} from ".";
import { TOKEN_TYPES } from "./tokenizeValue";

const sanitizeUnconnectedOperators = (val) => {
  const regex = /^([+ -]*)([^+-]*)$/;
  const matches = val.match(regex);
  let sign = "";
  let resultVal = val;

  if (matches && matches[1] && matches[2]) {
    // index is start of non sign part
    const signs = `${matches[1]}1`;

    sign = parseInt(signs) < 0 ? "-" : "";

    resultVal = `${sign}${matches[2]}`;
  }

  return resultVal;
};

const checkAcceptValues = (item, acceptedValues = []) => {
  // Simply check raw values, improve later
  let result = false;

  if (item) {
    result = acceptedValues.some((acceptedValue) => {
      // regex or string
      const testValue = parseToRegexOrString(acceptedValue);

      return (
        (testValue.test &&
          testValue.test(sanitizeUnconnectedOperators(item.raw))) ||
        testValue === item.raw
      );
    });
  }

  return result;
};

const unquoteIfNeeded = (val) => {
  if (typeof val === "string") {
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      return val.substring(1, val.length - 1);
    }
  }

  return val;
};

const preProcessToken = (variable, knownVariables) => {
  const regex = /#{([$\w-]*)}/g;
  const replacements = [];
  let result = variable;
  let match;

  // for (const match of regex.exec(variable).matchAll(regex)) {
  while ((match = regex.exec(variable)) !== null) {
    // node 10 does not support matchAll
    const replacement = knownVariables[match[1]];

    if (replacement) {
      replacements.push({
        index: match.index,
        match: match[0],
        replacement: unquoteIfNeeded(replacement.raw),
      });
    } else {
      replacements.push({
        index: match.index,
        match: match[0],
        replacement: match[1],
      });
    }
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const replacement = replacements[i];

    const lastIndex = result.lastIndexOf(replacement.match);

    result =
      result.substr(0, lastIndex) +
      replacement.replacement +
      result.substr(lastIndex + replacement.match.length);
  }

  result = normalizeVariableName(result);

  while (knownVariables[result]) {
    result = normalizeVariableName(knownVariables[result].raw);
  }

  return result;
};

const checkTokens = function (variable, ruleInfo, knownVariables) {
  const result = { accepted: false, done: false };

  // cope with variables wrapped in #{}
  const _variable = preProcessToken(variable, knownVariables);

  for (const tokenSet of ruleInfo.tokens) {
    const tokenSpecs = tokenSet.values;

    if (tokenSpecs.includes(_variable)) {
      result.source = tokenSet.source;
      result.accepted = tokenSet.accept;
      result.done = true; // all tests completed
      break;
    }
  }

  return result;
};

const checkProportionalMath = (mathItems, ruleInfo, knownVariables) => {
  let otherItem;

  if (
    mathItems[0].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[0].units) > -1
  ) {
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[2].units) > -1
  ) {
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["+", "-"].indexOf(mathItems[1].value) > -1) {
      // is plus or minus
      return checkTokens(otherItem.raw, ruleInfo, knownVariables);
    }
  }

  return {};
};

const checkNegation = (mathItems, ruleInfo, knownVariables) => {
  let otherItem;
  let numeric;

  if (
    mathItems[0].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[0].units === ""
  ) {
    numeric = mathItems[0];
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[2].units === ""
  ) {
    numeric = mathItems[2];
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["*", "/"].indexOf(mathItems[1].value) > -1 && numeric.raw === "-1") {
      // is times or divide by -1
      return checkTokens(otherItem.raw, ruleInfo, knownVariables);
    }
  }

  return {};
};

const testItemInner = function (item, ruleInfo, options, knownVariables) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  const result = {
    accepted: false,
    done: false,
  };

  if (item === undefined) {
    // do not accept undefined
    result.done = true;

    return result;
  }

  if (checkAcceptValues(item, options.acceptValues)) {
    // value matches one of the acceptValues
    result.accepted = true;
    result.done = true;

    return result;
  }

  // cope with css variables
  const _item =
    item.type === TOKEN_TYPES.FUNCTION && item.value === "var"
      ? item.items[0]
      : item;

  if (_item.type === TOKEN_TYPES.FUNCTION) {
    for (const funcSet of ruleInfo.functions) {
      const funcSpecs = funcSet.values;

      const matchesFuncSpec = funcSpecs.some((funcSpec) => {
        const parts = funcSpec.split("(");

        if (parts.length === 1) {
          // no parameter checks
          return parts[0] === _item.value;
        } else {
          // check parameters
          if (parts[0] === _item.value) {
            // a function will contain an items array that is either a LIST or not
            // IF TRUE a list then _item.items[0] === list which contains LIST_ITEMS in which case LIST_ITEMS.items is what we are interested in
            // IF FALSE a list contains values which could include math or brackets or function calls
            // NOTE: we do not try to deal with function calls inside function calls

            const inList = !!(
              _item.items && _item.items[0].type === TOKEN_TYPES.LIST
            );
            const paramItems = inList
              ? _item.items[0].items // List[0] contains list items
              : _item.items; // otherwise contains Tokens

            let [start, end] = parts[1]
              .substring(0, parts[1].length - 1)
              .split(" ");

            start = parseRangeValue(start, paramItems.length);
            end = parseRangeValue(end, paramItems.length) || start; // start if end empty

            for (let pos = start; pos <= end; pos++) {
              // check each param to see if it is acceptable

              if (!paramItems[pos]) {
                break; // ignore parts after undefined
              }

              // raw value of list and non-list item does allow for math
              let tokenResult = {};

              if (_item.isCalc && paramItems[pos].type === TOKEN_TYPES.MATH) {
                // allow proportional + or - checkTokens
                const mathItems = paramItems[pos].items;

                tokenResult = checkProportionalMath(
                  mathItems,
                  ruleInfo,
                  knownVariables
                );

                if (!tokenResult.accepted) {
                  tokenResult = checkNegation(
                    mathItems,
                    ruleInfo,
                    knownVariables
                  );
                }
              } else {
                tokenResult.accepted = checkAcceptValues(
                  paramItems[pos],
                  options.acceptValues
                );

                if (!tokenResult.accepted) {
                  tokenResult = checkTokens(
                    paramItems[pos].raw,
                    ruleInfo,
                    knownVariables
                  );
                }
              }

              if (!tokenResult.accepted) {
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
  } else if (item.type === TOKEN_TYPES.MATH) {
    const tokenResult = checkNegation(item.items, ruleInfo, knownVariables);

    result.source = tokenResult.source;
    result.accepted = tokenResult.accepted;
    result.done = tokenResult.done;
  } else {
    // test what ever is left over
    const tokenResult = checkTokens(_item.value, ruleInfo, knownVariables);

    result.source = tokenResult.source;
    result.accepted = tokenResult.accepted;
    result.done = tokenResult.done;
  }

  // if (
  //   !result.accepted &&
  //   item &&
  //   (item.startsWith("carbon--mini-units") ||
  //     item.startsWith("get-light-item"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     item,
  //     matches,
  //     matches && matches[matchFunction],
  //     matches && matches[matchFunction].length > 0,
  //     regexFuncAndItem
  //   );
  // }

  result.isCalc = _item.isCalc;

  return result;
};

export default function testItem(item, ruleInfo, options, knownVariables) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  let result = {};

  //   // eslint-disable-next-line no-console
  // console.log(JSON.stringify(item));

  if (item === undefined) {
    // do not accept undefined
    result.done = true;

    return result;
  }

  result = testItemInner(item, ruleInfo, options, knownVariables);

  result.isVariable = isVariable(item); // causes different result message

  if (!result.done && result.isVariable && options.acceptUndefinedVariables) {
    result.accepted = true;
  }

  result.variableItem = testItem; // last testItem found

  // if (result.isCalc) {
  //   // eslint-disable-next-line
  //   console.log("We have calc", item.raw);
  // }

  return result;
}
