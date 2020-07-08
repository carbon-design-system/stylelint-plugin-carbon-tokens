const parseAddDefaults = (options, defaults) => {
  const output = options ? options.filter((option) => option.length > 0) : [];
  let addDefaults = false;

  if (output.length === 0) {
    addDefaults = true;
  } else {
    const index = output.findIndex((item) => item === "*");

    if (index >= 0) {
      addDefaults = true;
      output.splice(index, 1);
    }
  }

  if (addDefaults) {
    const filteredDefaults = defaults.filter((def) => !output.includes(def));

    return output.concat(filteredDefaults);
  }

  return output;
};

export default function parseOptions(options, defaults) {
  const optsOut = {};

  // // eslint-disable-next-line
  // console.log(options);

  // NOTE expects type of options to match default options

  for (const prop of Object.keys(defaults)) {
    if (Array.isArray(defaults[prop])) {
      optsOut[prop] = parseAddDefaults(
        (options && options[prop]) || [],
        defaults[prop]
      );
    } else {
      optsOut[prop] = (options && options[prop]) || defaults[prop];
    }
  }

  // // eslint-disable-next-line
  // console.dir(optsOut);

  return optsOut;
}
