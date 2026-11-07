# AGENTS.md

This document tracks significant changes, features, and improvements to the AutoReadMe project, specifically focusing on contributions made through AI agents and automated workflows.

## Recent Changes

### October 2025

#### Project Initialization (2025-10-20)
**Commit:** `66dba1c` - Add MIT License section to README

**Major Changes:**
- **Initial project setup** with complete TypeScript-based CLI tool
- **Core functionality implemented:**
  - Project scanner (`src/scanner.ts`) that detects Node.js, Python, or generic projects
  - README generator (`src/generator.ts`) using Handlebars templates
  - CLI interface (`src/index.ts`) powered by Commander.js
  
- **Template system created:**
  - `default.hbs` - Generic project template
  - `node.hbs` - Node.js-specific template with npm instructions
  - `python.hbs` - Python-specific template with pip instructions
  
- **GitHub Actions workflow added:**
  - Automatic README generation on push to main branch
  - Auto-commits changes back to repository
  - Runs on Ubuntu with Node.js 20

- **Project infrastructure:**
  - TypeScript configuration with ESM modules
  - Build system using tsup for bundling
  - Dependencies: commander, fs-extra, handlebars, globby
  - MIT License applied

- **Documentation:**
  - Comprehensive README with quick start guide
  - Usage examples and CLI options
  - Contributing guidelines
  - MIT License section clarifying usage rights

**Key Features Implemented:**
- Auto-detection of project type from `package.json` or `requirements.txt`
- Badge generation (build status, license)
- Customizable output path via `--out` flag
- Template selection via `--template` flag
- Dependency listing in generated READMEs
- Usage examples tailored to project type

## Architecture Overview

### Core Components

1. **Scanner (`src/scanner.ts`)**
   - Detects project type by checking for `package.json` or `requirements.txt`
   - Extracts metadata: name, description, license, dependencies
   - Returns structured `ProjectInfo` object

2. **Generator (`src/generator.ts`)**
   - Loads appropriate Handlebars template
   - Compiles template with project data
   - Writes formatted README.md to disk
   - Generates badges for build and license

3. **CLI (`src/index.ts`)**
   - Command-line interface using Commander.js
   - `generate` command with template and output options
   - Executes generation workflow

4. **Templates (`src/templates/*.hbs`)**
   - Handlebars-based templating system
   - Separate templates for Node.js, Python, and generic projects
   - Variables: projectName, description, license, usageExample, dependencies, badges

### Build & Distribution

- **TypeScript** source with ESM module format
- **tsup** for fast bundling with minification and source maps
- **bin** entry point: `autoreadme` CLI command
- Can be installed globally via `npm link` or used directly

### Automation

- **GitHub Action** workflow runs on every push to main
- Auto-generates and commits README updates
- Ensures documentation stays synchronized with project changes

## Development Workflow

### Commands
```bash
npm install          # Install dependencies
npm run build        # Build CLI tool
npm run start        # Run built CLI
npm run test:local   # Test generation locally
```

### Adding New Templates

1. Create `src/templates/{language}.hbs`
2. Update scanner to detect the new project type
3. Add template selection logic in generator

### Extension Points

- **Scanner:** Add detection logic for more project types (Rust, Go, etc.)
- **Templates:** Create language-specific templates with relevant sections
- **Generator:** Extend badge generation or add AI enhancement stubs
- **CLI:** Add more command options or subcommands

## Next Steps & Roadmap

### Planned Enhancements
- AI-powered README polishing (stub exists in CLI options)
- Support for additional languages: Rust, Go, Java, etc.
- Configurable template variables via config file
- More sophisticated dependency analysis
- Section customization options
- Integration with package managers for better metadata extraction

### Testing
- Add unit tests for scanner, generator, and template rendering
- Integration tests for CLI commands
- Template validation tests

### Publishing
- Prepare for npm registry publication
- Version management and changelog generation
- Documentation improvements for contributors

---

**Last Updated:** 2025-10-20  
**Maintained by:** frpboy12  
**License:** MIT
