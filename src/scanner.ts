// Bolt Optimization: Use native node:fs/promises instead of fs-extra to save ~25ms startup latency
import fs from 'node:fs/promises';
import path from 'path';

export type ProjectInfo = {
  projectName: string;
  description?: string;
  license?: string;
  type: 'node'|'python'|'default';
  usageExample?: string;
  dependencies?: string[];
  author?: string;
  repository?: string;
  scripts?: string[];
};

// Security: Restrict repository links to safe protocols (http/https) to prevent
// script execution or malicious link schemes (e.g. javascript:, data:) in generated markdown
export function sanitizeRepoUrl(rawUrl?: unknown): string | undefined {
  if (typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Malformed URL or non-standard protocol
  }
  return undefined;
}

async function detectGitRepo(root: string): Promise<string | undefined> {
  try {
    const gitConfigPath = path.join(root, '.git', 'config');
    // Bolt Optimization: Read directly without pathExists stat to eliminate redundant I/O syscall
    const config = await fs.readFile(gitConfigPath, 'utf-8');
    const match = config.match(/url\s*=\s*(.+)/);
    if (match) {
      let url = match[1].trim();
      if (url.startsWith('git@github.com:')) {
        url = url.replace('git@github.com:', 'https://github.com/');
      }
      url = url.replace(/\.git$/, '');
      return sanitizeRepoUrl(url);
    }
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.warn('Could not detect git repository');
    }
  }
  return undefined;
}

export async function scanProject(root: string): Promise<ProjectInfo> {
  try {
    // Bolt Optimization: Parallelize git repo detection with package.json check to minimize scanning latency
    const gitPromise = detectGitRepo(root);

    const pkgPath = path.join(root, 'package.json');
    let pkg: any = null;
    try {
      // Bolt Optimization: Read file and parse JSON directly without fs-extra
      const pkgContent = await fs.readFile(pkgPath, 'utf-8');
      pkg = JSON.parse(pkgContent);
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    if (pkg) {
      const scripts = pkg.scripts ? Object.keys(pkg.scripts) : [];
      const usageScript = pkg.scripts?.dev ? 'dev' : pkg.scripts?.start ? 'start' : scripts[0];
      const repository = sanitizeRepoUrl(typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url) || await gitPromise;

      return {
        projectName: pkg.name || path.basename(root),
        description: pkg.description || '',
        license: pkg.license || 'MIT',
        type: 'node',
        usageExample: usageScript ? `npm install && npm run ${usageScript}` : 'npm install && npm start',
        dependencies: Object.keys(pkg.dependencies || {}),
        author: pkg.author,
        repository,
        scripts: scripts
      };
    }

    const reqPath = path.join(root, 'requirements.txt');
    let req: string | null = null;
    try {
      req = await fs.readFile(reqPath, 'utf-8');
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    const repository = await gitPromise;

    if (req !== null) {
      const deps = req.split('\n').map(s => s.trim()).filter(Boolean);
      return {
        projectName: path.basename(root),
        description: '',
        license: 'MIT',
        type: 'python',
        usageExample: 'pip install -r requirements.txt && python main.py',
        dependencies: deps,
        repository
      };
    }

    return {
      projectName: path.basename(root),
      description: '',
      license: 'MIT',
      type: 'default',
      usageExample: 'See examples in README',
      dependencies: [],
      repository
    };
  } catch (error) {
    console.error('Error scanning project:', error);
    throw new Error(`Failed to scan project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
