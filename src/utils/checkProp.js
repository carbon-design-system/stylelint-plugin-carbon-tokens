export default function checkProp(prop2Check, includedProps) {
  return includedProps.some((includedProp) => {
    // regex or string
    return (
      (includedProp.test && includedProp.test(prop2Check)) ||
      includedProp === prop2Check
    );
  });
}
