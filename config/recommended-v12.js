import recommended from './recommended.js';

// Recommended plus rules for Carbon v12, and for Carbon v11 projects that have
// enabled the v12 feature flags. The token names are the same in all three
// states, so this preset also works on plain Carbon v11.
export default {
  plugins: ['stylelint-plugin-carbon-tokens'],
  rules: {
    ...recommended.rules,
    'carbon/border-radius-use': [true, { severity: 'error' }],
  },
};
