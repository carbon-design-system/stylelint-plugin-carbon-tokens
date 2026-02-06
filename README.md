# stylelint-plugin-carbon-tokens v5 (Alpha)

> **⚠️ This is an alpha release of v5 - a complete rewrite focused on Carbon v11+**

A stylelint plugin to enforce the use of Carbon Design System tokens in CSS and SCSS files.

## What's New in V5

- **TypeScript**: Complete rewrite in TypeScript for better type safety
- **Carbon v11 Only**: Simplified to support only Carbon v11+ (no v10 compatibility)
- **Modern Parsing**: Uses standard PostCSS parser (no custom parsers)
- **Dual Format Support**: Validates both SCSS variables (`$spacing-05`) and CSS custom properties (`var(--cds-spacing-05)`)
- **Simplified Configuration**: Removed complex options like scope enforcement and custom Carbon paths

## Installation

```bash
npm install stylelint-plugin-carbon-tokens@alpha
```

## Usage

Add to your stylelint configuration:

```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/theme-use': true,
    'carbon/layout-use': true,
    // Additional rules coming soon:
    // 'carbon/type-use': true,
    // 'carbon/motion-duration-use': true,
    // 'carbon/motion-easing-use': true,
  },
};
```

## Available Rules (v5 Alpha)

### ✅ Implemented

- **carbon/theme-use** - Validates color and theme tokens
- **carbon/layout-use** - Validates spacing and layout tokens

### 🚧 Coming Soon

- **carbon/type-use** - Typography tokens
- **carbon/motion-duration-use** - Motion timing tokens
- **carbon/motion-easing-use** - Motion easing functions

## Rule Options

Each rule supports these options:

```js
{
  'carbon/theme-use': [
    true,
    {
      // Properties to check (default varies by rule)
      includeProps: ['color', 'background-color'],
      
      // Values to accept without validation
      acceptValues: ['transparent', 'inherit', '/^0$/'],
      
      // Allow user-defined SCSS/CSS variables
      acceptUndefinedVariables: false,
      
      // Allow Carbon CSS custom properties
      acceptCarbonCustomProp: false,
      
      // Custom Carbon prefix for CSS custom properties
      carbonPrefix: 'cds',
    },
  ],
}
```

## Auto-Fix Support

V5 includes basic auto-fix capabilities:

```bash
stylelint --fix "**/*.{css,scss}"
```

Fixes include:
- Hard-coded values → Carbon tokens (when 1:1 mapping exists)
- Incorrect CSS custom property prefix

## Migration from V4

See [V4-README.md](./V4-README.md) for V4 documentation.

Key changes:
- Carbon v10 support removed
- SCSS namespace handling removed
- Custom parser removed
- Simplified configuration options
- No v10-to-v11 auto-migration

## Development Status

This is an **alpha release** - a proof of concept for the V5 architecture. 

**What works:**
- TypeScript build system
- Carbon token loading from v11 packages
- Basic validation for theme and layout rules
- Simple auto-fix for direct token replacements

**What's missing:**
- Type, motion-duration, and motion-easing rules
- Comprehensive tests
- Advanced auto-fix scenarios
- Full documentation

## Requirements

- Node.js >= 20
- stylelint >= 16
- Carbon Design System v11 packages

## License

MIT

## Contributing

This is an alpha release. Feedback and contributions welcome!

For V4 documentation, see [V4-README.md](./V4-README.md).
