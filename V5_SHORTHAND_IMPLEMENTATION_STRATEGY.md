# V5 Shorthand Property Implementation Strategy

This document outlines the strategy for implementing shorthand property validation in V5.

## Overview

V5 currently validates only longhand properties. This document provides a complete strategy to add support for:
1. `transition` and `animation` shorthands (motion rules)
2. `font` shorthand (type rule)
3. `border` and `outline` shorthands (theme rule)

## Current Gap

**Test Results:**
```css
/* V5 currently IGNORES these shorthands */
transition: opacity 200ms ease-in;        /* ❌ Not validated */
animation: slide 300ms ease-out;          /* ❌ Not validated */
font: 16px/1.5 Arial;                     /* ❌ Not validated */
border: 1px solid #000000;                /* ❌ Not validated */
outline: 2px solid #ff0000;               /* ❌ Not validated */

/* But VALIDATES longhand properties */
transition-duration: 200ms;               /* ✅ Validated */
font-size: 16px;                          /* ✅ Validated */
border-color: #000000;                    /* ✅ Validated */
```

---

## Implementation Strategy

### Phase 1: Shorthand Parser Utility

Create a new utility file to parse shorthand properties into their component parts.

**File:** `src/utils/parse-shorthand.ts`

```typescript
/**
 * Parse transition shorthand into components
 * Format: <property> <duration> <timing-function> <delay>
 * Example: "opacity 200ms ease-in 0s"
 */
export function parseTransition(value: string): {
  property?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
} {
  // Implementation details below
}

/**
 * Parse animation shorthand into components
 * Format: <name> <duration> <timing-function> <delay> <iteration-count> <direction> <fill-mode> <play-state>
 * Example: "slide 300ms ease-out 0s infinite normal forwards running"
 */
export function parseAnimation(value: string): {
  name?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
  playState?: string;
} {
  // Implementation details below
}

/**
 * Parse font shorthand into components
 * Format: <font-style> <font-variant> <font-weight> <font-size>/<line-height> <font-family>
 * Example: "italic small-caps bold 16px/1.5 Arial, sans-serif"
 */
export function parseFont(value: string): {
  style?: string;
  variant?: string;
  weight?: string;
  size?: string;
  lineHeight?: string;
  family?: string;
} {
  // Implementation details below
}

/**
 * Parse border shorthand into components
 * Format: <width> <style> <color>
 * Example: "1px solid #000000"
 */
export function parseBorder(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  // Implementation details below
}

/**
 * Parse outline shorthand into components
 * Format: <width> <style> <color>
 * Example: "2px solid #ff0000"
 */
export function parseOutline(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  // Implementation details below
}
```

### Phase 2: Update Rule Configurations

Add shorthand properties to each rule's `includeProps`.

#### Motion Duration Rule

**File:** `src/rules/motion-duration-use.ts`

```typescript
const defaultOptions: MotionDurationRuleOptions = {
  includeProps: [
    '/duration$/',
    'transition',    // Add shorthand
    'animation',     // Add shorthand
  ],
  // ... rest of options
};
```

#### Motion Easing Rule

**File:** `src/rules/motion-easing-use.ts`

```typescript
const defaultOptions: MotionEasingRuleOptions = {
  includeProps: [
    '/timing-function$/',
    'transition',    // Add shorthand
    'animation',     // Add shorthand
  ],
  // ... rest of options
};
```

#### Type Rule

**File:** `src/rules/type-use.ts`

```typescript
const defaultOptions: TypeRuleOptions = {
  includeProps: [
    '/^font-/',
    'line-height',
    'letter-spacing',
    'font',          // Add shorthand
  ],
  // ... rest of options
};
```

#### Theme Rule

**File:** `src/rules/theme-use.ts`

```typescript
const defaultOptions: ThemeRuleOptions = {
  includeProps: [
    '/color$/',
    'background',
    'background-color',
    '/border.*color$/',
    '/outline.*color$/',
    'fill',
    'stroke',
    '/shadow$/',
    'border',        // Add shorthand
    'outline',       // Add shorthand
  ],
  // ... rest of options
};
```

### Phase 3: Update Rule Creation Logic

Modify `create-rule.ts` to handle shorthand properties.

**File:** `src/utils/create-rule.ts`

Add shorthand detection and parsing logic in the main validation loop:

```typescript
root.walkDecls((decl) => {
  const prop = decl.prop;

  if (!shouldValidateProperty(prop, options.includeProps || [])) {
    return;
  }

  // NEW: Handle shorthand properties
  if (isShorthandProperty(prop)) {
    const validations = validateShorthand(prop, decl.value, ruleName, tokens, options);
    
    for (const validation of validations) {
      if (!validation.isValid) {
        utils.report({
          message: validation.message,
          node: decl,
          result,
          ruleName,
          // Fix would need to reconstruct the shorthand
        });
      }
    }
    return;
  }

  // EXISTING: Handle longhand properties
  const values = parseValue(decl.value);
  // ... existing validation logic
});
```

Add helper functions:

```typescript
/**
 * Check if a property is a shorthand
 */
function isShorthandProperty(prop: string): boolean {
  return ['transition', 'animation', 'font', 'border', 'outline'].includes(prop);
}

/**
 * Validate shorthand property based on rule
 */
function validateShorthand(
  prop: string,
  value: string,
  ruleName: string,
  tokens: CarbonToken[],
  options: BaseRuleOptions
): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (prop === 'transition') {
    const parsed = parseTransition(value);
    
    if (ruleName === 'carbon/motion-duration-use' && parsed.duration) {
      results.push(validateValue(parsed.duration, tokens, options));
    }
    
    if (ruleName === 'carbon/motion-easing-use' && parsed.timingFunction) {
      results.push(validateValue(parsed.timingFunction, tokens, options));
    }
  }
  
  else if (prop === 'animation') {
    const parsed = parseAnimation(value);
    
    if (ruleName === 'carbon/motion-duration-use' && parsed.duration) {
      results.push(validateValue(parsed.duration, tokens, options));
    }
    
    if (ruleName === 'carbon/motion-easing-use' && parsed.timingFunction) {
      results.push(validateValue(parsed.timingFunction, tokens, options));
    }
  }
  
  else if (prop === 'font') {
    const parsed = parseFont(value);
    
    if (ruleName === 'carbon/type-use') {
      if (parsed.size) results.push(validateValue(parsed.size, tokens, options));
      if (parsed.family) results.push(validateValue(parsed.family, tokens, options));
      if (parsed.weight) results.push(validateValue(parsed.weight, tokens, options));
      if (parsed.lineHeight) results.push(validateValue(parsed.lineHeight, tokens, options));
    }
  }
  
  else if (prop === 'border' || prop === 'outline') {
    const parsed = prop === 'border' ? parseBorder(value) : parseOutline(value);
    
    if (ruleName === 'carbon/theme-use' && parsed.color) {
      results.push(validateValue(parsed.color, tokens, options));
    }
  }

  return results;
}
```

### Phase 4: Shorthand Parser Implementation Details

#### Transition Parser

```typescript
export function parseTransition(value: string): {
  property?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
} {
  // Split by spaces, respecting function parentheses
  const parts = parseValue(value);
  
  const result: any = {};
  
  for (const part of parts) {
    // Duration/delay: ends with 's' or 'ms'
    if (/^\d+\.?\d*(m?s)$/.test(part)) {
      if (!result.duration) {
        result.duration = part;
      } else if (!result.delay) {
        result.delay = part;
      }
    }
    // Timing function: keyword or function
    else if (isTimingFunction(part)) {
      result.timingFunction = part;
    }
    // Property name: everything else
    else if (!result.property) {
      result.property = part;
    }
  }
  
  return result;
}

function isTimingFunction(value: string): boolean {
  const keywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
  return keywords.includes(value) || 
         value.startsWith('cubic-bezier(') || 
         value.startsWith('steps(') ||
         value.startsWith('motion(');
}
```

#### Animation Parser

```typescript
export function parseAnimation(value: string): {
  name?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
  playState?: string;
} {
  const parts = parseValue(value);
  const result: any = {};
  
  for (const part of parts) {
    // Duration/delay
    if (/^\d+\.?\d*(m?s)$/.test(part)) {
      if (!result.duration) {
        result.duration = part;
      } else if (!result.delay) {
        result.delay = part;
      }
    }
    // Timing function
    else if (isTimingFunction(part)) {
      result.timingFunction = part;
    }
    // Iteration count
    else if (/^\d+$/.test(part) || part === 'infinite') {
      result.iterationCount = part;
    }
    // Direction
    else if (['normal', 'reverse', 'alternate', 'alternate-reverse'].includes(part)) {
      result.direction = part;
    }
    // Fill mode
    else if (['none', 'forwards', 'backwards', 'both'].includes(part)) {
      result.fillMode = part;
    }
    // Play state
    else if (['running', 'paused'].includes(part)) {
      result.playState = part;
    }
    // Animation name (first non-keyword value)
    else if (!result.name) {
      result.name = part;
    }
  }
  
  return result;
}
```

#### Font Parser

```typescript
export function parseFont(value: string): {
  style?: string;
  variant?: string;
  weight?: string;
  size?: string;
  lineHeight?: string;
  family?: string;
} {
  const result: any = {};
  
  // Font is complex: style variant weight size/line-height family
  // Example: italic small-caps bold 16px/1.5 Arial, sans-serif
  
  const parts = value.split(/\s+/);
  let i = 0;
  
  // Optional: font-style
  if (['italic', 'oblique', 'normal'].includes(parts[i])) {
    result.style = parts[i++];
  }
  
  // Optional: font-variant
  if (['small-caps', 'normal'].includes(parts[i])) {
    result.variant = parts[i++];
  }
  
  // Optional: font-weight
  if (['bold', 'bolder', 'lighter', 'normal'].includes(parts[i]) || /^\d{3}$/.test(parts[i])) {
    result.weight = parts[i++];
  }
  
  // Required: font-size (and optional line-height)
  if (parts[i]) {
    const sizeHeight = parts[i++].split('/');
    result.size = sizeHeight[0];
    if (sizeHeight[1]) {
      result.lineHeight = sizeHeight[1];
    }
  }
  
  // Required: font-family (rest of the string)
  if (i < parts.length) {
    result.family = parts.slice(i).join(' ');
  }
  
  return result;
}
```

#### Border/Outline Parser

```typescript
export function parseBorder(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  const parts = parseValue(value);
  const result: any = {};
  
  for (const part of parts) {
    // Width: ends with length unit
    if (/^\d+\.?\d*(px|em|rem|%)$/.test(part) || ['thin', 'medium', 'thick'].includes(part)) {
      result.width = part;
    }
    // Style: border style keywords
    else if (['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(part)) {
      result.style = part;
    }
    // Color: everything else (hex, rgb, named colors, etc.)
    else {
      result.color = part;
    }
  }
  
  return result;
}

export function parseOutline(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  // Same as border
  return parseBorder(value);
}
```

### Phase 5: Testing Strategy

#### Unit Tests

Create test files for each parser:

**File:** `src/utils/__tests__/parse-shorthand.test.ts`

```typescript
describe('parseTransition', () => {
  it('should parse basic transition', () => {
    const result = parseTransition('opacity 200ms ease-in');
    expect(result.property).toBe('opacity');
    expect(result.duration).toBe('200ms');
    expect(result.timingFunction).toBe('ease-in');
  });

  it('should parse transition with motion() function', () => {
    const result = parseTransition('opacity 200ms motion(standard, productive)');
    expect(result.timingFunction).toBe('motion(standard, productive)');
  });

  it('should parse transition with delay', () => {
    const result = parseTransition('opacity 200ms ease-in 100ms');
    expect(result.duration).toBe('200ms');
    expect(result.delay).toBe('100ms');
  });
});

describe('parseAnimation', () => {
  it('should parse basic animation', () => {
    const result = parseAnimation('slide 300ms ease-out');
    expect(result.name).toBe('slide');
    expect(result.duration).toBe('300ms');
    expect(result.timingFunction).toBe('ease-out');
  });

  it('should parse animation with iteration count', () => {
    const result = parseAnimation('slide 300ms ease-out infinite');
    expect(result.iterationCount).toBe('infinite');
  });
});

describe('parseFont', () => {
  it('should parse basic font', () => {
    const result = parseFont('16px Arial');
    expect(result.size).toBe('16px');
    expect(result.family).toBe('Arial');
  });

  it('should parse font with line-height', () => {
    const result = parseFont('16px/1.5 Arial');
    expect(result.size).toBe('16px');
    expect(result.lineHeight).toBe('1.5');
  });

  it('should parse font with all properties', () => {
    const result = parseFont('italic small-caps bold 16px/1.5 Arial, sans-serif');
    expect(result.style).toBe('italic');
    expect(result.variant).toBe('small-caps');
    expect(result.weight).toBe('bold');
    expect(result.size).toBe('16px');
    expect(result.lineHeight).toBe('1.5');
    expect(result.family).toBe('Arial, sans-serif');
  });
});

describe('parseBorder', () => {
  it('should parse basic border', () => {
    const result = parseBorder('1px solid #000000');
    expect(result.width).toBe('1px');
    expect(result.style).toBe('solid');
    expect(result.color).toBe('#000000');
  });

  it('should parse border with named color', () => {
    const result = parseBorder('2px dashed red');
    expect(result.color).toBe('red');
  });
});
```

#### Integration Tests

Add fixture files for each shorthand:

**File:** `src/__tests__/fixtures/motion-duration-use/valid/transition-shorthand.css`

```css
.test {
  /* Valid: Using Carbon tokens in shorthand */
  transition: opacity $duration-fast-01 ease-in;
  animation: slide $duration-moderate-02 ease-out;
}
```

**File:** `src/__tests__/fixtures/motion-duration-use/invalid/transition-shorthand.css`

```css
.test {
  /* Invalid: Hard-coded duration in shorthand */
  transition: opacity 200ms ease-in;
  animation: slide 300ms ease-out;
}
```

Similar fixtures for:
- `motion-easing-use` (timing functions in shorthands)
- `type-use` (font shorthand)
- `theme-use` (border/outline shorthands)

### Phase 6: Auto-fix Support

Shorthand auto-fix is complex because we need to reconstruct the entire shorthand value:

```typescript
// In validateShorthand function
if (!validation.isValid && validation.suggestedFix) {
  // Reconstruct shorthand with fix
  const fixedValue = reconstructShorthand(prop, parsed, validation.suggestedFix);
  
  utils.report({
    message: validation.message,
    node: decl,
    result,
    ruleName,
    fix: context.fix ? () => {
      decl.value = fixedValue;
    } : undefined,
  });
}
```

---

## Implementation Order

### Priority 1: Motion Shorthands (High Impact)
1. Implement `parseTransition()` and `parseAnimation()`
2. Update motion-duration-use and motion-easing-use rules
3. Add shorthand validation logic to create-rule.ts
4. Write unit tests for parsers
5. Add integration test fixtures
6. Test with real-world examples

### Priority 2: Font Shorthand (Medium Impact)
1. Implement `parseFont()`
2. Update type-use rule
3. Add font shorthand validation logic
4. Write tests
5. Test with real-world examples

### Priority 3: Border/Outline Shorthands (Lower Impact)
1. Implement `parseBorder()` and `parseOutline()`
2. Update theme-use rule
3. Add border/outline validation logic
4. Write tests
5. Test with real-world examples

---

## Edge Cases to Handle

### Multiple Transitions/Animations
```css
transition: opacity 200ms ease-in, transform 300ms ease-out;
animation: slide 300ms ease-out, fade 200ms ease-in;
```
Need to split by comma and validate each separately.

### Complex Font Families
```css
font: 16px "Times New Roman", Times, serif;
```
Need to handle quoted strings and comma-separated fallbacks.

### CSS Variables in Shorthands
```css
transition: opacity var(--duration) ease-in;
border: 1px solid var(--color);
```
Should accept CSS custom properties if configured.

### Motion Function in Shorthands
```css
transition: opacity 200ms motion(standard, productive);
animation: slide 300ms motion(entrance, expressive);
```
Parser must recognize and preserve function calls.

---

## Success Criteria

1. ✅ All shorthand properties are validated
2. ✅ Validation matches V4 behavior for shorthands
3. ✅ Auto-fix works for simple cases
4. ✅ All tests pass
5. ✅ Documentation updated
6. ✅ No regression in existing longhand validation

---

## Timeline Estimate

- **Phase 1** (Parser Utility): 2-3 days
- **Phase 2** (Rule Updates): 1 day
- **Phase 3** (Validation Logic): 2-3 days
- **Phase 4** (Parser Implementation): 3-4 days
- **Phase 5** (Testing): 2-3 days
- **Phase 6** (Auto-fix): 2-3 days

**Total: 12-17 days** for complete implementation with testing
