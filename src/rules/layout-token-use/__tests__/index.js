import rule, { ruleName } from "..";

const generatedTests = () => {
  const accept = [];
  const reject = [];
  const props = ["margin"];
  const good = [
    "$spacing-01",
    "$layout-01",
    "-$spacing-01",
    "-$layout-01",
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
    for (let g = 0; g < good.length - 4; g++) {
      // good tokens
      for (let n = 1; n < 5; n++) {
        // number of values
        accept.push({
          code: `.foo { ${prop}: ${good.slice(g, g + n)}; }`,
          description: `A ${prop} using ${n} token(s) is accepted`,
        });
      }
    }

    for (let b = 0; b < bad.length - 4; b++) {
      // bad tokens
      for (let n = 1; n < 5; n++) {
        // number of values
        reject.push({
          code: `.foo { ${prop}: ${bad.slice(b, b + n)}; }`,
          description: `A ${prop} using ${n} non-token(s) is rejected`,
        });
      }
    }
  }

  // // eslint-disable-next-line
  // console.dir(reject);

  const moreProps = ["left", "top", "bottom", "right"];

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
      code: `.foo { left: $carbon--container-01; }`,
      description: `Accept $carbon--container tokens with acceptContainerTokens: true.`,
    },
    {
      code: `.foo { left: $container-01; }`,
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
      code: `.foo { left: $carbon--icon-size-01; }`,
      description: `Accept $carbon--icon-size tokens with acceptIconSizeTokens: true.`,
    },
    {
      code: `.foo { left: $icon-size-01; }`,
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
      code: `.foo { left: $carbon--fluid-spacing-01; }`,
      description: `Accept $carbon--fluid-spacing tokens with acceptFluidSpacingTokens: true.`,
    },
    {
      code: `.foo { left: $fluid-spacing-01; }`,
      description: `Accept $fluid-spacing tokens with acceptFluidSpacingTokens: true.`,
    },
  ],
  reject: [],
});

testRule(rule, {
  ruleName,
  config: [true, { acceptCarbonMiniUnitsFunction: true }],
  syntax: "scss",
  accept: [
    {
      code: `.foo { left: carbon--mini-units(4); }`,
      description: `A left using a carbon--mini-units is accepted with option.`,
    },
    {
      code: `.foo { left: mini-units(4); }`,
      description: `A left using a mini-units is accepted with option.`,
    },
  ],
});

testRule(rule, {
  ruleName,
  config: true,
  syntax: "scss",
  reject: [
    {
      code: `.foo { left: carbon--mini-units(4); }`,
      description: `A left using a carbon--mini-units is rejected without option "acceptCaronMiniUnitsFunction".`,
    },
    {
      code: `.foo { left: mini-units(4); }`,
      description: `A left using a mini-units is rejected without option "acceptCaronMiniUnitsFunction".`,
    },
  ],
});
