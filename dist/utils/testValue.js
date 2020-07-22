"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = testValue;

var _ = require("./");

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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
        e: function e(_e2) {
          throw _e2;
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
    e: function e(_e3) {
      didErr = true;
      err = _e3;
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

var checkVariable = function checkVariable(variable, ruleInfo) {
  var result = {
    accepted: false,
    done: false,
  };

  var _iterator = _createForOfIteratorHelper(ruleInfo.tokens),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var tokenSet = _step.value;
      var tokenSpecs = tokenSet.values;

      if (tokenSpecs.includes(variable)) {
        result.source = tokenSet.source;
        result.accepted = tokenSet.accept;
        result.done = true; // all tests completed

        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
};

var checkValue = function checkValue(value, ruleInfo) {
  var result = {
    accepted: false,
    done: false,
  };

  if (value === undefined) {
    // do not accept undefined
    result.done = true;
    return result;
  } // cope with css variables

  var _value = value.startsWith("var(")
    ? value.substring(4, value.length - 2)
    : value; // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call

  var regexFuncAndToken = /^((-?\$[\w-]+)|(([\w-]+)\((['"$\w-, .]+)\)))/g;
  var matches = regexFuncAndToken.exec(_value);
  var matchVariable = 2;
  var matchFunction = 4;
  var matchFunctionParams = 5;

  if (matches) {
    // if function check it's in themeFunctions
    if (matches[matchFunction] && matches[matchFunction].length > 0) {
      // // eslint-disable-next-line
      // console.log("It is a function", matches[matchFunction]);
      // // eslint-disable-next-line
      // console.dir(matches);
      var _iterator2 = _createForOfIteratorHelper(ruleInfo.functions),
        _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var funcSet = _step2.value;
          // // eslint-disable-next-line
          // console.dir(funcSet);
          var funcSpecs = funcSet.values; // // eslint-disable-next-line
          // console.dir(funcSpecs);

          var matchesFuncSpec = funcSpecs.some(function (funcSpec) {
            var parts = funcSpec.split("<");

            if (parts.length === 1) {
              // has no range
              return parts[0] === matches[matchFunction];
            } else {
              if (parts[0] === matches[matchFunction]) {
                var paramParts = matches[matchFunctionParams].split(",");

                var _parts$1$substring$sp = parts[1]
                    .substring(0, parts[1].length - 1)
                    .split(" "),
                  _parts$1$substring$sp2 = _slicedToArray(
                    _parts$1$substring$sp,
                    2
                  ),
                  start = _parts$1$substring$sp2[0],
                  end = _parts$1$substring$sp2[1];

                start = (0, _.parseRangeValue)(start, paramParts.length);
                end = (0, _.parseRangeValue)(end, paramParts.length) || start; // start if end empty

                for (var pos = start; pos <= end; pos++) {
                  if (!paramParts[pos]) {
                    break; // ignore parts after undefined
                  }

                  var variableResult = checkVariable(
                    paramParts[pos].trim(),
                    ruleInfo
                  );

                  if (!variableResult.accepted) {
                    return false;
                  }
                } // all variables in function passed so return true

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
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else if (matches[matchVariable]) {
      var variableResult = checkVariable(matches[matchVariable], ruleInfo);
      result.soruce = variableResult.source;
      result.accepted = variableResult.accepted;
      result.done = variableResult.done;
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

  while (testValue && !result.done) {
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
