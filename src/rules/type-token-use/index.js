// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { isValidOption, namespace, parseOptions, checkRule } from "../../utils";
import { getTypeInfo } from "./utils";

export const ruleName = namespace("type-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon type token, mixin or function for "${property}" found "${value}".`,
  rejectedUndefinedRange: (property, value, range) =>
    `Expected carbon type token, mixin or function for "${property}" found "${value}" in position(s) "${range}".`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon type token, mixin or function to be set for variable "${variable}" used by "${property}" found "${value}".`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard type properites
  includeProps: ["font", "/^font-*/", "line-height", "letterSpacing"],
  ignoreValues: ["/inherit|initial/"],
  acceptFontWeightFunction: false, // permit use of carbon--font-weight function
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
          acceptFontWeightFunction: (val) =>
            val === undefined || typeof val === "boolean",
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    checkRule(root, result, ruleName, options, messages, getTypeInfo);
  };
}
