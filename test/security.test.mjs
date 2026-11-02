import assert from 'node:assert';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';

const execFileAsync = promisify(execFile);
const tempDir = path.resolve('test/temp-security-test');
await fs.ensureDir(tempDir);

try {
  const cliPath = path.resolve('dist/index.js');

  // 1. Path traversal template name should be rejected
  const maliciousTemplates = [
    '../../etc/passwd',
    '../templates/node',
    'node/../../etc/passwd',
    'foo/bar',
    '..\\..\\windows\\win.ini'
  ];

  for (const malicious of maliciousTemplates) {
    let errorCaught = false;
    try {
      await execFileAsync('node', [cliPath, 'generate', '-t', malicious, '-o', path.join(tempDir, 'README.md')], {
        cwd: tempDir
      });
    } catch (err) {
      errorCaught = true;
      const combinedOutput = (err.stdout || '') + (err.stderr || '');
      assert(
        combinedOutput.includes('Invalid template name') || combinedOutput.includes('Invalid template path traversal'),
        `Unexpected error message in output: ${combinedOutput}`
      );
    }
    assert.strictEqual(errorCaught, true, `Expected template name "${malicious}" to be rejected`);
  }

  // 2. Valid template name should succeed
  const validResult = await execFileAsync('node', [cliPath, 'generate', '-t', 'default', '-o', 'README.md'], {
    cwd: tempDir
  });
  assert(validResult.stdout.includes('README generated at README.md'));
  assert.strictEqual(await fs.pathExists(path.join(tempDir, 'README.md')), true);

  console.log('✅ Security tests passed: Path traversal is safely prevented.');
} finally {
  await fs.remove(tempDir);
}
