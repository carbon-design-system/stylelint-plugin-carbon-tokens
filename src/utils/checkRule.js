import { utils } from "stylelint";
import {
  declarationValueIndex,
  checkProp,
  isVariable,
  checkIgnoreValue,
  normaliseVariableName,
  splitValueList,
} from "./";

const variables = {}; // used to contain variable declarations

export default function checkRule(
  root,
  result,
  ruleName,
  options,
  messages,
  checkMethod
) {
  root.walkDecls((decl) => {
    if (isVariable(decl.prop)) {
      // add to variable declarations
      // expects all variables to appear before use
      // expects all variables to be simple (not map or list)
      variables[normaliseVariableName(decl.prop)] = decl.value;
    }

    const propSpec = checkProp(decl.prop, options.includeProps);

    if (propSpec) {
      // is supported prop
      // Some color properties have
      // variable parameter lists where color can be optional
      // variable parameters lists where color is not at a fixed position
      // split using , and propSpec
      const values = splitValueList(decl.value, propSpec);

      for (const value of values) {
        if (!checkIgnoreValue(value, options.ignoreValues)) {
          if (
            !checkMethod(
              value,
              options.acceptCarbonColorTokens,
              options.acceptIBMColorTokens
            )
          ) {
            // not a carbon theme token
            if (isVariable(value)) {
              // a variable that could be carbon theme token
              const variableValue = variables[value];

              if (
                !checkMethod(
                  variableValue,
                  options.acceptCarbonColorTokens,
                  options.acceptIBMColorTokens
                )
              ) {
                // a variable that does not refer to a carbon color token
                utils.report({
                  ruleName,
                  result,
                  message: messages.rejectedVariable(
                    decl.prop,
                    value,
                    variableValue
                  ),
                  index: declarationValueIndex(decl),
                  node: decl,
                });
              }
            } else {
              // not a variable or a carbon theme token
              utils.report({
                ruleName,
                result,
                message: messages.rejected(decl.prop, decl.value),
                index: declarationValueIndex(decl),
                node: decl,
              });
            }
          }
        }
      }
    }
  });
}
