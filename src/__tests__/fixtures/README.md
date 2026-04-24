# Fixture-Based Tests

This directory contains fixture-based tests for the stylelint-plugin-carbon-tokens V5 implementation. These tests use real CSS/SCSS files to validate rule behavior against realistic scenarios extracted from the V4 test suite.

## Directory Structure

```
fixtures/
├── theme-use/
│   ├── valid/          # Files that should pass validation
│   ├── invalid/        # Files that should fail validation
│   └── skip/           # Features not yet supported in V5
├── layout-use/
├── type-use/
├── motion-duration-use/
├── motion-easing-use/
└── README.md
```

## Test Categories

### Valid Fixtures
Files in `valid/` directories should pass validation without errors. These test:
- Carbon SCSS tokens (`$spacing-01`, `$layer-01`, etc.)
- Carbon CSS custom properties (`var(--cds-spacing-01)`)
- Standard CSS reset values (`inherit`, `initial`, `unset`, `none`)
- Allowed values (percentages, `0`, `auto`, etc.)
- Standard CSS keywords (for typography, easing, etc.)

### Invalid Fixtures
Files in `invalid/` directories should fail validation with specific errors. These test:
- Hard-coded values (colors, spacing, typography, durations)
- Non-standard or custom values
- Values that should use Carbon tokens

### Skip Fixtures
Files in `skip/` directories document features not yet implemented in V5:
- Carbon v10 token support
- SCSS namespace support
- Custom Carbon functions (e.g., `type-scale()`)
- V10 to V11 migration features

## Running Fixture Tests

```bash
npm test
```

The fixture test runner (`src/__tests__/fixtures.test.ts`) automatically:
1. Discovers all fixture files in each category
2. Runs Stylelint with the appropriate rule configuration
3. Validates expected pass/fail behavior
4. Documents skipped features with `.skip()` tests

## Test Results Summary

**Current Status**: All fixture tests passing ✓

- **theme-use**: 2 valid, 1 invalid, 1 skip
- **layout-use**: 1 valid, 1 invalid, 0 skip
- **type-use**: 1 valid, 1 invalid, 1 skip
- **motion-duration-use**: 1 valid, 1 invalid, 0 skip
- **motion-easing-use**: 1 valid, 1 invalid, 0 skip

## Adding New Fixtures

To add a new fixture test:

1. Create a `.css` or `.scss` file in the appropriate directory
2. Add a comment header describing what the fixture tests
3. For invalid fixtures, note which lines should produce errors
4. For skip fixtures, document why the feature isn't supported

Example:
```scss
/**
 * Valid: Using Carbon SCSS spacing tokens
 */

.foo {
  margin: $spacing-01;
  padding: $spacing-05;
}
```

## Comparison with V4

These fixtures are based on V4 test cases but adapted for V5's simplified architecture:
- **Removed**: V10 token support, SCSS namespaces, custom parsers
- **Kept**: Core validation logic, Carbon v11 tokens, standard CSS values
- **Simplified**: No complex configuration options, cleaner error messages

## Future Enhancements

Potential additions to the fixture test suite:
- More complex CSS scenarios (nested rules, media queries)
- Edge cases (calc(), rgba(), complex selectors)
- Real-world Carbon component examples
- Performance benchmarks with large files
