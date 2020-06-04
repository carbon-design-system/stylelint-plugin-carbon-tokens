// import parseToRegexOrString from "./parseToRegexOrString";

// export default function checkProp(prop2Check, includedProps) {
//   let propSpec = false;
//   let result = false;

//   for (const includedProp of includedProps) {
//     // starts with / and has another /
//     // or does not start with /
//     // optionally folloed by <anything in angled brackets>

//     const checkRegex = /(([^</]*)|(\/[^/]*\/))(<([^>]*)>)*/;

//     const matches = checkRegex.exec(includedProp);

//     if (matches && matches[1]) {
//       propSpec = {
//         prop: matches[1],
//         range: matches[5], // 5 may be undefined
//       };

//       const testProp = parseToRegexOrString(propSpec.prop);

//       if (
//         (testProp.test && testProp.test(prop2Check)) ||
//         testProp === prop2Check
//       ) {
//         // return first result that matches

//         result = propSpec;
//         break;
//       }
//     }
//   }

//   return result;
// }
