export default {
  rules: {
    'carbon/layout-use': [
      true,
      {
        severity: 'warning',
        acceptCarbonMiniUnitsFunction: true,
        acceptUndefinedVariables: true,
        acceptScopes: ['**'],
      },
    ],
    'carbon/motion-duration-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptScopes: ['**'],
      },
    ],
    'carbon/motion-easing-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptScopes: ['**'],
      },
    ],
    'carbon/theme-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptScopes: ['**'],
      },
    ],
    'carbon/type-use': [
      true,
      {
        severity: 'warning',
        acceptUndefinedVariables: true,
        acceptScopes: ['**'],
      },
    ],
  },
};
