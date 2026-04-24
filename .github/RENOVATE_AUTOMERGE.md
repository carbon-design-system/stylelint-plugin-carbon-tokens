# Renovate Auto-merge Configuration

This repository is configured to automatically merge Renovate dependency update
PRs under specific conditions.

## How It Works

### 1. Renovate Configuration ([`renovate.json`](../../renovate.json))

The Renovate bot is configured with the following rules:

- **Minor and Patch Updates**: Automatically merged for stable packages
  (version >= 1.0.0)
  - Update types: `minor`, `patch`
  - Merge strategy: `squash`
  - Requires: All CI checks must pass

- **Major Updates**: Require manual review and approval
  - These PRs will NOT be auto-merged
  - Example: ESLint v9 → v10 (like PR #186)

### 2. GitHub Actions Workflow ([`.github/workflows/renovate-automerge.yml`](../workflows/renovate-automerge.yml))

When a Renovate PR is opened or updated:

1. The workflow enables GitHub's auto-merge feature
2. Once all required CI checks pass, the PR is automatically merged
3. The merge uses the squash strategy to keep history clean

### 3. CI Requirements ([`.github/workflows/ci.yml`](../workflows/ci.yml))

Before auto-merge occurs, all CI checks must pass:

- Build succeeds
- Linting passes
- All tests pass
- Runs on Node.js 22.x and 24.x

## What Gets Auto-merged

✅ **Automatically merged:**

- Patch updates (e.g., 1.2.3 → 1.2.4)
- Minor updates (e.g., 1.2.0 → 1.3.0)
- Only for stable packages (version >= 1.0.0)

❌ **Requires manual review:**

- Major updates (e.g., 1.0.0 → 2.0.0)
- Pre-release versions (0.x.x)
- Updates that fail CI checks

## Repository Settings Required

For auto-merge to work, ensure these GitHub repository settings are configured:

1. **Branch Protection Rules** (Settings → Branches → main):
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks: `build (22.x)`, `build (24.x)`

2. **Actions Permissions** (Settings → Actions → General):
   - ✅ Allow GitHub Actions to create and approve pull requests

3. **Auto-merge** (Settings → General):
   - ✅ Allow auto-merge (should be enabled by default)

## Disabling Auto-merge

To disable auto-merge for specific dependencies, add to
[`renovate.json`](../../renovate.json):

```json
{
  "packageRules": [
    {
      "matchPackageNames": ["package-name"],
      "automerge": false
    }
  ]
}
```

## Monitoring

- View Renovate activity: Check the [Dependency Dashboard](../../issues) issue
- Review auto-merged PRs: Filter by `renovate[bot]` author
- CI status: All PRs show CI check results before merging

## Troubleshooting

**Auto-merge not working?**

1. Check that CI passes on all required Node.js versions
2. Verify branch protection rules are configured
3. Ensure the PR is from `renovate[bot]`
4. Check that the update type is minor or patch (not major)

**Want to merge a major update?** Major updates require manual review because
they may contain breaking changes. Review the PR, test locally if needed, then
manually approve and merge.
