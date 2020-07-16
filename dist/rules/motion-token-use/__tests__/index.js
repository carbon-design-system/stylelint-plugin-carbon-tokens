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

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [true],
  syntax: "scss",
  accept: [
    {
      code: ".foo { transition: width $duration--fast-01 linear ease-in; }",
      description: "Carbon motion token expected for transition.",
    },
    {
      code: ".foo { transition-duration: $duration--moderate-01; }",
      description: "Carbon motion token expected for transition duration.",
    },
    {
      code:
        ".foo { transition: width $duration--fast-01 linear ease-in, height $duration--moderate-01 ease-out; }",
      description: "Carbon motion token expected for split transitions.",
    },
    {
      code:
        "$my-value-accept: $duration--fast-01; .foo { transition-duration: $my-value-accept; }",
      description:
        "Accept $varaible declared before use with Carbon motion tokens.",
    },
    {
      code:
        "--my-value-accept: $duration--moderate-01; .foo { transition-duration: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon motion tokens.",
    },
    {
      code: ".foo { transition: all $my-value-accept; }",
      description: "Accept undeclared $variable by defaullt.",
    },
    {
      code: ".foo { transition: all var(--my-value-accept); }",
      description: "Accept undeclared --variable by default.",
    },
    {
      code: ".foo { animation: myAnim $duration--fast-01 linear ease-in; }",
      description: "Carbon motion token expected for animation.",
    },
    {
      code: ".foo { animation-duration: $duration--moderate-01; }",
      description: "Carbon motion token expected for animation duration.",
    },
    {
      code:
        "--my-value-accept: $duration--moderate-01; .foo { animation-duration: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon motion tokens.",
    },
    {
      code: ".foo { animation: myAnim $my-value-accept; }",
      description: "Accept undeclared $variable by defaullt.",
    },
    {
      code: ".foo { animation: myAnim var(--my-value-accept); }",
      description: "Accept undeclared --variable by default.",
    },
  ],
  reject: [
    {
      code: ".foo { transition: all 2s; }",
      description: "Used non-token duration.",
      message: _.messages.expected,
    },
    {
      code:
        ".foo { transition: width 99s linear ease-in, height $duration--fast-01 ease-out; }",
      description:
        "Used non-token in first split property not Carbon motion tokens.",
      message: _.messages.expected,
    },
    {
      code:
        ".foo { transition: width $duration--fast-01 linear ease-in, height 2s ease-out; }",
      description:
        "Used non-token in non-first split property not Carbon motion tokens.",
      message: _.messages.expected,
    },
  ],
}); // verify rejection of undeclared variables

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptUndefinedVariables: false,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code:
        "$my-value-accept: $duration--fast-01; .foo { transition-duration: $my-value-accept; }",
      description:
        "Accept $varaible declared before use with Carbon motion tokens.",
    },
    {
      code:
        "--my-value-accept: $duration--moderate-01; .foo { transition-duration: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon motion tokens.",
    },
  ],
  reject: [
    // an ibm motion token
    {
      code: ".foo { transition: all $my-value-reject; }",
      description:
        "Reject undeclared $variable for transittion when acceptUndefinedVariables is false.",
    },
    {
      code: ".foo { animation: myAnim $my-value-reject; }",
      description:
        "Reject undeclared $variable for animation when acceptUndefinedVariables is false.",
    },
    {
      code: ".foo { transition-duration: var(--my-value-reject); }",
      description:
        "Reject undeclared --variable for transition-duration when acceptUndefinedVariables is false.",
    },
    {
      code: ".foo { animation-duration: var(--my-value-reject); }",
      description:
        "Reject undeclared --variable for animation-duration when acceptUndefinedVariables is false.",
    },
  ],
}); // testConfig(rule, {
//   ruleName,
//   description: "Check for invalid ignore values",
//   message: messages.expected,
//   config: ["always", { ignoreValues: ["/wibble/"] }],
// });
