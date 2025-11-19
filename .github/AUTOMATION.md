# Automation Overview

This document describes the automated workflows in the AutoReadMe project.

## Workflows

### 1. AutoReadMe Generation (`autoreadme.yml`)

**Purpose:** Automatically regenerate README.md when code changes

**Trigger:** Push to `main` branch

**Steps:**
1. Checkout repository
2. Install dependencies
3. Build the CLI tool
4. Run `autoreadme generate`
5. Commit updated README.md

**Use case:** Keeps README synchronized with package.json and project structure

---

### 2. AGENTS.md Changelog (`update-agents.yml`)

**Purpose:** Automatically track significant changes in AGENTS.md

**Trigger:** Push to `main` branch (excluding AGENTS.md changes)

**Steps:**
1. Checkout full git history
2. Run update script on latest commit
3. Parse commit message and files
4. Update AGENTS.md if significant
5. Commit changes back

**Significant commit types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `breaking:` - Breaking changes
- `docs:` - Major documentation (with add/create/implement keywords)

**Significant files:**
- Anything in `src/`
- `package.json`
- `.github/workflows/`

---

## Update Script Details

### Script: `.github/scripts/update-agents.mjs`

**Language:** Node.js (ESM)

**Key Functions:**

1. **`isSignificantCommit(message, files)`**
   - Filters commits by type and changed files
   - Returns boolean

2. **`getCommitDetails(commitHash)`**
   - Extracts subject, body, author, date, files
   - Returns commit object

3. **`categorizeCommit(message)`**
   - Categorizes by type: feature, fix, refactor, etc.
   - Returns category string

4. **`extractKeyChanges(commit)`**
   - Parses commit body for bullet points
   - Infers changes from files if no body
   - Returns array of changes

5. **`formatCommitEntry(commit)`**
   - Creates formatted markdown entry
   - Includes commit hash, date, changes
   - Returns formatted string

6. **`updateAgentsFile(commitHash)`**
   - Main function orchestrating the update
   - Creates/finds month section
   - Inserts entry and updates timestamp
   - Writes to AGENTS.md

### Best Practices for Commits

To get the best automated changelog entries:

#### ✅ Good commit format:
```
feat: add Python project detection

- Scan for requirements.txt file
- Extract dependencies from pip format
- Generate Python-specific README template
```

#### ✅ Another good example:
```
fix: handle missing package.json gracefully

Scanner now returns default values when package.json is missing
instead of throwing an error.
```

#### ❌ Poor commit format:
```
update stuff
```

#### ❌ Too vague:
```
feat: improvements
```

### Manual Testing

Test the script locally before pushing:

```bash
# Test with specific commit
node .github/scripts/update-agents.mjs abc1234

# Test with HEAD
node .github/scripts/update-agents.mjs HEAD

# Test with previous commit
node .github/scripts/update-agents.mjs HEAD~1
```

---

## Workflow Coordination

Both workflows run independently but are coordinated:

1. **Paths exclusion** prevents infinite loops
2. **`update-agents.yml`** ignores changes to `AGENTS.md`
3. **`autoreadme.yml`** runs on all main branch pushes
4. Both use same bot credentials for commits

## Maintenance

### Updating the script

1. Edit `.github/scripts/update-agents.mjs`
2. Test locally with sample commits
3. Commit with clear message
4. Workflow will use updated script on next run

### Adjusting filters

Edit `isSignificantCommit()` function to change:
- Which commit types are tracked
- Which files trigger updates
- Additional filtering logic

### Customizing format

Edit `formatCommitEntry()` function to change:
- Entry structure
- Markdown formatting
- What information is included

---

## Troubleshooting

### Script fails silently
- Check `continue-on-error: true` in workflow
- Review GitHub Actions logs for script output
- Test locally with same commit hash

### Entries not appearing
- Verify commit type matches significant types
- Check that significant files were changed
- Ensure commit isn't self-referential

### Formatting issues
- Check `formatCommitEntry()` function
- Verify markdown syntax in output
- Test with sample commit locally

### Merge conflicts
- Script updates AGENTS.md atomically
- Conflicts should be rare
- Manually resolve if needed, script will continue

---

**Maintained by:** AutoReadMe project  
**Last Updated:** 2025-11-19  
**License:** MIT
