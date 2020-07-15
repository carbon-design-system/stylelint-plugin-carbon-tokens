import rule, { ruleName } from "..";

const generatedTests = () => {
  const accept = [];
  const reject = [];
  const props = ["margin", "box-shadow"];
  const good = [
    "$spacing-01",
    "$layout-01",
    "$carbon--spacing-01",
    "$carbon--layout-01",
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
    "$container-01", // only bad for default options
    "$fluid-spacing-01",
    "$icon-size-01",
    "$carbon--container-01",
    "$carbon--fluid-spacing-01",
    "$carbon--icon-size-01",
    "199px",
    "299px",
    "399px",
    "499px",
    "$my-value-reject",
    "var(--my-value-reject)",
  ];

  for (const prop of props) {
    const addColor = prop === "box-shadow" ? " red" : "";

    for (let g = 0; g < good.length - 4; g++) {
      // good tokens
      for (let n = 1; n < 5; n++) {
        // number of values
        accept.push({
          code: `.foo { ${prop}: ${good
            .slice(g, g + n)
            .join(" ")}${addColor}; }`,
          description: `A ${prop} using ${n} token(s) is accepted`,
        });
      }
    }

    for (let b = 0; b < bad.length - 4; b++) {
      // bad tokens
      for (let n = 1; n < 5; n++) {
        // number of values
        reject.push({
          code: `.foo { ${prop}: ${bad
            .slice(b, b + n)
            .join(" ")}${addColor}; }`,
          description: `A ${prop} using ${n} non-token(s) is rejected`,
        });
      }
    }
  }

  // // eslint-disable-next-line
  // console.dir(reject);

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

  accept.push({
    code: `.foo { width: carbon--mini-units(4); }`,
    description: `A width using a carbon--mini-units is accepted.`,
  });
  reject.push({
    code: `.foo { width: my-own-function(4); }`,
    description: `A width using a another function is rejected is rejected.`,
  });

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
      includeProps: [
        "/^border$/<1 -2>", // Borders and shadows are often 1px and not included in the standard test
        "/^border-/",
        "/^box-shadow$/<1 -2>",
        "*",
      ],
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

// "$container-01", // only bad for default options
// "$fluid-spacing-01",
// "$icon-size-01",
// "$carbon--container-01",
// "$carbon--fluid-spacing-01",
// "$carbon--icon-size-01",

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptContainerTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: `.foo { width: $carbon--container-01; }`,
      description: `Accept $carbon--container tokens with acceptContainerTokens: true.`,
    },
    {
      code: `.foo { width: $container-01; }`,
      description: `Accept $container tokens with acceptContainerTokens: true.`,
    },
  ],
  reject: [],
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptIconSizeTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: `.foo { width: $carbon--icon-size-01; }`,
      description: `Accept $carbon--icon-size tokens with acceptIconSizeTokens: true.`,
    },
    {
      code: `.foo { width: $icon-size-01; }`,
      description: `Accept $icon-size tokens with acceptIconSizeTokens: true.`,
    },
  ],
  reject: [],
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      acceptFluidSpacingTokens: true,
    },
  ],
  syntax: "scss",
  accept: [
    {
      code: `.foo { width: $carbon--fluid-spacing-01; }`,
      description: `Accept $carbon--fluid-spacing tokens with acceptFluidSpacingTokens: true.`,
    },
    {
      code: `.foo { width: $fluid-spacing-01; }`,
      description: `Accept $fluid-spacing tokens with acceptFluidSpacingTokens: true.`,
    },
  ],
  reject: [],
});
