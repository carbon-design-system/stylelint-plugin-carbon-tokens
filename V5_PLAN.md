# stylelint-plugin-carbon-tokens V5 Plan

## Overview

Version 5 represents a significant architectural simplification focused on modern Carbon Design System usage. This proof of concept will establish a clean foundation for validating Carbon token usage in both CSS and SCSS files.

## Core Principles

- **Modern Carbon Focus**: Support Carbon v11+ only, using CSS custom properties and SCSS variables
- **Standard Parsing**: Use PostCSS as the parser (no custom parsers)
- **TypeScript Implementation**: Full TypeScript for better maintainability and type safety
- **Simplified Architecture**: Remove complex SCSS namespace handling and v10 compatibility layers
- **Fixed Property Sets**: Define clear, fixed sets of properties to validate per rule
- **Simple Fixes**: Implement straightforward fixes without v10-to-v11 migration logic

## Technical Stack

- **Language**: TypeScript
- **Parser**: PostCSS (via stylelint 16)
- **Stylelint Version**: 16.x
- **Node Version**: >=20
- **Carbon Packages**: @carbon/themes, @carbon/colors, @carbon/layout, @carbon/type, @carbon/motion (v11+)

## Rules

The plugin will maintain the existing five rule names:

1. **carbon/theme-use** - Validates color and theme token usage
2. **carbon/layout-use** - Validates spacing and layout token usage
3. **carbon/type-use** - Validates typography token usage
4. **motion-duration-use** - Validates motion timing token usage
5. **carbon/motion-easing-use** - Validates motion easing function usage

## Validation Approach

### Supported Value Types

Each rule will validate:
- **SCSS variables**: `$spacing-05`, `$background`
- **CSS custom properties**: `var(--cds-spacing-05)`, `var(--cds-background)`
- **Carbon functions**: `type-scale()`, `font-family()`, `font-weight()`, `motion()`
- **CSS/SCSS functions**: `calc()`, `rgba()`, `translate()`, `translateX()`, `translateY()`, `translate3d()`
- **Hard-coded values**: For auto-fix suggestions

### Function Support

V5 implements comprehensive validation for 11 functions across all rules:

**Carbon v11 Functions (5):**
- `type-scale(index)` - Typography scale values (type-use)
- `font-family(name)` - Font family selection (type-use)
- `font-weight(name)` - Font weight selection (type-use)
- `motion(easing_type, motion_style)` - Motion easing curves (motion-duration-use, motion-easing-use)

**CSS/SCSS Functions (6):**
- `calc()` - Proportional math and token negation (layout-use)
- `rgba(color, alpha)` - Color with transparency, validates first parameter (theme-use)
- `translate(x, y)` - 2D translation (layout-use)
- `translateX(x)` - Horizontal translation (layout-use)
- `translateY(y)` - Vertical translation (layout-use)
- `translate3d(x, y, z)` - 3D translation, validates first 2 parameters (layout-use)

**Validation Approaches:**
- **Complex validation**: calc(), translate family, rgba(), motion() - validates parameters
- **Simple validation**: type-scale(), font-family(), font-weight() - detects function only

See V4_FUNCTIONS_BY_RULE.md for complete function documentation.

### Property Sets

Each rule will define a fixed set of CSS properties to check:

- **theme-use**: `color`, `background`, `background-color`, `border-color`, `outline-color`, `fill`, `stroke`, `box-shadow` (color values), etc.
- **layout-use**: `margin`, `margin-*`, `padding`, `padding-*`, `top`, `right`, `bottom`, `left`, `gap`, `row-gap`, `column-gap`, `transform` (translate values)
- **type-use**: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`
- **motion-duration-use**: `transition-duration`, `animation-duration`, `transition` (duration value), `animation` (duration value)
- **motion-easing-use**: `transition-timing-function`, `animation-timing-function`, `transition` (easing value), `animation` (easing value)

### Token Identification

The plugin will use Carbon packages directly to:
- Load available tokens from `@carbon/themes`, `@carbon/colors`, `@carbon/layout`, `@carbon/type`, `@carbon/motion`
- Match values against known Carbon tokens
- Suggest appropriate tokens for hard-coded values

## Configuration

### Default Configuration

Each rule will support:
- `includeProps`: Array of properties to check (fixed defaults, user can extend)
- `acceptValues`: Array of acceptable non-Carbon values (e.g., `transparent`, `inherit`, `0`)
- `acceptUndefinedVariables`: Boolean to allow user-defined variables
- `acceptCarbonCustomProp`: Boolean to allow CSS custom properties
- `carbonPrefix`: String for custom Carbon prefix (default: `cds`)

### Simplified Options

Remove from V4:
- `acceptScopes` / `enforceScopes` - No scope validation
- `carbonPath` / `carbonModulePostfix` - No custom Carbon paths
- `acceptCarbonColorTokens` - Simplified token acceptance
- `acceptIBMColorTokensCarbonV10Only` - No v10 support
- `experimentalFixTheme` - No theme-specific fixes

## Auto-Fix Capabilities

### Simple Fixes

The plugin will provide auto-fixes for:
1. **Hard-coded values to tokens**: `16px` → `$spacing-05` or `var(--cds-spacing-05)`
2. **Function to variable**: `theme('background')` → `$background` or `var(--cds-background)`
3. **Incorrect prefix**: `var(--carbon-spacing-05)` → `var(--cds-spacing-05)`

### No Migration Fixes

V5 will NOT include:
- Carbon v10 to v11 token migration
- Theme-specific value replacement
- Context-aware fixes requiring multiple token options

## File Structure

```
src/
├── index.ts                 # Plugin entry point
├── rules/
│   ├── index.ts            # Rule exports
│   ├── theme-use/
│   │   ├── index.ts        # Rule implementation
│   │   ├── README.md       # Rule documentation
│   │   └── __tests__/
│   │       └── index.test.ts
│   ├── layout-use/
│   ├── type-use/
│   ├── motion-duration-use/
│   └── motion-easing-use/
├── utils/
│   ├── carbon-tokens.ts    # Carbon token loading
│   ├── validators.ts       # Value validation logic
│   ├── parsers.ts          # Value parsing utilities
│   └── fixers.ts           # Auto-fix utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

## Implementation Phases

### Phase 1: Foundation
- Set up TypeScript configuration (tsconfig.json, build scripts)
- Update ESLint configuration for TypeScript
- Update Prettier configuration for TypeScript
- Preserve V4 README as V4-README.md
- Create initial V5 README with updated documentation
- Update package.json for TypeScript build and dependencies
- Create plugin structure with stylelint 16
- Implement basic rule registration
- Load Carbon tokens from packages

### Phase 2: Core Validation
- Implement property checking logic
- Add SCSS variable validation
- Add CSS custom property validation
- Add Carbon function validation

### Phase 3: Auto-Fix
- Implement simple value-to-token fixes
- Add fix for common hard-coded values
- Test fix reliability

### Phase 4: Testing & Documentation
- Write comprehensive tests for each rule
- Update README and rule documentation
- Create migration guide from V4

## Testing Strategy

- **Unit tests**: Test individual validation functions
- **Integration tests**: Test complete rule behavior with stylelint
- **Fixture tests**: Test against real-world CSS/SCSS files
- **Fix tests**: Verify auto-fix correctness

## Migration from V4

Users migrating from V4 will need to:
1. Update configuration to remove deprecated options
2. Remove Carbon v10 dependencies
3. Update any custom `carbonPath` configurations
4. Review and update any v10 token usage manually

---

## Deprecated in V5

### SCSS Namespace Support
Custom SCSS namespace handling removed. The plugin no longer tracks or validates SCSS `@use` statements with custom namespaces.

### Carbon v10 Support
All Carbon v10 token validation and migration removed. Users must be on Carbon v11+.

### Custom Parser
The custom SCSS parser has been removed in favor of standard PostCSS parsing.

### V10 to V11 Auto-Migration
Automatic fixes for migrating v10 tokens to v11 tokens removed. Users should complete migration before using V5.

### IBM Color Tokens
Support for deprecated IBM color tokens (`ibm-color()` function) removed.

### Theme-Specific Fixes
The `experimentalFixTheme` option and theme-aware value replacement removed.

### Monorepo Carbon Path Support
`carbonPath` and `carbonModulePostfix` options removed. Plugin expects standard Carbon package locations.

### Scope Enforcement
`acceptScopes` and `enforceScopes` options removed. No validation of token scope prefixes.

### Mini-Units Function
`acceptCarbonMiniUnitsFunction` option removed (v10 only feature).

---

## Not Yet Supported in V5

### Container Tokens
Validation of Carbon container tokens not yet implemented in initial release.

### Icon Size Tokens
Specific validation for icon size tokens deferred to future release.

### Fluid Spacing Tokens
Fluid spacing token validation (vw-based) not included in initial scope.

### Advanced calc() Patterns
V5 supports enhanced calc() validation for layout-use rule:
- **Proportional math**: `calc(100vw - #{$spacing-01})` - viewport/percentage units with +/- operators
- **Token negation**: `calc(-1 * #{$spacing-01})` or `calc(#{$spacing-01} / -1)` - multiply/divide by -1 only
- **Modern viewport units**: svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax

All other math patterns are rejected to prevent arbitrary spacing values. See V4_MATH_CALC_SUPPORT.md for complete details.

**Note**: V5 uses PostCSS and cannot validate SCSS math outside calc() (e.g., `$spacing-01 / -1`). Only calc() expressions are validated.

### Multi-Value Property Ranges
Advanced range syntax for multi-value properties (e.g., `box-shadow<-1>`) simplified or deferred.

### Custom Token Extensions
User-defined token validation beyond `acceptValues` not yet supported.

### Partial Line Fixes
Auto-fix for partially fixable multi-value properties (e.g., `margin: 2px 16px 4px`) deferred.

### Context-Aware Fixes
Fixes requiring understanding of component context or theme selection deferred.

### SCSS Mixin Validation
Validation of Carbon mixin usage not included in initial scope.

### CSS Class Validation
Validation of Carbon utility classes not included in initial scope.

### Customizing Properties
User-defined property lists beyond the fixed defaults not yet supported in initial release.

### Raw cubic-bezier() and steps() Functions
**Policy Decision**: V5 does NOT support raw `cubic-bezier()` or `steps()` functions in motion-easing-use rule. Users must use Carbon motion tokens, the `motion()` function, or standard CSS easing keywords (ease, ease-in, ease-out, linear). This ensures consistency with Carbon Design System motion principles.

