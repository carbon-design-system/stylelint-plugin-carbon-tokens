# Changelog

## 0.12.0

- chore: update Carbon versions
- chore: update browser list
- fix: resetting motion using none, unset, initial, inherit
- chore: read motion tokens using js

## 0.11.2

- Add support for translate3d

## 0.11.1

- Prevent linter falling over when passed the following forms
  code: `.foo { $body--height: 400px; top: -($body--height - $carbon--spacing-05); }`,
  code: `.foo { top: -($body--height - $carbon--spacing-05); }`,
  code: `.foo { $body--height: 400px; top: ($body--height - $carbon--spacing-05); }`,
  code: `.foo { top: ($body--height - $carbon--spacing-05); }`,
  code: `.foo { $body--height: 400px; top: $body--height - $carbon--spacing-05; }`,
  description: `Reject non-supported maths of form $x: 1px; $x - $token`,
  code: `.foo { top: $body--height - $carbon--spacing-05; }`,
  description: `Reject non-supported maths of form $unknown - $token`,
  code: `.foo {margin-top: 1 + map-get($map: (key: 1rem), $key: key);}`,

## 0.11.0

- Mocked console warnings thrown out during testing
- Added support for various forms of simple negation using
- Improved bracketed content support

## 0.10.0

- feat: Minor package dependency bumps including Carbon

## 0.9.0

- feat: Apply the 'acceptValues' in function parameters. Add tests for transform(x%, y%)

## 0.8.1

- fix: Previous version failed to process - and + and allowed / which is illegal in CSS and SCSS

## 0.8.0

- feat: improve handling of unattached operators

## 0.7.1

- fix: failure to parse math that has no value before it. Now emits warning

## 0.7.0

- feat: add support of -ve proportional values

## 0.6.1

- chore: add additional tests for value construction via pre-processor

## 0.6.0

- chore: switch tokenizer to simpler version

## 0.5.0

- fix: Replace use of matchAll with regex.exec to better support node 10

## 0.4.0

- feat: improve support for #{} syntax

## 0.3.0

- feat: switch layout to use js import of tokens

## 0.2.0

- chore: Removed dist from github
- chore: Updated gitignore
- feat: Add recommended config to README.md
- feat: switch color to use js import of tokens
- chore: add test for includeProps in theme

## 0.1.1

- Minor correction to initial release

## 0.1.0 Initial release
