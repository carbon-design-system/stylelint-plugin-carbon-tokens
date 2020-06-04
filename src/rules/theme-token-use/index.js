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
import { checkThemeValue } from "./utils";
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
  // include standard color properites
  includeProps: ["/color$/", "/shadow$/<-1>", "border<-1>", "outline<-1>"],
  // ignore transparent, common reset values and 0 on its own
  ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokens: false,
};

export default function rule(primaryOptions, secondaryOptions) {
  const options = parseOptions(secondaryOptions, defaultOptions);

  return (root, result) => {
    // // eslint-disable-next-line
    // console.log(typeof options.acceptCarbonColorTokens);

    // // eslint-disable-next-line
    // console.log(typeof options.acceptIBMColorTokens);

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
          acceptCarbonColorTokens: (val) =>
            val === undefined || typeof val === "boolean",
          acceptIBMColorTokens: (val) =>
            val === undefined || typeof val === "boolean",
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
              !checkThemeValue(
                value,
                options.acceptCarbonColorTokens,
                options.acceptIBMColorTokens
              )
            ) {
              // // eslint-disable-next-line
              // console.log(value);

              // // eslint-disable-next-line
              // console.dir(options);

              // not a carbon theme token
              if (isVariable(value)) {
                // a variable that could be carbon theme token
                const variableValue = variables[value];

                if (
                  !checkThemeValue(
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
