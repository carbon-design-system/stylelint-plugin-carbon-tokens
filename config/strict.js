export default {
  rules: {
    'carbon/layout-use': [
      true,
      { severity: 'error', trackFileVariables: false },
    ],
    'carbon/theme-use': [
      true,
      {
        severity: 'error',
        trackFileVariables: false,
        // Validate gradient color stops: only allows Carbon tokens and transparent
        // (no rgba() or other hard-coded colors)
        validateGradients: 'strict',
        // Alternative: validateGradients: 'recommended' (allows rgba white/black)
        // Alternative: remove validateGradients (no validation, like light-touch)
      },
    ],
    'carbon/theme-layer-use': [true, { severity: 'error' }],
    'carbon/type-use': [true, { severity: 'error', trackFileVariables: false }],
    'carbon/motion-duration-use': [
      true,
      { severity: 'error', trackFileVariables: false },
    ],
    'carbon/motion-easing-use': [
      true,
      { severity: 'error', trackFileVariables: false },
    ],
  },
};
