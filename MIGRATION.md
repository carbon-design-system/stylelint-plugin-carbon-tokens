# Dependency Update Migration Guide

This document outlines the changes made to update the non-Carbon dependencies to
the latest major versions.

## Node.js Version Requirement

- Updated Node.js version requirement from `>=18` to `>=20` in package.json to
  accommodate the requirements of cspell v9 and npm-check-updates v19.

## ESLint Configuration

- Migrated from `.eslintrc` to the new `eslint.config.js` format required by
  ESLint v9.
- Updated the ESLint configuration to use the new flat config format.
- Added comments about changes to recommended rules in ESLint v9.
- Updated the lint:es script in package.json to use the new configuration file.
- Migrated ignore patterns from `.eslintignore` to the `ignores` property in
  `eslint.config.js`.
- Fixed plugin configuration to use the correct object format for the import
  plugin.
- Added `@eslint/js` as a dev dependency.
- Added global definitions for `console` and `process` to fix linting errors.
- Removed the old `.eslintrc` and `.eslintignore` files.

## Dependencies Updated

### Major Version Updates

1. **ESLint v9** (from v8.57.1)

   - New default config format (eslint.config.js)
   - Updated "eslint:recommended" rules
   - Removed require-jsdoc and valid-jsdoc rules
   - Changed behavior for no-inner-declarations, no-unused-vars, and
     no-useless-computed-key rules

2. **cspell v9** (from v8.14.4)

   - Requires Node.js 20+

3. **eslint-config-prettier v10** (from v9.1.0)

   - Added support for @stylistic formatting rules

4. **npm-check-updates v19** (from v16.14.20)
   - Requires Node.js 20+
   - Command line option changes for workspaces

### Minor Version Updates

1. **@ibm/telemetry-js** (^1.6.1 → ^1.10.2)
2. **eslint-plugin-import** (^2.30.0 → ^2.32.0)
3. **eslint-plugin-prettier** (^5.2.1 → ^5.5.4)
4. **prettier** (^3.3.3 → ^3.6.2)
5. **stylelint** (^16.13.2 → ^16.25.0)
6. **stylelint-test-rule-node** (^0.3.0 → ^0.4.0)

## Testing

After updating the dependencies, the following tests were performed:

1. Linting with the new ESLint configuration
2. Running the full test suite

No issues were found during testing.
