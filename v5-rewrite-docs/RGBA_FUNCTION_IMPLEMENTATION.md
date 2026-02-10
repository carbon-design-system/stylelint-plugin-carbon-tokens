# rgba() Function Implementation Summary

## Overview

Successfully implemented validation for CSS `rgba()` function in the V5 stylelint plugin for the theme-use rule.

## Implementation Details

### Files Modified

1. **src/utils/validators.ts** - Added 2 new validation functions:
   - `isRgbaFunction()` - Detects rgba() function calls
   - `validateRgbaFunction()` - Validates first parameter is a Carbon theme token

2. **src/utils/create-rule.ts** - Updated to:
   - Import rgba validation functions
   - Check for rgba() functions in theme-use rule
   - Apply validation for color properties

### Test Coverage

Created comprehensive test suite with **19 new tests**:

- **src/utils/__tests__/rgba-validation.test.ts**
  - 3 tests for `isRgbaFunction()`
  - 16 tests for `validateRgbaFunction()` covering:
    - Valid usage (5 tests)
    - Invalid usage (8 tests)
    - Edge cases (3 tests)

### Fixture Files

1. **src/__tests__/fixtures/theme-use/valid/rgba-functions.scss**
   - Valid Carbon SCSS variables with alpha
   - Valid Carbon CSS custom properties with alpha
   - Different alpha value formats (0, 0.25, 0.5, 1, percentages)
   - rgba() in gradients and shadows

2. **src/__tests__/fixtures/theme-use/invalid/rgba-functions.scss**
   - Hard-coded RGB values (rejected)
   - Hex colors (rejected)
   - Color keywords (rejected)
   - Unknown tokens (rejected)
   - Invalid usage in gradients and shadows

## Validation Rules

### Function Detection
- Detects `rgba()` function calls in color properties
- Only validates when used in theme-use rule

### Parameter Validation
- **First parameter (color)**: MUST be a Carbon theme token
  - ✅ Accepts: SCSS variables like `$layer-01`, `$background`, `$text-primary`
  - ✅ Accepts: CSS custom properties like `var(--cds-layer-01)`
  - ❌ Rejects: Hard-coded RGB values like `rgba(100, 100, 255, 0.5)`
  - ❌ Rejects: Hex colors like `rgba(#ffffff, 0.5)`
  - ❌ Rejects: Color keywords like `rgba(white, 0.5)`
  - ❌ Rejects: Non-Carbon tokens

- **Remaining parameters (alpha, etc.)**: NOT validated
  - Any valid alpha value is accepted (0-1, 0%-100%)
  - No restrictions on additional parameters

## Examples

### Valid Usage

```scss
/* Carbon SCSS variables */
background-color: rgba($layer-01, 0.5);
color: rgba($text-primary, 0.8);

/* Carbon CSS custom properties */
background-color: rgba(var(--cds-layer-01), 0.5);
color: rgba(var(--cds-text-primary), 0.8);

/* Different alpha formats */
background-color: rgba($layer-01, 0);
color: rgba($text-primary, 0.25);
border-color: rgba($background, 50%);

/* In gradients */
background: linear-gradient(
  to bottom,
  rgba($layer-01, 0.8),
  rgba($layer-01, 0)
);

/* In shadows */
box-shadow: 0 2px 4px rgba($layer-01, 0.1);
```

### Invalid Usage

```scss
/* Hard-coded RGB values - REJECTED */
background-color: rgba(100, 100, 255, 0.5);

/* Hex colors - REJECTED */
background-color: rgba(#ffffff, 0.5);

/* Color keywords - REJECTED */
background-color: rgba(white, 0.5);

/* Unknown tokens - REJECTED */
background-color: rgba($custom-color, 0.5);
background-color: rgba(var(--custom-color), 0.5);
```

## Test Results

- **Total Tests**: 138 (all passing)
- **New rgba Tests**: 19
- **Previous Tests**: 119 (transform, calc, token loading, rules)
- **Test Execution Time**: ~440ms

## Documentation

Created supporting documentation:
- **V4_RGBA_FUNCTION.md** - Research notes on V4 implementation patterns
- **RGBA_FUNCTION_IMPLEMENTATION.md** - This summary document

## Key Differences from Transform Functions

| Aspect | Transform Functions | rgba() Function |
|--------|-------------------|-----------------|
| Parameters validated | All (or first N) | First only (color) |
| Token type | Spacing tokens | Theme/color tokens |
| Rule | layout-use | theme-use |
| Use case | Positioning/spacing | Color with transparency |

## Next Steps

Remaining function implementations:
1. `type-scale()`, `font-family()`, `font-weight()` - type-use rule
2. `motion()` - motion-duration-use and motion-easing-use rules

## Performance Impact

- Minimal performance impact
- rgba() validation only runs for theme-use rule
- Only validates when rgba() functions are detected
- Efficient regex-based detection and parameter parsing
- Reuses existing `extractFunctionParams()` from transform validation

## Implementation Status

**V5 Function Support: 3/11 (27%)**

✅ Implemented:
- calc() - layout-use
- translate(), translateX(), translateY(), translate3d() - layout-use
- rgba() - theme-use

⏳ Remaining:
- type-scale(), font-family(), font-weight() - type-use
- motion() - motion-duration-use, motion-easing-use
