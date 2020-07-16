"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = splitValueList;

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

// This function tries to determine which parts of a value are to be checked and whether or not a value
// should be broken into chunks.
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

function splitValueList(value, range) {
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  var commaSplitRegex = /,(?=(((?!\)).)*\()|[^()]*$)/g;
  var spaceSplitRegex = / (?=(((?!\)).)*\()|[^()]*$)/g;
  var commaSplitValues = [];
  var values;
  var lastPos = 0;
  var matches; // first split based on comma for values like box-shadow

  while ((matches = commaSplitRegex.exec(value)) !== null) {
    commaSplitValues.push(value.substring(lastPos, matches.index).trim());
    lastPos = commaSplitRegex.lastIndex;
  }

  if (lastPos < value.length) {
    commaSplitValues.push(value.substring(lastPos).trim());
  }

  if (range) {
    // Next split on space and check against range
    values = [];

    var _iterator = _createForOfIteratorHelper(commaSplitValues),
      _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var commaSplitValue = _step.value;
        var spaceSplitValues = [];
        lastPos = 0;

        while ((matches = spaceSplitRegex.exec(commaSplitValue)) !== null) {
          spaceSplitValues.push(
            commaSplitValue.substring(lastPos, matches.index).trim()
          );
          lastPos = spaceSplitRegex.lastIndex;
        }

        if (lastPos < commaSplitValue.length) {
          spaceSplitValues.push(commaSplitValue.substring(lastPos).trim());
        } // for the range select only the values to check
        // 1 = first value, -1 = last value

        var _range$split = range.split(" "),
          _range$split2 = _slicedToArray(_range$split, 2),
          start = _range$split2[0],
          end = _range$split2[1];

        start = parseRangeValue(start, spaceSplitValues.length);
        end = parseRangeValue(end, spaceSplitValues.length);

        if (end) {
          var _values;

          (_values = values).push.apply(
            _values,
            _toConsumableArray(spaceSplitValues.slice(start, end + 1))
          ); // +1 as slice end is not inclusive
        } else {
          values.push(spaceSplitValues[start]);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    // any part can match
    values = commaSplitValues;
  } // // eslint-disable-next-line
  // console.log("range", range);
  // if (range === "1 4") {
  //   // eslint-disable-next-line
  //   console.log("--------", star, end, commSplitValues, values);
  // }
  // // eslint-disable-next-line
  // console.dir(values);

  return values.filter(function (item) {
    return item !== undefined;
  });
}
