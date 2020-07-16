import { utils } from "stylelint";
import {
  declarationValueIndex,
  checkProp,
  isVariable,
  checkIgnoreValue,
  normaliseVariableName,
  splitValueList,
  testValue,
} from "./";

export default function checkRule(
  root,
  result,
  ruleName,
  options,
  messages,
  getRuleInfo
) {
  const variables = {}; // used to contain variable declarations

  root.walkDecls((decl) => {
    if (isVariable(decl.prop)) {
      // add to variable declarations
      // expects all variables to appear before use
      // expects all variables to be simple (not map or list)
      variables[normaliseVariableName(decl.prop)] = decl.value;
    }

    // read the prop spec
    const propSpec = checkProp(decl.prop, options.includeProps);

    if (propSpec) {
      // is supported prop
      // Some color properties have
      // variable parameter lists where color can be optional
      // variable parameters lists where color is not at a fixed position
      // split using , and propSpec
      const values = splitValueList(decl.value, propSpec.range);
      const ruleInfo = getRuleInfo(options);

      // // eslint-disable-next-line
      // console.dir({ propSpec, decl, values });

      for (const value of values) {
        // Ignore values specified by ignoreValues
        if (!checkIgnoreValue(value, options.ignoreValues)) {
          // // eslint-disable-next-line
          // console.log("The value is", value);

          const testResult = testValue(value, ruleInfo, options, variables);
          let message;

          // if (90 < parseInt(value, 10)) {
          //   // eslint-disable-next-line
          //   console.dir({ testResult, value });
          // }

          if (!testResult.accepted) {
            if (value === undefined) {
              message = messages.rejected(
                decl.prop,
                decl.value,
                propSpec.range
              );
            } else if (testResult.isVariable) {
              message = messages.rejectedVariable(
                decl.prop,
                value,
                testResult.variableValue
              );
            } else {
              // // eslint-disable-next-line
              // console.log("Wibble", decl.prop, decl.value);

              message = messages.rejected(decl.prop, decl.value);
            }

            utils.report({
              ruleName,
              result,
              message,
              index: declarationValueIndex(decl),
              node: decl,
            });
          }
        }
      }
    }
  });
}
