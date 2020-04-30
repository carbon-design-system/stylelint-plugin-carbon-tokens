import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/transparent|inherit/"],
      includeProps: ["/color/", "/shadow/", "border"],
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
      code: "$my-color-accept: $ui-01; .foo { color: $my-color-accept; }",
      description:
        "Accept $varaible declared before use with Carbon theme tokens.",
    },
    {
      code:
        "--my-color-accept: $ui-01; .foo { color: var(--my-color-accept); }",
      description:
        "Accept --variable declared before use with Carbon theme tokens.",
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
      code: ".foo { color: $my-color-reject; }",
      description:
        "Not a $varaible declared before use with Carbon theme tokens.",
    },
    {
      code: ".foo { color: var(--my-color-reject); }",
      description:
        "Not a --variable declared before use with Carbon theme tokens.",
    },
    {
      code: "@import 'file-with-dollar-var'; .foo { color: $dollar-var; }",
      description: "Does not parse $dollar-var from other files",
    },
  ],
});

// verify use of carbon color tokens
testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/transparent|inherit/"],
      includeProps: ["/color/", "/shadow/", "border"],
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
      ignoreValues: ["/transparent|inherit/"],
      includeProps: ["/color/", "/shadow/", "border"],
      acceptIbmColorTokens: true,
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

testConfig({
  ruleName,
  description: "Check for invalid ignore values",
  message: "Unknown rule carbon/theme-token-use.",
  config: ["always", { ignoreValues: ["/wibble"], message: messages.expected }],
});
