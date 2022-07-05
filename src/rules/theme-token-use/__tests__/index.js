/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptValues: ["/((--)|[$])my-value-accept/", "*"]
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { color: none; }",
      description: "Accept reset using none"
    },
    {
      code: ".foo { color: inherit; }",
      description: "Accept reset using inherit"
    },
    {
      code: ".foo { color: initial; }",
      description: "Accept reset using initial"
    },
    {
      code: ".foo { color: unset; }",
      description: "Accept reset using unset"
    },
    {
      code: ".foo { color: $layer-01; }",
      description: "Carbon theme token expected."
    },
    {
      code: ".foo { box-shadow: 0 0 5px $layer-01, 0 0 10px $layer-02; }",
      description: "All color tokens in split are Carbon theme tokens."
    },
    {
      code: "$my-value-accept: $layer-01; .foo { color: $my-value-accept; }",
      description:
        "Accept $variable declared before use with Carbon theme tokens."
    },
    {
      code: "--my-value-accept: $layer-01; .foo { color: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon theme tokens."
    },
    {
      code: ".foo { box-shadow: $layout-01 $layout-01 $layer-01; }",
      description:
        "Position one and two can can be non color variables three of three matches"
    },
    {
      code: ".foo { box-shadow: 0 0 $layout-01 $layer-01; }",
      description:
        "Position three of four can can be non color variables four of four matches"
    },
    {
      code: ".foo { border: 1px solid get-light-value('layer-01'); }",
      description: "Permitted function get-light-value passes"
    },
    {
      code: ".foo { color: $my-value-accept; }",
      description: "Accept undeclared $variable of defined format"
    },
    {
      code: ".foo { color: var(--my-value-accept); }",
      description: "Reject undeclared --variable by of defined format."
    }
  ],

  reject: [
    {
      code: ".foo { background-color: #f4f4f4; }",
      description: "Used #color instead of Carbon theme token expected.",
      message: messages.expected
    },
    {
      code: ".foo { box-shadow: 0 0 5px $layer-01, 0 0 10px #fefefe; }",
      description: "Used #color in a split property not Carbon theme tokens.",
      message: messages.expected
    },
    {
      code: ".foo { border: 1px solid my-value-fun($layer-01); }",
      description: "Other functions should fail my-value-fn fails"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptCarbonColorTokens: true,
      acceptIBMColorTokens: true
    }
  ],
  accept: [],
  reject: [
    {
      code: ".foo { background-color: $carbon--blue-90; }",
      description: "Reject using a carbon color token without v10 target",
      message: messages.expected
    },
    {
      code: ".foo { background-color: $ibm-color__blue-90; }",
      description: "Reject using a ibm color token without v10 target",
      message: messages.expected
    }
  ]
});

// // verify use of v10 carbon color tokens
testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptCarbonColorTokens: true,
      target: "v10"
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { background-color: $carbon--blue-90; }",
      description: "Accept using a carbon color token"
    }
  ],
  reject: [
    {
      code: ".foo { background-color: $ibm-color__blue-90; }",
      description: "Reject using a ibm color token",
      message: messages.expected
    }
  ]
});

// verify use of v10 carbon color tokens
testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptIBMColorTokens: true,
      target: "v10"
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { background-color: $ibm-color__blue-90; }",
      description: "Accept using a ibm color token"
    }
  ],
  reject: [
    // an ibm color token
    {
      code: ".foo { background-color: $carbon--blue-90; }",
      description: "Reject using a carbon color token",
      message: messages.expected
    }
  ]
});

// verify rejection of undeclared variables
testRule(rule, {
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: "$my-value-accept: $layer-01; .foo { color: $my-value-accept; }",
      description:
        "Accept $variable declared before use when acceptUndefinedVariables is false."
    },
    {
      code: "--my-value-accept: $layer-01; .foo { color: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use when acceptUndefinedVariables is false."
    }
  ],

  reject: [
    // an ibm color token
    {
      code: ".foo { color: $my-value-reject; }",
      description:
        "Reject undeclared $variable  when acceptUndefinedVariables is false.",
      message: messages.expected
    },
    {
      code: ".foo { color: var(--my-value-reject); }",
      description:
        "Reject undeclared --variable when acceptUndefinedVariables is false.",
      message: messages.expected
    }
  ]
});

// verify use of rgba with carbon theme token
testRule(rule, {
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { background-color: rgba($layer-01, 0.5); }",
      description: "Accept using a carbon theme token with rgba()",
      message: messages.expected
    }
  ],

  reject: [
    // an ibm color token
    {
      code: ".foo { background-color: rgba(100, 100, 255, 0.5); }",
      description: "Reject using a non-carbon theme token with rgba()",
      message: messages.expected
    }
  ]
});

// verify use of full and stroke with carbon theme token
testRule(rule, {
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { fill: $layer-01; }",
      description: "Accept carbon theme token for fill property by default",
      message: messages.expected
    },
    {
      code: ".foo { stroke: $layer-01; }",
      description: "Accept carbon theme token for stroke property by default",
      message: messages.expected
    }
  ],
  reject: [
    {
      code: ".foo { fill: #fefefe; }",
      description: "Reject non-carbon theme token for fill property by default",
      message: messages.expected
    },
    {
      code: ".foo { stroke: red; }",
      description:
        "Reject non-carbon theme token for stroke property by default",
      message: messages.expected
    }
  ]
});

// accept currentColor can be used as a value
testRule(rule, {
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { fill: currentColor; }",
      description: "Accept currentColor on the assumption color is valid",
      message: messages.expected
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      includeProps: ["/\\$.*do-check.*$/", "*"]
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: "$do-check-me: $layer-01;",
      description: "Should check '$do-check-me' using a carbon theme token"
    },
    {
      code: "$also-do-check-me-too: $layer-01;",
      description:
        "Should check '$also-do-check-me-too' using a carbon theme token"
    },
    {
      code: "$do-not-check-me-too: $layer-01;",
      description: "Should ignore '$do-not-check-me' using a carbon theme token"
    }
  ],
  reject: [
    {
      code: "$do-check-me: red;",
      description: "Should check '$do-check-me` not using a carbon theme token'"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptValues: ["/((--)|[$])my-value-accept/", "*"]
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `
@use '@carbon/theme';

.foo {
  background-color: theme.$layer-01;
};
`,
      description: "Should accept scoped theme token"
    }
  ],
  reject: [
    {
      code: "background-color: other.$layer-01;",
      description: "Should reject unrecognized scoped theme token"
    }
  ]
});

// Scope tests
testRule(rule, {
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { color: theme.$layer-01; }`,
      description: "Accept theme scope."
    },
    {
      code: `.foo { color: get-light-value(theme.$layer-01)}`,
      description: "Accept theme scope in function."
    }
  ],
  reject: [
    {
      code: `.foo { color: th.$layer-01; }`,
      description: "Reject scope 'th' without acceptScopes setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["th"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { color: th.$layer-01; }`,
      description: "Accept scope 'th' with acceptScopes setting."
    },
    {
      code: `.foo { color: get-light-value(th.$layer-01)}`,
      description: "Accept scope 'th' with acceptScopes setting in function."
    }
  ],
  reject: [
    {
      code: `.foo { color: theme.$layer-01; }`,
      description: "Reject theme scope with scope setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["th", "*"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { color: th.$layer-01; }`,
      description: "Accept scope 'th' with acceptScopes setting."
    },
    {
      code: `.foo { color: get-light-value(th.$layer-01)}`,
      description: "Accept scope 'th' with acceptScopes setting in function."
    },
    {
      code: `.foo { color: theme.$layer-01; }`,
      description: "Accept theme scope with scope setting including default."
    },
    {
      code: `.foo { color: get-light-value(theme.$layer-01)}`,
      description:
        "Accept theme scope in function with scope setting including default."
    }
  ],
  reject: [
    {
      code: `.foo { color: reject.$layer-01; }`,
      description: "Reject scope not included in scope setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["/^th(eme)?$/"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { color: th.$layer-01; }`,
      description: "Accept scope 'th' with acceptScopes regex setting."
    },
    {
      code: `.foo { color: get-light-value(th.$layer-01)}`,
      description:
        "Accept scope 'th' with acceptScopes regex setting in function."
    },
    {
      code: `.foo { color: theme.$layer-01; }`,
      description:
        "Accept theme scope with scope regex setting including default."
    },
    {
      code: `.foo { color: get-light-value(theme.$layer-01)}`,
      description:
        "Accept theme scope in function with scope regex setting including default."
    }
  ],
  reject: [
    {
      code: `.foo { color: reject.$layer-01; }`,
      description: "Reject scope not included in scope regex setting."
    }
  ]
});
