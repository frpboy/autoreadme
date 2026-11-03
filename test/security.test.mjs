import assert from 'node:assert';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const cli = path.resolve('dist/index.js');
const tmp = path.resolve('test/example-node');

// 1. Template path traversal rejected
await assert.rejects(
  execFileAsync('node', [cli, 'generate', '-t', '../../package', '-o', 'README.md'], { cwd: tmp })
);

// 2. Output path traversal escaping root rejected
await assert.rejects(
  execFileAsync('node', [cli, 'generate', '-o', '../../escaped.md'], { cwd: tmp })
);

// 3. Normal generation succeeds
const res = await execFileAsync('node', [cli, 'generate', '-o', 'README.md'], { cwd: tmp });
assert(res.stdout.includes('README generated at README.md'));
console.log('✅ Security tests passed');
