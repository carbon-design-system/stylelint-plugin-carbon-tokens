// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { isValidOption, namespace, parseOptions, checkRule } from "../../utils";
import { getLayoutInfo } from "./utils";

export const ruleName = namespace("layout-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon layout token, mixin or function for "${property}" found "${value}".`,
  rejectedUndefinedRange: (property, value, range) =>
    `Expected carbon layout token, mixin or function for "${property}" found "${value}" in position(s) "${range}".`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon layout token, mixin or function to be set for variable "${variable}" used by "${property}" found "${value}".`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard layout properites
  includeProps: [
    "/^margin$/<1 4>",
    "/^margin-/",
    "/^padding$/<1 4>",
    "/^padding-/",
    "left",
    "top",
    "bottom",
    "right",
    // the following are not really layout or spacing
    // "height",
    // "width",
    // "/^border$/<1 -2>",
    // "/^border-/",
    // "/^box-shadow$/<1 -2>",
  ],
  // ignore transparent, common reset values, 0, proportioanl values,
  ignoreValues: ["/inherit|initial/", "/^0[a-z]*$/", "/^[0-9]*(%|vw|vh)$/"],
  acceptUndefinedVariables: true,
  acceptContainerTokens: false,
  acceptIconSizeTokens: false,
  acceptFluidSpacingTokens: false,
  acceptCarbonMiniUnitsFunction: false,
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
          acceptContainerTokens: (val) =>
            val === undefined || typeof val === "boolean",
          acceptIconSizeTokens: (val) =>
            val === undefined || typeof val === "boolean",
          acceptFluidSpacingTokens: (val) =>
            val === undefined || typeof val === "boolean",
          acceptCarbonMiniUnitsFunction: (val) =>
            val === undefined || typeof val === "boolean",
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    checkRule(root, result, ruleName, options, messages, getLayoutInfo);
  };
}
