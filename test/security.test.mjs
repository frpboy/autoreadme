import assert from 'node:assert/strict';
import test from 'node:test';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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

test('sanitizes credentials from repository URLs', async () => {
  await withProject(async (root) => {
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name: 'secret-repo-fixture',
        repository: 'https://oauth2:ghp_secrettoken123456@github.com/org/repo.git'
      })
    );
    await execFileAsync(process.execPath, [cli, 'generate'], { cwd: root });
    const readme = await readFile(join(root, 'README.md'), 'utf8');

    assert.ok(!readme.includes('ghp_secrettoken123456'));
    assert.ok(!readme.includes('oauth2:'));
    assert.ok(readme.includes('[Repository](https://github.com/org/repo.git)'));
  });
});

test('rejects dangerous URI schemes in repository field', async () => {
  await withProject(async (root) => {
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name: 'xss-repo-fixture',
        repository: 'javascript:alert(1)'
      })
    );
    await execFileAsync(process.execPath, [cli, 'generate'], { cwd: root });
    const readme = await readFile(join(root, 'README.md'), 'utf8');

    assert.ok(!readme.includes('javascript:'));
    assert.ok(!readme.includes('[Repository]('));
  });
});
