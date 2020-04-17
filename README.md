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
// .stylelintrc
{
  "plugins": [
    "stylelint-carbon-use"
  ],
  "rules": {
    // ...
    "plugin/carbon-use": "color",
    // ...
  }
}
```

#### Multiple properties

Multiple properties can be watched by passing them inside array. Regex can also be used inside arrays.

```js
// .stylelintrc
"rules": {
  // ...
  "plugin/carbon-use": [["/color/", "background-color", "box-shadow", "border"]],
  // ...
}
```

#### Regex support

Passing a regex will watch the variable usage for all matching properties. This rule will match all CSS properties while ignoring Sass and Less variables.

```js
// .stylelintrc
"rules": {
  // ...
  "plugin/carbon-use": "/color/",
  // ...
}
```

#### Options

Passing `ignoreValues` option, you can accpet values which are exact same string or matched by Regex

```js
// .stylelintrc
"rules": {
  // ...
  "plugin/carbon-use": [["/color/", "background-color", { ignoreValues: ["transparent", "inherit", "initial", "/[^(]+/"] }]],
  // ...
}
```

## Details

Carbon components has tokens for use with color, theming, timing, spacing, typography etc. Use this linter in order to encourage / verify thier use.

```scss
$ui-01: #f4f4f4;

.foo {
  color: #f4f4f4; // Ooh, that's not a carbon token 👋
}
```

### Supported scss variables

Scss variables using '\$' notation and perhaps carbon functions

```scss
// Simple variables
$ui-01: #f4f4f4;

color: $some-carbon-token;

// Using carbon functions
background-color: get-light-value($ui-01);
```
