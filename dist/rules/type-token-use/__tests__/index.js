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
  accept: [],
  // there are not type tokens used directly
  reject: [
    {
      code: ".foo { font-style: italic; }",
      description: "Reject directly setting font-style",
      message: _.messages.expected,
    },
    {
      code: ".foo { font-variant: small-caps; }",
      description: "Reject directly setting font-weight",
      message: _.messages.expected,
    },
    {
      code: ".foo { font-weight: carbon--font-weight('light'); }",
      description:
        "Reject directly setting font-weight with carbon--font-weight function without option",
      message: _.messages.expected,
    },
    {
      code: ".foo { font-weight: 5px; }",
      description: "Reject directly setting font-weight",
      message: _.messages.expected,
    },
    {
      code: ".foo { font-size: 32px; }",
      description: "Reject directly setting font-size",
      message: _.messages.expected,
    },
    {
      code: ".foo { line-height: 32px; }",
      description: "Reject directly setting font-weight",
      message: _.messages.expected,
    },
    {
      code: '.foo { font-family: "Times New Roman", Times, serif; }',
      description: "Reject directly setting font-weight",
      message: _.messages.expected,
    },
  ],
});
testRule(_["default"], {
  ruleName: _.ruleName,
  config: [
    true,
    {
      acceptFontWeightFunction: true,
    },
  ],
  syntax: "scss",
  reject: [],
  // there are not type tokens used directly
  accept: [
    {
      code: ".foo { font-weight: carbon--font-weight('light'); }",
      description: "Used non-token duration.",
      message: _.messages.expected,
    },
  ],
});
