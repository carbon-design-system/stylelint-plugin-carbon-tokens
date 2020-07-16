"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = testValue;

var _ = require("./");

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

var checkValue = function checkValue(value, ruleInfo) {
  var result = {
    accepted: false,
    done: false,
  }; // cope with css variables

  var _value = value.startsWith("var(")
    ? value.substring(4, value.length - 2)
    : value; // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call

  var regexFuncAndToken = /^((\$[\w-]+)|(([\w-]+)\((['"$\w-]+)\)))/g;
  var matches = regexFuncAndToken.exec(_value);
  var matchVariable = 2;
  var matchFunction = 4; // const matchFunctionParam = 5;

  if (matches) {
    // if function check it's in themeFunctions
    if (matches[matchFunction] && matches[matchFunction].length > 0) {
      // // eslint-disable-next-line
      // console.log("It is a function", matches[matchFunction]);
      // // eslint-disable-next-line
      // console.dir(matches);
      var _iterator = _createForOfIteratorHelper(ruleInfo.functions),
        _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var funcSet = _step.value;
          // // eslint-disable-next-line
          // console.dir(funcSet);
          var funcSpecs = funcSet.values; // // eslint-disable-next-line
          // console.dir(funcSpecs);

          var matchesFuncSpec = funcSpecs.some(function (funcSpec) {
            var parts = funcSpec.split(" ");

            if (parts.length === 1) {
              // has no second clause
              return parts[0] === matches[matchFunction];
            } else {
              if (parts[0] === matches[matchFunction]) {
                // TODO: does not support parameter checking
                // for (const tokenSet of ruleInfo.tokens) {
                //   for (const tokenSpecs of tokenSet.values) {
                //     if (tokenSpecs.includes(matches[matchFunctionParam])) {
                //       return true;
                //       // CAN INCLUDE VARIABLES AAAAAGGGGHHHHH
                //       // RETURN THEM FOR PROCESSING BY CHECKRULE?
                //     }
                //   }
                // }
                return true;
              } else {
                return false;
              }
            }
          });

          if (matchesFuncSpec) {
            result.source = funcSet.source;
            result.accepted = funcSet.accept;
            result.done = true; // all tests completed

            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else if (matches[matchVariable]) {
      var _iterator2 = _createForOfIteratorHelper(ruleInfo.tokens),
        _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var tokenSet = _step2.value;
          var tokenSpecs = tokenSet.values;

          if (tokenSpecs.includes(matches[matchVariable])) {
            result.source = tokenSet.source;
            result.accepted = tokenSet.accept;
            result.done = true; // all tests completed

            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } // if (
  //   !result.accepted &&
  //   value &&
  //   (value.startsWith("carbon--mini-units") ||
  //     value.startsWith("get-light-value"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     value,
  //     matches,
  //     matches && matches[matchFunction],
  //     matches && matches[matchFunction].length > 0,
  //     regexFuncAndToken
  //   );
  // }

  return result;
};

function testValue(value, ruleInfo, options, knownVariables) {
  var result = {
    done: false,
  };
  var testValue = value;

  while (!result.done) {
    // loop checking testValue;
    result = checkValue(testValue, ruleInfo);

    if (!result.done && (0, _.isVariable)(testValue)) {
      // may be a variable referring to a value
      testValue = knownVariables[testValue];

      if (!testValue) {
        if (options.acceptUndefinedVariables) {
          result.accepted = true;
        }

        result.done = true;
      }
    } else {
      result.done = true;
    }
  }

  result.isVariable = (0, _.isVariable)(value); // causes different result message

  result.variableValue = testValue; // last testValue found
  // if (90 < parseInt(value, 10)) {
  //   // eslint-disable-next-line
  //   console.log(result, testValue, value);
  // }

  return result;
}
