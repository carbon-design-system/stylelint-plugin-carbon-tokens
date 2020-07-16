# stylelint-carbon-use

This project is intended to help users identify cases where tokens, functions and mixins defined as part of various projects relating to the Carbon Design System are used. [www.carbondesignsystem.com]

This includes, but may not be limited to, @carbon/themes, @carbon/colors, @carbon/layout, @carbon/type and @carbon/motion.

Not incluced, as they're not used through SCSS, are Carbon Icons, Grid and any other DOM related checks..

## Installation

```bash
# NOT YET DEPLOYED
# npm install @carbon/stylelint-carbon-use
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
    "carbon/rule-token-use": [ {
          // include standard color properites
        includeProps: ["/prop-a$/", "/prop-b$/<-1>", "prop-c", "prop-d<1 -2>", "*"],
        // ignore transparent, common reset values and 0 on its own
        ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
        // other options
        acceptOption: true
     } ]
  },
}
```

See rule README.md files for individual rule options and defaults.

[Theme token use](./theme-token-use/README.md)
[Layout token use](./layout-token-use/README.md)

### includeProps and ignoreValues

Accept arrays of strings and/or Regex followed by a range in angled brackets.

Defaults to options defined in the README files above.

#### Range

The range specification allows values or a range of values to be selected from a multipart value.

- Positive values represent positions at the start of a value list e.g. 1 is the first value.
- Negative values represent positions at the end of a value list. e.g. -1 = last value

- If no range is specified the whole value list is checked.
- A single value means only that value in a list is checked
- Two values represent start and end values of a range in the list.

e.g. ["/prop-a$/<-1>", "/prop-b$/<1 -2>"]

Specifies the last value of `prop-a` and the first to second last of `prop-b`,

#### General

Other valid values for use in ignoreValues and includeProps are:

- [] which indicates default values specified internally
- ["*"] also indicates default values specified internally
- ["a", "*"] "a" plus default values specified internally

## Variables

SCSS `$variables` and CSS `--variable` declared before are checked
