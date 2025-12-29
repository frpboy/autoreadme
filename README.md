# AutoReadMe

Auto-generate professional README.md files from your project structure with zero configuration.

![build](https://img.shields.io/badge/build-passing-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## Overview

AutoReadMe is a lightweight CLI tool that automatically generates clear, well-structured README files by analyzing your project. It detects your project type, dependencies, scripts, and repository information to create documentation that stays up-to-date without manual editing.

Perfect for:
- Quickly bootstrapping documentation for new projects
- Maintaining consistent README structure across projects
- Automating documentation in CI/CD pipelines
- Teams that want standardized project documentation

## Features

- **Zero Configuration**: Works out of the box with sensible defaults
- **Smart Detection**: Automatically identifies Node.js, Python, or generic projects
- **Git Integration**: Detects and includes repository information from `.git/config`
- **Customizable Templates**: Easy-to-modify Handlebars templates for different project types
- **CI/CD Ready**: Includes GitHub Action for automatic README updates
- **Script Discovery**: Automatically lists available npm scripts for Node projects
- **Error Handling**: Comprehensive error handling with helpful messages

## Installation

### Global Installation

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

### Basic Usage

Generate a README in the current directory:

```bash
autoreadme generate
```

Or if running locally:

```bash
node dist/index.js generate
```

### Options

```bash
autoreadme generate [options]

Options:
  -t, --template <name>   Specify template (node|python|default)
  -o, --out <path>        Output path (default: README.md)
  -h, --help              Display help
```

### Examples

```bash
autoreadme generate

autoreadme generate --template node

autoreadme generate --out docs/README.md
```

## Project Detection

AutoReadMe automatically detects your project type:

| Project Type | Detection Method | Template Used |
|--------------|------------------|---------------|
| Node.js | `package.json` exists | `node.hbs` |
| Python | `requirements.txt` exists | `python.hbs` |
| Generic | No specific files detected | `default.hbs` |

## Templates

Templates are located in `src/templates/` and use Handlebars syntax.

### Available Data

Templates have access to:

```typescript
{
  projectName: string;
  description?: string;
  license?: string;
  type: 'node'|'python'|'default';
  usageExample?: string;
  dependencies?: string[];
  author?: string;
  repository?: string;
  scripts?: string[];
  badges: {
    build: string;
    license: string;
  }
}
```

### Creating Custom Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use triple braces `{{{variable}}}` for code content
3. Use double braces `{{variable}}` for text content
4. Test with example projects

Example:

```handlebars
# {{projectName}}

{{description}}

## Installation
```bash
{{{usageExample}}}
```

## License
{{license}}
```

## GitHub Action

Automatically update your README on every push:

1. Copy `.github/workflows/autoreadme.yml` to your project
2. Commit and push
3. The action will run and update README.md automatically

The workflow:
- Runs on push to main branch
- Installs dependencies
- Builds the project
- Generates README
- Commits changes if any

## Development

### Project Structure

```
autoreadme/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── generator.ts       # README generation logic
│   ├── scanner.ts         # Project detection
│   └── templates/         # Handlebars templates
├── test/                  # Example projects for testing
├── dist/                  # Compiled output
└── package.json           # Package configuration
```

### Building

```bash
npm run build
```

### Testing

```bash
npm run test:local

cd test/example-node
node ../../dist/index.js generate
```

### Available Scripts

- `npm run dev` - Run in development mode with ts-node
- `npm run build` - Build the project with tsup
- `npm run start` - Run the built CLI
- `npm run test:local` - Test README generation
- `npm run test` - Generate README and build

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

- [ ] Support for more project types (Rust, Go, Java, etc.)
- [ ] AI-powered README enhancement
- [ ] Custom badge configuration
- [ ] Interactive mode for README customization
- [ ] Plugin system for extensibility
- [ ] Multi-language support

## FAQ

**Q: Can I customize the generated README?**
A: Yes! Modify the templates in `src/templates/` or create your own.

**Q: Does it overwrite my existing README?**
A: Yes, by default it overwrites `README.md`. Use `--out` to specify a different file.

**Q: How do I add support for my project type?**
A: Create a new template and add detection logic in `src/scanner.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Q: Can I use this in CI/CD?**
A: Absolutely! See the included GitHub Action or integrate into your existing pipeline.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Open an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Provide example projects when reporting bugs

## Acknowledgments

Built with:
- [Commander.js](https://github.com/tj/commander.js/) - CLI framework
- [Handlebars](https://handlebarsjs.com/) - Template engine
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - File system utilities
- [TypeScript](https://www.typescriptlang.org/) - Type safety
