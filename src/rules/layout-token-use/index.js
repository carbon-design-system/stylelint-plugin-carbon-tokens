// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import {
  declarationValueIndex,
  checkProp,
  isValidOption,
  isVariable,
  namespace,
  parseOptions,
  checkIgnoreValue,
  normaliseVariableName,
} from "../../utils";
import { checkLayoutValue } from "./utils";
import splitValueList from "../../utils/splitValueList";

export const ruleName = namespace("layout-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon layout token or function for "${property}" found "${value}.`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon layout token or function to be set for variable "${variable}" used by "${property}" found "${value}.`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;
const variables = {}; // used to contain variable declarations

const defaultOptions = {
  // include standard color properites
  includeProps: [
    "/^margin/<1 4>",
    "/^padding/<1 4>",
    "height",
    "width",
    "left",
    "top",
    "bottom",
    "right",
  ],
  // ignore transparent, common reset values, 0, proportioanl values,
  ignoreValues: ["/inherit|initial/", "/^0[a-z]*$/", "/^[0-9]*(%|vw|vh)$/"],
};

export default function rule(primaryOptions, secondaryOptions) {
  const options = parseOptions(secondaryOptions, defaultOptions);

  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOptions,
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidIncludeProps],
          ignoreValues: [isValidIgnoreValues],
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

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

        // // eslint-disable-next-line
        // console.log("post decl", decl.prop, decl.value);

        const values = splitValueList(decl.value, propSpec);

        for (const value of values) {
          if (!checkIgnoreValue(value, options.ignoreValues)) {
            // do not ignore value

            if (!checkLayoutValue(value)) {
              // // eslint-disable-next-line
              // console.log("do not ignore", value);

              // not a carbon layout token
              if (isVariable(value)) {
                // a variable that could be carbon layout token
                const variableValue = variables[value];

                // // eslint-disable-next-line
                // console.log(
                //   "decl.value",
                //   decl.value,
                //   "variableValue",
                //   variableValue
                // );

                if (!checkLayoutValue(variableValue)) {
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
                // // eslint-disable-next-line
                // console.log("decl.value", decl.value);

                // not a variable or a carbon layout token
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
  };
}
