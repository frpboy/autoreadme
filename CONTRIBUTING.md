# Contributing to AutoReadMe

Thank you for your interest in contributing to AutoReadMe! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/autoreadme.git
   cd autoreadme
   ```
3. Install dependencies:
   ```bash
   npm ci
   ```
4. Build and run the regression suite:
   ```bash
   npm test
   ```

## Development Workflow

### Project Structure

```
autoreadme/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── generator.ts       # README generation logic
│   ├── scanner.ts         # Project scanning and detection
│   └── templates/         # default, Node.js, and Python templates
├── test/
│   ├── generator.test.mjs # deterministic CLI regression tests
│   ├── security.test.mjs  # path traversal and safety tests
│   └── example-*          # human-readable sample projects
└── dist/                  # generated build output (not committed)
```

### Making Changes

1. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make source changes and add regression tests for the behavior.
3. Run the complete test/build gate:
   ```bash
   npm test
   ```
4. Use the generation smoke command only when you intentionally want to generate a README in the current directory:
   ```bash
   npm run test:local
   ```

## Code Style

- Use TypeScript for source files.
- Follow the existing code style and conventions.
- Use meaningful variable and function names.
- Keep functions small and focused.

## Adding New Templates

1. Create a template file in `src/templates/`.
2. Add project detection to `src/scanner.ts`.
3. Update `ProjectInfo` if necessary.
4. Add a temporary-fixture regression test covering the new project type.
5. Verify the generated output and documentation.

## Template Guidelines

- Use triple braces `{{{variable}}}` for intentionally raw code/command content.
- Use double braces `{{variable}}` for ordinary text.
- Test missing optional metadata as well as populated metadata.

## Submitting Changes

1. Commit with a clear, descriptive message.
2. Push your branch.
3. Open a pull request with a summary, test evidence, and related issue links.

## Testing

`npm test` builds the production CLI and runs deterministic regression/security tests under Node's test runner. Tests use temporary directories and must not modify the checked-in sample projects or README.

`npm run test:local` is a generation smoke test, not a regression test suite. It writes a README in the current working directory.

## Reporting Issues

Before opening an issue, check for duplicates. Include reproduction steps, expected and actual behavior, environment details, and relevant sample input.

## Code of Conduct

Be respectful and inclusive. Focus on constructive feedback and what is best for the project.

## License

By contributing to AutoReadMe, you agree that your contributions will be licensed under the MIT License.
