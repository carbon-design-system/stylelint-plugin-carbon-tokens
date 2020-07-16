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

function checkRule(root, result, ruleName, options, messages, getRuleInfo) {
  var variables = {}; // used to contain variable declarations

  root.walkDecls(function (decl) {
    if ((0, _.isVariable)(decl.prop)) {
      // add to variable declarations
      // expects all variables to appear before use
      // expects all variables to be simple (not map or list)
      variables[(0, _.normaliseVariableName)(decl.prop)] = decl.value;
    } // read the prop spec

    var propSpec = (0, _.checkProp)(decl.prop, options.includeProps);

    if (propSpec) {
      // is supported prop
      // Some color properties have
      // variable parameter lists where color can be optional
      // variable parameters lists where color is not at a fixed position
      // split using , and propSpec
      var values = (0, _.splitValueList)(decl.value, propSpec.range);
      var ruleInfo = getRuleInfo(options); // // eslint-disable-next-line
      // console.dir({ propSpec, decl, values });

      var _iterator = _createForOfIteratorHelper(values),
        _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var value = _step.value;

          // Ignore values specified by ignoreValues
          if (!(0, _.checkIgnoreValue)(value, options.ignoreValues)) {
            // // eslint-disable-next-line
            // console.log("The value is", value);
            var testResult = (0, _.testValue)(
              value,
              ruleInfo,
              options,
              variables
            );
            var message = void 0; // if (90 < parseInt(value, 10)) {
            //   // eslint-disable-next-line
            //   console.dir({ testResult, value });
            // }

            if (!testResult.accepted) {
              if (value === undefined) {
                message = messages.rejectedUndefinedRange(
                  decl.prop,
                  value,
                  propSpec.range
                );
              } else if (testResult.isVariable) {
                message = messages.rejectedVariable(
                  decl.prop,
                  value,
                  testResult.variableValue
                );
              } else {
                // // eslint-disable-next-line
                // console.log("Wibble", decl.prop, decl.value);
                message = messages.rejected(decl.prop, decl.value);
              }

              _stylelint.utils.report({
                ruleName: ruleName,
                result: result,
                message: message,
                index: (0, _.declarationValueIndex)(decl),
                node: decl,
              });
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  });
}
