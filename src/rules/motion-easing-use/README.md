# Motion Token Use

This rule is intended enfoce use of Carbon theme tokens, functions, mixins and CSS classes as defined.

- [https://www.carbondesignsystem.com/guidelines/motion/overview](https://www.carbondesignsystem.com/guidelines/motion/overview)

By default it accepts undefined SCSS and CSS variables.

NOTE: Transition and animation shorthand must conform to expected order

## Default props

```js
const defaultOptions = {
  // include standard motion properties
  includeProps: [
    "transition<3>", // only permitted definition order fails otherwise
    "transition-timing-function",
    "animation<3>", // only permitted definition order fails otherwise
    "animation-timing-function",
  ],
  //  Accept reset values
  acceptValues: ["ease-out", "/ease-in(-out)?/"],
  acceptsScopes: ["motion"],
  acceptUndefinedVariables: false,
};
```

## Fix

The automatic fixes for the layout rule are as follows.

- V11: Replace `$carbon--` with `$`
- V11: Replace `carbon-motion` function with `motion`.
