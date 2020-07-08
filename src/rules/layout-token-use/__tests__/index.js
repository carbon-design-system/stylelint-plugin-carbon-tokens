import rule, { ruleName } from "..";

const generatedTests = () => {
  const accept = [];
  const reject = [];
  const props = ["margin", "padding"];
  const good = [
    "$spacing-01",
    "$layout-01",
    "$container-01",
    "$fluid-spacing-01",
    "$icon-size-01",
    "$carbon--spacing-01",
    "$carbon--layout-01",
    "$carbon--container-01",
    "$carbon--fluid-spacing-01",
    "$carbon--icon-size-01",
    "100%",
    "50%",
    "100vw",
    "50vw",
    "100vh",
    "50vh",
    "0xxx",
    "$my-value-accept",
    "var(--my-value-accept)",
  ];
  const bad = [
    "1px",
    "2px",
    "3px",
    "4px",
    "$my-value-reject",
    "var(--my-value-reject)",
  ];

  for (const prop of props) {
    for (let i = 1; i < good.length; i++) {
      // good tokens
      for (let j = 0; j < bad.length; j++) {
        // bad tokens

        let start;
        let end;

        if (j === 0) {
          // no bad tokens
          start = good.length - i;
          end = Math.max(start + 4, good.length);
          accept.push({
            code: `.foo { ${prop}: ${good.slice(start, end).join(" ")}; }`,
            description: `A ${prop} using ${i} token(s) is accepted`,
          });
        } else {
          start = bad.length - j;
          end = Math.max(start + 4, bad.length);

          reject.push({
            code: `.foo { ${prop}: ${bad.slice(start, end).join(" ")}; }`,
            description: `A ${prop} using ${j} non-token(s) is rejected`,
          });
        }
      }
    }
  }

  const moreProps = ["height", "width", "left", "top", "bottom", "right"];

  for (const prop of moreProps) {
    accept.push({
      code: `.foo { ${prop}: ${good[0]}; }`,
      description: `A ${prop} using a token is accepted.`,
    });
    reject.push({
      code: `.foo { ${prop}: ${bad[0]}; }`,
      description: `A ${prop} using a non-token is rejected.`,
    });
  }

  // // eslint-disable-next-line
  // console.log(accept, reject);

  return { accept, reject };
};

const theGeneratedTests = generatedTests();

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreValues: ["/((--)|[$])my-value-accept/", "*"],
    },
  ],
  syntax: "scss",
  accept: theGeneratedTests.accept,
  reject: theGeneratedTests.reject,
});

// testConfig(rule, {
//   ruleName,
//   description: "Check for invalid ignore values",
//   message: messages.expected,
//   config: ["always", { ignoreValues: ["/wibble/"] }],
// });
