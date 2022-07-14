# Motion Token Use

This rule is intended enfoce use of Carbon theme tokens, functions, mixins and CSS classes as defined.

- [https://www.carbondesignsystem.com/guidelines/motion/overview](https://www.carbondesignsystem.com/guidelines/motion/overview)

By default it accepts undefined SCSS and CSS variables.

NOTE: Transition and animation shorthand must conform to expected order

## Default props

```js
const defaultOptions = {
  // include standard motion properites
  includeProps: [
    "transition<2>", // only permitted definition order fails otherwise
    "transition-duration",
    "animation<2>", // only permitted definition order fails otherwise
    "animation-duration",
  ],
  //  Accept reset values
  acceptValues: ["0s", "0"],
  acceptsScopes: ["motion"],
  acceptUndefinedVariables: false,
};
```

## Fix

The automatic fixes for the layout rule are as follows.

- V11: Replace `$carbon--` with `$`
- V11: Replace `$duration--` with `$duration-`
<!-- - V11: Replace `carbon-motion` function with `motion`. -->
- Replace timing literal match `$duration-0y` or `$duration--0y` token depending on version.
