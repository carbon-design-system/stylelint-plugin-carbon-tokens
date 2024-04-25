/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { tokenizeValue /*, TOKEN_TYPES */ } from "../index.js";

describe("tokenizeValue", () => {
  let spyWarn;

  beforeEach(() => {
    // The component instantiations that follow will generate a stack of
    // console errors and warnings about required props not provided or
    // conditions not met, and for the purposes of these tests we don't care.
    spyWarn = mock.method(console, "warn", () => {});
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it("Handles empty input", () => {
    assert.deepEqual(tokenizeValue(""), {
      items: [],
      raw: ""
    });
  });

  it("Handles single quoted strings", () => {
    assert.deepEqual(tokenizeValue("'a value'"), {
      items: [
        {
          type: "Quoted literal",
          value: "'a value'",
          raw: "'a value'"
        }
      ],
      raw: "'a value'"
    });
  });

  it("Handles double quoted strings", () => {
    assert.deepEqual(tokenizeValue('"a value"'), {
      items: [
        {
          type: "Quoted literal",
          value: '"a value"',
          raw: '"a value"'
        }
      ],
      raw: '"a value"'
    });
  });

  it("Handles single $variable", () => {
    assert.deepEqual(tokenizeValue("$test"), {
      items: [
        {
          type: "scss variable",
          value: "$test",
          raw: "$test"
        }
      ],
      raw: "$test"
    });
  });

  it("Handles single CSS variable", () => {
    assert.deepEqual(tokenizeValue("var(--test)"), {
      items: [
        {
          items: [
            {
              type: "Text Literal",
              value: "--test",
              raw: "--test"
            }
          ],
          type: "function",
          value: "var",
          isCalc: false,
          raw: "var(--test)"
        }
      ],
      raw: "var(--test)"
    });
  });

  it("Handles a function with multiple parameters", () => {
    assert.deepEqual(tokenizeValue("func('test', 'a value')"), {
      items: [
        {
          items: [
            {
              items: [
                {
                  type: "Item in list",
                  items: [
                    {
                      type: "Quoted literal",
                      value: "'test'",
                      raw: "'test'"
                    }
                  ],
                  raw: "'test'"
                },
                {
                  type: "Item in list",
                  items: [
                    {
                      type: "Quoted literal",
                      value: "'a value'",
                      raw: "'a value'"
                    }
                  ],
                  raw: "'a value'"
                }
              ],
              type: "Comma separated list",
              raw: "'test', 'a value'"
            }
          ],
          type: "function",
          value: "func",
          isCalc: false,
          raw: "func('test', 'a value')"
        }
      ],
      raw: "func('test', 'a value')"
    });
  });

  it("Handles calc", () => {
    assert.deepEqual(tokenizeValue("calc(100vw - 20px)"), {
      items: [
        {
          items: [
            {
              items: [
                {
                  type: "Numeric literal",
                  value: "100",
                  units: "vw",
                  raw: "100vw"
                },
                {
                  type: "operator",
                  value: "-",
                  raw: "-"
                },
                {
                  type: "Numeric literal",
                  value: "20",
                  units: "px",
                  raw: "20px"
                }
              ],
              type: "Math",
              raw: "100vw - 20px"
            }
          ],
          type: "function",
          value: "calc",
          isCalc: true,
          raw: "calc(100vw - 20px)"
        }
      ],
      raw: "calc(100vw - 20px)"
    });
  });

  it("Handles math", () => {
    assert.deepEqual(tokenizeValue("100vw - 20px"), {
      items: [
        {
          items: [
            {
              type: "Numeric literal",
              value: "100",
              units: "vw",
              raw: "100vw"
            },
            {
              type: "operator",
              value: "-",
              raw: "-"
            },
            {
              type: "Numeric literal",
              value: "20",
              units: "px",
              raw: "20px"
            }
          ],
          type: "Math",
          raw: "100vw - 20px"
        }
      ],
      raw: "100vw - 20px"
    });

    assert.deepEqual(tokenizeValue("-1 * #{$test}"), {
      items: [
        {
          items: [
            { value: "-1", type: "Numeric literal", raw: "-1", units: "" },
            { type: "operator", value: "*", raw: "*" },
            { value: "#{$test}", type: "Unknown", raw: "#{$test}" }
          ],
          type: "Math",
          raw: "-1 * #{$test}"
        }
      ],
      raw: "-1 * #{$test}"
    });

    assert.deepEqual(tokenizeValue("-1 * $test"), {
      items: [
        {
          items: [
            { value: "-1", type: "Numeric literal", raw: "-1", units: "" },
            { type: "operator", value: "*", raw: "*" },
            { value: "$test", type: "scss variable", raw: "$test" }
          ],
          type: "Math",
          raw: "-1 * $test"
        }
      ],
      raw: "-1 * $test"
    });

    assert.deepEqual(tokenizeValue("- 10px"), {
      items: [
        {
          raw: "- 10px",
          type: "Numeric literal",
          units: "px",
          value: "- 10"
        }
      ],
      raw: "- 10px"
    });

    assert.deepEqual(tokenizeValue("- - + - 10%"), {
      items: [
        {
          raw: "- - + - 10%",
          type: "Numeric literal",
          units: "%",
          value: "- - + - 10"
        }
      ],
      raw: "- - + - 10%"
    });

    assert.deepEqual(tokenizeValue("+ 10px"), {
      items: [
        {
          raw: "+ 10px",
          type: "Numeric literal",
          units: "px",
          value: "+ 10"
        }
      ],
      raw: "+ 10px"
    });

    assert.deepEqual(tokenizeValue("* 10px"), {
      items: [],
      warning:
        "It looks like you are starting some math with '*' without anything to apply it to.",
      raw: "* 10px"
    });

    assert.deepEqual(tokenizeValue("/ 10px"), {
      items: [],
      warning:
        "It looks like you are starting some math with '/' without anything to apply it to.",
      raw: "/ 10px"
    });
  });

  it("Handles multiple space separated values", () => {
    assert.deepEqual(tokenizeValue("$a $b $c"), {
      items: [
        { type: "scss variable", value: "$a", raw: "$a" },
        { type: "scss variable", value: "$b", raw: "$b" },
        { type: "scss variable", value: "$c", raw: "$c" }
      ],
      raw: "$a $b $c"
    });
  });

  it("Handles comma separated list", () => {
    assert.deepEqual(tokenizeValue("$a, $b,$c"), {
      items: [
        {
          type: "Item in list",
          items: [{ type: "scss variable", value: "$a", raw: "$a" }],
          raw: "$a"
        },
        {
          type: "Item in list",
          items: [{ type: "scss variable", value: "$b", raw: "$b" }],
          raw: "$b"
        },
        {
          type: "Item in list",
          items: [{ type: "scss variable", value: "$c", raw: "$c" }],
          raw: "$c"
        }
      ],
      raw: "$a, $b, $c", // spaces added by parse after comma
      type: "Comma separated list"
    });
  });

  it("Handles unterminated input", () => {
    assert.deepEqual(tokenizeValue("'unterminated quoted literal"), {
      items: [
        {
          value: "'",
          type: "Quoted literal",
          raw: "'"
        },
        {
          value: "unterminated",
          type: "Text Literal",
          raw: "unterminated"
        },
        {
          value: "quoted",
          type: "Text Literal",
          raw: "quoted"
        },
        {
          value: "literal",
          type: "Text Literal",
          raw: "literal"
        }
      ],
      raw: "'unterminated quoted literal"
    });
  });

  it("Treats #{$var} as an 'Other' type", () => {
    assert.deepEqual(tokenizeValue("#{$i-am-not-easily-knowable}"), {
      items: [
        {
          raw: "#{$i-am-not-easily-knowable}",
          type: "Unknown",
          value: "#{$i-am-not-easily-knowable}"
        }
      ],
      raw: "#{$i-am-not-easily-knowable}"
    });
  });

  it("Handles content split across lines", () => {
    assert.deepEqual(
      tokenizeValue(`url(
  "/graphics/settings/checkMark.svg"
)`),
      {
        items: [
          {
            isCalc: false,
            items: [
              {
                raw: '"/graphics/settings/checkMark.svg"',
                type: "Quoted literal",
                value: '"/graphics/settings/checkMark.svg"'
              }
            ],
            raw: 'url("/graphics/settings/checkMark.svg")',
            type: "function",
            value: "url"
          }
        ],
        raw: 'url(\n  "/graphics/settings/checkMark.svg"\n)'
      }
    );
  });

  it("can parse scope", () => {
    assert.deepEqual(tokenizeValue("scope.$test"), {
      items: [
        {
          type: "scss variable",
          value: "$test",
          scope: "scope",
          raw: "scope.$test"
        }
      ],
      raw: "scope.$test"
    });
  });
});
