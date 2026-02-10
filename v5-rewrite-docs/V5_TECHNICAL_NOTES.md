# V5 Technical Notes

## Token Loading Bug Fix (2026-02-06)

### Problem

The initial implementation had a critical bug in token loading functions. Tests
were failing because `loadLayoutTokens()` and `loadMotionTokens()` were
returning empty arrays.

### Root Cause

The Carbon packages (`@carbon/layout`, `@carbon/motion`, `@carbon/type`) export
`unstable_tokens` as **arrays of token name strings**, not objects with token
names as keys.

Example:

```javascript
// What Carbon actually exports:
['spacing01', 'spacing02', 'spacing03', ...]

// What we incorrectly assumed:
{ spacing01: 'value', spacing02: 'value', ... }
```

### The Bug

The code was using `for...in` loops to iterate over object keys (array indices
like '0', '1', '2') instead of the actual token names:

```typescript
// ❌ WRONG - iterates over array indices
for (const key in layoutTokens) {
  const token = formatTokenName(key); // key is '0', '1', '2'...
  const value = layoutTokens[key]; // value is 'spacing01', 'spacing02'...
}
```

This caused the token categorization logic to fail because:

1. `formatTokenName('0')` returns `'0'` (not a valid token name)
2. The switch/if statements checking for token prefixes never matched
3. All tokens were filtered out, resulting in empty arrays

### The Fix

Changed to iterate directly over array values using `for...of`:

```typescript
// ✅ CORRECT - iterates over token names
for (const tokenName of layoutTokens) {
  const token = formatTokenName(tokenName); // tokenName is 'spacing01', etc.
  // Now categorization works correctly
}
```

### Files Changed

1. **[`src/types/carbon.d.ts`](src/types/carbon.d.ts:8)** - Fixed type
   definitions

   ```typescript
   // Before
   export const unstable_tokens: Record<string, string>;

   // After
   export const unstable_tokens: string[];
   ```

2. **[`src/utils/carbon-tokens.ts`](src/utils/carbon-tokens.ts:80)** - Fixed
   three functions
   - `loadLayoutTokens()` - Lines 80-131
   - `loadTypeTokens()` - Lines 136-159
   - `loadMotionTokens()` - Lines 165-195

### Test Results

After the fix, all 27 tests pass:

```
✔ carbon-tokens (3.74875ms)
  ✔ loadThemeTokens (1.451333ms)
  ✔ loadLayoutTokens (0.420166ms)
  ✔ loadTypeTokens (0.304791ms)
  ✔ loadMotionTokens (0.538375ms)
  ✔ getAllTokens (0.703584ms)
✔ validators (4.245ms)
```

### Token Categories

**Layout Tokens (37 total)**:

- Spacing: `spacing01` through `spacing13`
- Fluid Spacing: `fluidSpacing01` through `fluidSpacing04`
- Layout: `layout01` through `layout07`
- Container: `container01` through `container05`
- Icon Size: `iconSize01`, `iconSize02`

**Motion Tokens (12 total)**:

- Easing: `fast01`, `fast02`, `moderate01`, `moderate02`, `slow01`, `slow02`
- Duration: `durationFast01`, `durationFast02`, `durationModerate01`,
  `durationModerate02`, `durationSlow01`, `durationSlow02`

**Type Tokens**: Font-related tokens (exact count varies by Carbon version)

### Lessons Learned

1. **Always verify data structures** - Don't assume the shape of imported data
2. **Debug with actual data** - Created `debug-tokens.js` to inspect raw exports
3. **Type definitions matter** - Incorrect TypeScript types masked the real
   issue
4. **Test early** - Unit tests caught the bug immediately

### Related Issues

This fix resolves:

- Empty spacing/layout token arrays
- Empty duration/easing token arrays
- All 5 failing tests in the initial implementation

### Future Considerations

The token loading functions now correctly:

1. Iterate over token name arrays
2. Categorize tokens by prefix matching
3. Generate both SCSS variables (`$token`) and CSS custom properties
   (`--cds-token`)
4. Return properly populated token collections

No further changes needed to token loading logic unless Carbon changes their
export format.
