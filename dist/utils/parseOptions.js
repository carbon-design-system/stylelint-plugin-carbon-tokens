// const parseRegex = (options) => {
//   const errors = [];
//   const optsOut = {};
//   for (const key of Object.keys(options)) {
//     const props = options[key];
//     // init output
//     optsOut[key] = [];
//     for (const prop of props) {
//       if (prop.startsWith("/")) {
//         if (prop.endsWith("/")) {
//           optsOut[key].push(RegExp(prop.slice(1, -1)));
//         } else {
//           optsOut[key].push(prop);
//           errors.push(
//             `The configuration option '${prop}' specified for '${key}' is invalid. String or regular expression expected.`
//           );
//         }
//       } else {
//         optsOut[key].push(prop);
//       }
//     }
//   }
//   if (errors.length > 0) {
//     optsOut.errors = errors;
//   }
//   return optsOut;
// };
// export default function parseOptions(options, defaults) {
//   const optsOut = parseRegex({
//     includedProps: options.includedProps || defaults.includedProps,
//     ignoreValues: options.ignoreValues || defaults.ignoreValues,
//   });
//   // standard options
//   optsOut.actual =
//     options.includedProps || options.ignoreValues
//       ? options.stylelintOptions
//       : options;
//   return optsOut;
// }
"use strict";
