"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = testItem;

var _ = require(".");

var _tokenizeValue = require("./tokenizeValue");

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

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
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
  var normalCompletion = true,
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
  if (n === "Map" || n === "Set") return Array.from(o);
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

var checkTokens = function checkTokens(variable, ruleInfo) {
  var result = {
    accepted: false,
    done: false,
  }; // cope with variables wrapped in #{}

  var _variable =
    variable.startsWith("#{") && variable.endsWith("}")
      ? variable.substr(2, variable.length - 3)
      : variable;

  var _iterator = _createForOfIteratorHelper(ruleInfo.tokens),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var tokenSet = _step.value;
      var tokenSpecs = tokenSet.values;

      if (tokenSpecs.includes(_variable)) {
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

var checkProportionalMath = function checkProportionalMath(
  mathItems,
  ruleInfo
) {
  var otherItem;

  if (
    mathItems[0].type === _tokenizeValue.TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[0].units) > -1
  ) {
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === _tokenizeValue.TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[2].units) > -1
  ) {
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["+", "-"].indexOf(mathItems[1].value) > -1) {
      // is plus or minus
      return checkTokens(otherItem.raw, ruleInfo);
    }
  }

  return {};
};

var checkNegation = function checkNegation(mathItems, ruleInfo) {
  var otherItem;
  var numeric;

  if (
    mathItems[0].type === _tokenizeValue.TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[0].units === ""
  ) {
    numeric = mathItems[0];
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === _tokenizeValue.TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[2].units === ""
  ) {
    numeric = mathItems[2];
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["*", "/"].indexOf(mathItems[1].value) > -1 && numeric.raw === "-1") {
      // is times or divide by -1
      return checkTokens(otherItem.raw, ruleInfo);
    }
  }

  return {};
};

var testItemInner = function testItemInner(item, ruleInfo) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  var result = {
    accepted: false,
    done: false,
  };

  if (item === undefined) {
    // do not accept undefined
    result.done = true;
    return result;
  } // cope with css variables

  var _item =
    item.type === _tokenizeValue.TOKEN_TYPES.FUNCTION && item.value === "var"
      ? item.items[0]
      : item;

  if (_item.type === _tokenizeValue.TOKEN_TYPES.FUNCTION) {
    var _iterator2 = _createForOfIteratorHelper(ruleInfo.functions),
      _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
        var funcSet = _step2.value;
        var funcSpecs = funcSet.values;
        var matchesFuncSpec = funcSpecs.some(function (funcSpec) {
          var parts = funcSpec.split("(");

          if (parts.length === 1) {
            // no parameter checks
            return parts[0] === _item.value;
          } else {
            // check parameters
            if (parts[0] === _item.value) {
              // a function will contain an items array that is either a LIST or not
              // IF TRUE a list then _item.items[0] === list which contains LIST_ITEMS in which case LIST_ITEMS.items is what we are interested in
              // IF FALSE a list contains values which could include math or brackets or function calls
              // NOTE: we do not try to deal with function calls inside function calls
              var inList = !!(
                _item.items &&
                _item.items[0].type === _tokenizeValue.TOKEN_TYPES.LIST
              );
              var paramItems = inList
                ? _item.items[0].items // List[0] contains list items
                : _item.items; // otherwise contains Tokens

              var _parts$1$substring$sp = parts[1]
                  .substring(0, parts[1].length - 1)
                  .split(" "),
                _parts$1$substring$sp2 = _slicedToArray(
                  _parts$1$substring$sp,
                  2
                ),
                start = _parts$1$substring$sp2[0],
                end = _parts$1$substring$sp2[1];

              start = (0, _.parseRangeValue)(start, paramItems.length);
              end = (0, _.parseRangeValue)(end, paramItems.length) || start; // start if end empty

              for (var pos = start; pos <= end; pos++) {
                if (!paramItems[pos]) {
                  break; // ignore parts after undefined
                } // raw value of list and non-list item does allow for math

                var tokenResult = {};

                if (
                  _item.isCalc &&
                  paramItems[pos].type === _tokenizeValue.TOKEN_TYPES.MATH
                ) {
                  // allow proportional + or - checkTokens
                  var mathItems = paramItems[pos].items;
                  tokenResult = checkProportionalMath(mathItems, ruleInfo);

                  if (!tokenResult.accepted) {
                    tokenResult = checkNegation(mathItems, ruleInfo);
                  }
                } else {
                  tokenResult = checkTokens(paramItems[pos].raw, ruleInfo);
                }

                if (!tokenResult.accepted) {
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
  } else if (item.type === _tokenizeValue.TOKEN_TYPES.MATH) {
    var tokenResult = checkNegation(item.items, ruleInfo);
    result.source = tokenResult.source;
    result.accepted = tokenResult.accepted;
    result.done = tokenResult.done;
  } else if (_item.type === _tokenizeValue.TOKEN_TYPES.SCSS_VAR) {
    var _tokenResult = checkTokens(_item.value, ruleInfo);

    result.source = _tokenResult.source;
    result.accepted = _tokenResult.accepted;
    result.done = _tokenResult.done;
  } // if (
  //   !result.accepted &&
  //   item &&
  //   (item.startsWith("carbon--mini-units") ||
  //     item.startsWith("get-light-item"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     item,
  //     matches,
  //     matches && matches[matchFunction],
  //     matches && matches[matchFunction].length > 0,
  //     regexFuncAndItem
  //   );
  // }

  result.isCalc = _item.isCalc;
  return result;
};

function testItem(item, ruleInfo, options, knownVariables) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  var result = {};

  if (item === undefined) {
    // do not accept undefined
    result.done = true;
    return result;
  }

  var testItem = item;
  result.done = false;

  while (testItem && !result.done) {
    // loop checking testItem;
    result = testItemInner(testItem, ruleInfo);

    if (!result.done && (0, _.isVariable)(testItem)) {
      // may be a variable referring to a item
      testItem = knownVariables[testItem.raw];

      if (!testItem) {
        if (options.acceptUndefinedVariables) {
          result.accepted = true;
        }

        result.done = true;
      }
    } else {
      result.done = true;
    }
  }

  result.isVariable = (0, _.isVariable)(item); // causes different result message

  result.variableItem = testItem; // last testItem found
  // if (result.isCalc) {
  //   // eslint-disable-next-line
  //   console.log("We have calc", item.raw);
  // }

  return result;
}
