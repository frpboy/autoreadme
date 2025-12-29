# Contributing to AutoReadMe

Thank you for your interest in contributing to AutoReadMe! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/autoreadme.git
   cd autoreadme
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Project Structure

```
autoreadme/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── generator.ts       # README generation logic
│   ├── scanner.ts         # Project scanning and detection
│   └── templates/         # Handlebars templates
│       ├── default.hbs    # Generic project template
│       ├── node.hbs       # Node.js project template
│       └── python.hbs     # Python project template
├── test/                  # Test examples
└── dist/                  # Compiled output
```

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Build and test your changes:
   ```bash
   npm run build
   npm run test:local
   ```

4. Test with example projects:
   ```bash
   cd test/example-node
   node ../../dist/index.js generate
   ```

### Code Style

- Use TypeScript for all source files
- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Adding New Templates

To add support for a new project type:

1. Create a new template file in `src/templates/`:
   ```bash
   touch src/templates/rust.hbs
   ```

2. Update `src/scanner.ts` to detect the new project type:
   ```typescript
   // Add detection logic for Cargo.toml, etc.
   const cargoPath = path.join(root, 'Cargo.toml');
   if (await fs.pathExists(cargoPath)) {
     // Parse and return project info
   }
   ```

3. Update the `ProjectInfo` type if needed

4. Create a test example in `test/`

5. Test thoroughly before submitting

### Template Guidelines

When creating templates:
- Use triple braces `{{{variable}}}` for code/command content to prevent HTML escaping
- Use double braces `{{variable}}` for text content
- Include meaningful sections: Installation, Usage, Dependencies, License
- Keep templates clean and well-organized
- Test with various project configurations

## Submitting Changes

1. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat: add Rust project support"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots/examples if applicable

## Testing

Before submitting a PR:

1. Ensure the project builds without errors:
   ```bash
   npm run build
   ```

2. Test with multiple project types:
   ```bash
   npm run test:local
   ```

3. Verify templates render correctly:
   - Check for proper encoding
   - Ensure all sections display as expected
   - Test with projects that have missing optional fields

## Reporting Issues

When reporting bugs or suggesting features:

1. Check existing issues first
2. Provide a clear description
3. Include reproduction steps for bugs
4. Share example projects or configurations if relevant
5. Specify your environment (Node version, OS, etc.)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project

## Questions?

Feel free to open an issue for questions or discussions about contributing.

## License

By contributing to AutoReadMe, you agree that your contributions will be licensed under the MIT License.
