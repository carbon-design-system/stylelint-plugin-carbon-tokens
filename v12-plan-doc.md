# Carbon v12 support plan

Tracking document for supporting Carbon v11, v11 with v12 feature flags, and
Carbon v12 in `stylelint-plugin-carbon-tokens`.

Status legend: `[x]` done, `[-]` in progress, `[ ]` not started.

## Background

A linted project is most likely to be in one of three states:

1. **v11** - Carbon v11 with no v12 feature flags.
2. **v11 + flags** - Carbon v11 with some or all `enable-v12-*` flags (or
   `enable-v12-release`) turned on.
3. **v12** - Carbon v12 packages.

Runtime detection of the installed version and the active flags is fragile
(flags can be set in JS, Sass or HTML, and only the Sass form is visible to
stylelint). The plan is therefore to avoid detection, to avoid shipping a second
copy of the Carbon packages, and to keep the token vocabulary shared between all
three states, because it is identical.

## Findings

Compared `@carbon/{themes,layout,type,motion}` at `11.85.0` against
`12.0.0-alpha.6` (layout, type and motion at `12.0.0-alpha.5`).

| Surface the plugin reads                  | v11 | v12 alpha | Difference |
| ----------------------------------------- | --- | --------- | ---------- |
| `themes.unstable_metadata.v11` names      | 384 | 384       | none       |
| `themes.white` keys (values: white, g100) | 235 | 235       | none       |
| `layout.unstable_tokens`                  | 37  | 37        | none       |
| `layout` exports (names and values)       | 68  | 68        | none       |
| `type.unstable_tokens`                    | 58  | 58        | none       |
| `motion` exports (durations, easings)     | 21  | 21        | none       |

- The existing test suite (377 tests) passes unchanged with the v12 alpha
  packages installed in place of v11.
- `$border-radius-*` tokens already exist in v11 (`@carbon/layout`).
- The v12 differences live in `@carbon/styles` SCSS, gated by `enable-v12-*`
  flags (for example `--cds-button-radius` in
  `packages/styles/scss/components/button/_radius.scss`, gated by
  `enable-v12-release`). They are not exported from any JS package, so the
  plugin cannot read them from its Carbon dependencies.
- `@carbon/styles` and `@carbon/react` are numbered `2.0.0-alpha.*` at the
  `v12.0.0-alpha.7` tag, while the element packages are `12.0.0-alpha.*`.
- The v12 alpha packages are rewritten in TypeScript but keep the `unstable_*`
  exports the plugin relies on, including `unstable_metadata.v11`.

### What is new in v12 (compiled CSS comparison)

Compiled `@carbon/styles` `1.119.0` (v11) and `2.0.0-alpha.7` (v12) with Dart
Sass and compared the `--cds-*` custom properties declared and referenced in the
output.

- **Declared, new in v12:** `--cds-button-radius`, `--cds-button-radius-ss`,
  `--cds-button-radius-se`, `--cds-button-radius-es`, `--cds-button-radius-ee`.
  Nothing was removed.
- `@carbon/styles` 1.119.0 compiled with `enable-v12-release: true` declares and
  references exactly the same custom properties as 2.0.0-alpha.7, which has
  `enable-v12-release` on by default. So "v11 + flags" and "v12" are the same
  vocabulary.
- No new SCSS variables were found in the `layout`, `themes`, `motion` and
  `type` Sass entry points. `$layout-token` is the only difference found (in v11
  only).
- Radius tokens (`$border-radius-00` to `-max`) are already exported by
  `@carbon/layout` v11 as `borderRadius00` to `borderRadiusMax`, but are not in
  `unstable_tokens`, so `loadLayoutTokens` does not load them today. Carbon
  defines them in `layout.tokens.json` alongside spacing. Carbon itself uses
  `$spacing-*` for some radii (for example `add-select`, `tile`) and
  `calc($border-radius-08 - 1px)` for inner corners (`card`, AI label).
- No current rule validates `border-radius`, so none of these properties is
  rejected today. They only matter once a rule that validates radii exists.

Sources: Carbon repo tags `v11.85.0` and `v12.0.0-alpha.7`,
`packages/feature-flags/feature-flags.yml`, and the `carbon-v12-migration` skill
in `db2-knowledge-base`.

## Decisions

- **D1** Keep importing the v11-compatible token packages. Move to v12 packages
  after v12 GA. Token names and values are currently identical.
- **D2** No second copy of `@carbon/*` (no aliased runtime dependencies) so
  users' `node_modules` do not grow.
- **D3** No runtime detection of installed version or active flags.
- **D4** (replaces the earlier `acceptCarbonV11`/`acceptCarbonV12` switch
  design) No version switches. Token names and values are identical in v11, v11
  with flags, and v12, so no rule needs to know the version.
- **D5** (replaces the earlier switch design) The v12 additions are delivered as
  a new rule, `carbon/border-radius-use`, which is enabled by **v12 variants of
  the presets**. Existing presets and rules are unchanged, so v11 users see no
  behavior change. A version switch is added only if a rule later has to behave
  differently by version.
- **D6** (was Q1) Keep `dependencies` on `^11` until v12 GA, then change the
  range. Do not widen to include v12 alphas: a fresh install would resolve to
  the highest satisfying version, which is the v12 alpha.
- **D7** (was Q2) The only v12-only tokens found are the five
  `--cds-button-radius*` custom properties. `border-radius-use` accepts
  `var(--cds-*radius*)` component radius properties in all versions (harmless on
  v11, where they simply have no effect).

## Open questions

- **Q3** How are the v12 presets exposed? `package.json` has no `exports` map,
  and the preset paths documented in the README (for example
  `stylelint-plugin-carbon-tokens/recommended`) do not resolve. Only
  `stylelint-plugin-carbon-tokens/config/recommended.js` does. Options: fix the
  README paths, or add an `exports` map for `./recommended`, `./strict`,
  `./light-touch` and the v12 variants. Needs a maintainer decision.

## Plan

### Phase 1 - Verify v12 compatibility of current behavior

- [x] Compare token names and values between v11.85.0 and v12.0.0-alpha.6
- [x] Run the existing test suite against the v12 alpha packages (377 pass)
- [x] Add a non-blocking CI job that runs the suite against the v12 alpha
      packages (`.github/workflows/ci.yml`, job `carbon-v12-alpha`)
- [ ] Commit the comparison as a repeatable script (names and values for all
      four packages) so it can be re-run at v12 rc and GA
- [ ] Make the v12 CI job blocking once v12 reaches rc

### Phase 2 - Radius rule

- [x] Resolve Q2 and replace the switch design (D4, D5, D7)
- [x] `loadRadiusTokens()` in `src/utils/carbon-tokens.ts` (memoised, frozen)
- [x] `carbon/border-radius-use`: require `$border-radius-*` (or `$spacing-*`)
      instead of hard-coded radii (also useful on v11). Radius tokens are SCSS
      variables only: no `--cds-border-radius-*` custom properties are emitted.
      Accepts CSS-wide keywords, `0`, percentages, the `/` separator, and
      `var(--cds-*radius*)`. Validates `calc($border-radius-08 - 1px)` style
      concentric corners.
- [x] Register the rule in `src/index.ts`
- [x] Rule tests and fixtures

### Phase 3 - Presets and further rules

- [ ] Resolve Q3, then add v12 variants of `recommended`, `strict` and
      `light-touch` that enable `carbon/border-radius-use`
- [ ] Flag overrides of `.cds--btn { border-radius }` and suggest
      `--cds-button-radius` on the container
- [ ] Warn on deprecated tokens (`layout-01` to `layout-07`)

### Phase 4 - Housekeeping

- [x] Memoise the token loaders in `src/utils/carbon-tokens.ts`. They were
      called for every file and rule, and `theme-use` also reloaded the layout
      tokens for every file. Results are now built once, frozen, and shared.
      Measured saving is small (about 0.6 ms per file and rule for the four
      loaders), so this is housekeeping rather than a major speed-up.
- [x] Resolve Q1: keep `^11` until GA (no `package.json` change needed now)
- [ ] Update `CHANGELOG.md` and the README (supported Carbon versions)

### Phase 5 - After Carbon v12 GA

- [ ] Re-run the comparison against the GA packages
- [ ] Move the dependency range to v12
- [ ] Fold the v12 preset variants into the main presets in the next major

## Re-running the comparison

Install both versions into scratch directories and compare the exports the
plugin reads:

```bash
mkdir -p /tmp/carbon-compare/v11 /tmp/carbon-compare/v12
(cd /tmp/carbon-compare/v11 && npm init -y && npm i @carbon/themes@11.85.0 \
  @carbon/layout @carbon/type @carbon/motion)
(cd /tmp/carbon-compare/v12 && npm init -y && npm i @carbon/themes@12.0.0-alpha.6 \
  @carbon/layout@12.0.0-alpha.5 @carbon/type@12.0.0-alpha.5 \
  @carbon/motion@12.0.0-alpha.5)
```

Run the test suite against v12 packages from a copy of the repo:

```bash
yarn add --ignore-scripts --no-lockfile @carbon/themes@12.0.0-alpha.6 \
  @carbon/layout@12.0.0-alpha.5 @carbon/type@12.0.0-alpha.5 \
  @carbon/motion@12.0.0-alpha.5 @carbon/colors@12.0.0-alpha.4
yarn test
```
