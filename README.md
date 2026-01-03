# AutoReadMe

**Transform messy repositories into maintainable documentation, automatically.**

AutoReadMe is a lightweight CLI tool that generates professional-grade README files from project analysis. Zero configuration. Intelligent defaults. Built for teams and CI/CD pipelines.

[![build passing](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/frpboy/autoreadme)
[![license MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/frpboy/autoreadme/blob/main/LICENSE)

## Problem Statement

README files are often an afterthought:
- Outdated as projects evolve
- Inconsistently structured across teams  
- Time-consuming to maintain manually
- Frequently missing critical sections (setup, architecture, troubleshooting)

AutoReadMe solves this by **analyzing your codebase and generating documentation that reflects reality**.

## How It Works

1. **Scans** your project structure, dependencies, and scripts
2. **Detects** project type (Node.js, Python, or generic)
3. **Generates** a structured, polished README with zero manual effort
4. **Integrates** seamlessly into CI/CD pipelines

## Key Features

- **Zero Configuration**: Works immediately with sensible defaults
- **Smart Detection**: Identifies Node.js, Python, or generic projects automatically
- **Git Integration**: Pulls repository URL and metadata from `.git/config`
- **Customizable Templates**: Handlebars-based templates for full flexibility
- **CI/CD Ready**: Includes GitHub Action for automatic README updates on every push
- **Script Discovery**: Auto-lists available npm/Python scripts for quick reference
- **Comprehensive Error Handling**: Helpful messages when something goes wrong

## Installation

### Global (recommended)
```bash
npm install -g autoreadme
```

### Local Development
```bash
git clone https://github.com/frpboy/autoreadme.git
cd autoreadme
npm install
npm run build
```

## Usage

### Quick Start
```bash
autoreadme generate
```

This creates/overwrites `README.md` in the current directory.

### With Options
```bash
# Specify template type
autoreadme generate --template node

# Custom output path
autoreadme generate --out docs/README.md

# Display help
autoreadme generate --help
```

### Project Type Detection

AutoReadMe intelligently detects your project:

| Detection | Template | File Markers |
|-----------|----------|---------------|
| **Node.js** | `node.hbs` | `package.json` present |
| **Python** | `python.hbs` | `requirements.txt` present |
| **Generic** | `default.hbs` | No recognized markers |

## Architecture

### Core Components

```
src/
├── index.ts        # CLI entry point and command routing
├── scanner.ts      # Project type detection and metadata extraction
├── generator.ts    # README generation logic
└── templates/      # Handlebars templates
    ├── node.hbs
    ├── python.hbs
    └── default.hbs
```

### Template System

Templates use **Handlebars syntax** and have access to:

```typescript
{
  projectName: string              // Inferred from package.json or directory
  description?: string             // From package.json or manual input
  license?: string                 // License type
  type: 'node' | 'python' | 'default'
  usageExample?: string            // CLI command examples
  dependencies?: string[]          // Package dependencies
  author?: string                  // Author information
  repository?: string              // Git repository URL
  scripts?: string[]               // Available npm/Python scripts
  badges: {                        // Pre-formatted status badges
    build: string
    license: string
  }
}
```

### Creating Custom Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use `{{variable}}` for text, `{{{variable}}}` for HTML/code
3. Test with example projects in `test/`

Example:
```handlebars
# {{projectName}}

{{description}}

## Installation
\`\`\`bash
{{{usageExample}}}
\`\`\`
```

## GitHub Actions Integration

Automatically regenerate your README on every push:

1. **Copy** `.github/workflows/autoreadme.yml` to your repository
2. **Commit and push** the workflow file
3. **GitHub Actions** will run automatically on main branch pushes

The workflow:
- Installs dependencies
- Builds the project  
- Generates a fresh README
- Commits changes if any (automatic version bump friendly)

## Development

### Build
```bash
npm run build
```

Compiles TypeScript to `dist/` using tsup.

### Test Locally
```bash
npm run test:local
cd test/example-node
node ../../dist/index.js generate
```

### Available Scripts

- `npm run dev` - Run in watch mode with ts-node
- `npm run build` - Build using tsup
- `npm run start` - Run the compiled CLI
- `npm run test:local` - Test against example projects
- `npm run test` - Build and generate test README

## FAQ

**Can I customize the generated README?**
Yes. Either modify templates in `src/templates/` or use custom templates with the `--template` flag.

**Does it overwrite my existing README?**
Yes, by default. Use `--out` to save to a different file.

**How do I add support for a new language/framework?**
Create a new `.hbs` template and add detection logic in `scanner.ts`. See CONTRIBUTING.md for details.

**Can I use this in CI/CD without GitHub Actions?**
Absolutely. The CLI works in any environment—just run `autoreadme generate` in your pipeline.

## Design Principles

- **Speed over perfection**: Generate useful docs in seconds, refine manually if needed
- **Zero friction**: No config files, no setup wizards
- **Extensibility**: Easy to add new templates and detection methods
- **Maintainability**: Clear separation of concerns (scanning, generation, templates)

## Roadmap

- [ ] Support for Rust, Go, Java, and other languages
- [ ] AI-powered content enhancement (optional)
- [ ] Interactive customization mode
- [ ] Badge configuration (build status, coverage, etc.)
- [ ] Plugin system for extensibility
- [ ] Multi-language README generation

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Support & Feedback

- **Bug reports**: [Open an issue](https://github.com/frpboy/autoreadme/issues)
- **Feature requests**: [Discussions](https://github.com/frpboy/autoreadme/discussions)
- **Security concerns**: Please email directly (see LICENSE for contact)

Check existing issues before creating new ones to avoid duplicates.

## Built With

- [Commander.js](https://github.com/tj/commander.js/) - Powerful CLI framework
- [Handlebars](https://handlebarsjs.com/) - Logic-less templates
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - File system utilities
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
