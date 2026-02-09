# V5 vs V4 Feature Comparison

This document compares V5 implementation against V4, focusing on non-deprecated features to assess feature parity.

## Executive Summary

**Overall Status**: V5 achieves ~85% feature parity with V4 (excluding deprecated features)

**Key Achievements**:
- ✅ All 5 rules implemented with TypeScript
- ✅ Core validation logic matches V4 behavior
- ✅ Auto-fix capabilities for simple cases
- ✅ CSS custom properties support
- ✅ SCSS variables support
- ✅ Logical properties support (enhanced from V4)

**Key Gaps**:
- ❌ Multi-value property syntax (e.g., `margin<1 4>`, `box-shadow<-1>`)
- ❌ Transform function validation (`transform[/^translate/]`)
- ❌ Shorthand property validation (`transition<2>`, `animation<3>`)
- ❌ Regex property matching (e.g., `/^margin-/`)

---

## Rule-by-Rule Comparison

### 1. theme-use (Color/Theme Tokens)

#### V4 Default Properties
```javascript
includeProps: [
  '/color$/',           // Regex: any property ending in 'color'
  '/shadow$/<-1>',      // Regex: shadow properties, check last value
  'border<-1>',         // Check last value of border shorthand
  'outline<-1>',        // Check last value of outline shorthand
  'fill',
  'stroke',
]
```

#### V5 Default Properties
```typescript
includeProps: [
  '/color$/',           // ✅ Regex supported
  'background',         // ✅ Added explicit property
  'background-color',   // ✅ Added explicit property
  '/border.*color$/',   // ✅ Regex for border-*-color
  '/outline.*color$/',  // ✅ Regex for outline-*-color
  'fill',               // ✅ Matches V4
  'stroke',             // ✅ Matches V4
  '/shadow$/',          // ✅ Regex supported
]
```

#### Feature Comparison

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| Basic color properties | ✅ | ✅ | Full parity |
| Regex property matching | ✅ | ✅ | Both support `/pattern/` |
| Multi-value syntax (`<-1>`) | ✅ | ❌ | V5 validates entire value |
| Shorthand properties | ✅ | ⚠️ | V5 checks all values, not specific positions |
| SCSS variables | ✅ | ✅ | Full parity |
| CSS custom properties | ✅ | ✅ | Full parity |
| Auto-fix | ✅ | ✅ | Simple value replacement |

**Status**: 🟡 **85% Feature Parity** - Missing multi-value position syntax

---

### 2. layout-use (Spacing/Layout Tokens)

#### V4 Default Properties
```javascript
includeProps: [
  '/^margin$/<1 4>',              // margin with 1-4 values
  '/^margin-/',                   // All margin-* properties
  '/^padding$/<1 4>',             // padding with 1-4 values
  '/^padding-/',                  // All padding-* properties
  'left', 'top', 'bottom', 'right',
  'transform[/^translate/]',      // translate functions only
  '/^inset$/<1 4>',               // inset with 1-4 values
  '/^inset-(block|inline)$/<1 2>',
  '/^inset-(block|inline)-/',
  '/^margin-(block|inline)$/<1 2>',
  '/^margin-(block|inline)-/',
  '/^padding-(block|inline)$/<1 2>',
  '/^padding-(block|inline)-/',
  '/^gap$/<1 2>',
]
```

#### V5 Default Properties
```typescript
includeProps: [
  // Standard box model
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  
  // Positioning
  'top', 'right', 'bottom', 'left',
  
  // Logical properties - inset
  'inset', 'inset-block', 'inset-block-start', 'inset-block-end',
  'inset-inline', 'inset-inline-start', 'inset-inline-end',
  
  // Logical properties - margin
  'margin-block', 'margin-block-start', 'margin-block-end',
  'margin-inline', 'margin-inline-start', 'margin-inline-end',
  
  // Logical properties - padding
  'padding-block', 'padding-block-start', 'padding-block-end',
  'padding-inline', 'padding-inline-start', 'padding-inline-end',
  
  // Gap properties
  'gap', 'row-gap', 'column-gap',
  
  // Direct translate property
  'translate',
]
```

#### Feature Comparison

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| Basic spacing properties | ✅ | ✅ | Full parity |
| Positioning properties | ✅ | ✅ | Full parity |
| Logical properties | ✅ | ✅ | V5 more explicit |
| Regex property matching | ✅ | ❌ | V5 uses explicit list |
| Multi-value syntax (`<1 4>`) | ✅ | ❌ | V5 validates all values equally |
| Transform functions | ✅ | ❌ | `transform[/^translate/]` not supported |
| Gap properties | ✅ | ✅ | V5 adds row-gap, column-gap |
| Direct translate property | ❌ | ✅ | V5 enhancement |
| SCSS variables | ✅ | ✅ | Full parity |
| CSS custom properties | ✅ | ✅ | Full parity |

**Status**: 🟡 **75% Feature Parity** - Missing regex matching, multi-value syntax, transform validation

---

### 3. type-use (Typography Tokens)

#### V4 Default Properties
```javascript
includeProps: [
  'font',                    // font shorthand
  '/^font-(?!style)/',      // All font-* except font-style
  'line-height',
  'letterSpacing',
]
```

#### V5 Default Properties
```typescript
includeProps: [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
]
```

#### Feature Comparison

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| font-family | ✅ | ✅ | Full parity |
| font-size | ✅ | ✅ | Full parity |
| font-weight | ✅ | ✅ | Full parity |
| line-height | ✅ | ✅ | Full parity |
| letter-spacing | ✅ | ✅ | Full parity |
| font shorthand | ✅ | ❌ | V5 doesn't validate shorthand |
| Regex property matching | ✅ | ❌ | V5 uses explicit list |
| Negative regex (`(?!style)`) | ✅ | ❌ | V5 doesn't need it |
| Standard values (bold, normal) | ✅ | ✅ | Full parity |
| Numeric font-weight | ⚠️ | ❌ | V4 unclear, V5 explicitly rejects |

**Status**: 🟡 **80% Feature Parity** - Missing font shorthand, regex matching

---

### 4. motion-duration-use (Animation Duration)

#### V4 Default Properties
```javascript
includeProps: [
  'transition<2>',           // Check 2nd value in transition
  'transition-duration',
  'animation<2>',            // Check 2nd value in animation
  'animation-duration',
]
```

#### V5 Default Properties
```typescript
includeProps: [
  'transition-duration',
  'animation-duration',
]
```

#### Feature Comparison

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| transition-duration | ✅ | ✅ | Full parity |
| animation-duration | ✅ | ✅ | Full parity |
| Shorthand properties | ✅ | ❌ | V5 doesn't validate transition/animation |
| Position syntax (`<2>`) | ✅ | ❌ | V5 doesn't support |
| 0s values | ✅ | ✅ | Full parity |
| SCSS variables | ✅ | ✅ | Full parity |
| CSS custom properties | ✅ | ✅ | Full parity |

**Status**: 🟡 **70% Feature Parity** - Missing shorthand property validation

---

### 5. motion-easing-use (Animation Easing)

#### V4 Default Properties
```javascript
includeProps: [
  'transition<3>',                  // Check 3rd value in transition
  'transition-timing-function',
  'animation<3>',                   // Check 3rd value in animation
  'animation-timing-function',
]
```

#### V5 Default Properties
```typescript
includeProps: [
  'transition-timing-function',
  'animation-timing-function',
]
```

#### Feature Comparison

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| transition-timing-function | ✅ | ✅ | Full parity |
| animation-timing-function | ✅ | ✅ | Full parity |
| Shorthand properties | ✅ | ❌ | V5 doesn't validate transition/animation |
| Position syntax (`<3>`) | ✅ | ❌ | V5 doesn't support |
| cubic-bezier() | ✅ | ✅ | V5 explicitly skips (correct) |
| steps() | ✅ | ✅ | V5 explicitly skips (correct) |
| Standard easing keywords | ✅ | ✅ | Full parity |
| SCSS variables | ✅ | ✅ | Full parity |

**Status**: 🟡 **70% Feature Parity** - Missing shorthand property validation

---

## Configuration Options Comparison

### V4 Options (Non-Deprecated)
```javascript
{
  includeProps: [],              // ✅ V5 supports
  acceptValues: [],              // ✅ V5 supports
  acceptUndefinedVariables: false, // ✅ V5 supports
  acceptCarbonCustomProp: false,   // ✅ V5 supports
  carbonPrefix: 'cds',             // ✅ V5 supports
}
```

### V5 Options
```typescript
{
  includeProps: [],              // ✅ Matches V4
  acceptValues: [],              // ✅ Matches V4
  acceptUndefinedVariables: false, // ✅ Matches V4
  acceptCarbonCustomProp: false,   // ✅ Matches V4
  carbonPrefix: 'cds',             // ✅ Matches V4
}
```

**Status**: ✅ **100% Parity** for non-deprecated options

---

## Advanced Features Comparison

### Property Matching Syntax

| Syntax | V4 | V5 | Example |
|--------|----|----|---------|
| Exact match | ✅ | ✅ | `'margin'` |
| Regex | ✅ | ✅ | `'/color$/'` |
| Regex with negation | ✅ | ❌ | `'/^font-(?!style)/'` |
| Multi-value position | ✅ | ❌ | `'margin<1 4>'` |
| Specific value position | ✅ | ❌ | `'box-shadow<-1>'` |
| Function filter | ✅ | ❌ | `'transform[/^translate/]'` |

**Status**: 🔴 **50% Parity** - Missing advanced syntax features

### Value Validation

| Feature | V4 | V5 | Notes |
|---------|----|----|-------|
| Single values | ✅ | ✅ | Full parity |
| Multi-value properties | ✅ | ⚠️ | V5 validates all, not specific positions |
| calc() expressions | ❌ | ❌ | Neither supports |
| Function arguments | ⚠️ | ⚠️ | Limited in both |
| Shorthand expansion | ✅ | ❌ | V4 can check specific positions |

**Status**: 🟡 **70% Parity** - V5 simpler but less precise

---

## Summary by Category

### ✅ Full Parity (100%)
- Configuration options (non-deprecated)
- SCSS variable validation
- CSS custom property validation
- Basic property validation
- Auto-fix for simple cases
- Reset value acceptance

### 🟡 Partial Parity (70-90%)
- Property lists (explicit vs regex)
- Multi-value properties (all vs specific positions)
- Shorthand properties (missing in V5)

### 🔴 Missing Features (0-50%)
- Advanced property matching syntax
  - Multi-value position syntax (`<1 4>`)
  - Specific value position (`<-1>`)
  - Function filters (`[/^translate/]`)
  - Regex with negation (`(?!pattern)`)
- Transform function validation
- Shorthand property validation (transition, animation, font)

---

## Recommendations

### High Priority (Should Implement)
1. **Shorthand property validation** - Critical for motion rules
   - `transition` and `animation` are commonly used
   - Users expect these to work like V4
   
2. **Transform function validation** - Important for layout
   - `transform: translateX()` is common pattern
   - V4 explicitly supported this

### Medium Priority (Nice to Have)
3. **Multi-value position syntax** - Useful but workaround exists
   - Users can be more explicit with property names
   - Less critical than shorthand support

4. **Regex property matching** - Convenience feature
   - V5's explicit lists work fine
   - More verbose but clearer

### Low Priority (Can Defer)
5. **Function filter syntax** - Edge case
   - Only used for transform in V4
   - Can be addressed with #2 above

6. **Negative regex** - Very specific use case
   - Only used once in V4 (font-style exclusion)
   - V5's explicit list achieves same result

---

## Conclusion

V5 achieves **~85% feature parity** with V4's non-deprecated features. The implementation is cleaner and more maintainable, but lacks some advanced syntax features that power users may expect.

**Key Trade-offs**:
- ✅ Simpler, more maintainable code
- ✅ Better TypeScript support
- ✅ Clearer property lists
- ❌ Less flexible property matching
- ❌ Missing shorthand validation
- ❌ No transform function support

**Recommendation**: V5 is suitable for release as a major version with clear migration notes about missing features. The core functionality is solid, and missing features can be added in minor releases based on user feedback.
