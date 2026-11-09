import assert from 'node:assert/strict';
import test from 'node:test';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = resolve(projectRoot, 'dist/index.js');

async function withProject(callback) {
  const root = await mkdtemp(join(tmpdir(), 'autoreadme-security-'));
  try {
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('rejects template path traversal', async () => {
  await withProject(async (root) => {
    await assert.rejects(
      execFileAsync(process.execPath, [cli, 'generate', '--template', '../../package'], { cwd: root })
    );
    await assert.rejects(readFile(join(root, 'README.md'), 'utf8'));
  });
});

test('rejects symlink output destinations pointing outside the target project', async () => {
  await withProject(async (root) => {
    const outsideTarget = await mkdtemp(join(tmpdir(), 'autoreadme-symlink-target-'));
    try {
      const sensitiveFile = join(outsideTarget, 'sensitive.txt');
      await writeFile(sensitiveFile, 'do-not-overwrite', 'utf8');

      // Create symlink in project pointing to external file
      await symlink(sensitiveFile, join(root, 'README.md'));

      await assert.rejects(
        execFileAsync(process.execPath, [cli, 'generate', '--out', 'README.md'], { cwd: root })
      );

      // Verify external target was not overwritten
      const content = await readFile(sensitiveFile, 'utf8');
      assert.equal(content, 'do-not-overwrite');
    } finally {
      await rm(outsideTarget, { recursive: true, force: true });
    }
  });
});

test('rejects output paths that escape the target project', async () => {
  await withProject(async (root) => {
    await assert.rejects(
      execFileAsync(process.execPath, [cli, 'generate', '--out', '../../escaped.md'], { cwd: root })
    );
    await assert.rejects(readFile(join(root, 'README.md'), 'utf8'));
  });
});

test('generates into a temporary project without touching tracked examples', async () => {
  await withProject(async (root) => {
    await writeFile(join(root, 'package.json'), JSON.stringify({ name: 'temporary-security-fixture' }));
    const result = await execFileAsync(process.execPath, [cli, 'generate', '--out', 'README.md'], { cwd: root });
    const readme = await readFile(join(root, 'README.md'), 'utf8');

    assert.ok(result.stdout.includes('README generated at README.md'));
    assert.ok(readme.includes('# temporary-security-fixture'));
    assert.ok(!readme.includes('build-passing'));
  });
});
