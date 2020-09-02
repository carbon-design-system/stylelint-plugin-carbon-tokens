"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _ = _interopRequireWildcard(require(".."));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [true, {
    ignoreValues: ["/((--)|[$])my-value-accept/", "*"]
  }],
  syntax: "scss",
  accept: [{
    code: ".foo { color: $ui-01; }",
    description: "Carbon theme token expected."
  }, {
    code: ".foo { box-shadow: 0 0 5px $ui-01, 0 0 10px $ui-02; }",
    description: "All color tokens in split are Carbon theme tokens."
  }, {
    code: "$my-value-accept: $ui-01; .foo { color: $my-value-accept; }",
    description: "Accept $varaible declared before use with Carbon theme tokens."
  }, {
    code: "--my-value-accept: $ui-01; .foo { color: var(--my-value-accept); }",
    description: "Accept --variable declared before use with Carbon theme tokens."
  }, {
    code: ".foo { box-shadow: $layout-01 $layout-01 $ui-01; }",
    description: "Position one and two can can be non color variables three of three matches"
  }, {
    code: ".foo { box-shadow: 0 0 $layout-01 $ui-01; }",
    description: "Position three of four can can be non color variables four of four matches"
  }, {
    code: ".foo { border: 1px solid get-light-value('ui-01'); }",
    description: "Permitted function get-light-value passes"
  }, {
    code: ".foo { color: $my-value-accept; }",
    description: "Accept undeclared $variable by defaullt."
  }, {
    code: ".foo { color: var(--my-value-accept); }",
    description: "Accept undeclared --variable by default."
  }],
  reject: [{
    code: ".foo { background-color: #f4f4f4; }",
    description: "Used #color instead of Carbon theme token expected.",
    message: _.messages.expected
  }, {
    code: ".foo { box-shadow: 0 0 5px $ui-01, 0 0 10px #fefefe; }",
    description: "Used #color in a split property not Carbon theme tokens.",
    message: _.messages.expected
  }, {
    code: ".foo { border: 1px solid my-value-fun($ui-01); }",
    description: "Other functions should fail my-value-fn fails"
  }]
}); // verify use of carbon color tokens

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [true, {
    ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
    acceptCarbonColorTokens: true
  }],
  syntax: "scss",
  accept: [{
    code: ".foo { background-color: $carbon--blue-90; }",
    description: "Accept using a carbon color token",
    message: _.messages.expected
  }],
  reject: [// an ibm color token
  {
    code: ".foo { background-color: $ibm-color__blue-90; }",
    description: "Reject using a ibm color token",
    message: _.messages.expected
  }]
}); // verify use of carbon color tokens

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [true, {
    ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
    acceptIBMColorTokens: true
  }],
  syntax: "scss",
  accept: [{
    code: ".foo { background-color: $ibm-color__blue-90; }",
    description: "Accept using a ibm color token",
    message: _.messages.expected
  }],
  reject: [// an ibm color token
  {
    code: ".foo { background-color: $carbon--blue-90; }",
    description: "Reject using a carbon color token",
    message: _.messages.expected
  }]
}); // verify rejection of undeclared variables

testRule(_["default"], {
  ruleName: _.ruleName,
  config: [true, {
    acceptUndefinedVariables: false
  }],
  syntax: "scss",
  accept: [{
    code: "$my-value-accept: $ui-01; .foo { color: $my-value-accept; }",
    description: "Accept $varaible declared before use when acceptUndefinedVariables is false."
  }, {
    code: "--my-value-accept: $ui-01; .foo { color: var(--my-value-accept); }",
    description: "Accept --variable declared before use when acceptUndefinedVariables is false."
  }],
  reject: [// an ibm color token
  {
    code: ".foo { color: $my-value-reject; }",
    description: "Reject undeclared $variable  when acceptUndefinedVariables is false."
  }, {
    code: ".foo { color: var(--my-value-reject); }",
    description: "Reject undeclared --variable  when acceptUndefinedVariables is false."
  }]
}); // verify use of rgba with carbon theme token

testRule(_["default"], {
  ruleName: _.ruleName,
  config: true,
  syntax: "scss",
  accept: [{
    code: ".foo { background-color: rgba($ui-01, 0.5); }",
    description: "Accept using a carbon theme token with rgba()",
    message: _.messages.expected
  }],
  reject: [// an ibm color token
  {
    code: ".foo { background-color: rgba(100, 100, 255, 0.5); }",
    description: "Reject using a non-carbon theme token with rgba()",
    message: _.messages.expected
  }]
}); // verify use of full and stroke with carbon theme token

testRule(_["default"], {
  ruleName: _.ruleName,
  config: true,
  syntax: "scss",
  accept: [{
    code: ".foo { fill: $ui-01; }",
    description: "Accept carbon theme token for fill property by default",
    message: _.messages.expected
  }, {
    code: ".foo { stroke: $ui-01; }",
    description: "Accept carbon theme token for stroke property by default",
    message: _.messages.expected
  }],
  reject: [{
    code: ".foo { fill: #fefefe; }",
    description: "Reject non-carbon theme token for fill property by default",
    message: _.messages.expected
  }, {
    code: ".foo { stroke: red; }",
    description: "Reject non-carbon theme token for stroke property by default",
    message: _.messages.expected
  }]
}); // accept currentColor can be used as a value

testRule(_["default"], {
  ruleName: _.ruleName,
  config: true,
  syntax: "scss",
  accept: [{
    code: ".foo { fill: currentColor; }",
    description: "Accept currentColor on the assumption color is valid",
    message: _.messages.expected
  }]
});