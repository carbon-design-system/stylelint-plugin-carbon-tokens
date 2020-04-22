# stylelint-carbon-use

## Installation

```
npm install stylelint-carbon-use
```

## Usage

Add it to your stylelint config `plugins` array, then add `"carbon-use"` to your rules,
specifying the property for which you want to check the usage of variable.

Like so:

```js
{
  "plugins": [
    "stylelint-carbon-use"
  ],
  "rules": {
    "scss/theme-token-use": [
    "always",
    {
      ignoreValues: ["/transparent|inherit/"],
      includeProps: ["/color/", "/shadow/", "border"],
    },
  ]",
  }
}
```

NOTE: ignoreValues and includeProps accept an array of strings and/or Regex.

## Details

Carbon components has tokens for use with color, theming, timing, spacing, typography etc. Use this linter in order to encourage / verify thier use.

```scss
$ui-01: #f4f4f4;

.foo {
  color: #f4f4f4; // Ooh, that's not a carbon token 👋
}
```

### Supports variables

```scss
// Simple variables declared before use
$ui-01: #f4f4f4;
$som-carbon-token = $ui-01;
color: $some-carbon-token;

// css simple variables declared before use
$ui-01: #f4f4f4;
--my-var: $ui-01
color: var(--my-var);

// Using carbon functions
background-color: get-light-value($ui-01);
```
