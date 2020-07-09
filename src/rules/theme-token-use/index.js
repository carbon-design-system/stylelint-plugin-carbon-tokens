// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { isValidOption, namespace, parseOptions, checkRule } from "../../utils";
import { checkThemeValue } from "./utils";

export const ruleName = namespace("theme-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon theme token or function for "${property}" found "${value}.`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon theme token or function to be set for variable "${variable}" used by "${property}" found "${value}.`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard color properites
  includeProps: ["/color$/", "/shadow$/<-1>", "border<-1>", "outline<-1>"],
  // ignore transparent, common reset values and 0 on its own
  ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokens: false,
  acceptCarbonFunctions: true,
};

export default function rule(primaryOptions, secondaryOptions) {
  // // eslint-disable-next-line
  // console.log(primaryOptions, secondaryOptions);

  const options = parseOptions(secondaryOptions, defaultOptions);

  // eslint-disable-next-line
  console.log("after options parse");

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

    // eslint-disable-next-line
    console.log("valid options", validOptions);

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    // eslint-disable-next-line
    console.log("before we check the rule");

    checkRule(root, result, ruleName, options, messages, checkThemeValue);
  };
}
