# Carbon Motion Function Implementation Summary

## Overview

Successfully implemented validation for the Carbon `motion()` function in V5, which generates easing curves for animations and transitions.

## Implementation Details

### Function Signature

```scss
motion(easing_type, motion_style)
```

**Parameters:**
- `easing_type`: `'standard'` | `'entrance'` | `'exit'`
- `motion_style`: `'productive'` | `'expressive'`

**Returns:** A `cubic-bezier()` string

## Policy Decision: No Raw cubic-bezier() Support

**V5 does NOT support raw `cubic-bezier()` or `steps()` functions in the motion-easing-use rule.**

Users must use one of these approved approaches:
- Carbon motion tokens (e.g., `$duration-fast-01`, `--cds-duration-fast-01`)
- The Carbon `motion()` function (e.g., `motion(standard, productive)`)
- Standard CSS easing keywords (e.g., `ease`, `ease-in`, `ease-out`, `linear`)

**Rationale:** This decision ensures consistency with Carbon Design System patterns and prevents arbitrary timing functions that may not align with Carbon's motion principles. While the `motion()` function generates `cubic-bezier()` values internally, users should not bypass Carbon's motion system by using raw cubic-bezier values.

**Test Coverage:** [`src/__tests__/fixtures/motion-easing-use/invalid/cubic-bezier-not-supported.scss`](src/__tests__/fixtures/motion-easing-use/invalid/cubic-bezier-not-supported.scss)

### Validation Logic

**Location:** [`src/utils/validators.ts`](src/utils/validators.ts:669-702)

Two new functions were added:

1. **`isCarbonMotionFunction(value: string): boolean`**
   - Detects if a value contains a `motion()` function call
   - Uses regex: `/\bmotion\s*\(/`

2. **`validateCarbonMotionFunction(value: string): ValidationResult`**
   - Validates the parameters of the `motion()` function
   - Ensures first parameter is one of: `standard`, `entrance`, `exit`
   - Ensures second parameter is one of: `productive`, `expressive`
   - Supports optional quotes around parameters
   - Returns detailed error messages for invalid parameters

### Integration

**Location:** [`src/utils/create-rule.ts`](src/utils/create-rule.ts:8-23, 158-177)

The motion function validation was integrated into both motion rules:
- `carbon/motion-duration-use`
- `carbon/motion-easing-use`

The validation is applied before standard token validation, allowing the function to be recognized and validated with proper parameter checking.

## Test Coverage

### Unit Tests

**Location:** [`src/utils/__tests__/carbon-motion-validation.test.ts`](src/utils/__tests__/carbon-motion-validation.test.ts)

**18 tests covering:**

1. **Function Detection (4 tests)**
   - Basic motion() detection
   - Detection with quotes
   - Detection with whitespace
   - Non-motion function rejection

2. **Valid Calls (10 tests)**
   - All 6 valid combinations (3 easing types × 2 motion styles)
   - Quoted parameters
   - Whitespace handling

3. **Invalid Calls (4 tests)**
   - Invalid easing types
   - Invalid motion styles
   - Missing parameters
   - Non-motion functions

### Integration Tests

**Valid Fixtures:** [`src/__tests__/fixtures/motion-easing-use/valid/carbon-easing-tokens.scss`](src/__tests__/fixtures/motion-easing-use/valid/carbon-easing-tokens.scss)

Examples:
```scss
.motion-function {
  transition-timing-function: motion(standard, productive);
  animation-timing-function: motion(entrance, expressive);
}

.motion-exit {
  transition-timing-function: motion(exit, productive);
  animation-timing-function: motion(exit, expressive);
}

.motion-with-quotes {
  transition-timing-function: motion('standard', 'productive');
  animation-timing-function: motion("entrance", "expressive");
}
```

**Invalid Fixtures:** [`src/__tests__/fixtures/motion-easing-use/invalid/carbon-motion-functions.scss`](src/__tests__/fixtures/motion-easing-use/invalid/carbon-motion-functions.scss)

Examples:
```scss
.invalid-easing-type {
  transition-timing-function: motion(invalid, productive);
}

.invalid-motion-style {
  animation-timing-function: motion(standard, invalid);
}

.missing-second-param {
  transition-timing-function: motion(standard);
}
```

## Usage Examples

### Valid Usage

```scss
// Standard easing with productive motion
.fade-in {
  transition: opacity 300ms motion(standard, productive);
}

// Entrance easing with expressive motion
.slide-in {
  animation: slideIn 500ms motion(entrance, expressive);
}

// Exit easing with productive motion
.fade-out {
  transition: opacity 200ms motion(exit, productive);
}

// With quotes (also valid)
.animated {
  animation-timing-function: motion('standard', 'expressive');
}
```

### Invalid Usage

```scss
// ❌ Invalid easing type
.wrong {
  transition-timing-function: motion(invalid, productive);
}

// ❌ Invalid motion style
.wrong {
  animation-timing-function: motion(standard, invalid);
}

// ❌ Missing parameter
.wrong {
  transition-timing-function: motion(standard);
}

// ❌ Wrong parameter order
.wrong {
  animation-timing-function: motion(productive, standard);
}
```

## Carbon Motion Easing Values

The `motion()` function returns these cubic-bezier values:

| Easing Type | Productive | Expressive |
|-------------|-----------|------------|
| **standard** | `cubic-bezier(0.2, 0, 0.38, 0.9)` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| **entrance** | `cubic-bezier(0, 0, 0.38, 0.9)` | `cubic-bezier(0, 0, 0.3, 1)` |
| **exit** | `cubic-bezier(0.2, 0, 1, 0.9)` | `cubic-bezier(0.4, 0.14, 1, 1)` |

## V4 Compatibility

V5 maintains compatibility with V4's motion() function support:

### V4 Features Supported
- ✅ Basic `motion(easing, style)` syntax
- ✅ All 6 valid parameter combinations
- ✅ Quoted and unquoted parameters
- ✅ Whitespace tolerance

### V4 Features Not Supported
- ❌ Namespace syntax (e.g., `motion.motion()`)
- ❌ V10 prefix (e.g., `carbon--motion()`)

These were intentionally excluded from V5 as they are legacy Carbon v10 features.

## Test Results

All tests passing:
- **Unit tests:** 18/18 ✅
- **Integration tests:** All motion-easing-use fixtures passing ✅
- **Total test suite:** 169/169 tests passing ✅

## Documentation

- **Research Document:** [`CARBON_MOTION_FUNCTIONS.md`](CARBON_MOTION_FUNCTIONS.md)
- **Implementation Summary:** This document
- **Carbon Documentation:** [Motion Overview](https://carbondesignsystem.com/elements/motion/overview/)

## Related Functions

The motion() function is part of a broader set of Carbon function validations:

1. **Layout Functions**
   - `calc()` - Proportional math and token negation
   - `translate()`, `translateX()`, `translateY()`, `translate3d()` - Transform functions

2. **Theme Functions**
   - `rgba()` - Color manipulation with Carbon tokens

3. **Type Functions**
   - `type-scale()` - Typography scale
   - `font-family()` - Font family selection
   - `font-weight()` - Font weight selection

4. **Motion Functions** (this implementation)
   - `motion()` - Easing curve generation

## Summary

The Carbon motion() function implementation provides:
- ✅ Complete parameter validation
- ✅ Clear error messages
- ✅ Comprehensive test coverage
- ✅ V4 compatibility (excluding legacy features)
- ✅ Integration with both motion rules
- ✅ Support for all 6 valid parameter combinations

This completes the implementation of all major Carbon SCSS functions in V5.
