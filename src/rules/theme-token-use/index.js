// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import {
  declarationValueIndex,
  checkProp,
  isValidOption,
  // isVariable,
  namespace,
  // parseOptions,
  checkIgnoreValue,
  checkValue,
} from "../../utils";
import splitValueList from "../../utils/splitValueList";

export const ruleName = namespace("theme-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon token for "${property}" found "${value}.`,
});

// const defaultOptions = {
//   includedProps: ["/color/", "/shadow/", "border"],
//   ignoreValues: ["/transparent|inherit|initial/"]
// };

export default function rule(expectation, options) {
  // eslint-disable-next-line no-console
  console.dir(expectation);
  // eslint-disable-next-line no-console
  console.dir(options);

  return (root, result) => {
    // const options = parseOptions(primary, defaultOptions);

    // if (options.errors) {
    //   for (const error of options.errors) {
    //     // // eslint-disable-next-line no-console
    //     // console.error(error);

    //     utils.report({
    //       result: {
    //         message: error,
    //         stylelintType: "invalidOption"
    //       }
    //     });
    //     // utils.report({ ruleName, message: error });
    //   }

    //   return;
    // }

    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always", "never"],
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidOption],
          ignoreValues: [isValidOption],
        },
        optional: true,
      }
    );

    if (!validOptions) {
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
      // check supported prop
      if (checkProp(decl.prop, options.includedProps)) {
        // Some color properties have
        // variable parameter lists where color can be optional
        // variable parameters lists where color is not at a fixed position

        const values = splitValueList(decl.value);

        for (const value of values) {
          if (!checkIgnoreValue(value, options.ignoreValues)) {
            if (!checkValue(value)) {
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

      // postcss provides valueParse which we could use
      // valueParser(decl.value).walk(node => {
      // });
      // }
    });
  };
}
