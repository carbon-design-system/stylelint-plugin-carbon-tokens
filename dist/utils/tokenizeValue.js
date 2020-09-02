"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.TOKEN_TYPES = exports.tokenizeValue = void 0;

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

var TOKEN_TYPES = {
  NUMERIC_LITERAL: "Numeric literal",
  SCSS_VAR: "scss variable",
  OPERATOR: "operator",
  SEPARATOR: "separator",
  FUNCTION: "function",
  LEFT_BR: "Left bracket",
  RIGHT_BR: "Right bracket",
  BRACKETED_CONTENT: "Content of brackets",
  QUOTED_LITERAL: "Quoted literal",
  TEXT_LITERAL: "Text Literal",
  COLOR_LITERAL: "Color Literal",
  MATH: "Math",
  LIST: "Comma sepaarted list",
  LIST_ITEM: "Item in list",
  UNKNOWN: "Unknown",
};
exports.TOKEN_TYPES = TOKEN_TYPES;

var getTokenList = function getTokenList(inStr) {
  // match (single quoted string) or (double quoted string) or (numeric with or without units)
  // or (scss var with optional - prefix) or (css var or literal, could be function) or ( or ) or , or operator
  // single quoted string
  // ('[^']*')
  // or double quoted string
  // |("[^"]*")|
  // or numeric with or without units
  // ((-{0,1}[0-9.]+)([\w%]*))
  // or scss var with optional - prefix
  // |(-{0,1}\$[\w-]+)
  // or css var or literal at least 2 if with - to prevent match with operator could be function with opening (
  // |(([\w-#]{2,}|\w*)
  // or ( or ) or ,
  // |(\()|(\))|(,)
  // or operator
  // |([^\w$ (),#])
  // or space
  // |( )*
  var tokenRegex = /('[^']*')|("[^"]*")|((-{0,1}[0-9.]+)([\w%]*))|(-{0,1}\$[\w-]+)|(([\w-#]{2,}|\w+)(\(*))|(\()|(\))|(,)|([^\w\n (),#])|( )/g; // TODO: While the above regex is technically entertaining swap out for a simple character walk and state engine.
  // regex parts

  var RP_SQ_STR = 1;
  var RP_DQ_STR = 2;
  var RP_NUM = 4;
  var RP_UNIT = 5;
  var RP_SCSS_VAR = 6;
  var RP_LITERAL = 8;
  var RP_FUNCTION = 9;
  var RP_LEFT_BR = 10;
  var RP_RIGHT_BR = 11;
  var RP_COMMA = 12;
  var RP_OPERATOR = 13;
  var RP_SPACE = 14;
  var token = tokenRegex.exec(inStr);
  var results = [];

  while (token) {
    if (token[RP_SCSS_VAR]) {
      results.push({
        type: TOKEN_TYPES.SCSS_VAR,
        value: token[RP_SCSS_VAR],
      });
    } else if (token[RP_FUNCTION]) {
      results.push({
        type: TOKEN_TYPES.FUNCTION,
        value: token[RP_LITERAL],
      });
      results.push({
        type: TOKEN_TYPES.LEFT_BR,
        value: token[RP_FUNCTION],
      });
    } else if (token[RP_OPERATOR]) {
      results.push({
        type: TOKEN_TYPES.OPERATOR,
        value: token[RP_OPERATOR],
      });
    } else if (token[RP_LITERAL]) {
      results.push({
        type: TOKEN_TYPES.TEXT_LITERAL,
        value: token[RP_LITERAL],
      });
    } else if (token[RP_LEFT_BR]) {
      results.push({
        type: TOKEN_TYPES.LEFT_BR,
        value: token[RP_LEFT_BR],
      });
    } else if (token[RP_RIGHT_BR]) {
      results.push({
        type: TOKEN_TYPES.RIGHT_BR,
        value: token[RP_RIGHT_BR],
      });
    } else if (token[RP_COMMA]) {
      results.push({
        type: TOKEN_TYPES.SEPARATOR,
        value: token[RP_COMMA],
      });
    } else if (token[RP_SQ_STR] || token[RP_DQ_STR]) {
      results.push({
        type: TOKEN_TYPES.QUOTED_LITERAL,
        value: token[RP_SQ_STR] || token[RP_DQ_STR],
      });
    } else if (token[RP_NUM]) {
      results.push({
        type: TOKEN_TYPES.NUMERIC_LITERAL,
        value: token[RP_NUM],
        units: token[RP_UNIT],
      });
    } else if (token[RP_SPACE]) {
      if (results.length) {
        results[results.length - 1].spaceAfter = true;
      } // } else {
      // ignore unknown
      //   results.push({
      //     type: TOKEN_TYPES.UNKNOWN,
      //     value: token,
      //   });
    }

    token = tokenRegex.exec(inStr);
  }

  return results;
};

var addToCurrent = function addToCurrent(current, value) {
  var target;
  var host = current;

  if (
    current.type === TOKEN_TYPES.FUNCTION ||
    current.type === TOKEN_TYPES.BRACKETED_CONTENT
  ) {
    // may have one or more items
    host =
      current.items.length && current.items[0].type === TOKEN_TYPES.LIST
        ? current.items[0]
        : current;

    if (host.type === TOKEN_TYPES.LIST) {
      host.raw = ""
        .concat(host.raw, ", ")
        .concat(value.raw)
        .concat(value.spaceAfter ? " " : "");
    }
  } else {
    host = current;
  }

  if (host.type === TOKEN_TYPES.LIST) {
    target = host.items[host.items.length - 1];
    target.raw = ""
      .concat(target.raw || "")
      .concat(value.raw)
      .concat(value.spaceAfter ? " " : "");
  } else {
    target = host;
  }

  target.items.push(value);
};

var maybeMathEnd = function maybeMathEnd(type) {
  return type !== TOKEN_TYPES.OPERATOR && type !== TOKEN_TYPES.LEFT_BR;
};

var doEndMath = function doEndMath(current) {
  var newCurrent = current.parent;
  delete current.parent;
  addToCurrent(newCurrent, current);
  newCurrent.raw = "".concat(newCurrent.raw || "").concat(current.raw);
  return newCurrent;
}; // tokenizeValue generates a output that looks like the following
// { items: [T], raw: 'R' } where [T] is an array tokens and R is the string value
// Each T is an object of the form
// {
//   items, // undefined or array of type T
//   type, // type of the item e.g. "Quoted literal",
//   value, // undefined or value e.g. matches raw for simple types,
//          // otherwise undefined except for type functions where it contains the name,
//   raw, // string value representing the whole item
// }
// where T.type = MATH, T.items contains maths (an array of T)
// where T.type = LIST, T.itmes is an array of { type: LIST_ITEM, items: [T], raw: 'raw value' }
// where T.type = BRACKETED_CONTENT, T.items contains array of T
// where T.type = FUNCTION, T.items contains an array of T representing the parameters

var tokenizeValue = function tokenizeValue(value) {
  var tokenList = getTokenList(value);
  var result = {
    items: [],
  };
  var current = result;
  var lastToken = {};

  var _iterator = _createForOfIteratorHelper(tokenList),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var token = _step.value;
      var endsMath =
        current.type === TOKEN_TYPES.MATH &&
        maybeMathEnd(lastToken.type) &&
        maybeMathEnd(token.type);
      token.raw = token.units
        ? "".concat(token.value).concat(token.units)
        : "".concat(token.value);
      var space = token.spaceAfter ? " " : "";

      if (endsMath) {
        current = doEndMath(current);
      }

      if (
        token.type !== TOKEN_TYPES.LEFT_BR &&
        token.type !== TOKEN_TYPES.FUNCTION &&
        token.type !== TOKEN_TYPES.SEPARATOR
      ) {
        current.raw = ""
          .concat(current.raw || "")
          .concat(token.raw)
          .concat(space);
      }

      if (token.type === TOKEN_TYPES.FUNCTION) {
        var _item = {
          items: [],
          type: token.type,
          value: token.value,
          parent: current,
          creatingFunction: true,
          isCalc: token.value === "calc",
          raw: "".concat(token.value, "("),
        };
        current = _item;
      } else if (token.type === TOKEN_TYPES.LEFT_BR) {
        if (current.creatingFunction) {
          delete current.creatingFunction;
        } else {
          var _item2 = {
            items: [],
            type: TOKEN_TYPES.BRACKETED_CONTENT,
            parent: current,
            raw: "(",
          };
          current = _item2;
        }
      } else if (token.type === TOKEN_TYPES.RIGHT_BR && current.parent) {
        var _item3 = current;
        current = _item3.parent;
        delete _item3.parent;
        addToCurrent(current, _item3); //do we need right bracket

        current.raw = "".concat(current.raw || "").concat(_item3.raw);
      } else if (token.type === TOKEN_TYPES.OPERATOR) {
        // is Math ends with litreal followed by non-operator
        var prev = current.items.pop(); // maths starts with previuos item

        var _item4 = {
          items: [prev],
          parent: current,
          type: TOKEN_TYPES.MATH,
          raw: ""
            .concat(prev.raw)
            .concat(lastToken.spaceAfter ? " " : "")
            .concat(token.raw)
            .concat(space),
        };
        current.raw = current.raw.substring(0, current.raw.indexOf(prev.raw));
        current = _item4;
        addToCurrent(current, token); // add operator
      } else if (token.type === TOKEN_TYPES.SEPARATOR) {
        // list all the way to end of function or value
        if (current.type !== TOKEN_TYPES.LIST) {
          if (
            current.type === TOKEN_TYPES.FUNCTION ||
            current.type === TOKEN_TYPES.BRACKETED_CONTENT
          ) {
            var _item5 = {
              items: [
                {
                  type: TOKEN_TYPES.LIST_ITEM,
                  items: current.items,
                  raw: lastToken.raw,
                },
                {
                  type: TOKEN_TYPES.LIST_ITEM,
                  items: [],
                  raw: "",
                },
              ],
              type: TOKEN_TYPES.LIST,
              raw: lastToken.raw,
            };
            current.items = [_item5];
          } else {
            current.type = TOKEN_TYPES.LIST;
            current.items = [
              {
                type: TOKEN_TYPES.LIST_ITEM,
                items: current.items,
                raw: current.raw,
              },
              {
                type: TOKEN_TYPES.LIST_ITEM,
                items: [],
                raw: "",
              },
            ];
          }
        } else {
          current.items.push({
            type: TOKEN_TYPES.LIST_ITEM,
            items: [],
            raw: "",
          });
        }

        current.raw = ""
          .concat(current.raw || "")
          .concat(token.raw)
          .concat(space);
      } else {
        addToCurrent(current, token);
      }

      lastToken = token;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  while (current.parent) {
    // attempt to tidy up if not back at result
    if (current.type === TOKEN_TYPES.MATH) {
      current = doEndMath(current);
    } else {
      var item = current;
      current = item.parent;
      delete item.parent;
      addToCurrent(current, item);
    }
  }

  return result;
};

exports.tokenizeValue = tokenizeValue;
