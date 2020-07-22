"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var _ = _interopRequireWildcard(require(".."));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

var generatedTests = function generatedTests() {
  var accept = [];
  var reject = [];
  var props = ["margin"];
  var good = [
    "$spacing-01",
    "$layout-01",
    "-$spacing-01",
    "-$layout-01",
    "$carbon--spacing-01",
    "$carbon--layout-01",
    "100%",
    "50%",
    "100vw",
    "50vw",
    "100vh",
    "50vh",
    "0xxx",
    "$my-value-accept",
    "var(--my-value-accept)",
  ];
  var bad = [
    "$container-01", // only bad for default options
    "$fluid-spacing-01",
    "$icon-size-01",
    "$carbon--container-01",
    "$carbon--fluid-spacing-01",
    "$carbon--icon-size-01",
    "199px",
    "299px",
    "399px",
    "499px",
    "$my-value-reject",
    "var(--my-value-reject)",
  ];

  for (var _i = 0, _props = props; _i < _props.length; _i++) {
    var prop = _props[_i];

    for (var g = 0; g < good.length - 4; g++) {
      // good tokens
      for (var n = 1; n < 5; n++) {
        // number of values
        accept.push({
          code: ".foo { "
            .concat(prop, ": ")
            .concat(good.slice(g, g + n), "; }"),
          description: "A "
            .concat(prop, " using ")
            .concat(n, " token(s) is accepted"),
        });
      }
    }

    for (var b = 0; b < bad.length - 4; b++) {
      // bad tokens
      for (var _n = 1; _n < 5; _n++) {
        // number of values
        reject.push({
          code: ".foo { "
            .concat(prop, ": ")
            .concat(bad.slice(b, b + _n), "; }"),
          description: "A "
            .concat(prop, " using ")
            .concat(_n, " non-token(s) is rejected"),
        });
      }
    }
  } // // eslint-disable-next-line
  // console.dir(reject);

  var moreProps = ["left", "top", "bottom", "right"];

  for (var _i2 = 0, _moreProps = moreProps; _i2 < _moreProps.length; _i2++) {
    var _prop = _moreProps[_i2];
    accept.push({
      code: ".foo { ".concat(_prop, ": ").concat(good[0], "; }"),
      description: "A ".concat(_prop, " using a token is accepted."),
    });
    reject.push({
      code: ".foo { ".concat(_prop, ": ").concat(bad[0], "; }"),
      description: "A ".concat(_prop, " using a non-token is rejected."),
    });
  }

  return {
    accept: accept,
    reject: reject,
  };
};

var theGeneratedTests = generatedTests();
testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
    },
  ],
  syntax: "scss",
  accept: theGeneratedTests.accept,
  reject: theGeneratedTests.reject,
}); // testConfig(rule, {
//   ruleName,
//   description: "Check for invalid ignore values",
//   message: messages.expected,
//   config: ["always", { ignoreValues: ["/wibble/"] }],
// });
// "$container-01", // only bad for default options
// "$fluid-spacing-01",
// "$icon-size-01",
// "$carbon--container-01",
// "$carbon--fluid-spacing-01",
// "$carbon--icon-size-01",

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptContainerTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { left: $carbon--container-01; }",
      description:
        "Accept $carbon--container tokens with acceptContainerTokens: true.",
    },
    {
      code: ".foo { left: $container-01; }",
      description: "Accept $container tokens with acceptContainerTokens: true.",
    },
  ],
  reject: [],
});
testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptIconSizeTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { left: $carbon--icon-size-01; }",
      description:
        "Accept $carbon--icon-size tokens with acceptIconSizeTokens: true.",
    },
    {
      code: ".foo { left: $icon-size-01; }",
      description: "Accept $icon-size tokens with acceptIconSizeTokens: true.",
    },
  ],
  reject: [],
});
testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptFluidSpacingTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { left: $carbon--fluid-spacing-01; }",
      description:
        "Accept $carbon--fluid-spacing tokens with acceptFluidSpacingTokens: true.",
    },
    {
      code: ".foo { left: $fluid-spacing-01; }",
      description:
        "Accept $fluid-spacing tokens with acceptFluidSpacingTokens: true.",
    },
  ],
  reject: [],
});
testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptCarbonMiniUnitsFunction: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { left: carbon--mini-units(4); }",
      description: "A left using a carbon--mini-units is accepted with option.",
    },
    {
      code: ".foo { left: mini-units(4); }",
      description: "A left using a mini-units is accepted with option.",
    },
  ],
});
testRule(_["default"], {
  ruleName: _.ruleName,
  config: true,
  syntax: "scss",
  reject: [
    {
      code: ".foo { left: carbon--mini-units(4); }",
      description:
        'A left using a carbon--mini-units is rejected without option "acceptCaronMiniUnitsFunction".',
    },
    {
      code: ".foo { left: mini-units(4); }",
      description:
        'A left using a mini-units is rejected without option "acceptCaronMiniUnitsFunction".',
    },
  ],
});
