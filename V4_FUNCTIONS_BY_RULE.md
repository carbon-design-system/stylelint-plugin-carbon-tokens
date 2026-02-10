# Function Support in V4 (Relevant for V5)

This document lists all functions supported in V4, organized by rule. Includes both Carbon-specific functions and standard CSS/SCSS functions that receive special handling.

---

## Summary

| Rule | Carbon v11 Functions | CSS/SCSS Functions | Total | V4 Support | V5 Support |
|------|---------------------|-------------------|-------|------------|------------|
| theme-use | 0 | 1 | 1 | ✅ Yes | ❌ No |
| layout-use | 0 | 5 | 5 | ✅ Yes | ❌ No |
| type-use | 3 | 0 | 3 | ✅ Yes | ❌ No |
| motion-duration-use | 1 | 0 | 1 | ✅ Yes | ❌ No |
| motion-easing-use | 1 | 0 | 1 | ✅ Yes | ❌ No |
| **Total** | **5** | **6** | **11** | **11** | **0** |

---

## 1. theme-use (Color/Theme Functions)

### Carbon v11 Functions
**None** - Theme values are accessed via tokens only

### CSS/SCSS Functions

#### 1. `rgba()`
- **Type**: SCSS/CSS color function
- **Purpose**: Create colors with alpha transparency
- **Validation**: Accepts if first parameter is a Carbon token
- **Example**: `background-color: rgba($layer-01, 0.5);`
- **V4 Support**: ✅ Yes - validates token in first parameter
- **V5 Support**: ❌ No - would reject entire value
- **Common Usage**: Semi-transparent backgrounds, overlays

**Source:** `.v4-src/rules/theme-use/utils/initSassFunctions.js:8`

**V4 Behavior:**
- ✅ Accepts: `rgba($layer-01, 0.5)` - Carbon token with alpha
- ❌ Rejects: `rgba(100, 100, 255, 0.5)` - Hard-coded RGB values

---

## 2. layout-use (Spacing/Layout Functions)

### Carbon v11 Functions
**None** - Layout values are accessed via tokens only

### CSS/SCSS Functions

#### 1. `calc()`
- **Type**: CSS math function
- **Purpose**: Perform calculations with mixed units
- **Validation**: Special rules for Carbon token usage
- **V4 Support**: ✅ Yes - validates specific patterns
- **V5 Support**: ❌ No - not yet implemented
- **Common Usage**: Responsive spacing, viewport-relative positioning

**Accepted Patterns:**
```scss
// Viewport/percentage with token
calc(100vw - #{$spacing-01})
calc(100% + #{$spacing-01})
calc(100vh - #{$spacing-01})

// Token negation
calc(-1 * #{$spacing-04})
calc(#{$spacing-04} * -1)
calc(#{$spacing-04} / -1)
calc($spacing-01 / -1)
```

**Rejected Patterns:**
```scss
// Pixel values with tokens
calc(100px - #{$spacing-01})  // ❌
calc(100px + #{$spacing-01})  // ❌

// Token arithmetic
calc(#{$spacing-01} + #{$spacing-01})  // ❌
calc(#{$spacing-01} * 1.5)  // ❌

// Pure pixel math
calc(100px + 100px)  // ❌
calc(50% - 8px)  // ❌
```

**Source:** `.v4-src/rules/layout-use/utils/getLayoutInfo.js:66`

#### 2. `translate()`
- **Type**: CSS transform function
- **Purpose**: 2D translation
- **Validation**: Parameters must be Carbon tokens or relative units (%, vw, vh)
- **Example**: `transform: translate($spacing-06, -20vh);`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ No
- **Common Usage**: Positioning, centering

#### 3. `translateX()`
- **Type**: CSS transform function
- **Purpose**: Horizontal translation
- **Validation**: Parameter must be Carbon token or relative unit
- **Example**: `transform: translateX($spacing-05);`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ No
- **Common Usage**: Horizontal positioning

#### 4. `translateY()`
- **Type**: CSS transform function
- **Purpose**: Vertical translation
- **Validation**: Parameter must be Carbon token or relative unit
- **Example**: `transform: translateY(calc(-1 * $spacing-05));`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ No
- **Common Usage**: Vertical positioning

#### 5. `translate3d()`
- **Type**: CSS transform function
- **Purpose**: 3D translation
- **Validation**: First two parameters must be Carbon tokens or relative units
- **Example**: `transform: translate3d($spacing-04, $spacing-04, 100px);`
- **V4 Support**: ✅ Yes - validates first 2 params only
- **V5 Support**: ❌ No
- **Common Usage**: Hardware-accelerated transforms
- **Note**: Third parameter (Z-axis) not validated

**Source:** `.v4-src/rules/layout-use/utils/getLayoutInfo.js:59-64`

**V4 Behavior:**
- ✅ Accepts: `translate(49%, 49%)` - Relative values
- ✅ Accepts: `translate($spacing-06, -20vh)` - Token + relative
- ✅ Accepts: `translateX(calc(-1 * $spacing-05))` - Token in calc
- ❌ Rejects: `translate(-20px, -1em)` - Hard-coded units
- ❌ Rejects: `translateX(-20px)` - Hard-coded pixels

---

## 3. type-use (Typography Functions)

### Carbon v11 Functions

#### 1. `type-scale()`
- **Type**: Carbon typography function
- **Purpose**: Get type scale value by index
- **Parameters**: `(index: number)`
- **Example**: `font-size: type-scale(1);`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ Not yet implemented
- **Common Usage**: Responsive typography, dynamic font sizing

#### 2. `font-family()`
- **Type**: Carbon typography function
- **Purpose**: Get font family by index or name
- **Parameters**: `(index: number | name: string)`
- **Example**: `font-family: font-family('mono');`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ Not yet implemented
- **Common Usage**: Font family management, theme switching

#### 3. `font-weight()`
- **Type**: Carbon typography function
- **Purpose**: Get font weight by name
- **Parameters**: `(name: string)`
- **Example**: `font-weight: font-weight('semibold');`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ Not yet implemented
- **Common Usage**: Consistent font weight application

**Source:** `.v4-src/rules/type-use/utils/initTypeTokens.js:51-64`

### CSS/SCSS Functions
**None** - No special CSS function handling for type-use

---

## 4. motion-duration-use (Animation Duration Functions)

### Carbon v11 Functions

#### 1. `motion()`
- **Type**: Carbon motion function
- **Purpose**: Get motion duration value by name
- **Parameters**: `(name: string)`
- **Example**: `transition-duration: motion('fast-01');`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ Not yet implemented
- **Common Usage**: Consistent animation timing
- **Note**: Same function name used for both duration and easing

**Source:** `.v4-src/rules/motion-duration-use/utils/initMotionThemeTokens.js:14`

### CSS/SCSS Functions
**None** - No special CSS function handling for motion-duration-use

---

## 5. motion-easing-use (Animation Easing Functions)

### Carbon v11 Functions

#### 1. `motion()`
- **Type**: Carbon motion function
- **Purpose**: Get motion easing curve
- **Parameters**: `(curve: string, mode?: string)`
- **Example**: `transition-timing-function: motion('standard', 'productive');`
- **V4 Support**: ✅ Yes
- **V5 Support**: ❌ Not yet implemented
- **Common Usage**: Consistent easing curves
- **Note**: Same function name used for both duration and easing

**Source:** `.v4-src/rules/motion-easing-use/utils/initMotionEasingTokens.js:12-35`

### CSS/SCSS Functions

**Note:** V4 explicitly skips validation for `cubic-bezier()` and `steps()` as they are standard CSS easing functions. V5 also skips these via `shouldSkipValue`.

---

## Usage Examples

### theme-use: rgba()
```scss
// Valid - Carbon token with alpha
.overlay {
  background-color: rgba($layer-01, 0.5);
}

// Invalid - Hard-coded RGB
.overlay {
  background-color: rgba(100, 100, 255, 0.5);  // ❌
}
```

### layout-use: calc()
```scss
// Valid patterns
.sidebar {
  right: calc(100vw - #{$spacing-01});
  left: calc(100% + #{$spacing-01});
  top: calc(-1 * #{$spacing-04});
}

// Invalid patterns
.sidebar {
  right: calc(100px - #{$spacing-01});  // ❌ px with token
  left: calc(#{$spacing-01} * 1.5);  // ❌ token multiplication
}
```

### layout-use: translate functions
```scss
// Valid
.centered {
  transform: translate(-50%, -50%);
  transform: translate($spacing-06, -20vh);
  transform: translateX(calc(-1 * $spacing-05));
}

// Invalid
.positioned {
  transform: translate(-20px, -1em);  // ❌ hard-coded units
  transform: translateX(-20px);  // ❌ hard-coded pixels
}
```

### type-use: Carbon functions
```scss
.heading {
  font-size: type-scale(5);
  font-family: font-family('sans');
  font-weight: font-weight('semibold');
}
```

### motion: Carbon functions
```scss
.button {
  transition-duration: motion('fast-01');
  transition-timing-function: motion('entrance', 'productive');
}
```

---

## V5 Implementation Status

### ❌ Not Yet Implemented (11 functions)

**Carbon Functions (5):**
1. `type-scale()` - High priority
2. `font-family()` - High priority
3. `font-weight()` - Medium priority
4. `motion()` for duration - High priority
5. `motion()` for easing - High priority

**CSS/SCSS Functions (6):**
1. `rgba()` - Medium priority (theme-use)
2. `calc()` - High priority (layout-use)
3. `translate()` - High priority (layout-use)
4. `translateX()` - High priority (layout-use)
5. `translateY()` - High priority (layout-use)
6. `translate3d()` - Medium priority (layout-use)

### Current V5 Behavior

- All function calls are parsed but not specially validated
- Functions would fail validation unless they match token patterns
- `cubic-bezier()` and `steps()` are explicitly skipped in motion-easing-use

---

## Implementation Priority

### High Priority (Commonly Used)
1. **`calc()`** - Essential for responsive layouts
2. **`translate()` family** - Common for positioning
3. **`type-scale()`** - Very common for responsive typography
4. **`font-family()`** - Common for font management
5. **`motion()`** - Used for animations

### Medium Priority (Less Common)
6. **`rgba()`** - Useful for transparency
7. **`font-weight()`** - Less common, usually use tokens
8. **`translate3d()`** - Less common than 2D transforms

---

## Technical Implementation Notes

### V4 Function Validation Approach

**For CSS Functions (calc, translate, rgba):**
- Defined as "CSS" source functions
- Always accepted (`accept: true`)
- Parameters validated to contain Carbon tokens
- Special rules for calc() patterns

**For Carbon Functions:**
- Defined with function name
- Parameters not deeply validated
- Function call itself validates as Carbon usage

**Source:** `.v4-src/utils/testItem.js:357-466`

### V5 Implementation Requirements

To support these functions in V5:

1. **Enhanced Parser**
   - Already identifies functions
   - Need to extract and validate parameters

2. **Function Registry**
   - Define allowed functions per rule
   - Specify validation rules per function

3. **Parameter Validation**
   - Validate calc() patterns
   - Validate translate() parameters
   - Validate rgba() first parameter

4. **Special Cases**
   - calc() needs pattern matching
   - translate3d() only validates first 2 params
   - rgba() only validates first param

---

## Conclusion

V4 supports **11 total functions**:
- **5 Carbon v11 functions** (type, motion)
- **6 CSS/SCSS functions** (rgba, calc, translate family)

V5 currently supports **0 functions** with special handling.

**Most Impactful to Implement:**
1. `calc()` - Essential for responsive layouts
2. `translate()` family - Common positioning pattern
3. `type-scale()` - Common typography pattern

**Impact:** Without function support, users cannot use common CSS patterns like `calc(100% - $spacing-05)` or `translate($spacing-06, -50%)`, significantly limiting the plugin's usefulness.
