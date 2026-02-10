# V4 rgba() Function Validation

## Overview

The V4 implementation validates `rgba()` function usage in the theme-use rule to ensure the first parameter (color) is a Carbon theme token.

## Validation Rules

### Function Detection
- Detects `rgba()` function calls
- Registered as a Sass color function: `sassColorFunctions = ['rgba(1)']`

### Parameter Validation
- **First parameter (color)**: MUST be a Carbon theme token
  - Accepts: SCSS variables like `$layer-01`, `$background`, `$text-primary`
  - Accepts: CSS custom properties like `var(--cds-layer-01)`
  - Rejects: Hard-coded RGB values like `rgba(100, 100, 255, 0.5)`
  - Rejects: Non-Carbon tokens

- **Remaining parameters (alpha, etc.)**: NOT validated
  - Alpha values can be any valid number (0-1, 0%-100%)
  - No restrictions on additional parameters

## Test Cases from V4

### Valid Usage
```scss
// Carbon SCSS variable with alpha
background-color: rgba($layer-01, 0.5);

// Carbon CSS custom property with alpha
background-color: rgba(var(--cds-layer-01), 0.5);
```

### Invalid Usage
```scss
// Hard-coded RGB values - REJECTED
background-color: rgba(100, 100, 255, 0.5);

// Non-Carbon token - REJECTED
background-color: rgba($custom-color, 0.5);
```

## Implementation Notes

1. **Only first parameter validated**: The color parameter must be a Carbon token
2. **Alpha parameter ignored**: Any valid alpha value is accepted
3. **Applies to theme-use rule only**: Only validates color properties
4. **SCSS and CSS support**: Works with both SCSS variables and CSS custom properties

## V5 Implementation Strategy

1. Add `isRgbaFunction()` to detect rgba() calls
2. Reuse `extractFunctionParams()` from transform validation
3. Add `validateRgbaFunction()` to validate first parameter only
4. Integrate into theme-use rule validation
5. Create comprehensive tests and fixtures

## Differences from Transform Functions

- **Transform functions**: Validate all parameters (or first N parameters)
- **rgba() function**: Only validates first parameter (color)
- **Transform functions**: Check for spacing tokens
- **rgba() function**: Checks for theme/color tokens
