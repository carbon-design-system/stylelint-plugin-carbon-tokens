export default {
  rules: {
    'carbon/layout-use': [true, { severity: 'error' }],
    'carbon/theme-use': [
      true,
      {
        severity: 'error',
        // Validate gradient color stops: allows Carbon tokens, transparent,
        // and semi-transparent white/black via rgba()
        validateGradients: 'recommended',
        // Alternative: validateGradients: 'strict' (only tokens + transparent)
        // Alternative: remove validateGradients (no validation, like light-touch)
      },
    ],
    'carbon/theme-layer-use': [true, { severity: 'warning' }],
    'carbon/type-use': [true, { severity: 'error' }],
    'carbon/motion-duration-use': [true, { severity: 'error' }],
    'carbon/motion-easing-use': [true, { severity: 'error' }],
  },
};
