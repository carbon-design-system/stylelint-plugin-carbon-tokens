# V4 Math and calc() Support Analysis

## Overview

V4 supports **limited** math expressions and calc() functions with specific
validation rules. The goal is to allow proportional layouts and token negation
while preventing arbitrary math that could create non-standard spacing values.

## Supported Math Patterns

### 1. Proportional Math (Addition/Subtraction)

**Pattern**: `calc(P O #{$token})` where:

- `P` = Proportional unit (vw, vh, or %)
- `O` = Operator (+ or -)
- `$token` = Carbon spacing token

**Examples (ACCEPTED)**:

```scss
right: calc(100vw - #{$spacing-01});
right: calc(100% + #{$spacing-01});
right: calc(100vh - #{$spacing-01});
```

**Rationale**: Allows responsive layouts that adjust based on viewport/container
size while maintaining Carbon spacing.

### 2. Token Negation (Multiplication/Division by -1)

**Pattern**: `calc(-1 * #{$token})` or `calc(#{$token} / -1)` or
`calc(#{$token} * -1)`

**Examples (ACCEPTED)**:

```scss
// Inside calc()
right: calc(#{$spacing-01} / -1);
right: calc($spacing-01 / -1);
right: calc(-1 * #{$spacing-04});
right: calc(#{$spacing-04} * -1);

// Outside calc() (SCSS math)
right: $spacing-01 / -1;
right: -1 * $spacing-04;
right: $spacing-04 * -1;
right: -$spacing-04;
right: -(#{$spacing-04});
```

**Rationale**: Allows negating tokens for opposite directions (e.g., negative
margins) without creating new spacing values.

## Rejected Math Patterns

### 1. Fixed Unit Math

**Pattern**: `calc(px O px)` or `calc(px O #{$token})`

**Examples (REJECTED)**:

```scss
right: calc(100px - #{$spacing-01}); // ❌ px - token
right: calc(100px + #{$spacing-01}); // ❌ px + token
right: calc(100px + 100px); // ❌ px + px
right: calc(50% - 8px); // ❌ % - px (not a token)
```

**Rationale**: Fixed pixel math defeats the purpose of using tokens. Use tokens
directly instead.

### 2. Token-to-Token Math

**Pattern**: `calc($token O $token)`

**Examples (REJECTED)**:

```scss
right: calc(#{$spacing-01} + #{$spacing-01}); // ❌ token + token
```

**Rationale**: If you need to combine tokens, use a different token or define a
custom value.

### 3. Token Multiplication/Division (except -1)

**Pattern**: `calc($token * N)` or `calc($token / N)` where N ≠ -1

**Examples (REJECTED)**:

```scss
right: calc(#{$spacing-01} * 1.5); // ❌ token * number
right: calc(#{$spacing-01} / 2); // ❌ token / number
```

**Rationale**: Multiplying/dividing tokens creates arbitrary spacing values
outside the design system.

### 4. Complex Math Expressions

**Pattern**: Multiple operations or nested expressions

**Examples (REJECTED)**:

```scss
left: calc(
  #{$arbitrary-pixel-size} * #{$spacing-01} / 2
); // ❌ Multiple operations
```

**Rationale**: Complex math is difficult to validate and likely creates
non-standard values.

### 5. Non-Token Variable Math

**Pattern**: Math involving non-Carbon variables

**Examples (REJECTED)**:

```scss
$body--height: 400px;
top: -($body--height - $spacing-05); // ❌ Unknown var - token
top: ($body--height - $spacing-05); // ❌ Unknown var - token
top: $body--height - $spacing-05; // ❌ Unknown var - token
```

**Rationale**: Cannot validate that non-Carbon variables contain appropriate
values.

## Implementation Details

### V4 Validation Logic

1. **Token Parsing**: V4 uses a custom Sass parser to tokenize values into:
   - `TEXT_LITERAL`: Simple values (tokens, variables, keywords)
   - `NUMERIC_LITERAL`: Numbers with units
   - `FUNCTION`: Function calls (including calc)
   - `MATH`: Math expressions
   - `OPERATOR`: Math operators (+, -, \*, /, %)

2. **calc() Detection**: When a function named "calc" is detected, it sets
   `isCalc: true` flag

3. **Math Validation**: Inside calc(), if math is detected:
   - Call `checkProportionalMath()` first
   - If rejected, call `checkNegationMaths()`
   - If both reject, report error with `rejectedMaths` message

4. **Proportional Math Check** (`checkProportionalMath`):
   - Requires exactly 3 items: `[value, operator, value]`
   - One value must be proportional unit (vw, vh, %)
   - Operator must be + or -
   - Other value is validated as a token

5. **Negation Math Check** (`checkNegationMaths`):
   - Requires exactly 3 items: `[value, operator, value]`
   - One value must be numeric literal with value "-1" and no units
   - Operator must be \* or /
   - Other value is validated as a token

### Error Message

When math is rejected, V4 shows:

```
Expected calc of the form calc(P O #{$}) or calc(-1 * #{$}).
Where 'P' is in (vw, vh or %), 'O' is + or -,
'$' is a carbon layout token, mixin or function for "property" found "value".
```

## V5 Implementation Considerations

### Scope for V5

V5 should support the same limited math patterns as V4:

1. ✅ Proportional math: `calc(100vw - #{$spacing-01})`
2. ✅ Token negation: `calc(-1 * #{$spacing-01})` and SCSS equivalents
3. ❌ All other math patterns (reject with clear error)

### Key Differences from V4

1. **No Custom Parser**: V5 uses PostCSS, so cannot parse SCSS math outside
   calc()
   - `$spacing-01 / -1` → Not detectable in PostCSS (SCSS-only)
   - `calc($spacing-01 / -1)` → Detectable and validatable

2. **Simplified Validation**: Without custom parser, V5 can:
   - Detect calc() functions
   - Parse calc() contents as string
   - Use regex or simple parsing to validate patterns
   - Cannot validate SCSS math outside calc()

3. **Recommendation**: V5 should:
   - Support calc() with proportional and negation patterns
   - Document that SCSS math outside calc() is not validated
   - Encourage using calc() for all math expressions
   - Keep validation logic simple and maintainable

### Implementation Strategy

1. **Detect calc() in value**: Check if value contains `calc(`
2. **Extract calc() contents**: Parse string between `calc(` and `)`
3. **Pattern matching**:

   ```typescript
   // Proportional: calc(100vw - #{$spacing-01})
   const proportionalPattern =
     /calc\(\s*(\d+(?:\.\d+)?)(vw|vh|%)\s*([+-])\s*(.+?)\s*\)/;

   // Negation: calc(-1 * #{$spacing-01}) or calc(#{$spacing-01} / -1)
   const negationPattern =
     /calc\(\s*(?:(-1)\s*([*\/])\s*(.+?)|(.+?)\s*([*\/])\s*(-1))\s*\)/;
   ```

4. **Validate token**: Extract token reference and validate against Carbon
   tokens
5. **Report errors**: Use similar message format as V4

## Test Cases for V5

### Should Accept

```scss
// Proportional math
right: calc(100vw - #{$spacing-01});
right: calc(100% + #{$spacing-01});
right: calc(100vh - #{$spacing-01});

// Token negation
right: calc(#{$spacing-01} / -1);
right: calc($spacing-01 / -1);
right: calc(-1 * #{$spacing-04});
right: calc(#{$spacing-04} * -1);
```

### Should Reject

```scss
// Fixed unit math
right: calc(100px - #{$spacing-01});
right: calc(100px + 100px);
right: calc(50% - 8px);

// Token-to-token
right: calc(#{$spacing-01} + #{$spacing-01});

// Arbitrary multiplication
right: calc(#{$spacing-01} * 1.5);

// Complex expressions
left: calc(#{$arbitrary-pixel-size} * #{$spacing-01} / 2);
```

## Summary

V4's math support is **intentionally limited** to:

1. Proportional layouts (viewport/percentage + token)
2. Token negation (multiply/divide by -1)

This prevents developers from creating arbitrary spacing values while still
allowing common responsive layout patterns. V5 should maintain this philosophy
but with simpler implementation using PostCSS instead of custom Sass parsing.
