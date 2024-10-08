# Theme Token Use

This rule is intended enforce use of Carbon theme tokens, functions, mixins and
CSS classes as defined.

- [https://www.carbondesignsystem.com/guidelines/color/overview](https://www.carbondesignsystem.com/guidelines/color/overview)
- [https://www.carbondesignsystem.com/guidelines/themes/overview](https://www.carbondesignsystem.com/guidelines/themes/overview)

It optionally allows use of Carbon color tokens and IBM color tokens.

NOTE: Use of IBM color tokens are deprecated.

By default it accepts undefined SCSS and CSS variables.

## Default props

```js
const defaultOptions = {
  // include standard color properties
  includeProps: ["/color$/", "/shadow$/<-1>", "border<-1>", "outline<-1>"],
  // Accept transparent, common reset values and 0 on its own
  acceptValues: ["/transparent|inherit|initial/", "/^0$/"],
  acceptsScopes: ["theme"],
  acceptCarbonColorTokens: false, // NOTE: use of `carbon--` prefix is v10 only
  acceptIBMColorTokensCarbonV10Only: false, // Carbon v10 only
  acceptUndefinedVariables: false,
  // preferContextFixes: false
  carbonPath: undefined // allows a different path for node_modules (supports monorepo with multiple carbon versions) e.g. packages/proj1/node_modules/@carbon
  carbonModulePostfix: undefined, // optional for use in conjunction with `carbonPath` to where a Carbon module has been renamed e.g. `-10` with a carbonPath of `node_modules/@carbon` will use `node_modules/@carbon/colors-10`
  enforceScopes: false,
  experimentalFixTheme: undefined,
  acceptCarbonCustomProp: false, // permit use of Carbon custom css properties
  carbonPrefix: 'cds', // custom carbon prefix for when using carbon custom css properties
};
```

## Fix

The automatic fixes for the theme rule are as follows.

- V11: Attempts to update V10 tokens to V11. This is limited by not all v10
  tokens mapping 1-1 to a v11 token. In some cases the property name can be used
  to refine the mapping, but in numerous cases the linter does not have the
  context to be able to make a fix. An assumption based on the primary, or first
  declared meaning of a v10 token may also be used.

Please Review all changes.

### experimentalFixTheme

Optional setting: undefined, `white`, `g10`, `g90` or `g100`

This will attempt to replace a hard coded hex value with a theme token from the
selected theme.

NOTE: If there is more than one match then the value will be replaced with a
value and note. For example `#f4f4f4` in `g10` will be replaced with
`$background /* fix: see notes */`.

In this case it is recommend that you review with respect the replaced value
with color tokens also using this value for the theme selected.

[https://carbondesignsystem.com/elements/color/tokens](https://carbondesignsystem.com/elements/color/tokens)
