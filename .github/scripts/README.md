# Automation Scripts

This directory contains automation scripts for the AutoReadMe project.

## update-agents.mjs

Automatically updates `AGENTS.md` with significant commits.

### How it works

1. **Triggered** by GitHub Actions on every push to `main` branch
2. **Analyzes** the commit message and changed files
3. **Filters** for significant commits:
   - `feat:` / `feature:` - New features
   - `fix:` - Bug fixes
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `breaking:` - Breaking changes
   - Major documentation changes (with `docs:` prefix)

4. **Extracts** key changes from:
   - Commit body (bullet points)
   - Files changed (if no body)
   - Commit subject line

5. **Updates** AGENTS.md by:
   - Creating or finding the current month section
   - Adding formatted entry with commit hash, date, and changes
   - Updating the "Last Updated" timestamp

6. **Commits** changes back to repository automatically

### Running locally

```bash
# Test with a specific commit
node .github/scripts/update-agents.mjs <commit-hash>

# Test with latest commit
node .github/scripts/update-agents.mjs HEAD
```

### Commit message format

For best results, use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type: subject line

- Key change 1
- Key change 2
- Key change 3
```

**Examples:**

```
feat: add Rust project template support

- Created src/templates/rust.hbs template
- Updated scanner to detect Cargo.toml
- Added Rust-specific usage examples
```

```
fix: handle missing package.json gracefully

- Added file existence check in scanner
- Return default project info on error
- Added error logging
```

### Skipped commits

The script skips:
- Non-significant commit types (chore, style, test)
- Commits that don't change significant files
- Self-referential commits (updating AGENTS.md itself)
- Minor documentation fixes

### Configuration

Edit the script to adjust:
- `significantTypes` - Which commit types to track
- `isSignificantCommit()` - Filtering logic
- `extractKeyChanges()` - Change extraction logic
- `formatCommitEntry()` - Entry formatting

---

**Maintained by:** AutoReadMe automation system  
**License:** MIT
