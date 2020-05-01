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
  // console.dir(defaults);

  optsOut.includeProps = parseAddDefaults(
    (options && options.includeProps) || [],
    defaults.includeProps
  );
  optsOut.ignoreValues = parseAddDefaults(
    (options && options.ignoreValues) || [],
    defaults.ignoreValues
  );

  optsOut.acceptCarbonColorTokens =
    (options && options.acceptCarbonColorTokens) ||
    defaults.acceptCarbonColorTokens;
  optsOut.acceptIBMColorTokens =
    (options && options.acceptIBMColorTokens) || defaults.acceptIBMColorTokens;

  // // eslint-disable-next-line
  // console.dir(optsOut);

  return optsOut;
}
