import { execSync } from 'node:child_process';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, '..', 'dist', 'index.js');
const exampleNodeDir = path.resolve(__dirname, 'example-node');

function runCli(args, cwd = exampleNodeDir) {
  try {
    const stdout = execSync(`node ${cliPath} ${args}`, { cwd, encoding: 'utf-8', stdio: 'pipe' });
    return { stdout, status: 0 };
  } catch (err) {
    return {
      stdout: err.stdout?.toString() || '',
      stderr: err.stderr?.toString() || '',
      status: err.status ?? 1
    };
  }
}

// Test 1: Template name traversal rejection
const res1 = runCli('generate -t ../../package');
assert(res1.status !== 0, 'Expected non-zero exit code when template has path traversal');
assert(
  res1.stderr.includes('Invalid template name') || res1.stderr.includes('Failed to generate README'),
  `Expected error message on template traversal, got: ${res1.stderr}`
);

// Test 2: Output path traversal rejection
const res2 = runCli('generate -o ../../escaped-readme.md');
assert(res2.status !== 0, 'Expected non-zero exit code when outputPath escapes root');
assert(
  res2.stderr.includes('escapes the root directory'),
  `Expected escape root error message, got: ${res2.stderr}`
);

// Test 3: Normal generation succeeds
const res3 = runCli('generate -o README.md');
assert(res3.status === 0, `Expected success on normal generation, got error: ${res3.stderr}`);
assert(res3.stdout.includes('README generated at README.md'));

console.log('All security tests passed! ✅');
