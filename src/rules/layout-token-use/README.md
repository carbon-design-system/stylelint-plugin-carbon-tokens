````js
{
  "plugins": [
    "stylelint-carbon-use"
  ],
  "rules": {
    "carbon/theme-token-use": [ { options } ]
       {

        // include standard color properites
        includeProps: ["/color$/", "/shadow$/<-1>", "border<-1>", "outline<-1>"],
        // ignore transparent, common reset values and 0 on its own
        ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
        // accept carbon tokens from @carbon/color
        acceptCarbonColorTokens: false,
        // accept IBM color tokens from @carbon/color
        acceptIBMColorTokens: false,
      },
    ],
  },
}


### acceptCarbonColorTokens

Default is false, permits color tokens from @carbon/color/scss mixin carbon--colors.

### acceptIBMColorTokens

Default is false, permits color tokens from @carbon/color/scss mixin ibm--colors.

## Details

Carbon components has tokens for use with color, theming, timing, spacing, typography etc. Use this linter in order to encourage / verify thier use.

```scss
$ui-01: #f4f4f4;

.foo {
  color: #f4f4f4; // Ooh, that's not a carbon token 👋
}
````

### Supports variables

Variables declared in the current file before use.

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
