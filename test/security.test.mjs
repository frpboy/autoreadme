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

// 4. Insecure repository URL scheme rejected
const fs = await import('node:fs/promises');
const pkgPath = path.resolve(tmp, 'package.json');
const origPkg = await fs.readFile(pkgPath, 'utf-8');
try {
  const parsed = JSON.parse(origPkg);
  parsed.repository = 'javascript:alert(1)';
  await fs.writeFile(pkgPath, JSON.stringify(parsed, null, 2), 'utf-8');
  await execFileAsync('node', [cli, 'generate', '-o', 'README.md'], { cwd: tmp });
  const generated = await fs.readFile(path.resolve(tmp, 'README.md'), 'utf-8');
  assert(!generated.includes('javascript:alert(1)'), 'Dangerous repository URL scheme should not be rendered');
} finally {
  await fs.writeFile(pkgPath, origPkg, 'utf-8');
}

console.log('✅ Security tests passed');
