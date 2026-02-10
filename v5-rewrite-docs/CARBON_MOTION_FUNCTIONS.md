# Carbon Motion Functions Research

## Overview

Carbon provides a `motion()` function in the `@carbon/motion` package that
generates easing curves for animations and transitions.

## Function Signature

```javascript
motion(easing_type, motion_style);
```

### Parameters

1. **easing_type** (required): The type of easing curve
   - `'standard'` - Standard easing for most transitions
   - `'entrance'` - Easing for elements entering the view
   - `'exit'` - Easing for elements leaving the view

2. **motion_style** (required): The motion style
   - `'productive'` - Faster, more efficient motion (default for most UI)
   - `'expressive'` - Slower, more dramatic motion

### Return Value

Returns a `cubic-bezier()` string that can be used directly in CSS.

## Easing Curve Values

| Easing Type | Productive                        | Expressive                        |
| ----------- | --------------------------------- | --------------------------------- |
| Standard    | `cubic-bezier(0.2, 0, 0.38, 0.9)` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| Entrance    | `cubic-bezier(0, 0, 0.38, 0.9)`   | `cubic-bezier(0, 0, 0.3, 1)`      |
| Exit        | `cubic-bezier(0.2, 0, 1, 0.9)`    | `cubic-bezier(0.4, 0.14, 1, 1)`   |

## Usage Examples

### SCSS Usage

```scss
// Using motion() function
.element {
  transition: opacity $duration-fast-01 motion(standard, productive);
  animation: slide-in $duration-moderate-02 motion(entrance, expressive);
}

// Using with multiple transitions
.multi {
  transition:
    background-color $duration-slow-02 motion(exit, expressive),
    opacity $duration-moderate-02 motion(exit, expressive);
}
```

### JavaScript Usage

```javascript
import { motion } from '@carbon/motion';

// Returns 'cubic-bezier(0.2, 0, 0.38, 0.9)'
const standardEasing = motion('standard', 'productive');

// Returns 'cubic-bezier(0, 0, 0.38, 0.9)'
const entranceEasing = motion('entrance', 'productive');

// Returns 'cubic-bezier(0.2, 0, 1, 0.9)'
const exitEasing = motion('exit', 'productive');
```

## V4 Support

V4 supported the `motion()` function in both:

- **motion-duration-use**: Validated in transition/animation shorthand
  properties
- **motion-easing-use**: Validated in timing-function properties

### V4 Examples from Tests

```scss
// Valid in V4
.foo {
  transition: background-color $duration-slow-02 motion(exit, expressive);
}

.bar {
  transition:
    background-color $duration-slow-02 motion(exit, expressive),
    opacity $duration-moderate-02 motion(exit, expressive);
}

// With namespace (V10 support)
.baz {
  transition: background-color $duration-slow-02 motion.motion(exit, expressive);
}

// V10 prefix
.qux {
  transition: background-color $duration-slow-02
    carbon--motion(standard, productive);
}
```

## V5 Implementation Plan

### Current Status

V5 implementation status:

- ✅ Validates `motion()` function calls with parameter checking
- ✅ Validates standard CSS easing keywords (linear, ease, ease-in, etc.)
- ❌ Does NOT accept raw `cubic-bezier()` functions (policy decision)
- ❌ Does NOT accept `steps()` functions (policy decision)

**Policy Decision:** V5 requires users to use Carbon tokens, the `motion()`
function, or standard CSS keywords. Raw cubic-bezier and steps functions are not
supported to ensure consistency with Carbon Design System patterns.

### Implementation Approach (COMPLETED)

Similar to Carbon type functions (type-scale, font-family, font-weight), we
implemented:

1. **Detect `motion()` function calls** in property values ✅
2. **Validate parameters**:
   - First parameter must be: `standard`, `entrance`, or `exit`
   - Second parameter must be: `productive` or `expressive`
3. **Apply to both rules**:
   - `carbon/motion-duration-use` - for shorthand properties
   - `carbon/motion-easing-use` - for timing-function properties

### Validation Logic

```typescript
function isCarbonMotionFunction(value: string): boolean {
  return /\bmotion\s*\(/.test(value);
}

function validateCarbonMotionFunction(value: string): boolean {
  const match = value.match(
    /\bmotion\s*\(\s*['"]?(standard|entrance|exit)['"]?\s*,\s*['"]?(productive|expressive)['"]?\s*\)/
  );
  return match !== null;
}
```

### Test Cases

**Valid:**

```scss
transition-timing-function: motion(standard, productive);
transition-timing-function: motion(entrance, expressive);
transition-timing-function: motion(exit, productive);
animation-timing-function: motion(standard, expressive);
```

**Invalid:**

```scss
transition-timing-function: motion(invalid, productive);
transition-timing-function: motion(standard, invalid);
transition-timing-function: motion(standard);
transition-timing-function: motion();
```

## References

- [Carbon Motion Documentation](https://carbondesignsystem.com/elements/motion/overview/)
- [Carbon Motion Package](https://github.com/carbon-design-system/carbon/tree/main/packages/motion)
- V4 Implementation: `.v4-src/rules/motion-easing-use/`
