import parseToRegexOrString from "./parseToRegexOrString";

export default function checkProp(prop2Check, includedProps) {
  return includedProps.some((includedProp) => {
    // regex or string
    const testProp = parseToRegexOrString(includedProp);

    return (
      (testProp.test && testProp.test(prop2Check)) || testProp === prop2Check
    );
  });
}
