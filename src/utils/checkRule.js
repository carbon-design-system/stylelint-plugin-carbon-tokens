/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  TOKEN_TYPES,
  checkProp,
  declarationValueIndex,
  isVariable,
  normalizeVariableName,
  parseRangeValue,
  testItem,
  tokenizeValue
} from "./";
import { utils } from "stylelint";
// import valueParser from "postcss-value-parser";

export default async function checkRule(
  root,
  result,
  ruleName,
  options,
  messages,
  getRuleInfo,
  context
) {
  const checkItem = (decl, item, propSpec, ruleInfo, knownVariables) => {
    // Expects to be passed an item containing either a token { raw, type, value} or
    // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }

    const testResult = testItem(item, ruleInfo, options, knownVariables);
    let message;

    if (!testResult.accepted) {
      if (item === undefined) {
        message = messages.rejectedUndefinedRange(
          decl.prop,
          item,
          propSpec.range
        );
      } else if (testResult.isCalc) {
        message = messages.rejectedMaths(decl.prop, item.raw);
      } else if (decl.prop === "transition") {
        message = messages.rejectedTransition(decl.prop, item.raw);
      } else if (decl.prop === "animation") {
        message = messages.rejectedAnimation(decl.prop, item.raw);
      } else if (testResult.isVariable) {
        message = messages.rejectedVariable(
          decl.prop,
          item.raw,
          testResult.variableValue === undefined
            ? "an unknown, undefined or unrecognized value"
            : testResult.variableValue
        );
      } else {
        message = messages.rejected(decl.prop, decl.value);
      }

      // adjust position for multipart value
      const offsetValue = item !== undefined ? decl.value.indexOf(item.raw) : 0;

      return {
        ruleName,
        result,
        message,
        index: declarationValueIndex(decl) + offsetValue,
        node: decl
      };
    }

    return null;
  };

  const specialItems = ["inherit", "initial", "none", "unset"];

  const checkItems = (items, decl, propSpec, ruleInfo, knownVariables) => {
    // expects to be passed an items array containing tokens
    let itemsToCheck;
    const isRange = propSpec.range !== undefined;
    const reports = [];

    if (
      !isRange ||
      (items.length === 1 && specialItems.includes(items[0].value))
    ) {
      // check all items in list
      itemsToCheck = items;
    } else if (isRange) {
      // for the range select only the values to check
      // 1 = first value, -1 = last value
      let [start, end] = propSpec.range.split(" ");

      itemsToCheck = [];

      start = parseRangeValue(start, items.length);
      end = parseRangeValue(end, items.length);

      if (end) {
        itemsToCheck.push(...items.slice(start, end + 1)); // +1 as slice end is not inclusive
      } else {
        itemsToCheck.push(items[start]);
      }
    }

    // look at propSpec.valueCheck
    if (propSpec.valueCheck) {
      itemsToCheck = itemsToCheck.filter((item) => {
        if (typeof propSpec.valueCheck === "object") {
          return propSpec.valueCheck.test(item.raw);
        }

        return propSpec.valueCheck === item.raw;
      });
    }

    for (const item of itemsToCheck) {
      const report = checkItem(decl, item, propSpec, ruleInfo, knownVariables);

      if (report) {
        // contains report
        reports.push(report);
      }
    }

    return reports;
  };

  const knownVariables = {}; // used to contain variable declarations

  await root.walkDecls(async (decl) => {
    const tokenizedValue = tokenizeValue(decl.value);

    if (tokenizedValue && tokenizedValue.error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Unexpected syntax in decl: ${JSON.stringify(
          decl
        )}. \n\n HELP. If you see this message PLEASE copy the contents of the message above and raise a github issue. Thankyou in advance for helping us to improve the tool.`
      );
    } else if (tokenizedValue && tokenizedValue.warning) {
      // eslint-disable-next-line no-console
      console.warn(tokenizedValue.warning);
    } else {
      if (isVariable(decl.prop)) {
        const newKeys = [normalizeVariableName(decl.prop)];

        // In some decl.prop may contain an existing known value
        // Store the value as an additional key
        Object.keys(knownVariables).forEach((key) => {
          const interpolatedKey = `#{${key}}`;

          if (decl.prop.indexOf(key) !== -1) {
            newKeys.push(
              decl.prop.replace(interpolatedKey, knownVariables[key].value)
            );
          }
        });

        newKeys.forEach((key) => {
          // add to variable declarations
          // expects all variables to appear before use
          // expects all variables to be simple (not map or list)
          knownVariables[normalizeVariableName(key)] = tokenizedValue.items[0];
        });
      }

      // read the prop spec
      const propSpec = checkProp(decl.prop, options.includeProps);

      if (propSpec) {
        // is supported prop
        // Some color properties have
        // variable parameters lists where color is not at a fixed position

        const ruleInfo = await getRuleInfo(options);
        const itemsToCheck =
          tokenizeValue.type === TOKEN_TYPES.LIST
            ? tokenizedValue.items
            : [tokenizedValue];

        const reports = [];

        for (const itemToCheck of itemsToCheck) {
          const newReports = checkItems(
            itemToCheck.items,
            decl,
            propSpec,
            ruleInfo,
            knownVariables
          );

          if (newReports?.length > 0) {
            reports.push(...newReports);
          }
        }

        if (reports.length > 0) {
          let fixed = false;

          if (context && context.fix && ruleInfo.fixes) {
            let workingValue = decl.value;

            // try to fix
            ruleInfo.fixes.forEach((fix) => {
              if (typeof fix.replacement === "function") {
                workingValue = fix.replacement(workingValue, fix.target);
              } else {
                workingValue = workingValue.replaceAll(
                  fix.target,
                  fix.replacement
                );
              }
            });

            const reportsFix = [];

            if (workingValue !== decl.value) {
              // test new value
              const tokenizedValueFix = tokenizeValue(workingValue);
              const itemsToCheckFix =
                tokenizedValueFix.type === TOKEN_TYPES.LIST
                  ? tokenizedValueFix.items
                  : [tokenizedValueFix];

              for (const itemToCheckFix of itemsToCheckFix) {
                const newReports = checkItems(
                  itemToCheckFix.items,
                  decl,
                  propSpec,
                  ruleInfo,
                  knownVariables
                );

                if (newReports?.length > 0) {
                  // use original reports
                  reportsFix.push(...newReports);
                }
              }
            }

            if (reportsFix.length === 0) {
              fixed = true;
              decl.value = workingValue;
            }
          }

          if (!fixed) {
            // always report original warnings not those based on fix
            reports.forEach((report) => {
              utils.report(report);
            });
          }
        }
      }
    }
  });
}
