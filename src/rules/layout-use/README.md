# Layout Token Use

This rule is intended enforce use of Carbon theme tokens, functions, mixins and
CSS classes as defined.

- [https://www.carbondesignsystem.com/guidelines/layout/overview](https://www.carbondesignsystem.com/guidelines/layout/overview)

By default it accepts undefined SCSS and CSS variables.

NOTE: Transition and animation shorthand must conform to expected order

Optionally accepts container, icon size and fluid spacing tokens.

## Default props

```js
const defaultOptions = {
  // include standard layout properties
  includeProps: [
    "/^margin$/<1 4>",
    "/^margin-/",
    "/^padding$/<1 4>",
    "/^padding-/",
    "height",
    "width",
    "left",
    "top",
    "bottom",
    "right",
    "transform",
  ],
  // Accept transparent, common reset values, 0, proportional values,
  acceptValues: ["/inherit|initial/", "/^0[a-z]*$/", "/^[0-9]*(%|vw|vh)$/"],
  acceptsScopes: ["layout"],
  acceptUndefinedVariables: false,
  acceptContainerTokens: false,
  acceptIconSizeTokens: false,
  acceptFluidSpacingTokens: false,
  acceptCarbonMiniUnitsFunction: false, // V10 only
  carbonPath: undefined // allows a different path for node_modules (supports monorepo with multiple Carbon versions) e.g. packages/proj1/node_modules/@carbon
  carbonModulePostfix: undefined, // optional for use in conjunction with `carbonPath` to where a Carbon module has been renamed e.g. `-10` with a carbonPath of `node_modules/@carbon` will use `node_modules/@carbon/layout-10`
  enforceScopes: false,
};
```

## Fix

The automatic fixes for the layout rule are as follows.

- V11: Replace `$carbon--` with `$`
- V11: Replace `$layout-0x` tokens with `$spacing-0y` tokens of the same size.
- Replace pixel and rem sizes that match `$spacing-0y` token.
