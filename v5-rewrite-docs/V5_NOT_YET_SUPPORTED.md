# V5 Not Yet Supported

This document lists features that are planned for V5 but not yet implemented.

## Summary

**Current Status**: V5 has achieved **100% feature parity** with V4's
non-deprecated features.

All major features have been implemented:

- ✅ All 5 rules (theme, layout, type, motion-duration, motion-easing)
- ✅ All 11 functions (calc, rgba, translate family, Carbon type/motion
  functions)
- ✅ Shorthand properties (transition, animation, font, border, outline) with
  auto-fix
- ✅ Modern viewport units (svw, lvw, dvw, svh, lvh, dvh, vi, vb, vmin, vmax)
- ✅ SCSS variables and CSS custom properties
- ✅ Logical properties support
- ✅ Regex patterns including negative lookahead (e.g., `/^font-(?!style)/`)

## No Remaining Gaps

V5 has achieved complete feature parity with all non-deprecated V4 features. All
advanced syntax features that were removed have been properly deprecated with
clear explanations of why V5's approach is superior.

See [`V5_DEPRECATIONS.md`](./V5_DEPRECATIONS.md) for details on deprecated
features and migration guidance.

## Future Enhancements

These features may be added in future minor releases based on user feedback:

1. **Enhanced auto-fix** - More intelligent suggestions based on context
2. **Custom property lists** - User-defined property validation patterns
3. **Fuzzy token matching** - Better suggestions when tokens don't match exactly
4. **Performance optimizations** - Caching and memoization for large codebases
5. **Additional Carbon functions** - Support for new Carbon Design System
   functions as they are released

## Documentation

For more information, see:

- [`V5_IMPLEMENTATION_STATUS.md`](./V5_IMPLEMENTATION_STATUS.md) - Complete
  implementation status
- [`V5_V4_COMPARISON.md`](./V5_V4_COMPARISON.md) - Detailed V4 vs V5 comparison
- [`V5_DEPRECATIONS.md`](./V5_DEPRECATIONS.md) - Deprecated features and
  migration guide
- [`V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md`](./V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md) -
  Shorthand implementation details
