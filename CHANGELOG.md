# Changelog

## 5.0.2 (2026-04-21)

### 🐛 Bug Fixes

- **gradient validation**: Fix parsing of multi-line gradient functions with
  spacing tokens as position values
  - Updated `extractFunctionParams()` regex to support multi-line function calls
    by adding the `s` (dotAll) flag
  - Gradients with newlines and whitespace are now properly parsed
  - Added test cases for multi-line gradients with spacing tokens as position
    values

## 5.0.1 (2026-04-20)

- docs: Remove alpha references from README
- docs: Update installation instructions to use stable release

## 5.0.0 (2026-04-20)

### 🎉 Major Release

Version 5.0.0 is a complete TypeScript rewrite of
stylelint-plugin-carbon-tokens, focused on Carbon Design System v11+ with modern
CSS support, comprehensive validation, and enhanced developer experience.

### ✨ Features

#### Core Capabilities

- **Complete TypeScript rewrite** - Full type safety and better maintainability
- **All 5 Carbon token rules** - theme-use, layout-use, type-use,
  motion-duration-use, motion-easing-use
- **11 functions validated** - calc(), rgba(), translate family (4), Carbon v11
  functions (5)
- **Comprehensive shorthand support** - Full parsing, validation, and auto-fix
  for transition, animation, font, border, outline
- **Modern CSS support** - Modern viewport units (svw, lvw, dvw, etc.), logical
  properties, direct translate property
- **Enhanced validation** - Better error messages, more comprehensive checks
- **Auto-fix capabilities** - Automatic fixes for common violations with 1:1
  token mappings

#### Gradient Validation (New in 5.0.0)

- **Three validation modes** for theme-use rule:
  - `undefined` (light-touch): Skip gradient validation entirely (default,
    maintains backward compatibility)
  - `'recommended'`: Validate color stops, allow Carbon tokens, transparent, and
    semi-transparent white/black via rgba()
  - `'strict'`: Only allow Carbon tokens and transparent keyword
- **Full gradient support** - linear-gradient, radial-gradient, conic-gradient
- **Smart parsing** - Properly handles gradient syntax (directions, angles,
  positions, sizes)
- **Targeted validation** - Validates individual color stops while allowing
  gradient-specific parameters
- **41 new tests** added for gradient parsing and validation

#### Configuration & Presets

- **Three preset configurations**:
  - `recommended` - Balanced validation with practical exceptions
  - `strict` - Maximum enforcement of Carbon Design System best practices
  - `light-touch` - Minimal validation for gradual adoption
- **Simplified configuration** - Cleaner syntax, regex patterns including
  negative lookahead
- **Component-specific variables** - `validateVariables` option for
  project-specific design tokens
- **Local variable tracking** - `trackFileVariables` option to resolve
  file-level SCSS variable declarations

### 📚 Documentation

- **Comprehensive README** - Complete usage guide with examples
- **Migration guides** - V4→V5 migration at MIGRATION.md, V3→V4 reference at
  MIGRATION_V3_TO_V4.md
- **Advanced examples** - Real-world scenarios, integration examples,
  troubleshooting guides
- **Gradient validation docs** - Detailed documentation for validateGradients
  option behavior
- **Rule documentation** - Individual README files for each rule

### 🔧 Infrastructure

- **Modern tooling** - GitHub Actions with Node.js 20.x and 22.x, npm instead of
  yarn
- **Prettier configured** - Optimal TypeScript formatting settings
- **Comprehensive testing** - 263+ tests passing, 95.17% branch coverage
- **Stylelint v16 & v17** - Support for both Stylelint v16.26.1+ and v17.0.0+

### 💥 Breaking Changes

#### Removed Features

- **Carbon v10 removed** - Only Carbon v11+ is supported
- **Node.js 20+ required** - Minimum Node.js version increased from 18
- **Scope options removed** - acceptScopes, enforceScopes no longer available
- **Custom Carbon paths removed** - carbonPath, carbonModulePostfix options
  removed
- **IBM color tokens removed** - ibm-color() function no longer supported
- **Theme-specific fixes removed** - experimentalFixTheme option removed
- **Mini-units function removed** - acceptCarbonMiniUnitsFunction option removed
  (v10 only)

#### Syntax Changes

- **Position syntax deprecated** - Use simple property names instead of `<1 4>`
  syntax
- **Function filter syntax deprecated** - Direct validation replaces
  `[/^translate/]` syntax
- **cubic-bezier() not supported** - Must use Carbon tokens or motion() function
- **steps() not supported** - Must use Carbon tokens or motion() function

### 🐛 Bug Fixes

Throughout the beta period, numerous fixes were implemented:

- Fixed CSS custom property validation to only accept known Carbon tokens
- Fixed validation of CSS custom properties with fallback values
- Fixed recognition of negative SCSS variables (e.g., `-$spacing-07`)
- Fixed box-shadow length values validation
- Fixed non-spacing transform functions validation
- Fixed token name formatting for theme tokens
- Fixed negative proportional values validation
- Fixed deprecation warnings for context.fix usage
- Improved type safety by removing `as any` casts

### 📦 What's Included

- 5 fully implemented rules with auto-fix
- 263+ comprehensive tests
- Complete TypeScript type definitions
- Three preset configurations (recommended, strict, light-touch)
- Extensive documentation and examples
- Support for Stylelint v16 and v17

### 🚀 Migration from V4

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions. Key
changes:

1. Update to Carbon v11+ if not already done
2. Remove deprecated configuration options
3. Update Node.js to version 20+
4. Review gradient validation settings (new feature)
5. Test with the new validation rules

---

## 5.0.0-beta.1 (2026-04-08)

### ✨ Features

- **Gradient validation** - Added `validateGradients` option to theme-use rule
  - Three modes: `undefined` (light-touch), `'recommended'`, and `'strict'`
  - `undefined`: Skip gradient validation entirely (default, maintains backward
    compatibility)
  - `'recommended'`: Validate color stops, allow Carbon tokens, transparent, and
    semi-transparent white/black via rgba()
  - `'strict'`: Only allow Carbon tokens and transparent keyword
  - Supports all gradient types: linear-gradient, radial-gradient,
    conic-gradient
  - Properly handles gradient syntax (directions, angles, positions, sizes)
  - Validates individual color stops while allowing gradient-specific parameters
  - 41 new tests added for gradient parsing and validation

### 📚 Documentation

- Added comprehensive gradient validation documentation to README
- Created gradient test fixtures for valid and invalid cases
- Documented validateGradients option behavior for each config preset
- Added inline comments in config files showing alternative options
- Updated MIGRATION.md with gradient validation examples

### 🔧 Configuration

- **light-touch**: `validateGradients` omitted (undefined) - No gradient
  validation
- **recommended**: `validateGradients: 'recommended'` - Validate with
  white/black rgba exceptions
- **strict**: `validateGradients: 'strict'` - Strict Carbon token enforcement

### 🐛 Bug Fixes

- Fixed option validation schema to include `validateGradients` option
- Improved type safety by removing `as any` casts in favor of proper type
  assertions

## 5.0.0-beta.0 (2026-03-06)

### 🎉 Beta Release

V5 is now feature-complete and ready for beta testing! This is a complete
rewrite focused on Carbon v11+ with TypeScript.

### ✨ Features

- **Complete TypeScript rewrite** - Full type safety and better maintainability
- **All 5 rules implemented** - theme-use, layout-use, type-use,
  motion-duration-use, motion-easing-use
- **11 functions validated** - calc(), rgba(), translate family (4), Carbon v11
  functions (5)
- **Comprehensive shorthand support** - Full parsing, validation, and auto-fix
  for transition, animation, font, border, outline
- **Modern CSS support** - Modern viewport units (svw, lvw, dvw, etc.), logical
  properties, direct translate property
- **Enhanced validation** - Better error messages, more comprehensive checks
- **Simplified configuration** - Cleaner syntax, regex patterns including
  negative lookahead
- **Advanced usage examples** - Real-world scenarios, integration examples,
  troubleshooting guides

### 📚 Documentation

- **Streamlined documentation** - Removed development artifacts, kept only
  essential user-facing docs
- **Migration guide** - Comprehensive V4→V5 migration instructions at
  MIGRATION.md
- **V3→V4 reference** - Historical migration guide at MIGRATION_V3_TO_V4.md
- **Advanced examples** - Added extensive usage examples covering real-world
  scenarios

### 🔧 Infrastructure

- **GitHub Actions updated** - Modern Node.js versions (20.x, 22.x), npm instead
  of yarn, main branch
- **Prettier configured** - Optimal TypeScript formatting settings
- **Test coverage** - 263 tests passing, 95.17% branch coverage

### 💥 Breaking Changes

- **Carbon v10 removed** - Only Carbon v11+ is supported
- **Node.js 20+ required** - Minimum Node.js version increased
- **Scope options removed** - acceptScopes, enforceScopes no longer available
- **Custom Carbon paths removed** - carbonPath, carbonModulePostfix options
  removed
- **Position syntax deprecated** - Use simple property names instead of `<1 4>`
  syntax
- **Function filter syntax deprecated** - Direct validation replaces
  `[/^translate/]` syntax
- **cubic-bezier() not supported** - Must use Carbon tokens or motion() function
- **steps() not supported** - Must use Carbon tokens or motion() function

### 📦 What's Included

- 5 fully implemented rules with auto-fix
- 263 comprehensive tests
- Complete TypeScript type definitions
- Three preset configurations (recommended, strict, light-touch)
- Extensive documentation and examples

### 🚀 Next Steps

This beta release is ready for testing in real projects. Please report any
issues or feedback!

# Changelog

## 5.0.0-alpha.17 (2026-02-19)

### 🐛 Bug Fixes

- **stylelint v17**: Added support for Stylelint v17
  - Updated stylelint dependency to support both v16 and v17:
    `"^16.26.1 || ^17.0.0"`
  - Fixes "Converting circular structure to JSON" error in VSCode extension when
    using Stylelint v17
  - The TypeScript rewrite in v5 already resolved the circular reference issue
    that affected v4.x
  - Updated test utilities to use `result.code` instead of deprecated
    `result.output`
- **dependencies**: Removed ajv resolution to fix ESLint compatibility
  - The ajv@^8.18.0 resolution was causing conflicts with @eslint/eslintrc
  - ESLint dependencies require older ajv versions that support deprecated
    options
- **typescript**: Updated TypeScript configuration for better module resolution
  - Changed `moduleResolution` from `node` to `node16`
  - Changed `module` from `ES2022` to `Node16`
  - Fixes Stylelint type resolution issues
- **linting**: Improved linting configuration
  - Added eslint-disable comments for necessary `any` type usage in
    carbon-tokens.ts
  - Added test and debug files to ESLint ignore patterns
  - Added v5-doc-archive to cspell ignore paths

## 5.0.0-alpha.16 (2026-02-16)

### 🔒 Security

- **dependencies**: Updated ajv from 8.17.1 to 8.18.0 to address security
  vulnerability
  - Added resolution in package.json to force ajv@^8.18.0
  - ajv 8.17.x versions have known security issues

## 5.0.0-alpha.15 (2026-02-16)

### 🐛 Bug Fixes

- **validateVariables**: Now validates values assigned to variables in
  `validateVariables` list
  - Previously only accepted variables when used, but didn't validate their
    assigned values
  - Now validates both SCSS variable declarations (`$component-color: #fff;`)
    and CSS custom property declarations (`--component-color: #fff;`)
  - Hard-coded values assigned to validated variables are now rejected
  - Carbon tokens assigned to validated variables are accepted
  - Supports both exact matches and regex patterns
  - Added comprehensive test coverage for variable declaration validation

### 📝 Example

```scss
// Configuration: validateVariables: ['/^$c4p-/']

// ❌ Rejected - hard-coded value assigned to validated variable
$c4p-spacing: 16px;

// ✅ Accepted - Carbon token assigned to validated variable
$c4p-spacing: $spacing-05;

// ✅ Accepted - validated variable used in property
margin: $c4p-spacing;
```

## 5.0.0-alpha.14 (2026-02-13)

### ✨ Features

- **Component-Specific Variables**: Added `validateVariables` option to accept
  project-specific design tokens
  - New option `validateVariables` allows specifying patterns for
    component-specific SCSS variables and CSS custom properties
  - Supports exact matches: `['$c4p-spacing-01', '--my-component-color']`
  - Supports regex patterns: `['/^\\$c4p-/', '/^--my-component-/']`
  - Different from `acceptUndefinedVariables`: validates AND accepts specific
    patterns instead of accepting all undefined variables
  - Useful for Carbon for IBM Products variables or custom component libraries

### 📝 Use Cases

Accept component library variables while still validating against Carbon tokens:

```scss
.component {
  // ✅ Accepted - matches validateVariables pattern
  margin: $c4p-spacing-01;
  padding: var(--my-component-spacing);

  // ❌ Rejected - doesn't match pattern
  margin: $other-spacing;
}
```

### 🔧 Configuration

```js
{
  'carbon/layout-use': [true, {
    validateVariables: [
      '/^\\$c4p-/',              // Carbon for IBM Products variables
      '/^--my-component-/'       // Custom component variables
    ]
  }]
}
```

## 5.0.0-alpha.13 (2026-02-13)

### ✨ Features

- **Local Variable Tracking**: Added `trackFileVariables` option to resolve
  file-level SCSS variable declarations
  - New option `trackFileVariables` (default: `true` for v4 compatibility)
    enables tracking and resolution of local SCSS variables
  - Supports simple variable declarations: `$indicator-width: $spacing-02;`
  - Supports variable chains (transitive resolution):
    `$base: $spacing-03; $derived: $base;`
  - Works with calc() expressions: `calc(-1 * $indicator-height)`
  - Works with negative variables: `-$indicator-width`
  - Works with multiple variables in one value: `$spacing-05 $indicator-width`
  - Variables must be declared before use (module-level only)
  - Variables are resolved when stored, enabling efficient lookups

### 📝 Use Cases

This feature is designed for projects that use local variable abstractions over
Carbon tokens:

```scss
@use '@carbon/styles/scss/spacing' as *;

// Declare local variables
$indicator-width: $spacing-02;
$indicator-height: $spacing-05;

.component {
  width: $indicator-width; // ✅ Resolves to $spacing-02
  height: $indicator-height; // ✅ Resolves to $spacing-05
  inset-block-end: calc(-1 * $indicator-height); // ✅ Works in calc()
  margin-inline: -$indicator-width; // ✅ Works with negatives
}
```

### 🔧 Configuration

**Enabled by default** for v4 compatibility. To disable:

```js
{
  'carbon/layout-use': [true, {
    trackFileVariables: false
  }]
}
```

**Note**: The `strict` preset disables `trackFileVariables` to enforce direct
Carbon token usage without local variable abstractions.

### 🐛 Bug Fixes

- **Transform Functions**: Fixed validation of negative SCSS variables in
  transform functions (e.g., `translateY(-$spacing-04)`)
  - `isValidSpacingValue()` now properly handles negative variables by stripping
    the leading `-` before token lookup
  - Affects `translateX()`, `translateY()`, `translate()`, and `translate3d()`
  - Added test coverage for negative variables in transform functions
  - This bug wasn't caught earlier because our fixture tests didn't include
    negative SCSS variables in transform functions

### 📊 Testing

- Added 7 new tests for `trackFileVariables` option
- All 304 tests passing
- Comprehensive coverage of variable resolution scenarios

## 5.0.0-alpha.12 (2026-02-13)

### 🐛 Bug Fixes

- **acceptCarbonCustomProp Behavior**: Fixed CSS custom property validation to
  only accept known Carbon tokens
  - Removed wildcard acceptance of any `--cds-*` CSS custom property
  - Now only accepts CSS custom properties that are in the loaded Carbon token
    list
  - When `acceptCarbonCustomProp: false`, all CSS custom properties are rejected
    (even known Carbon tokens)
  - When `acceptCarbonCustomProp: true`, only known Carbon CSS custom properties
    are accepted
  - Example: `var(--cds-spacing-05)` is accepted when
    `acceptCarbonCustomProp: true` because it's a known Carbon token
  - Example: `var(--cds-custom-value)` is rejected even when
    `acceptCarbonCustomProp: true` because it's not in the token list

### 📝 Impact

This fix ensures that `acceptCarbonCustomProp` properly gates access to CSS
custom properties, preventing arbitrary `--cds-*` properties from being accepted
when they're not actually Carbon tokens. This provides better validation and
catches typos or non-existent tokens.

## 5.0.0-alpha.11 (2026-02-13)

### 🐛 Bug Fixes

- **CSS Custom Property Fallbacks**: Fixed validation of CSS custom properties
  with fallback values
  - Updated regex in `isCarbonCustomProperty()` and `extractCssVarName()` to
    stop at comma (fallback separator)
  - Now correctly handles `var(--cds-background, #ffffff)` by extracting only
    `--cds-background`
  - Previously would incorrectly capture `--cds-background, #ffffff` as the
    variable name

### 📝 Impact

This fix resolves false positives for CSS custom properties that include
fallback values, which is a common and recommended pattern for providing
graceful degradation.

## 5.0.0-alpha.10 (2026-02-13)

### 🧹 Code Cleanup

- **Simplified acceptValues**: Removed redundant `1px` and `-1px` entries from
  theme-use rule
  - These are now covered by the more general regex pattern
    `/^-?\d+\.?\d*(px|rem|em)$/`
  - Cleaner, more maintainable configuration

## 5.0.0-alpha.9 (2026-02-13)

### 🐛 Bug Fixes

- **Box-Shadow Length Values**: Fixed incorrect validation of blur and spread
  radius in box-shadow
  - Added pattern `/^-?\d+\.?\d*(px|rem|em)$/` to theme-use acceptValues
  - Box-shadow syntax:
    `[inset?] <offset-x> <offset-y> <blur-radius>? <spread-radius>? <color>?`
  - Blur and spread radius are spacing values (px, rem, em) but were incorrectly
    flagged as needing theme tokens
  - Example: `box-shadow: 0 0 4px 1px $layer-accent-01` - the `4px` blur radius
    is now correctly accepted

### 📝 Impact

This fix resolves false positives for box-shadow declarations that use length
values for blur and spread radius. These are valid spacing values that don't
need to be Carbon tokens.

## 5.0.0-alpha.8 (2026-02-13)

### 🐛 Bug Fixes

- **Negative SCSS Variables**: Fixed recognition of negative SCSS variables like
  `-$spacing-07`
  - Updated `validateValue()` to check tokens without the negative sign
  - Resolves false positives for negative spacing values in positioning and
    margins
- **Negative 1px Values**: Added support for `-1px` values
  - Added to acceptValues in both `theme-use` and `layout-use` rules
  - Common for negative offsets in box-shadows and positioning
- **Non-Spacing Transform Functions**: Fixed incorrect validation of non-spacing
  transforms
  - Added skip logic for `rotate()`, `scale()`, `scaleX()`, `scaleY()` functions
  - These transforms don't use spacing tokens and should not be validated by
    layout-use rule
- **1px Values Support**: Added support for 1px values in borders and
  box-shadows
  - 1px is valid for hairline borders and should not require a token
  - Added to acceptValues in both `theme-use` and `layout-use` rules
- **Box-Shadow and Cross-Token Properties**: Fixed validation of properties that
  mix token types
  - Added spacing token patterns to `theme-use` acceptValues (for box-shadow
    offsets)
  - Added theme token patterns to `layout-use` acceptValues (for border colors
    in shorthand)
  - Fixed trailing punctuation parsing in multi-value properties
- **Border Style Keywords**: Added support for CSS border-style keywords
  - Keywords like `solid`, `dashed`, `inset`, `outset` are now accepted
  - Prevents false positives when using standard CSS border styles
- **Motion Easing Aliases**: Added support for `@carbon/styles` convenience
  aliases
  - `$standard-easing` → `cubic-bezier(0.5, 0, 0.1, 1)`
  - `$ease-in` → `cubic-bezier(0.25, 0, 1, 1)`
  - `$ease-out` → `cubic-bezier(0, 0, 0.25, 1)`
  - These aliases are defined in `@carbon/styles/scss/_motion.scss` for backward
    compatibility

### 📝 Impact

These fixes significantly reduce false positives when testing with IBM Products
and other Carbon-based projects. The changes address common patterns that are
valid but were incorrectly flagged by the plugin.

## 5.0.0-alpha.7 (2026-02-12)

### ✨ Features

- **Improved SCSS Validation**: Significantly reduced false positives in v5
  - Added `cleanScssValue()` to properly handle SCSS interpolation (`#{}`) and
    module namespaces
  - Added `isSpacingTransformFunction()` to only validate spacing-related
    transform functions (`translate*`)
  - Added `isGradientFunction()` to always permit gradient functions without
    validation
  - Extended `acceptValues` with CSS keywords (`inset`, `padding-box`,
    `border-box`)
  - Updated `validateCarbonMotionFunction()` to accept `motion(standard)`
    shorthand syntax

### 🧪 Testing

- Added comprehensive test coverage for new validation functions
  - 6 tests for `cleanScssValue()` covering interpolation and namespace
    stripping
  - 4 tests for `isSpacingTransformFunction()` covering transform detection
  - 6 tests for `isGradientFunction()` covering gradient pattern detection
  - Updated `validateCarbonMotionFunction()` tests to include shorthand syntax
  - All 289 tests passing

### 📝 Notes

This release focuses on reducing false positives by properly handling SCSS
syntax patterns, limiting transform validation to spacing-related functions, and
supporting common CSS patterns that don't require Carbon tokens.

## 5.0.0-alpha.6 (2026-02-12)

### ✨ Features

- **New `theme-layer-use` Rule**: Encourages contextual layer tokens over
  numbered tokens
  - Validates usage of layer tokens (`$layer-01`, `$layer-02`, etc.) vs
    contextual tokens (`$layer`, `$border-subtle`, etc.)
  - Contextual tokens automatically adapt to layer context when using Carbon's
    Layer component
  - Provides auto-fix to convert numbered tokens to contextual equivalents
  - Configured as warning in `recommended` config, error in `strict` config,
    disabled in `light-touch` config

- **New `strict` Configuration Preset**: Maximum enforcement of Carbon Design
  System best practices
  - All rules set to error severity (including `theme-layer-use`)
  - Use when you want strict enforcement of contextual layer tokens with the
    Layer component
  - Example: `extends: ['stylelint-plugin-carbon-tokens/strict']`

### 📚 Documentation

- Added comprehensive preset configurations section to README
- Documented all three configuration presets: `recommended`, `strict`, and
  `light-touch`
- Added guidance on when to use contextual vs numbered layer tokens based on
  Carbon MCP documentation

## 5.0.0-alpha.5 (2026-02-12)

### 🐛 Bug Fixes

- **Deprecation Warning**: Removed deprecated `context.fix` usage
  - Updated to use modern Stylelint fix callback approach
  - Fixes `[stylelint:005] DeprecationWarning: context.fix is being deprecated`
    warning
  - No functional changes to auto-fix behavior

## 5.0.0-alpha.4 (2026-02-12)

### ✨ Features

- **Enhanced Auto-Fix Support**: Comprehensive auto-fix implementation for all
  token types
  - **Layout tokens**: Auto-fix now supports both `px` and `rem` values
    - `16px` → `$spacing-05`
    - `1rem` → `$spacing-05`
  - **Motion duration tokens**: Auto-fix for millisecond values
    - `110ms` → `$duration-fast-02`
  - **Motion easing tokens**: Auto-fix for cubic-bezier functions
    - `cubic-bezier(0.2, 0, 0.38, 0.9)` → `$easing-standard-productive`
  - **Theme color tokens**: Opt-in auto-fix with `experimentalFixTheme` option
    - `#0f62fe` → `$background-brand` (when `experimentalFixTheme: 'white'`)
    - Requires explicit theme selection: `'white'`, `'g10'`, `'g90'`, or
      `'g100'`
    - Default behavior: no auto-fix for colors (safer)

### 🔧 Technical Changes

- **Token Value Loading**: Modified token loaders to store actual CSS values
  instead of token names
  - `loadLayoutTokens()`: Now loads actual rem/px values from `@carbon/layout`
  - `loadMotionTokens()`: Now loads actual ms values and cubic-bezier functions
    from `@carbon/motion`
  - `loadThemeTokens()`: Optionally loads actual color values from
    `@carbon/themes`
- **Bidirectional Mapping**: Created mappings for both rem and px equivalents
  - Both `1rem` and `16px` map to `$spacing-05`
- **Type Safety**: Updated TypeScript interfaces to support optional parameters
  in token loaders
- **Rule Configuration**: Extended `ThemeRuleOptions` with
  `experimentalFixTheme` parameter

### 📚 Documentation

- Updated README.md with comprehensive auto-fix examples and usage
- Updated MIGRATION_V4_TO_V5.md to document `experimentalFixTheme` behavior
  changes
- Added warnings about color auto-fix ambiguity (same color used by multiple
  tokens)

## 5.0.0-alpha.3 (2026-02-11)

### 🐛 Bug Fixes

- **Token Name Formatting**: Fixed token name formatting for theme tokens from
  `unstable_metadata`
  - Theme token names from `unstable_metadata` are already in kebab-case format
    and should not be reformatted
  - Prevents double-dash issues like `layer-hover--01` (incorrect) vs
    `layer-hover-01` (correct)
  - Ensures proper recognition of contextual layer tokens like `$layer`,
    `$layer-hover`, `$border-subtle`, etc.
- **Negative Proportional Values**: Improved validation for negative
  proportional spacing values
  - Negative percentages (e.g., `-100%`, `-50%`) are now properly accepted for
    positioning
  - Negative viewport units (e.g., `-100vh`, `-100vw`, `-50svh`) are correctly
    validated
  - Added `isValidSpacingValue()` check in rule validation to handle
    proportional units

## 5.0.0-alpha.2 (2026-02-11)

### 🐛 Bug Fixes

- **Token Name Formatting**: Fixed token name construction to properly convert
  camelCase to kebab-case
  - Tokens like `spacing01`, `durationFast01`, `fast01`, `body01` are now
    correctly formatted as `spacing-01`, `duration-fast-01`, `fast-01`,
    `body-01`
  - Updated `formatTokenName()` function to use proper regex pattern from v4
    implementation
  - This ensures SCSS variables (`$spacing-05`) and CSS custom properties
    (`--cds-spacing-05`) are correctly recognized

## 5.0.0-alpha.1 (2026-02-11)

### 🎉 Major Rewrite - Alpha Release

This is the first alpha release of v5, a complete rewrite of the plugin with
focus on Carbon v11+ support.

#### ✨ New Features

- **Complete TypeScript Rewrite**: Entire codebase rewritten in TypeScript for
  better type safety and developer experience
- **All 5 Carbon Token Categories Supported**:
  - `carbon/theme-use` - Color and theme tokens
  - `carbon/layout-use` - Spacing and layout tokens
  - `carbon/type-use` - Typography tokens (NEW)
  - `carbon/motion-duration-use` - Motion timing tokens (NEW)
  - `carbon/motion-easing-use` - Motion easing functions (NEW)
- **Shorthand Property Validation**: Full support for shorthand properties
  - `transition` - validates duration and timing function
  - `animation` - validates duration and timing function
  - `font` - validates size, family, weight, line-height
  - `border` - validates color
  - `outline` - validates color
- **Auto-Fix Support**: Automatically fix common violations
  - Hard-coded values → Carbon tokens (when 1:1 mapping exists)
  - Incorrect CSS custom property prefix
  - Invalid shorthand components
- **Dual Format Support**: Validates both SCSS variables (`$spacing-05`) and CSS
  custom properties (`var(--cds-spacing-05)`)
- **Enhanced Validation**:
  - `calc()` expressions with Carbon tokens
  - `rgba()` function with Carbon color tokens
  - Transform functions (`translateX`, `translateY`, `translate`, `translate3d`)
  - Carbon v11 functions: `motion()`, `type-scale()`, `font-family()`,
    `font-weight()`
- **Improved Error Messages**: Clear, actionable error messages with suggested
  fixes

#### 🔧 Configuration Improvements

All V4 configuration options have been migrated and enhanced:

- **`includeProps`**: Now supports advanced regex patterns
  - Exact match: `'color'`, `'margin'`
  - Regex: `'/^border-/'`, `'/^font-(?!style)/'` (including negative lookahead)
  - Multiple patterns: `['margin', '/^padding/']`
- **`acceptValues`**: Per-rule configuration (no longer global)
  - Supports exact values and regex patterns
  - Example: `['transparent', 'inherit', '/^0$/']`
- **`acceptUndefinedVariables`**: Allow custom SCSS/CSS variables
  - When `true`, allows any `$variable` or `var(--custom-prop)`
- **`acceptCarbonCustomProp`**: Allow Carbon CSS custom properties
  - When `true`, allows `var(--{carbonPrefix}-*)` patterns
- **`carbonPrefix`**: Custom prefix for CSS custom properties
  - Default: `'cds'`
  - Allows custom prefixes like `'custom'` for `var(--custom-*)`

#### 🚨 Breaking Changes

- **Carbon v10 Support Removed**: Only Carbon v11+ is supported
  - V10 functions (`carbon--font-weight()`, `carbon--type-scale()`, etc.) are
    not supported
  - Use V11 equivalents: `font-weight()`, `type-scale()`, `font-family()`,
    `motion()`
- **Node.js 20+ Required**: Minimum Node.js version increased from 18 to 20

- **Configuration Changes**:
  - `acceptValues` is now per-rule instead of global
  - Removed: `acceptCarbonFontWeightFunction`, `acceptCarbonTypeScaleFunction`,
    `acceptCarbonFontFamilyFunction`, `acceptCarbonMotionFunction`
  - Position-specific syntax removed (e.g., `transition<2>`, `margin<1 4>`)
  - Function filter syntax removed (e.g., `transform[/^translate/]`)

- **Simplified Architecture**:
  - SCSS namespace handling removed
  - Custom parser removed (uses standard PostCSS)
  - Scope enforcement removed

#### 📊 Test Coverage

- **263 tests** (100% passing)
- **84.34%** line coverage
- **95.17%** branch coverage
- **96.10%** function coverage
- All 5 rule files have 100% coverage
- Comprehensive test suite for all features

#### 📚 Documentation

- Complete migration guide from V4
  ([MIGRATION_V4_TO_V5.md](./MIGRATION_V4_TO_V5.md))
- Detailed V4/V5 comparison
  ([V5_V4_COMPARISON.md](./v5-rewrite-docs/V5_V4_COMPARISON.md))
- Deprecations guide
  ([V5_DEPRECATIONS.md](./v5-rewrite-docs/V5_DEPRECATIONS.md))
- Test coverage report
  ([V5_TEST_COVERAGE.md](./v5-rewrite-docs/V5_TEST_COVERAGE.md))
- Updated README with V5 examples
- API documentation for all rules

#### 🐛 Known Issues

- Stylelint deprecation warnings for `context.fix` (will be addressed in future
  release)
- Some edge cases in auto-fix for complex calc expressions

#### 🔗 Migration Path

See [MIGRATION_V4_TO_V5.md](./MIGRATION_V4_TO_V5.md) for detailed migration
instructions.

**Quick Migration Example**:

V4 Configuration:

```js
{
  "carbon/theme-use": [true, {
    acceptValues: ["transparent"]
  }]
}
```

V5 Configuration (same):

```js
{
  "carbon/theme-use": [true, {
    acceptValues: ["transparent"]
  }]
}
```

Most configurations work as-is, but check the migration guide for deprecated
options.

#### 📦 Installation

```bash
npm install stylelint-plugin-carbon-tokens@alpha
```

#### 🙏 Feedback Welcome

This is an alpha release - please test and provide feedback!

Report issues:
https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/issues

---

## 4.0.6

- fix: Resolve Stylelint v17 + vscode-stylelint v2.0.0 circular reference issue
  - Clean all PostCSS nodes in the AST tree before processing to remove circular
    references from postcss-scss's Lexer
  - This fixes the "Converting circular structure to JSON" error in VSCode/Bob
    when using vscode-stylelint v2.0.0 with Stylelint v17
  - Related to Stylelint issue #8964
  - The fix ensures compatibility with the "Stylelint 17 way" of handling custom
    syntaxes

## 4.0.5

- fix: Completely resolve circular structure JSON serialization error in VSCode
  - Remove `syntax` property from PostCSS nodes before reporting to prevent
    circular references from postcss-scss's Lexer
  - This fixes the "Converting circular structure to JSON" error that was still
    occurring in VSCode/Bob when using the plugin
- fix: Remove ajv resolution that was causing ESLint compatibility issues
  - The ajv ^8.18.0 resolution (added in 4.0.3 for CVE-2025-59873) caused
    @eslint/eslintrc to fail with "Cannot set properties of undefined"
  - Removed the resolution to restore ESLint functionality

## 4.0.4

- fix: Stylelint v17 compatibility - Fixed circular structure JSON serialization
  error
  - Replaced `JSON.stringify(decl)` with safe property extraction in error
    logging
  - Updated stylelint dependency to support both v16 and v17:
    `"^16.26.1 || ^17.0.0"`
  - Fixes "Converting circular structure to JSON" error in VSCode extension when
    using Stylelint v17

## 4.0.3

- fix: CVE-2025-69873 - Updated ajv from 8.17.1 to 8.18.0 to address security
  vulnerability
  - Added resolution in package.json to force ajv@^8.18.0

## 4.0.2

- Various minor dependency updates.

## 4.0.1

- f6aca05 - fix: remove package-lock, lock update, add js-yaml resolution
- a4d63d9 - chore: add renovate config

## 4.0.0

- BREAK: Updated Node.js version requirement from `>=18` to `>=20`
- BREAK: Updated major dependencies:
  - ESLint v9 (from v8.57.1)
  - cspell v9 (from v8.14.4)
  - eslint-config-prettier v10 (from v9.1.0)
  - npm-check-updates v19 (from v16.14.20)
- BREAK: Migrated from `.eslintrc` to the new `eslint.config.js` format required
  by ESLint v9
- Added `@eslint/js` as a dev dependency
- Migrated ignore patterns from `.eslintignore` to the `ignores` property in
  `eslint.config.js`
- Fixed plugin configuration to use the correct object format for the import
  plugin
- Added global definitions for `console` and `process` to fix linting errors
- Removed the old `.eslintrc` and `.eslintignore` files
- Updated minor version dependencies:
  - @ibm/telemetry-js (^1.6.1 → ^1.10.2)
  - eslint-plugin-import (^2.30.0 → ^2.32.0)
  - eslint-plugin-prettier (^5.2.1 → ^5.5.4)
  - prettier (^3.3.3 → ^3.6.2)
  - stylelint (^16.13.2 → ^16.25.0)
  - stylelint-test-rule-node (^0.3.0 → ^0.4.0)

## 3.2.3

- fix: endIndex deprecation warning

## 3.2.2

- chore: update endpoint and readme
- fix: use of spacing namespace

## 3.2.1

- fix: deprecation warnings caused by use of `content.fix` following
  https://stylelint.io/changelog/#1682.
