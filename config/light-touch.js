export default {
  rules: {
    'carbon/layout-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
      },
    ],
    'carbon/theme-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
        // validateGradients is undefined by default (no validation)
        // Alternative: validateGradients: 'recommended' | 'strict'
      },
    ],
    'carbon/type-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
      },
    ],
    'carbon/motion-duration-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
      },
    ],
    'carbon/motion-easing-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptCarbonCustomProp: true,
      },
    ],
  },
};
