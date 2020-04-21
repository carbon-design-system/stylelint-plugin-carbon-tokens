const ruleTester = require("stylelint-test-rule-tape");
const carbonUseVariable = require("..");
const messages = carbonUseVariable.messages;

// Test for excluding non-matching properties
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: "/color/",

  accept: [{ code: ".foo { color: $ui-01; }" }],

  reject: [
    {
      code: ".foo { background-color: #f4f4f4; }",
      message: messages.expected("background-color"),
    },
    {
      code: ".foo { color: #fcfcfc; }",
      message: messages.expected("color"),
    },
  ],
});

// Test for background-color variables
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: "background-color",

  accept: [{ code: ".foo { background-color: $ui-background; }" }],

  reject: [
    {
      code: ".foo { background-color: 22; }",
      message: messages.expected("background-color"),
    },
    {
      code: ".foo { background-color: map-get($map, $val); }",
      message: messages.expected("background-color"),
    },
  ],
});

// Test for multiple values in array including regex
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: [["/color/", "background-color", "box-shadow", "border"]],

  accept: [
    { code: ".foo { color: $ui-01; }" },
    { code: ".foo { background-color: $ui-background; }" },
    { code: ".foo { box-shadow: 0 0 20px $ui-01; }" },
    { code: ".foo { box-shadow: 0 0 10px 10px $ui-01; }" },
    { code: ".foo { border: 5px solid $ui-01; }" },
  ],

  reject: [
    {
      code: ".foo { color: blue; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { background-color: blue; }",
      message: messages.expected("background-color"),
    },
    {
      code: ".foo { color: map-get($map, $val); }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { background-color: map-get($map, $val); }",
      message: messages.expected("background-color"),
    },
  ],
});

// Test for carbon color functions
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: [["/color/", "background-color"]],

  accept: [{ code: ".foo { color: get-light-value($ui-background); }" }],

  reject: [
    {
      code: ".foo { color: blue; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { background-color: blue; }",
      message: messages.expected("background-color"),
    },
  ],
});

// Test for ignoreValues by string
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: [["/color/", "background-color", { ignoreValues: ["transparent"] }]],

  accept: [
    { code: ".foo { color: get-light-value($ui-background); }" },
    { code: ".foo { color: transparent }" },
  ],

  reject: [
    {
      code: ".foo { color: blue; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { background-color: #111111; }",
      message: messages.expected("background-color"),
    },
    {
      code: ".foo { color: inherit; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { color: var(--var-name); }",
      message: messages.expected("color"),
    },
  ],
});

// Test for ignoreValues by regexp
ruleTester(carbonUseVariable.rule, {
  ruleName: carbonUseVariable.ruleName,
  config: [
    [
      "/color/",
      "background-color",
      { ignoreValues: ["/transparent|inherit/"] },
    ],
  ],

  accept: [
    { code: ".foo { color: get-light-value($ui-background); }" },
    { code: ".foo { color: transparent }" },
    { code: ".foo { color: inherit }" },
  ],

  reject: [
    {
      code: ".foo { color: initial; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { color: blue; }",
      message: messages.expected("color"),
    },
    {
      code: ".foo { background-color: #111111; }",
      message: messages.expected("background-color"),
    },
    {
      code: ".foo { color: var(--var-name); }",
      message: messages.expected("color"),
    },
  ],
});
