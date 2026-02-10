# V5 Deprecations

This document lists features that were available in V4 but are deprecated or intentionally not supported in V5.

## Deprecated Configuration Options

The following configuration options from V4 are no longer supported in V5:

### 1. `acceptCarbonFontWeightFunction`
- **Status**: Deprecated
- **Reason**: V5 does not support V10 Carbon Sass functions
- **Migration**: Use Carbon tokens directly instead of `carbon--font-weight()` function

### 2. `acceptCarbonTypeScaleFunction`
- **Status**: Deprecated  
- **Reason**: V5 does not support V10 Carbon Sass functions
- **Migration**: Use Carbon tokens directly instead of `carbon--type-scale()` function

### 3. `acceptCarbonFontFamilyFunction`
- **Status**: Deprecated
- **Reason**: V5 does not support V10 Carbon Sass functions
- **Migration**: Use Carbon tokens directly instead of `carbon--font-family()` function

### 4. `acceptCarbonMotionFunction`
- **Status**: Deprecated
- **Reason**: V5 does not support V10 Carbon Sass functions
- **Migration**: Use Carbon tokens directly instead of `carbon--motion()` function

### 5. `acceptValues` (global configuration)
- **Status**: Deprecated
- **Reason**: Replaced with per-rule configuration
- **Migration**: Configure `acceptValues` individually for each rule:
  ```javascript
  {
    "carbon/theme-use": [true, { acceptValues: [...] }],
    "carbon/layout-use": [true, { acceptValues: [...] }],
    "carbon/type-use": [true, { acceptValues: [...] }],
    "carbon/motion-duration-use": [true, { acceptValues: [...] }],
    "carbon/motion-easing-use": [true, { acceptValues: [...] }]
  }
  ```

## Intentionally Unsupported Functions

The following CSS functions are intentionally not supported in V5:

### 1. `cubic-bezier()`
- **Status**: Not supported
- **Reason**: Carbon Design System provides standardized easing tokens
- **Alternative**: Use Carbon easing tokens (`$duration-fast-01`, `$duration-moderate-01`, etc.) or standard easing keywords (`ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear`)
- **Example**:
  ```scss
  // ❌ Not supported
  transition: opacity cubic-bezier(0.4, 0.0, 0.2, 1) 200ms;
  
  // ✅ Use Carbon tokens
  transition: opacity $duration-fast-01 motion(standard, productive);
  ```

### 2. `steps()`
- **Status**: Not supported
- **Reason**: Carbon Design System provides standardized easing tokens
- **Alternative**: Use Carbon easing tokens or standard easing keywords
- **Example**:
  ```scss
  // ❌ Not supported
  animation: slide steps(4, end) 1s;
  
  // ✅ Use Carbon tokens
  animation: slide $duration-moderate-01 motion(standard, productive);
  ```

## Migration Guide

For detailed migration instructions from V4 to V5, see [`MIGRATION_V4_TO_V5.md`](./MIGRATION_V4_TO_V5.md).
