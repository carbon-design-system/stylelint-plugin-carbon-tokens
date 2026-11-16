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
stylelint). The plan is therefore to use **explicit configuration** and to avoid
shipping a second copy of the Carbon packages.

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

Sources: Carbon repo tags `v11.85.0` and `v12.0.0-alpha.7`,
`packages/feature-flags/feature-flags.yml`, and the `carbon-v12-migration` skill
in `db2-knowledge-base`.

## Decisions

- **D1** Keep importing the v11-compatible token packages. Move to v12 packages
  after v12 GA. Token names and values are currently identical.
- **D2** No second copy of `@carbon/*` (no aliased runtime dependencies) so
  users' `node_modules` do not grow.
- **D3** No runtime detection of installed version or active flags. Use explicit
  options.
- **D4** Add switches in the style of `acceptCarbonCustomProp`:
  `acceptCarbonV11` (default `true`) and `acceptCarbonV12` (default `false`).
  The V11 switch is expected to be dropped in a future major.
- **D5** Both switches `false` is a configuration error. Both `true` is the
  migration (union) mode.

## Open questions

- **Q1** Dependency strategy for v12 users. Widening `dependencies` to
  `^11.x || ^12.0.0-alpha.0` is **not safe**: a fresh install would resolve to
  the highest satisfying version, which is the v12 alpha. Options:
  - Keep `dependencies` on `^11` until v12 GA, then change the range.
  - Move the `@carbon/*` packages to `peerDependencies` (users supply them; no
    duplicates under npm 7+ and pnpm), keeping them in `devDependencies` for
    tests.
- **Q2** What does `acceptCarbonV12` change for token validation, given the
  vocabulary is identical? Candidate: style-level custom properties such as
  `--cds-button-radius` and `--cds-button-radius-*` that no JS package exports.
- **Q3** Where do the switches live? Rule secondary options are per rule (six
  repeats). Presets (for example a v12 variant of `recommended`) could set them
  on every rule.

## Plan

### Phase 1 - Verify v12 compatibility of current behavior

- [x] Compare token names and values between v11.85.0 and v12.0.0-alpha.6
- [x] Run the existing test suite against the v12 alpha packages (377 pass)
- [x] Add a non-blocking CI job that runs the suite against the v12 alpha
      packages (`.github/workflows/ci.yml`, job `carbon-v12-alpha`)
- [ ] Commit the comparison as a repeatable script (names and values for all
      four packages) so it can be re-run at v12 rc and GA
- [ ] Make the v12 CI job blocking once v12 reaches rc

### Phase 2 - Configuration switches

- [ ] Resolve Q2 (what the switches gate)
- [ ] Add `acceptCarbonV11` and `acceptCarbonV12` to `BaseRuleOptions`
      (`src/types/index.ts`)
- [ ] Add them to the secondary option allow-list in `src/utils/create-rule.ts`
- [ ] Validate that at least one switch is `true`
- [ ] Unit tests for the three states (v11, v11 + flags, v12)
- [ ] Document the switches in the README and rule READMEs
- [ ] Decide on presets (Q3)

### Phase 3 - v12-aware rules

- [ ] `carbon/border-radius-use`: require `$border-radius-*` or
      `--cds-border-radius-*` instead of hard-coded radii (also useful on v11)
- [ ] Flag overrides of `.cds--btn { border-radius }` and suggest
      `--cds-button-radius` on the container (gated by `acceptCarbonV12`)
- [ ] Warn on deprecated tokens (`layout-01` to `layout-07`)

### Phase 4 - Housekeeping

- [ ] Memoise the token loaders in `src/utils/carbon-tokens.ts`. They are called
      for every file and rule, and `theme-use` also reloads the layout tokens
      for every file.
- [ ] Resolve Q1 and update `package.json` ranges accordingly
- [ ] Update `CHANGELOG.md` and the README (supported Carbon versions)

### Phase 5 - After Carbon v12 GA

- [ ] Re-run the comparison against the GA packages
- [ ] Move the dependency range to v12
- [ ] Flip defaults (`acceptCarbonV12` to `true`) and plan removal of
      `acceptCarbonV11` for the next major

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
