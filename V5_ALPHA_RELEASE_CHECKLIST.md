# V5 Alpha Release Checklist

**Version**: 5.0.0-alpha.1  
**Release Date**: TBD  
**Status**: Ready for Alpha Release

## Pre-Release Verification

### ✅ Code Quality
- [x] All TypeScript compilation passes without errors
- [x] All ESLint checks pass
- [x] All tests pass (263/263 tests passing)
- [x] Test coverage meets standards (84.34% line, 95.17% branch, 96.10% function)
- [x] No console warnings or errors in test output

### ✅ Feature Completeness
- [x] All 5 rules implemented and working:
  - [x] `carbon/theme-use` - Color and theme tokens
  - [x] `carbon/layout-use` - Spacing and layout tokens
  - [x] `carbon/type-use` - Typography tokens
  - [x] `carbon/motion-duration-use` - Motion timing tokens
  - [x] `carbon/motion-easing-use` - Motion easing functions
- [x] Shorthand property support (transition, animation, font, border, outline)
- [x] Auto-fix functionality implemented
- [x] Configuration options migrated from V4

### ✅ Documentation
- [x] README.md updated for V5
- [x] CHANGELOG.md updated with V5 changes
- [x] Migration guide created (MIGRATION_V4_TO_V5.md)
- [x] V5 implementation documentation complete:
  - [x] V5_V4_COMPARISON.md
  - [x] V5_DEPRECATIONS.md
  - [x] V5_NOT_YET_SUPPORTED.md
  - [x] V5_TEST_COVERAGE.md
- [x] API documentation for all rules
- [x] Configuration examples provided

### ✅ Package Configuration
- [x] package.json version set to `5.0.0-alpha.1`
- [x] package.json metadata correct (name, description, keywords)
- [x] Dependencies up to date
- [x] Build scripts working (`npm run build`)
- [x] Test scripts working (`npm test`, `npm run test:coverage`)
- [x] Files array in package.json correct

## Release Steps

### 1. Final Verification
```bash
# Clean build
npm run clean
npm run build

# Run all tests
npm test

# Run coverage report
npm run test:coverage

# Run linting
npm run lint

# Check for TypeScript errors
npx tsc --noEmit
```

### 2. Version Verification
- [ ] Confirm version in package.json: `5.0.0-alpha.1`
- [ ] Confirm version in CHANGELOG.md matches
- [ ] Confirm README.md mentions alpha status

### 3. Git Preparation
```bash
# Ensure all changes are committed
git status

# Create release branch (if not already on one)
git checkout -b release/v5.0.0-alpha.1

# Tag the release
git tag -a v5.0.0-alpha.1 -m "Release v5.0.0-alpha.1"
```

### 4. NPM Publishing
```bash
# Dry run to verify package contents
npm pack --dry-run

# Publish alpha to npm
npm publish --tag alpha

# Verify published package
npm view stylelint-plugin-carbon-tokens@alpha
```

### 5. Post-Release
- [ ] Push tags to GitHub: `git push origin v5.0.0-alpha.1`
- [ ] Create GitHub Release with release notes
- [ ] Update project board/issues
- [ ] Announce alpha release to team

## Known Limitations (Alpha)

### Expected Limitations
1. **create-rule.js Coverage**: 48.49% line coverage
   - This is acceptable - framework code tested through integration
   - All 5 rule files have 100% coverage

2. **carbon-tokens.js Coverage**: 89.18% line coverage
   - Missing coverage is legacy fallback path for older Carbon v11 versions
   - Primary path has full coverage

3. **Deprecation Warnings**: Stylelint deprecation warnings for `context.fix`
   - Known issue with Stylelint 16.x
   - Will be addressed in future release

### Not Included in Alpha
- Advanced auto-fix scenarios (complex calc expressions, nested functions)
- Performance optimizations
- Extensive real-world testing

## Testing Recommendations for Alpha Users

### Installation
```bash
npm install stylelint-plugin-carbon-tokens@alpha
```

### Basic Configuration
```js
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    'carbon/theme-use': true,
    'carbon/layout-use': true,
    'carbon/type-use': true,
    'carbon/motion-duration-use': true,
    'carbon/motion-easing-use': true,
  },
};
```

### Test Scenarios
1. **Theme tokens**: Test color validation in various properties
2. **Layout tokens**: Test spacing in margin, padding, gap, etc.
3. **Type tokens**: Test font-size, font-family, line-height
4. **Motion tokens**: Test transition and animation properties
5. **Shorthand properties**: Test transition, animation, font, border, outline
6. **Auto-fix**: Run with `--fix` flag and verify corrections

### Feedback Collection
- Report issues on GitHub: https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/issues
- Include:
  - Stylelint version
  - Carbon package versions
  - Minimal reproduction case
  - Expected vs actual behavior

## Success Criteria for Beta Release

Before moving from alpha to beta, we need:
- [ ] At least 3 teams testing in real projects
- [ ] No critical bugs reported
- [ ] Performance acceptable in large codebases
- [ ] Documentation feedback incorporated
- [ ] Auto-fix working reliably in common scenarios

## Release Notes Template

```markdown
# stylelint-plugin-carbon-tokens v5.0.0-alpha.1

## 🎉 Major Rewrite - Alpha Release

This is the first alpha release of v5, a complete rewrite of the plugin with focus on Carbon v11+ support.

### ✨ New Features
- Complete TypeScript rewrite for better type safety
- Support for all 5 Carbon token categories
- Shorthand property validation (transition, animation, font, border, outline)
- Auto-fix support for common violations
- Dual format support: SCSS variables and CSS custom properties
- Improved error messages with suggested fixes

### 🔧 Configuration
All V4 configuration options have been migrated and improved:
- `includeProps` - Now supports regex patterns including negative lookahead
- `acceptValues` - Per-rule configuration (no longer global)
- `acceptUndefinedVariables` - Allow custom variables
- `acceptCarbonCustomProp` - Allow Carbon CSS custom properties
- `carbonPrefix` - Custom prefix for CSS custom properties

### 📊 Test Coverage
- 263 tests (100% passing)
- 84.34% line coverage
- 95.17% branch coverage
- 96.10% function coverage

### 🚨 Breaking Changes
- Requires Carbon v11+ (v10 support removed)
- Node.js 20+ required
- Configuration options restructured (see migration guide)
- V10 Carbon functions not supported (use V11 equivalents)

### 📚 Documentation
- Complete migration guide from V4
- Detailed API documentation
- Configuration examples
- Test coverage report

### 🐛 Known Issues
- Stylelint deprecation warnings for `context.fix` (will be addressed in future release)

### 📦 Installation
```bash
npm install stylelint-plugin-carbon-tokens@alpha
```

### 🔗 Resources
- [Migration Guide](./MIGRATION_V4_TO_V5.md)
- [V4/V5 Comparison](./v5-rewrite-docs/V5_V4_COMPARISON.md)
- [Deprecations](./v5-rewrite-docs/V5_DEPRECATIONS.md)
- [Test Coverage](./v5-rewrite-docs/V5_TEST_COVERAGE.md)

### 🙏 Feedback Welcome
This is an alpha release - please test and provide feedback!
Report issues: https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens/issues
```

## Rollback Plan

If critical issues are discovered:
1. Unpublish alpha: `npm unpublish stylelint-plugin-carbon-tokens@5.0.0-alpha.1`
2. Fix issues in development
3. Increment alpha version (5.0.0-alpha.2)
4. Re-test and re-release

## Next Steps After Alpha

1. **Gather Feedback** (2-4 weeks)
   - Monitor GitHub issues
   - Collect user feedback
   - Track adoption metrics

2. **Address Issues**
   - Fix critical bugs
   - Improve documentation based on feedback
   - Optimize performance if needed

3. **Beta Release** (5.0.0-beta.1)
   - More stable than alpha
   - Feature complete
   - Ready for broader testing

4. **Release Candidate** (5.0.0-rc.1)
   - Production-ready
   - Final testing phase
   - Documentation finalized

5. **Stable Release** (5.0.0)
   - Fully tested and stable
   - Ready for production use
   - Complete documentation
