# Test Suite

The automated regression suite uses temporary project directories so test runs never overwrite the checked-in example READMEs.

## Coverage

- Default, Node.js, and Python project detection and template rendering.
- Optional and malformed package metadata.
- Usage scripts, dependencies, repository metadata, and license badges.
- Fallback to the default template for an unknown template.
- Output-path and template-path traversal protection.
- Verification that generated output never claims an unverified build is passing.

## Run

```bash
npm test
```

The command builds the CLI and runs all files matching `test/*.test.mjs` with Node's built-in test runner.

`npm run test:local` remains a manual generation smoke test. It writes a README into the current working directory and is not a regression test suite.
