# V5 Not Yet Supported

This document lists features that are planned for V5 but not yet implemented.

## Shorthand Properties

The following CSS shorthand properties are not yet supported in V5. When these properties are used, the plugin will not validate their individual component values.

### 1. `transition` (shorthand)
- **Status**: Not yet supported
- **Longhand alternatives**: Use individual properties that ARE supported:
  - `transition-property` ✅ Supported
  - `transition-duration` ✅ Supported (validated by `motion-duration-use`)
  - `transition-timing-function` ✅ Supported (validated by `motion-easing-use`)
  - `transition-delay` ✅ Supported (validated by `motion-duration-use`)
- **Example**:
  ```scss
  // ❌ Not yet validated
  transition: opacity 200ms ease-in-out;
  
  // ✅ Use longhand properties (validated)
  transition-property: opacity;
  transition-duration: $duration-fast-01;
  transition-timing-function: motion(standard, productive);
  ```

### 2. `animation` (shorthand)
- **Status**: Not yet supported
- **Longhand alternatives**: Use individual properties that ARE supported:
  - `animation-name` ✅ Supported
  - `animation-duration` ✅ Supported (validated by `motion-duration-use`)
  - `animation-timing-function` ✅ Supported (validated by `motion-easing-use`)
  - `animation-delay` ✅ Supported (validated by `motion-duration-use`)
  - `animation-iteration-count` ✅ Supported
  - `animation-direction` ✅ Supported
  - `animation-fill-mode` ✅ Supported
  - `animation-play-state` ✅ Supported
- **Example**:
  ```scss
  // ❌ Not yet validated
  animation: slide 300ms ease-in-out 100ms;
  
  // ✅ Use longhand properties (validated)
  animation-name: slide;
  animation-duration: $duration-moderate-01;
  animation-timing-function: motion(standard, productive);
  animation-delay: $duration-fast-01;
  ```

### 3. `font` (shorthand)
- **Status**: Not yet supported
- **Longhand alternatives**: Use individual properties that ARE supported:
  - `font-family` ✅ Supported (validated by `type-use`)
  - `font-size` ✅ Supported (validated by `type-use`)
  - `font-weight` ✅ Supported (validated by `type-use`)
  - `line-height` ✅ Supported (validated by `type-use`)
  - `font-style` ✅ Supported
  - `font-variant` ✅ Supported
- **Example**:
  ```scss
  // ❌ Not yet validated
  font: 14px/1.5 'IBM Plex Sans', sans-serif;
  
  // ✅ Use longhand properties (validated)
  font-family: $font-family-sans;
  font-size: $font-size-01;
  line-height: $line-height-01;
  ```

### 4. `border` and `outline` (shorthands)
- **Status**: Not yet supported
- **Longhand alternatives**: Use individual properties that ARE supported:
  - `border-color` / `outline-color` ✅ Supported (validated by `theme-use`)
  - `border-width` / `outline-width` ✅ Supported (validated by `layout-use`)
  - `border-style` / `outline-style` ✅ Supported
- **Example**:
  ```scss
  // ❌ Not yet validated
  border: 1px solid $border-subtle-01;
  
  // ✅ Use longhand properties (validated)
  border-width: $border-width-01;
  border-style: solid;
  border-color: $border-subtle-01;
  ```

## Implementation Status

Shorthand property support is planned for a future V5 release. The implementation strategy is documented in [`V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md`](./V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md).

### Workaround

Until shorthand properties are supported, use the longhand property alternatives listed above. All longhand properties are fully validated by the appropriate rules.

## Tracking

For the latest implementation status, see:
- [`V5_IMPLEMENTATION_STATUS.md`](./V5_IMPLEMENTATION_STATUS.md)
- [`V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md`](./V5_SHORTHAND_IMPLEMENTATION_STRATEGY.md)
