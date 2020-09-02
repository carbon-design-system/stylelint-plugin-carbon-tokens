"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = checkRule;

var _stylelint = require("stylelint");

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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

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

var checkIgnoreToken = function checkIgnoreToken(item) {
  var ignoredValues =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  // Simply check raw values, improve later
  var result = false;

  if (item) {
    result = ignoredValues.some(function (ignoredValue) {
      // regex or string
      var testValue = (0, _.parseToRegexOrString)(ignoredValue);
      return (
        (testValue.test && testValue.test(item.raw)) || testValue === item.raw
      );
    });
  }

  return result;
};

function checkRule(root, result, ruleName, options, messages, getRuleInfo) {
  var checkItem = function checkItem(
    decl,
    item,
    propSpec,
    ruleInfo,
    knownVariables
  ) {
    // Expects to be passed an item containing either a token { raw, type, value} or
    // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
    // Make checkIgnoreToken look at raw or value and deal with item being undefined (not found in range).
    if (!checkIgnoreToken(item, options.ignoreValues)) {
      var testResult = (0, _.testItem)(item, ruleInfo, options, knownVariables);
      var message;

      if (!testResult.accepted) {
        if (item === undefined) {
          message = messages.rejectedUndefinedRange(
            decl.prop,
            item,
            propSpec.range
          );
        } else if (testResult.isCalc) {
          message = messages.rejectedMaths(decl.prop, item.raw);
        } else if (testResult.isVariable) {
          message = messages.rejectedVariable(
            decl.prop,
            item.raw,
            testResult.variableValue
          );
        } else {
          message = messages.rejected(decl.prop, decl.value);
        } // adjust position for multipart value

        var offsetValue = item !== undefined ? decl.value.indexOf(item.raw) : 0;

        _stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          message: message,
          index: (0, _.declarationValueIndex)(decl) + offsetValue,
          node: decl,
        });
      }
    }

    return false;
  };

  var checkItems = function checkItems(
    items,
    decl,
    propSpec,
    ruleInfo,
    knownVariables
  ) {
    // expects to be passed an items array containing tokens
    var itemsToCheck;

    if (propSpec.range) {
      // for the range select only the values to check
      // 1 = first value, -1 = last value
      var _propSpec$range$split = propSpec.range.split(" "),
        _propSpec$range$split2 = _slicedToArray(_propSpec$range$split, 2),
        start = _propSpec$range$split2[0],
        end = _propSpec$range$split2[1];

      itemsToCheck = [];
      start = (0, _.parseRangeValue)(start, items.length);
      end = (0, _.parseRangeValue)(end, items.length);

      if (end) {
        var _itemsToCheck;

        (_itemsToCheck = itemsToCheck).push.apply(
          _itemsToCheck,
          _toConsumableArray(items.slice(start, end + 1))
        ); // +1 as slice end is not inclusive
      } else {
        itemsToCheck.push(items[start]);
      }
    } else {
      // check all items in list
      itemsToCheck = items;
    } // look at propSpec.valueCheck

    if (propSpec.valueCheck) {
      itemsToCheck = itemsToCheck.filter(function (item) {
        if (_typeof(propSpec.valueCheck) === "object") {
          return propSpec.valueCheck.test(item.raw);
        } else {
          return propSpec.valueCheck === item.raw;
        }
      });
    }

    var _iterator = _createForOfIteratorHelper(itemsToCheck),
      _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var item = _step.value;
        checkItem(decl, item, propSpec, ruleInfo, knownVariables);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  var knownVariables = {}; // used to contain variable declarations

  root.walkDecls(function (decl) {
    var tokenizedValue = (0, _.tokenizeValue)(decl.value);

    if ((0, _.isVariable)(decl.prop)) {
      // add to variable declarations
      // expects all variables to appear before use
      // expects all variables to be simple (not map or list)
      knownVariables[(0, _.normaliseVariableName)(decl.prop)] =
        tokenizedValue.items[0];
    } // read the prop spec

    var propSpec = (0, _.checkProp)(decl.prop, options.includeProps);

    if (propSpec) {
      // is supported prop
      // Some color properties have
      // variable parameters lists where color is not at a fixed position
      var ruleInfo = getRuleInfo(options);

      if (tokenizedValue.type === _.TOKEN_TYPES.LIST) {
        var _iterator2 = _createForOfIteratorHelper(tokenizedValue.items),
          _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var listItem = _step2.value;
            checkItems(
              listItem.items,
              decl,
              propSpec,
              ruleInfo,
              knownVariables
            );
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        checkItems(
          tokenizedValue.items,
          decl,
          propSpec,
          ruleInfo,
          knownVariables
        );
      }
    }
  });
}
