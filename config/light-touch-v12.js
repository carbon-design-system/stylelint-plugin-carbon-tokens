import lightTouch from './light-touch.js';

// Light-touch plus rules for Carbon v12, and for Carbon v11 projects that have
// enabled the v12 feature flags. The token names are the same in all three
// states, so this preset also works on plain Carbon v11.
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    ...lightTouch.rules,
    'carbon/border-radius-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
      },
    ],
  },
};
