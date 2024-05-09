/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { testRule } from "stylelint-test-rule-node";
import plugins from "../../../index.js";
const plugin = plugins.find((thing) => thing.ruleName === "carbon/type-use");

const {
  rule: { messages, ruleName }
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-style: none; }",
      description: "Accept reset using none"
    },
    {
      code: ".foo { font-style: inherit; }",
      description: "Accept reset using inherit"
    },
    {
      code: ".foo { font-style: initial; }",
      description: "Accept reset using initial"
    },
    {
      code: ".foo { font-style: unset; }",
      description: "Accept reset using unset"
    },
    {
      code: ".foo { font-style: italic; }",
      description: "Accept directly setting font-style"
    }
  ], // there are not type tokens used directly
  reject: [
    {
      code: ".foo { font-variant: small-caps; }",
      description: "Reject directly setting font-weight",
      message: messages.rejected("font-variant", "small-caps")
    },
    {
      code: ".foo { font-weight: 5px; }",
      description: "Reject directly setting font-weight",
      message: messages.rejected("font-weight", "5px")
    },
    {
      code: ".foo { font-size: 32px; }",
      description: "Reject directly setting font-size",
      message: messages.rejected("font-size", "32px")
    },
    {
      code: ".foo { line-height: 32px; }",
      description: "Reject directly setting line-height",
      message: messages.rejected("line-height", "32px")
    },
    {
      code: `.foo { font-family: "Times New Roman", Times, serif; }`,
      description: "Reject directly setting font-family",
      // multiple warnings look like this
      warnings: [
        {
          message: messages.rejected(
            "font-family",
            '"Times New Roman", Times, serif'
          )
        },
        {
          message: messages.rejected(
            "font-family",
            '"Times New Roman", Times, serif'
          )
        },
        {
          message: messages.rejected(
            "font-family",
            '"Times New Roman", Times, serif'
          )
        }
      ]
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-size: type-scale(1); }",
      description: "Permit Carbon type scale function."
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-family: font-family(1); }",
      description: "Permit Carbon font family function."
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-weight: font-weight('bold'); }",
      description: "Permit Carbon font weight function."
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [
    true,
    {
      carbonPath: "node_modules/@carbon",
      carbonModulePostfix: "-10"
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-size: carbon--type-scale(1); }",
      description: "Permit Carbon v10 type scale function."
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [
    true,
    {
      carbonPath: "node_modules/@carbon",
      carbonModulePostfix: "-10"
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-family: carbon--font-family(1); }",
      description: "Permit v10 Carbon font family function."
    }
  ]
});

testRule({
  plugins: [plugin],
  ruleName,
  config: [
    true,
    {
      carbonPath: "node_modules/@carbon",
      carbonModulePostfix: "-10"
    }
  ],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { font-weight: carbon--font-weight('bold'); }",
      description: "Permit v10 Carbon font weight function."
    }
  ]
});
