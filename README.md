# stylelint-plugin-carbon-tokens

This project is intended to help users identify cases where tokens, functions and mixins defined as part of various projects relating to the Carbon Design System are used. [www.carbondesignsystem.com]

It consists of a stylelint plugin and depends on various Carbon Design System packages for loading settings.

It includes, but may not be limited to, linting for @carbon/themes, @carbon/colors, @carbon/layout, @carbon/type and @carbon/motion.

Not included, as they're not used through SCSS, are Carbon Icons, Grid and any other DOM related checks..

## Please be helpful

Before we start this project is a work in progress which deliberately outputs warnings when it comes across a syntax that has not yet been catered for. If you see one of these warnings please raise an issue so that it can be addressed.

## Stylelint

Before you can use this stylelint plugin you will need to install and configure stylelint.

See https://www.npmjs.com/package/stylelint for details

NOTE: Just in case you were wondering, yes you can use comments to enable and disable the linter.
E.g. // stylelint-disable-next-line

## Installation

```bash
npm install stylelint-plugin-carbon-tokens
```

```bash
yarn add stylelint-plugin-carbon-tokens
```

## Usage

Add it to your stylelint config `plugins` array.

```js
module.exports = {
  // stylelint.js
  // ...
  plugins: ["stylelint-plugin-carbon-tokens"],
  //...
};
```

Then add rules as follows:

```js
modules.exports = {
  // stylelint.js
  //...
  rules: {
    //... other rules
    "carbon/layout-token-use": true,
    "carbon/motion-token-use": [true, { severity: "warning" }],
    "carbon/theme-token-use": true,
    "carbon/type-token-use": true,
    //...other rules
  },
  //...
};
```

NOTE: Motion is shown above with a standard stylelint secondary option `severity` set to `warning` the default is `error`.

FYI: There are no automated fixes with --fix. See [Why no --fix?](#Why%20no%20--fix?)

FYI: With regards to math. See [What math is OK?](#What%20math%20is%20OK?)

## Recommended config

### Strict

```js
  rules: {
    // ADDED TO TEST CARBON USE
    'carbon/layout-token-use': [true, { severity: 'error', acceptUndefinedVariables: false }],
    'carbon/motion-token-use': [true, { severity: 'error', acceptUndefinedVariables: false }],
    'carbon/theme-token-use': [true, { severity: 'error', acceptUndefinedVariables: false }],
    'carbon/type-token-use': [
      true,
      {
        severity: 'error',
        acceptCarbonTypeScaleFunction: true,
        acceptCarbonFontWeightFunction: true,
      },
    ],
  },
```

### Default

```js
  rules: {
    // ADDED TO TEST CARBON USE
    'carbon/layout-token-use': [true, { severity: 'error' }],
    'carbon/motion-token-use': [true, { severity: 'error' }],
    'carbon/theme-token-use': [true, { severity: 'error' }],
    'carbon/type-token-use': [
      true,
      {
        severity: 'error',
        acceptCarbonTypeScaleFunction: true,
        acceptCarbonFontWeightFunction: true,
      },
    ],
  },
```

### Light touch

```js
  rules: {
    // ADDED TO TEST CARBON USE
    'carbon/layout-token-use': [true, { severity: 'warning' }],
    'carbon/motion-token-use': [true, { severity: 'warning' }],
    'carbon/theme-token-use': [true, { severity: 'warning' }],
    'carbon/type-token-use': [
      true,
      {
        severity: 'warning',
        acceptCarbonTypeScaleFunction: true,
        acceptCarbonFontWeightFunction: true,
      },
    ],
  },
```

## Variables

SCSS `$variables` and CSS `--variable` declared before are checked.

## Secondary Options

Each of the rules listed above have secondary options which are documented in the individual rule README.md files along with defaults..

- [Layout token use](./src/rules/layout-token-use/README.md)
- [Motion token use](./src/rules/motion-token-use/README.md)
- [Theme token use](./src/rules/theme-token-use/README.md)
- [Type token use](./src/rules/type-token-use/README.md)

The simplest type of secondary options are boolean and of the form `acceptSomeThing: Boolean`

e.g.

```js
modules.exports = {
  // stylelint.js
  //...
  rules: {
    //... other rules
    "carbon/type-token-use": [
      true,
      {
        severity: "warning",
        acceptUndefinedVariables: false,
        acceptCarbonTypeScaleFunction: false,
      },
    ],
    //...other rules
  },
  //...
};
```

## Advanced options

These options when omitted to accept the defaults. They are intended to support non-standard use cases and accept values that use a syntax which may well need some refining as the project moves forward.

- includeProps: Array
- acceptValues: Array

Arrays of strings and/or Regex followed by a range in angled brackets.

The defaults for these are defined in the individual README files listed above.

- `includeProps: []` - Indicates default, same as omitting the property
- `includeProps: ["*"]` - Indicates default, same as omitting the property
- `includeProps: ["/^\\$my-color--/", "*"]` - SCSS variable starting "\$my-color--", plus default values specified

The last option here shows how you could elect to check your own tokens refer to values acceptable to the linter.

- `acceptValues: ["$/^\\$my-color--/"]` - Accept SCSS variables starting "\$my-color--"

### includeProps Range

Can include a range value expressed inside greater than and less than signs.

e.g. `["/prop-a$/<-1>", "/prop-b$/<1 -2>"]`

The above specifies the last value of `prop-a` and the first to second last of `prop-b`,

It can be applied either to regex or string values and allows values or a range of values to be selected from a multipart value.

The range value allows values to be selected from a multipart value such as a box-shadow.

- Positive values represent positions at the start of a value list e.g. 1 is the first value.
- Negative values represent positions at the end of a value list. e.g. -1 = last value

- If no range is specified the whole value list is checked.
- A single value means only that value in a list is checked
- Two values represent start and end values of a range in the list.

### includeProps specific values

For some props e.g. transform we are only interested in values that match a certain criteria.

This is specified as part of the includedProp inside [].

e.g. `translate[/^transform/]`

In this case only values starting `transform` are tested so not `skew` for example. As per the prop definition the can be a plain string or regular expression.

### Function values specific range for function parameters

If not specified then parameters are treated as a single value.

The range for parameters is specified in ()

e.g. `calc(1)` or `translate(1,2)`.

NOTE: this is not currently a user configurable option.

## Why no --fix?

The main reason there are no automated fixes is that it is very hard to translate from physical value or scss variable or css custom property or function to a logical version. It is also the case that the user may not have imported the relevant SCSS file, or even have the package installed. Although the relevant Carbon packages are currently listed as dependencies they may be more loosely coupled in the future and a user would still need to import them in order to build.

### Color

Gray 80 - #393939 is the value used by the following color tokens:

- (White and Gray 10 theme) - $interactive-02 and $inverse-02
- (Gray 90 theme) - $ui-01, $field-01, $active-secondary and $disabled-01
- (Gray 100 theme) - $ui-02, $ui-03, $field-02, $active-secondary, $selected-ui and $skeleton-02

Now having a setting for the theme in the options would narrow this down to at best two and even there it is hard to pick one.

### Layout

The task is perhaps simpler for layout where Carbon only lists spacing tokens (2, 4, 8, 12, 24, 32, 40, 48)px and layout tokens (16, 24, 32, 48, 64, 96, 160)px, however, the full picture includes container tokens (24, 32, 40, 48, 64)px, icon-size (16, 20)px, fluid-layout tokens (0, 2, 5, 10)vw.

### Motion

Motion is a combination of timing and easing and is a possibility as there is a one to one match between timings and tokens. The easing functions are slightly more complicated with some undocumented values declared with the timing values, that said Carbon lists six distinct options here https://www.carbondesignsystem.com/guidelines/motion/overview

### Type

Is not just one css value but a range of values; type, font-size, line-height, font-weight and letter-spacing. There are also functions which could be used to font-weight and font-family. In theory, we should only see font-weight explicitly set by function or mixin, line-height however can be used as a layout mechanism in some scenarios.

## What math is OK?

The range of math permitted is limited in order to ensure carbon tokens are used appropriately.

| Math                              | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `calc(P O $)`                     | Where P is (%, vw or vh), O is (+ or -) and \$ is a token |
| `calc(-1 * $)` and `calc($ * -1)` | To allow negation                                         |

### Not allowed

While it is tempting to allow arbitrary math on tokens, such as the following.

e.g. `$layout-01 * 1.25` or `$layout-01 - 2px`

Doing so would allow any value to be constructed without the user having to add any reasoning in the source file. The recommendation here is to use a stylelint disable and add a comment.

```scss
// stylelint-disable-next-line carbon/layout-token-use
top: calc($layout-07 * 3.14); // A value related to PI was needed
```

While this example is a bit silly it serves to demonstrate how easy allowing arbitrary math would allow any value, not using the mini-grid could be calculated.

If there is demand, an option to allow the loosening of this rule could be created (feel free to submit a PR). This would likely go no further than allowing multiplication by whole numbers so as to keep the result on a mini-unit boundary.
