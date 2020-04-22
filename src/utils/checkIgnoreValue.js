import parseToRegexOrString from "./parseToRegexOrString";

/* istanbul ignore next */
export default function checkIgnoreValue(value, ignoredValues = []) {
  return ignoredValues.some((ignoredValue) => {
    // regex or string
    const testValue = parseToRegexOrString(ignoredValue);

    return (testValue.test && testValue.test(value)) || testValue === value;
  });
}
