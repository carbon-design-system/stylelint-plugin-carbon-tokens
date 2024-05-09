/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const parseAddDefaults = (options, defaults) => {
  // remove empty strings
  let output = options ? options.filter((option) => option.length > 0) : [];
  let addDefaults = false;

  // put aside excludes
  const excludes = [];
  for (let i = output.length - 1; i >= 0; i--) {
    if (output[i].startsWith('!')) {
      excludes.push(output[i].substring(1));
      output.splice(i, 1);
    }
  }

  if (output.length === 0) {
    addDefaults = true;
  } else {
    const index = output.findIndex((item) => item === '*');

    if (index >= 0) {
      addDefaults = true;
      output.splice(index, 1);
    }
  }

  if (addDefaults) {
    const filteredDefaults = defaults.filter((def) => !output.includes(def));

    output = output.concat(filteredDefaults);
  }

  // process excludes and return
  if (excludes.length) {
    output = output.filter((opt) => !excludes.includes(opt));
  }

  return output;
};

export default function parseOptions(options, defaults) {
  const optsOut = {};

  // NOTE expects type of options to match default options

  for (const prop of Object.keys(defaults)) {
    if (Array.isArray(defaults[prop])) {
      optsOut[prop] = parseAddDefaults(
        (options && options[prop]) || [],
        defaults[prop]
      );
    } else if (options && options[prop] !== undefined) {
      optsOut[prop] = options[prop];
    } else {
      optsOut[prop] = defaults[prop];
    }
  }

  return optsOut;
}
