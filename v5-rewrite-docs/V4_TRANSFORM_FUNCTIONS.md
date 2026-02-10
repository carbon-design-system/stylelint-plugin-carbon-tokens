# V4 Transform Function Validation

## Overview

V4 validates transform functions (translate, translateX, translateY,
translate3d) to ensure they use Carbon spacing tokens or relative units (%, vw,
vh).

## Validation Rules

### translate(x, y)

- **Parameters**: 2 required
- **Validation**: Both parameters must be:
  - Carbon spacing token ($spacing-XX)
  - Relative unit (%, vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax)
  - calc() expression with valid pattern
  - 0 (unitless or with unit)

### translateX(x) / translateY(y)

- **Parameters**: 1 required
- **Validation**: Parameter must be:
  - Carbon spacing token ($spacing-XX)
  - Relative unit (%, vw, vh, etc.)
  - calc() expression with valid pattern
  - 0 (unitless or with unit)

### translate3d(x, y, z)

- **Parameters**: 3 required
- **Validation**:
  - First 2 parameters (x, y) must follow same rules as translate()
  - Third parameter (z) is NOT validated (can be any value)

## Accepted Values

### Carbon Tokens

```scss
transform: translate($spacing-06, $spacing-04);
transform: translateX($spacing-05);
transform: translateY($spacing-03);
transform: translate3d($spacing-04, $spacing-04, 100px); // z not validated
```

### Relative Units

```scss
transform: translate(49%, 49%);
transform: translate(-48%, -48%);
transform: translateX(-20%);
transform: translateY(-20vh);
transform: translate(-20vw, $spacing-06);
transform: translate($spacing-06, -20vh);
```

### calc() Expressions

```scss
transform: translateX(calc(-1 * $spacing-05));
transform: translateY(calc(-1 * #{$spacing-05}));
transform: translateX(calc(100vw - #{$spacing-01}));
```

### Zero Values

```scss
transform: translate(0, 0);
transform: translateX(0);
transform: translateY(0px);
```

## Rejected Values

### Hard-coded Pixels/Ems

```scss
transform: translate(-20px, -1em); // ❌
transform: translate(-20px, $spacing-06); // ❌ first param
transform: translate($spacing-06, -20px); // ❌ second param
transform: translateX(-20px); // ❌
transform: translateY(-20px); // ❌
```

### translate3d with invalid first 2 params

```scss
transform: translate3d(100px, $spacing-04, 100px); // ❌ first param
transform: translate3d($spacing-04, 100px, 100px); // ❌ second param
transform: translate3d(100px, 100px, 100px); // ❌ both params
```

## Implementation Strategy for V5

1. **Function Detection**: Check if value starts with `translate(`,
   `translateX(`, `translateY(`, or `translate3d(`

2. **Parameter Extraction**: Parse function to extract parameters
   (comma-separated)

3. **Parameter Validation**: For each parameter that needs validation:
   - Check if it's a Carbon token
   - Check if it's a relative unit (%, vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi,
     vb, vmin, vmax)
   - Check if it's a calc() expression (validate using existing calc validator)
   - Check if it's 0 (with or without unit)
   - Reject hard-coded px, em, rem, etc.

4. **Special Cases**:
   - translate3d: Only validate first 2 parameters
   - Negative values are allowed
   - calc() expressions can be nested

## Error Messages

```
Expected Carbon spacing token or relative unit (%, vw, vh, svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax) for translate() parameters. Found "translate(-20px, -1em)"
```
