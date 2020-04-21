export default function checkIgnoreValue(value, ignoredValues = []) {
  return ignoredValues.some((ingnoredValue) => {
    // regex or string
    return (
      (ingnoredValue.test && ingnoredValue.test(value)) ||
      ingnoredValue === value
    );
  });
}
