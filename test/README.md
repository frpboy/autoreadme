# Test Suite

This directory contains example projects used to test AutoReadMe functionality.

## Test Projects

1. **example-node**: A sample Node.js project with dependencies and scripts
2. **example-python**: A sample Python project with requirements.txt

## Running Tests

To test the tool against these examples:

```bash
cd test/example-node
node ../../dist/index.js generate
cat README.md

cd ../example-python
node ../../dist/index.js generate
cat README.md
```

The generated README files should accurately reflect each project's structure and dependencies.
