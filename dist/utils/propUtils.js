"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.parseRangeValue = exports.checkProp = exports.getPropSpec = void 0;

var _parseToRegexOrString = _interopRequireDefault(
  require("./parseToRegexOrString")
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var it,
    normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var getPropSpec = function getPropSpec(prop) {
  // starts with / and has another /
  // or does not start with /
  // optionally folloed by <anything in angled brackets>
  var propSpec = false;
  var checkRegex = /^((\/[^/]*\/)|([^</[]+))(<([^>]*)>)*(\[([^]+)\])*/;
  var matches = checkRegex.exec(prop);

  if (matches && matches[1]) {
    propSpec = {
      prop: matches[1],
      test: (0, _parseToRegexOrString["default"])(matches[1]),
      range: matches[5],
      // 5 may be undefined
      valueCheck: (0, _parseToRegexOrString["default"])(matches[7]), // may be undefined
    };
  }

  return propSpec;
};

exports.getPropSpec = getPropSpec;

var checkProp = function checkProp(prop2Check, includedProps) {
  var propSpec = false;
  var result = false;

  var _iterator = _createForOfIteratorHelper(includedProps),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var includedProp = _step.value;
      propSpec = getPropSpec(includedProp);

      if (propSpec) {
        if (
          (propSpec.test.test && propSpec.test.test(prop2Check)) ||
          propSpec.test === prop2Check
        ) {
          // return first result that matches
          result = propSpec;
          break;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
};

exports.checkProp = checkProp;

var parseRangeValue = function parseRangeValue(value, length) {
  if (!value) {
    return value;
  }

  var _value = parseInt(value, 10);

  if (_value < 0) {
    // -ve from end
    return length + _value; // zero based
  } else {
    return _value - 1; // make it zero based
  }
};

exports.parseRangeValue = parseRangeValue;
