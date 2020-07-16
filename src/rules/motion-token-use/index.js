// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { isValidOption, namespace, parseOptions, checkRule } from "../../utils";
import { getMotionInfo } from "./utils";

export const ruleName = namespace("motion-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon motion token or function for "${property}" found "${value}.`,
  rejectUndefinedRange: (property, value, range) =>
    `Expected carbon motion token or function for "${property}" found "${value} in position(s) "${range}".`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon motion token or function to be set for variable "${variable}" used by "${property}" found "${value}.`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard color properites
  // "/^border$/<1 -2>", // Borders and shadows are often 1px
  // "/^border-/",
  // "/^box-shadow$/<1 -2>",
  includeProps: [
    "transition<2>", // preferred definition order fails otherwise
    "transition-duration",
    "animation<2>", // preferred definition order fails otherwise
    "animation-duration",
  ],
  // ignore transparent, common reset values, 0, proportioanl values,
  ignoreValues: ["/inherit|initial/"],
  acceptUndefinedVariables: true,
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
          acceptUndefinedVariables: (val) =>
            val === undefined || typeof val === "boolean",
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    checkRule(root, result, ruleName, options, messages, getMotionInfo);
  };
}
