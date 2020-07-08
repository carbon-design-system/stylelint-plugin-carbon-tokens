import parseToRegexOrString from "./parseToRegexOrString";

/* istanbul ignore next */
export default function checkIgnoreValue(value, ignoredValues = []) {
  const result = ignoredValues.some((ignoredValue) => {
    // regex or string
    const testValue = parseToRegexOrString(ignoredValue);

    return (testValue.test && testValue.test(value)) || testValue === value;
  });

  // if (!result && value.startsWith("$")) {
  //   // eslint-disable-next-line
  //   console.log(result, value, ignoredValues);
  // }

  return result;
}
