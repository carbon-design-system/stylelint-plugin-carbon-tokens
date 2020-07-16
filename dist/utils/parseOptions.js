"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = parseOptions;

var parseAddDefaults = function parseAddDefaults(options, defaults) {
  var output = options
    ? options.filter(function (option) {
        return option.length > 0;
      })
    : [];
  var addDefaults = false;

  if (output.length === 0) {
    addDefaults = true;
  } else {
    var index = output.findIndex(function (item) {
      return item === "*";
    });

    if (index >= 0) {
      addDefaults = true;
      output.splice(index, 1);
    }
  }

  if (addDefaults) {
    var filteredDefaults = defaults.filter(function (def) {
      return !output.includes(def);
    });
    return output.concat(filteredDefaults);
  }

  return output;
};

function parseOptions(options, defaults) {
  var optsOut = {}; // // eslint-disable-next-line
  // console.log(options);
  // NOTE expects type of options to match default options

  for (
    var _i = 0, _Object$keys = Object.keys(defaults);
    _i < _Object$keys.length;
    _i++
  ) {
    var prop = _Object$keys[_i];

    if (Array.isArray(defaults[prop])) {
      optsOut[prop] = parseAddDefaults(
        (options && options[prop]) || [],
        defaults[prop]
      );
    } else {
      if (options && options[prop] !== undefined) {
        optsOut[prop] = options[prop];
      } else {
        optsOut[prop] = defaults[prop];
      }
    }
  } // // eslint-disable-next-line
  // console.dir(optsOut);

  return optsOut;
}
