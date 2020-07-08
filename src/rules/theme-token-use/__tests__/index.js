import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { color: $ui-01; }",
      description: "Carbon theme token expected.",
    },
    {
      code: ".foo { box-shadow: 0 0 5px $ui-01, 0 0 10px $ui-02; }",
      description: "All color tokens in split are Carbon theme tokens.",
    },
    {
      code: "$my-value-accept: $ui-01; .foo { color: $my-value-accept; }",
      description:
        "Accept $varaible declared before use with Carbon theme tokens.",
    },
    {
      code:
        "--my-value-accept: $ui-01; .foo { color: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon theme tokens.",
    },
    {
      code: ".foo { box-shadow: $layout-01 $layout-01 $ui-01; }",
      description:
        "Position one and two can can be non color variables three of three matches",
    },
    {
      code: ".foo { box-shadow: 0 0 $layout-01 $ui-01; }",
      description:
        "Position three of four can can be non color variables four of four matches",
    },
    {
      code: ".foo { border: 1px solid get-light-value($ui-01); }",
      description: "Permitted function get-light-value passes",
    },
  ],

  reject: [
    {
      code: ".foo { background-color: #f4f4f4; }",
      description: "Used #color istead of Carbon theme token expected.",
      message: messages.expected,
    },
    {
      code: ".foo { box-shadow: 0 0 5px $ui-01, 0 0 10px #fefefe; }",
      description: "Used #color in a split property not Carbon theme tokens.",
      message: messages.expected,
    },
    {
      code: ".foo { color: $my-value-reject; }",
      description:
        "Not a $varaible declared before use with Carbon theme tokens.",
    },
    {
      code: ".foo { color: var(--my-value-reject); }",
      description:
        "Not a --variable declared before use with Carbon theme tokens.",
    },
    {
      code: "@import 'file-with-dollar-var'; .foo { color: $dollar-var; }",
      description: "Does not parse $dollar-var from other files",
    },
    {
      code: ".foo { border: 1px solid my-value-fun($ui-01); }",
      description: "Other functions should fail my-value-fn fails",
    },
  ],
});

// verify use of carbon color tokens
testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
      acceptCarbonColorTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { background-color: $carbon--blue-90; }",
      description: "Accept using a carbon color token",
      message: messages.expected,
    },
  ],

  reject: [
    // an ibm color token
    {
      code: ".foo { background-color: $ibm-color__blue-90; }",
      description: "Reject using a ibm color token",
      message: messages.expected,
    },
  ],
});

// verify use of carbon color tokens
testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
      acceptIBMColorTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: ".foo { background-color: $ibm-color__blue-90; }",
      description: "Accept using a ibm color token",
      message: messages.expected,
    },
  ],

  reject: [
    // an ibm color token
    {
      code: ".foo { background-color: $carbon--blue-90; }",
      description: "Reject using a carbon color token",
      message: messages.expected,
    },
  ],
});

// testConfig(rule, {
//   ruleName,
//   description: "Check for invalid ignore values",
//   message: messages.expected,
//   config: ["always", { ignoreValues: ["/wibble/"] }],
// });
