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
  checkValue,
  normaliseVariableName,
} from "../../utils";
import splitValueList from "../../utils/splitValueList";

export const ruleName = namespace("theme-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon token for "${property}" found "${value}.`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon token to be set for variable "${variable}" used by "${property}" found "${value}.`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;
const variables = {}; // used to contain variable declarations

const defaultOptions = {
  includeProps: ["/color/", "/shadow/", "border"],
  ignoreValues: ["/transparent|inherit|initial/"],
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

    // list of variables that may need checking during walk
    // const declVariables = [];
    // root.walkDecls(decl => {
    //   // record variable for check later with $ or --
    //   if (isVariable(decl.prop)) {
    //     declVariables.push(decl);
    //   }
    // });

    root.walkDecls((decl) => {
      if (isVariable(decl.prop)) {
        // add to variable declarations
        // expects all variables to appear before use
        // expects all variables to be simple (not map or list)

        variables[normaliseVariableName(decl.prop)] = decl.value;
      } else if (checkProp(decl.prop, options.includeProps)) {
        // is supported prop
        // Some color properties have
        // variable parameter lists where color can be optional
        // variable parameters lists where color is not at a fixed position

        const values = splitValueList(decl.value);

        for (const value of values) {
          if (!checkIgnoreValue(value, options.ignoreValues)) {
            if (!checkValue(value)) {
              // not a carbon theme token
              if (isVariable(value)) {
                // a variable that could be carbon theme token
                const variableValue = variables[value];

                if (!checkValue(variableValue)) {
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
                  // // eslint-disable-next-line
                  // console.log(
                  //   messages.rejectedVariable(decl.prop, value, variableValue)
                  // );
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

      // postcss provides valueParse which we could use
      // valueParser(decl.value).walk(node => {
      // });
      // }
    });
  };
}
