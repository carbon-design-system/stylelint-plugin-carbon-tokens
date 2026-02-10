# V4 Carbon Type Functions

## Overview

The V4 implementation validates three Carbon type functions in the type-use
rule. These functions are SCSS functions that return Carbon typography values.

## Supported Functions

### 1. type-scale()

- **Purpose**: Returns a Carbon type scale value (font size)
- **Usage**: `font-size: type-scale(1);`
- **V10 equivalent**: `carbon--type-scale(1)`
- **Parameters**: Accepts numeric scale values
- **Properties**: Typically used with `font-size`

### 2. font-family()

- **Purpose**: Returns a Carbon font family value
- **Usage**: `font-family: font-family(1);`
- **V10 equivalent**: `carbon--font-family(1)`
- **Parameters**: Accepts numeric or string identifiers
- **Properties**: Used with `font-family`

### 3. font-weight()

- **Purpose**: Returns a Carbon font weight value
- **Usage**: `font-weight: font-weight('bold');`
- **V10 equivalent**: `carbon--font-weight('bold')`
- **Parameters**: Accepts string weight names (e.g., 'bold', 'regular')
- **Properties**: Used with `font-weight`

## Validation Rules

### Function Detection

- Detects Carbon type functions: `type-scale()`, `font-family()`,
  `font-weight()`
- Also detects V10 variants: `carbon--type-scale()`, `carbon--font-family()`,
  `carbon--font-weight()`
- Registered as Sass functions in V4

### Validation Behavior

- **V4 accepts these functions as valid values**
- No parameter validation - any parameters are accepted
- Functions are treated as "acceptable" values, similar to Carbon tokens
- The actual validation happens at Sass compile time, not in the linter

## Test Cases from V4

### Valid Usage

```scss
// V11 functions (accepted)
font-size: type-scale(1);
font-family: font-family(1);
font-weight: font-weight('bold');

// V10 functions (accepted with carbonModulePostfix: '-10')
font-size: carbon--type-scale(1);
font-family: carbon--font-family(1);
font-weight: carbon--font-weight('bold');
```

### Invalid Usage

```scss
// Hard-coded values (rejected)
font-size: 16px;
font-family: 'Times New Roman', Times, serif;
font-weight: 5px;
```

## V5 Implementation Strategy

Since V5 does not support Carbon v10, we will:

1. **Detect Carbon type functions**: `type-scale()`, `font-family()`,
   `font-weight()`
2. **Accept them as valid values**: No parameter validation needed
3. **Do NOT support V10 variants**: `carbon--*` functions not supported
4. **Simple validation**: Just check if the value is one of these function calls

## Key Differences from Other Functions

| Aspect                | Transform/rgba               | Carbon Type Functions            |
| --------------------- | ---------------------------- | -------------------------------- |
| Parameter validation  | Yes (validates parameters)   | No (accepts any parameters)      |
| Token checking        | Checks against loaded tokens | No token checking                |
| Validation complexity | Complex (parameter parsing)  | Simple (function name detection) |
| Purpose               | Ensure correct token usage   | Allow Carbon function usage      |

## Implementation Notes

1. **No parameter validation**: Unlike `rgba()` or `translate()`, we don't
   validate parameters
2. **Function name only**: We only check if the function name matches
3. **Sass compile-time validation**: Parameter correctness is validated by Sass,
   not the linter
4. **Simple pattern matching**: Can use regex to detect function calls
5. **No V10 support**: V5 only supports V11 function names (without `carbon--`
   prefix)

## Example Implementation

```typescript
// Simple function detection
function isCarbonTypeFunction(value: string): boolean {
  return /^(type-scale|font-family|font-weight)\s*\(/.test(value.trim());
}

// Validation (just checks if it's a Carbon function)
function validateCarbonTypeFunction(value: string): ValidationResult {
  if (isCarbonTypeFunction(value)) {
    return { isValid: true };
  }
  return { isValid: false, message: 'Not a Carbon type function' };
}
```

## Integration Strategy

Unlike `rgba()` and `transform()` functions which need complex validation,
Carbon type functions just need to be recognized as valid values. We can:

1. Add detection in the validation flow
2. Mark them as valid without further checks
3. Let Sass handle parameter validation at compile time
