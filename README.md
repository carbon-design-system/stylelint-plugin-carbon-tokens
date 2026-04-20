# stylelint-plugin-carbon-tokens v5

A stylelint plugin to enforce the use of Carbon Design System tokens in CSS and
SCSS files.

## What's New in V5

- **TypeScript**: Complete rewrite in TypeScript for better type safety
- **Carbon v11 Only**: Simplified to support only Carbon v11+ (no v10
  compatibility)
- **All 5 Token Categories**: Complete support for theme, layout, type, and
  motion tokens
- **Shorthand Properties**: Full validation of transition, animation, font,
  border, and outline
- **Auto-Fix Support**: Automatically fix common violations
- **Dual Format Support**: Validates both SCSS variables (`$spacing-05`) and CSS
  custom properties (`var(--cds-spacing-05)`)
- **Enhanced Validation**: Support for calc(), rgba(), transform functions, and
  Carbon v11 functions
- **Improved Configuration**: Advanced regex patterns, per-rule options, better
  error messages

## Installation

```bash
npm install stylelint-plugin-carbon-tokens
```

## Quick Start

Add to your stylelint configuration:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/theme-use': true,
    'carbon/theme-layer-use': true,
    'carbon/layout-use': true,
    'carbon/type-use': true,
    'carbon/motion-duration-use': true,
    'carbon/motion-easing-use': true,
  },
};
```

Or use one of the preset configurations:

```js
// Recommended (balanced strictness)
export default {
  extends: ['stylelint-plugin-carbon-tokens/recommended'],
};

// Strict (enforces all rules including contextual layer tokens)
export default {
  extends: ['stylelint-plugin-carbon-tokens/strict'],
};

// Light-touch (minimal enforcement)
export default {
  extends: ['stylelint-plugin-carbon-tokens/light-touch'],
};
```

## Available Rules

All rules are fully implemented and production-ready:

### carbon/theme-use

Validates color and theme tokens.

**Properties validated** (default):

- `color`, `background-color`, `border-color`, `outline-color`
- `fill`, `stroke`
- Shorthand: `border`, `outline`
- Gradient functions: `linear-gradient()`, `radial-gradient()`,
  `conic-gradient()`

**Example violations**:

```css
/* ❌ Hard-coded color */
.button {
  color: #0f62fe;
}

/* ✅ Carbon token */
.button {
  color: $link-primary;
}
.button {
  color: var(--cds-link-primary);
}
```

**Gradient Validation**:

The `validateGradients` option controls how gradient color stops are validated:

```js
{
  'carbon/theme-use': [true, {
    validateGradients: 'recommended' | 'strict'
  }]
}
```

**Modes**:

- **undefined** (default in `light-touch`): Skip gradient validation entirely
- **`'recommended'`** (default in `recommended`): Validate color stops, allow
  Carbon tokens, `transparent`, and semi-transparent white/black via `rgba()`
- **`'strict'`** (default in `strict`): Only allow Carbon tokens and
  `transparent` keyword

**Examples**:

```scss
// ✅ Valid in all modes
background: linear-gradient(to right, $layer-01, $layer-02);
background: radial-gradient(circle, $background, transparent);

// ✅ Valid in 'recommended' and undefined modes
background: linear-gradient(to right, $layer-01, rgba(255, 255, 255, 0.5));
background: radial-gradient(circle, $layer-01, rgb(0 0 0 / 50%));

// ❌ Invalid in 'recommended' and 'strict' modes
background: linear-gradient(to right, $layer-01, red);
background: radial-gradient(circle, #ffffff, $layer-02);
```

### carbon/theme-layer-use

Encourages contextual layer tokens over numbered tokens when using Carbon's
Layer component.

**Properties validated** (default):

- `color`, `background-color`, `border-color`, `outline-color`
- `fill`, `stroke`
- Shorthand: `border`, `outline`

**Example violations**:

```css
/* ❌ Numbered layer token */
.component {
  background-color: $layer-01;
  border: 1px solid $border-subtle-02;
}

/* ✅ Contextual layer token (preferred with Layer component) */
.component {
  background-color: $layer;
  border: 1px solid $border-subtle;
}
```

**Rationale**: Contextual tokens automatically adapt to the layer context
provided by Carbon's Layer component, making components more flexible and
maintainable. The Carbon Design System documentation explicitly marks these
tokens as "automatically matches contextual layer background."

**Severity**: Warning in `recommended` config, error in `strict` config,
disabled in `light-touch` config.

**When to disable**: If you need explicit layer control or aren't using the
Layer component, disable this rule or use the light-touch configuration.

### carbon/layout-use

Validates spacing and layout tokens.

**Properties validated** (default):

- `margin`, `margin-*`, `padding`, `padding-*`
- `gap`, `row-gap`, `column-gap`
- `top`, `right`, `bottom`, `left`, `inset`
- `width`, `height`, `min-width`, `max-width`, etc.

**Example violations**:

```css
/* ❌ Hard-coded spacing */
.container {
  margin: 16px;
}

/* ✅ Carbon token */
.container {
  margin: $spacing-05;
}
.container {
  margin: var(--cds-spacing-05);
}
```

### carbon/type-use

Validates typography tokens.

**Properties validated** (default):

- `font-size`, `font-family`, `font-weight`, `line-height`
- Shorthand: `font`

**Example violations**:

```css
/* ❌ Hard-coded typography */
.heading {
  font-size: 32px;
}

/* ✅ Carbon token */
.heading {
  font-size: $heading-03;
}
.heading {
  font-size: var(--cds-heading-03);
}

/* ✅ Carbon v11 function */
.heading {
  font-size: type-scale(7);
}
```

### carbon/motion-duration-use

Validates motion timing tokens.

**Properties validated** (default):

- `transition-duration`, `animation-duration`
- Shorthand: `transition`, `animation`

**Example violations**:

```css
/* ❌ Hard-coded duration */
.fade {
  transition: opacity 300ms;
}

/* ✅ Carbon token */
.fade {
  transition: opacity $duration-fast-02;
}
.fade {
  transition: opacity var(--cds-duration-fast-02);
}
```

### carbon/motion-easing-use

Validates motion easing functions.

**Properties validated** (default):

- `transition-timing-function`, `animation-timing-function`
- Shorthand: `transition`, `animation`

**Example violations**:

```css
/* ❌ Custom cubic-bezier */
.slide {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ Carbon token */
.slide {
  transition: transform 300ms $easing-standard-productive;
}
.slide {
  transition: transform 300ms var(--cds-easing-standard-productive);
}

/* ✅ Carbon v11 function */
.slide {
  transition: transform 300ms motion(standard, productive);
}
```

## Preset Configurations

The plugin provides three preset configurations to suit different project needs:

### Recommended (Default)

Balanced approach with most rules as errors and `theme-layer-use` as a warning:

```js
export default {
  extends: ['stylelint-plugin-carbon-tokens/recommended'],
};
```

**Rule severities:**

- `theme-use`: error
- `theme-layer-use`: **warning** (encourages contextual tokens)
- `layout-use`: error
- `type-use`: error
- `motion-duration-use`: error
- `motion-easing-use`: error

### Strict

Enforces all rules including contextual layer tokens as errors:

```js
export default {
  extends: ['stylelint-plugin-carbon-tokens/strict'],
};
```

**Rule severities:**

- All rules: **error** (including `theme-layer-use`)
- `trackFileVariables`: **disabled** (enforces direct Carbon token usage)

Use this configuration when you want maximum enforcement of Carbon Design System
best practices, including the use of contextual layer tokens with the Layer
component. This config disables local variable tracking to ensure all values use
direct Carbon tokens.

### Light-touch

Minimal enforcement for gradual adoption:

```js
export default {
  extends: ['stylelint-plugin-carbon-tokens/light-touch'],
};
```

**Rule severities:**

- Most rules: warning
- `theme-layer-use`: **disabled**

Use this configuration when migrating existing projects or when you need more
flexibility.

## Configuration Options

Each rule supports these options:

```js
{
  'carbon/theme-use': [
    true,
    {
      // Properties to validate (supports regex)
      includeProps: [
        'color',
        'background-color',
        '/^border-color/',  // Regex pattern
        '/^font-(?!style)/' // Negative lookahead
      ],

      // Values to accept without validation (supports regex)
      acceptValues: [
        'transparent',
        'inherit',
        'currentColor',
        '/^0$/'  // Regex: exactly "0"
      ],

      // Allow user-defined SCSS/CSS variables
      acceptUndefinedVariables: false,

      // Allow known Carbon CSS custom properties
      // When true: accepts CSS custom properties that are in the loaded Carbon token list
      // When false: rejects all CSS custom properties (even known Carbon tokens)
      acceptCarbonCustomProp: false,

      // Custom Carbon prefix for CSS custom properties
      carbonPrefix: 'cds',  // default

      // Track and resolve file-level SCSS variable declarations
      // When true: resolves local variables to their Carbon token values
      // When false: validates variables as-is without resolution
      trackFileVariables: true,  // default (v4 compatibility)

      // Component-specific variables to validate and accept
      // Useful for accepting project-specific design tokens
      validateVariables: [
        '$c4p-spacing-01',           // Exact match
        '/^\\$c4p-/',                // SCSS variables with prefix
        '/^--my-component-/'         // CSS custom properties with prefix
      ],
    },
  ],
}
```

### Configuration Examples

#### Allow Custom Variables

```js
{
  'carbon/theme-use': [true, {
    acceptUndefinedVariables: true
  }]
}
```

Now accepts any SCSS variable or CSS custom property:

```css
.custom {
  color: $my-custom-color;
}
.custom {
  color: var(--my-custom-color);
}
```

#### Allow Carbon CSS Custom Properties

```js
{
  'carbon/theme-use': [true, {
    acceptCarbonCustomProp: true
  }]
}
```

Now accepts known Carbon CSS custom properties:

```css
.component {
  /* ✅ Accepted - known Carbon token */
  color: var(--cds-link-primary);
  background: var(--cds-background);
}

.component {
  /* ❌ Rejected - not in Carbon token list */
  color: var(--cds-custom-color);
}
```

**Note**: `acceptCarbonCustomProp` only accepts CSS custom properties that are
in the loaded Carbon token list. It does NOT accept arbitrary `--cds-*`
properties.

#### Custom Property Patterns

```js
{
  'carbon/layout-use': [true, {
    includeProps: [
      'margin',
      '/^padding/',  // All padding-* properties
      '/^gap/'       // gap, row-gap, column-gap
    ]
  }]
}
```

#### Accept Specific Values

```js
{
  'carbon/theme-use': [true, {
    acceptValues: [
      'transparent',
      'inherit',
      'currentColor',
      '/^#[0-9a-f]{6}$/i'  // Any 6-digit hex color
    ]
  }]
}
```

#### Accept Component-Specific Variables

Use `validateVariables` to accept project-specific design tokens or component
library variables. This option both validates variable declarations and accepts
their usage:

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

Validates variable declarations and accepts their usage:

```scss
// ✅ Accepted - Carbon token assigned to validated variable
$c4p-spacing-01: $spacing-05;
--my-component-spacing: var(--cds-spacing-05);

// ❌ Rejected - hard-coded value assigned to validated variable
$c4p-spacing-01: 16px;
--my-component-spacing: 16px;

.component {
  /* ✅ Accepted - validated variable used in property */
  margin: $c4p-spacing-01;
  padding: var(--my-component-spacing);
}

.component {
  /* ❌ Rejected - doesn't match validateVariables pattern */
  margin: $other-spacing;
}
```

**Note**: `validateVariables` is different from `acceptUndefinedVariables`:

- `validateVariables`: Validates variable declarations AND accepts their usage
  for specific patterns
- `acceptUndefinedVariables`: Accepts ALL undefined variables without any
  validation

**Configuration**: This option is not included in the pre-canned configs
(`recommended`, `strict`, `light-touch`) because variable patterns are
project-specific. Add it to your custom configuration as needed.

#### Track File-Level Variables (Enabled by Default)

File-level variable tracking is **enabled by default** for v4 compatibility.
This allows local SCSS variable declarations that resolve to Carbon tokens:

```scss
@use '@carbon/styles/scss/spacing' as *;

// Declare local variables
$indicator-width: $spacing-02;
$indicator-height: $spacing-05;

.component {
  /* ✅ Accepted - resolves to $spacing-02 */
  width: $indicator-width;

  /* ✅ Accepted - resolves to $spacing-05 */
  height: $indicator-height;

  /* ✅ Accepted - resolves in calc() */
  inset-block-end: calc(-1 * $indicator-height);

  /* ✅ Accepted - resolves negative variables */
  margin-inline: -$indicator-width;
}

// Variable chains work too
$base-spacing: $spacing-03;
$derived-spacing: $base-spacing;

.container {
  /* ✅ Accepted - resolves through chain to $spacing-03 */
  padding: $derived-spacing;
}
```

**How it works:**

- Variables must be declared before use (module-level only)
- Supports transitive resolution (variable chains)
- Works with calc(), negative values, and multiple variables
- Variables are resolved when stored, enabling efficient lookups

**When to use:**

- Projects with local variable abstractions over Carbon tokens
- Migrating codebases that use intermediate variable names
- Teams that prefer semantic variable names (e.g., `$indicator-width` instead of
  `$spacing-02`)

**To disable** (not recommended):

```js
{
  'carbon/layout-use': [true, {
    trackFileVariables: false
  }]
}
```

When disabled, only direct Carbon token references are accepted:

```scss
.component {
  /* ✅ Accepted - direct Carbon token */
  width: $spacing-02;

  /* ❌ Rejected - local variable not resolved */
  width: $indicator-width;
}
```

## Shorthand Property Support

V5 fully validates shorthand properties:

### Transition

```css
/* ❌ Invalid */
.fade {
  transition: opacity 300ms ease-in;
}

/* ✅ Valid */
.fade {
  transition: opacity $duration-fast-02 $easing-standard-productive;
}
```

### Animation

```css
/* ❌ Invalid */
.spin {
  animation: rotate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* ✅ Valid */
.spin {
  animation: rotate $duration-slow-01 motion(standard, productive) infinite;
}
```

### Font

```css
/* ❌ Invalid */
.text {
  font: 16px/1.5 Arial;
}

/* ✅ Valid */
.text {
  font: type-scale(3) / 1.5 font-family(sans);
}
```

### Border & Outline

```css
/* ❌ Invalid */
.box {
  border: 1px solid #0f62fe;
}

/* ✅ Valid */
.box {
  border: 1px solid $border-interactive;
}
```

## Auto-Fix Support

V5 includes comprehensive auto-fix capabilities for hard-coded values:

```bash
stylelint --fix "**/*.{css,scss}"
```

**Note**: Auto-fixes can be applied applied in a number of ways:

- via the CLI
- "Fix all auto-fixable problems" command (VSCode or clone only).
- on save (VSCode or clone only) with the following settings.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  }
}
```

### Always Enabled (Safe)

These auto-fixes work automatically with no configuration needed:

**Layout tokens** - Spacing values in both px and rem:

```css
/* Before */
.container {
  margin: 16px;
  padding: 1rem;
}

/* After auto-fix */
.container {
  margin: $spacing-05;
  padding: $spacing-05;
}
```

**Motion duration tokens** - Millisecond values:

```css
/* Before */
.fade {
  transition: opacity 110ms;
}

/* After auto-fix */
.fade {
  transition: opacity $duration-fast-02;
}
```

**Motion easing tokens** - cubic-bezier functions:

```css
/* Before */
.slide {
  transition: transform 300ms cubic-bezier(0.2, 0, 0.38, 0.9);
}

/* After auto-fix */
.slide {
  transition: transform 300ms $easing-standard-productive;
}
```

### Opt-in (Experimental)

**Theme color tokens** - Requires `experimentalFixTheme` option:

```javascript
{
  'carbon/theme-use': [
    true,
    {
      experimentalFixTheme: 'white'  // or 'g10', 'g90', 'g100'
    }
  ]
}
```

```css
/* Before */
.button {
  color: #0f62fe;
  background: #ffffff;
}

/* After auto-fix */
.button {
  color: $background-brand;
  background: $ai-popover-background;
}
```

**⚠️ Warning**: Color auto-fix is experimental because colors can be ambiguous
(same color used by multiple tokens). Use with caution and review the suggested
tokens.

### Complete Example

```css
/* Before */
.card {
  color: #0f62fe;
  margin: 16px 24px;
  padding: 1rem;
  transition: all 110ms cubic-bezier(0.2, 0, 0.38, 0.9);
}

/* After auto-fix (with experimentalFixTheme: 'white') */
.card {
  color: $background-brand;
  margin: $spacing-05 $spacing-06;
  padding: $spacing-05;
  transition: all $duration-fast-02 $easing-standard-productive;
}
```

## Advanced Features

### calc() Expressions

```css
/* ✅ Proportional math */
.container {
  width: calc(100vw - $spacing-05);
}

/* ✅ Token negation */
.offset {
  margin-left: calc(-1 * $spacing-05);
}
```

### rgba() Function

```css
/* ✅ Carbon color with custom alpha */
.overlay {
  background: rgba($background, 0.8);
}
```

### Transform Functions

```css
/* ✅ Spacing tokens in transforms */
.slide {
  transform: translateX($spacing-05);
}
```

### Carbon v11 Functions

```css
/* ✅ Type functions */
.heading {
  font-size: type-scale(7);
  font-family: font-family(sans);
  font-weight: font-weight(semibold);
}

/* ✅ Motion function */
.fade {
  transition: opacity 300ms motion(standard, productive);
}
```

## Migration from V4

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

### Key Changes

**Breaking Changes**:

- Carbon v10 support removed (use v11+)
- Node.js 20+ required
- V10 functions not supported (use V11 equivalents)
- Configuration options restructured

**Most configurations work as-is**, but check the migration guide for:

- Deprecated options
- New configuration patterns
- V10 → V11 function migration

### Quick Migration

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

## Documentation

- **[Migration Guide](./MIGRATION.md)** - V4 → V5 migration instructions
- **[V3 to V4 Migration](./MIGRATION_V3_TO_V4.md)** - For users on V3 or earlier
- **[V5 Plan](./v5-rewrite-docs/V5_PLAN.md)** - V5 architecture and
  implementation plan

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Test Statistics**:

- 263 tests (100% passing)
- 84.34% line coverage
- 95.17% branch coverage
- 96.10% function coverage

## Contributing

Contributions welcome! Please:

1. Check existing issues
2. Create a new issue for discussion
3. Submit PR with tests
4. Follow existing code style

## License

MIT

## Support

- **Issues**:
  https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/issues
- **Carbon Design System**: https://carbondesignsystem.com
- **Stylelint**: https://stylelint.io

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

---

## Advanced Usage Examples

This section provides practical examples for common scenarios and advanced
configurations.

### Real-World Scenarios

#### Migrating from Hard-Coded Values

When migrating an existing codebase, start with the `light-touch` configuration
and gradually increase strictness:

```js
// Step 1: Start with warnings only
export default {
  extends: ['stylelint-plugin-carbon-tokens/light-touch'],
};

// Step 2: After fixing warnings, move to recommended
export default {
  extends: ['stylelint-plugin-carbon-tokens/recommended'],
};

// Step 3: For new projects or complete migration, use strict
export default {
  extends: ['stylelint-plugin-carbon-tokens/strict'],
};
```

**Migration workflow:**

```bash
# 1. Identify violations
npx stylelint "**/*.{css,scss}" --formatter verbose

# 2. Auto-fix safe violations
npx stylelint "**/*.{css,scss}" --fix

# 3. Review remaining violations
npx stylelint "**/*.{css,scss}" --formatter json > violations.json
```

#### Working with Component Libraries

When building a component library that extends Carbon, use `validateVariables`
to accept your library's design tokens:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/layout-use': [
      true,
      {
        validateVariables: [
          '/^\\$my-lib-/', // SCSS variables: $my-lib-spacing-*
          '/^--my-lib-/', // CSS custom properties: --my-lib-spacing-*
        ],
      },
    ],
    'carbon/theme-use': [
      true,
      {
        validateVariables: ['/^\\$my-lib-color-/', '/^--my-lib-color-/'],
      },
    ],
  },
};
```

**Component library pattern:**

```scss
// tokens.scss - Define library tokens using Carbon
$my-lib-spacing-sm: $spacing-03;
$my-lib-spacing-md: $spacing-05;
$my-lib-spacing-lg: $spacing-07;

$my-lib-color-primary: $background-brand;
$my-lib-color-secondary: $layer-accent;

// component.scss - Use library tokens
.my-component {
  padding: $my-lib-spacing-md; // ✅ Accepted
  color: $my-lib-color-primary; // ✅ Accepted
}
```

#### Using with CSS-in-JS

For CSS-in-JS solutions (styled-components, emotion, etc.), configure stylelint
to process JavaScript files:

```js
// stylelint.config.js
export default {
  extends: ['stylelint-plugin-carbon-tokens/recommended'],
  customSyntax: 'postcss-styled-syntax', // or '@stylelint/postcss-css-in-js'
  rules: {
    'carbon/theme-use': [
      true,
      {
        acceptCarbonCustomProp: true, // Accept var(--cds-*) in JS
      },
    ],
  },
};
```

**Example with styled-components:**

```jsx
import styled from 'styled-components';

// ✅ Valid - using CSS custom properties
const Button = styled.button`
  color: var(--cds-text-primary);
  background: var(--cds-background-brand);
  padding: var(--cds-spacing-05);
  transition: all var(--cds-duration-fast-02)
    var(--cds-easing-standard-productive);
`;
```

#### Gradual Adoption Strategy

For large codebases, adopt rules incrementally by directory:

```js
// stylelint.config.js
export default {
  extends: ['stylelint-plugin-carbon-tokens/light-touch'],
  overrides: [
    {
      // Strict enforcement for new components
      files: ['src/components/new/**/*.scss'],
      extends: ['stylelint-plugin-carbon-tokens/strict'],
    },
    {
      // Recommended for refactored components
      files: ['src/components/refactored/**/*.scss'],
      extends: ['stylelint-plugin-carbon-tokens/recommended'],
    },
    {
      // Allow legacy code temporarily
      files: ['src/legacy/**/*.scss'],
      rules: {
        'carbon/theme-use': null,
        'carbon/layout-use': null,
      },
    },
  ],
};
```

### Complex Configuration Examples

#### Multiple Rules with Different Settings

Customize each rule based on your project's needs:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    // Strict theme enforcement
    'carbon/theme-use': [
      true,
      {
        acceptValues: ['transparent', 'currentColor', 'inherit'],
        acceptCarbonCustomProp: true,
      },
    ],

    // Flexible layout with custom spacing
    'carbon/layout-use': [
      true,
      {
        acceptValues: [
          '0',
          'auto',
          '100%',
          '/^\\d+px$/', // Allow any px value temporarily
        ],
        validateVariables: ['/^\\$app-/'],
      },
    ],

    // Typography with system fonts
    'carbon/type-use': [
      true,
      {
        acceptValues: [
          'inherit',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
        ],
      },
    ],

    // Motion with custom durations
    'carbon/motion-duration-use': [
      true,
      {
        acceptValues: ['0s', '0ms'],
      },
    ],

    // Standard easing only
    'carbon/motion-easing-use': true,

    // Contextual layers as warnings
    'carbon/theme-layer-use': [
      true,
      {
        severity: 'warning',
      },
    ],
  },
};
```

#### Project-Specific Variable Patterns

Handle multiple variable naming conventions:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/layout-use': [
      true,
      {
        validateVariables: [
          // Component library prefix
          '/^\\$c4p-/',

          // Feature-specific prefixes
          '/^\\$header-/',
          '/^\\$sidebar-/',
          '/^\\$modal-/',

          // CSS custom properties
          '/^--component-/',
          '/^--feature-/',
        ],
      },
    ],
  },
};
```

**Usage example:**

```scss
// Variable declarations
$c4p-spacing-base: $spacing-05;
$header-height: $spacing-09;
$sidebar-width: $spacing-13;

--component-padding: var(--cds-spacing-05);
--feature-margin: var(--cds-spacing-07);

// All accepted in components
.header {
  height: $header-height; // ✅
  padding: $c4p-spacing-base; // ✅
}

.sidebar {
  width: $sidebar-width; // ✅
  margin: var(--feature-margin); // ✅
}
```

#### Mixed SCSS and CSS Custom Properties

Support both SCSS variables and CSS custom properties in the same project:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/theme-use': [
      true,
      {
        // Accept both formats
        acceptCarbonCustomProp: true,
        trackFileVariables: true,

        // Accept project variables in both formats
        validateVariables: ['/^\\$theme-/', '/^--theme-/'],
      },
    ],
  },
};
```

**Mixed usage:**

```scss
// SCSS variables
@use '@carbon/styles/scss/theme' as *;

$theme-primary: $background-brand;
$theme-secondary: $layer-accent;

// CSS custom properties
:root {
  --theme-surface: var(--cds-layer);
  --theme-border: var(--cds-border-subtle);
}

// Use both in components
.card {
  background: $theme-primary; // ✅ SCSS variable
  border: 1px solid var(--theme-border); // ✅ CSS custom property
}
```

### Integration Examples

#### Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        // Stylelint runs during development
        require('stylelint')({
          config: {
            extends: ['stylelint-plugin-carbon-tokens/recommended'],
          },
        }),
      ],
    },
  },
});
```

#### Webpack Configuration

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'stylelint-webpack-plugin',
            options: {
              configFile: '.stylelintrc.json',
              files: '**/*.{css,scss}',
              fix: true, // Auto-fix during build
            },
          },
        ],
      },
    ],
  },
};
```

#### CI/CD Pipeline

```yaml
# .github/workflows/lint.yml
name: Lint Styles

on: [push, pull_request]

jobs:
  stylelint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run stylelint
        run: npx stylelint "**/*.{css,scss}" --formatter github

      - name: Check for violations
        run: |
          if npx stylelint "**/*.{css,scss}" --quiet; then
            echo "No violations found"
          else
            echo "Violations found - see annotations above"
            exit 1
          fi
```

#### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Lint staged CSS/SCSS files
npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{css,scss}": ["stylelint --fix", "git add"]
  }
}
```

### Troubleshooting Examples

#### Handling False Positives

**Problem**: Legitimate values flagged as violations

```css
/* ❌ False positive - 0 is valid */
.element {
  margin: 0;
}
```

**Solution**: Add to `acceptValues`

```js
{
  'carbon/layout-use': [true, {
    acceptValues: ['0', 'auto', 'inherit']
  }]
}
```

#### Performance Optimization for Large Codebases

**Problem**: Slow linting on large projects

**Solution 1**: Use `.stylelintignore`

```
# .stylelintignore
node_modules/
dist/
build/
vendor/
*.min.css
```

**Solution 2**: Disable variable tracking for specific files

```js
export default {
  overrides: [
    {
      files: ['src/vendor/**/*.scss'],
      rules: {
        'carbon/layout-use': [
          true,
          {
            trackFileVariables: false, // Faster for vendor files
          },
        ],
      },
    },
  ],
};
```

**Solution 3**: Run in parallel

```json
{
  "scripts": {
    "lint:css": "stylelint --max-workers 4 \"**/*.{css,scss}\""
  }
}
```

#### Debugging Configuration Issues

**Problem**: Rules not working as expected

**Solution**: Enable debug output

```bash
# Check which rules are active
DEBUG=stylelint:* npx stylelint "src/**/*.scss"

# Verify configuration
npx stylelint --print-config src/component.scss
```

**Problem**: Variables not being resolved

**Solution**: Verify variable tracking is enabled

```js
{
  'carbon/layout-use': [true, {
    trackFileVariables: true,  // Must be true (default)
  }]
}
```

**Debug variable resolution:**

```scss
// Add debug output
$test-var: $spacing-05;

.debug {
  /* Check if this passes - if not, variable tracking may be disabled */
  margin: $test-var;
}
```

#### Common Configuration Mistakes

**Mistake 1**: Wrong regex syntax

```js
// ❌ Wrong - missing delimiters
validateVariables: ['^\\$app-'];

// ✅ Correct - wrapped in slashes
validateVariables: ['/^\\$app-/'];
```

**Mistake 2**: Forgetting to escape special characters

```js
// ❌ Wrong - $ not escaped
validateVariables: ['/^$app-/'];

// ✅ Correct - $ escaped
validateVariables: ['/^\\$app-/'];
```

**Mistake 3**: Conflicting options

```js
// ❌ Wrong - acceptUndefinedVariables makes validateVariables redundant
{
  acceptUndefinedVariables: true,
  validateVariables: ['/^\\$app-/']  // This has no effect
}

// ✅ Correct - use one or the other
{
  validateVariables: ['/^\\$app-/']  // Validate specific patterns
}
```

#### Handling Third-Party CSS

**Problem**: Violations in third-party libraries

**Solution**: Exclude third-party files

```js
export default {
  extends: ['stylelint-plugin-carbon-tokens/recommended'],
  ignoreFiles: ['node_modules/**', 'src/vendor/**', 'public/libs/**'],
};
```

**Alternative**: Disable rules for specific files

```js
export default {
  overrides: [
    {
      files: ['src/vendor/**/*.css'],
      rules: {
        'carbon/theme-use': null,
        'carbon/layout-use': null,
        'carbon/type-use': null,
      },
    },
  ],
};
```
