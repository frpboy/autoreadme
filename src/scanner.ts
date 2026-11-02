import fs from 'fs-extra';
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

async function detectGitRepo(root: string): Promise<string | undefined> {
  try {
    const gitConfigPath = path.join(root, '.git', 'config');
    // Read directly to avoid redundant stat call via pathExists
    const config = await fs.readFile(gitConfigPath, 'utf-8');
    const match = config.match(/url\s*=\s*(.+)/);
    if (match) {
      let url = match[1].trim();
      if (url.startsWith('git@github.com:')) {
        url = url.replace('git@github.com:', 'https://github.com/');
      }
      url = url.replace(/\.git$/, '');
      return url;
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
    // Performance optimization: Read git repo and package.json concurrently,
    // avoiding redundant pathExists checks before reading.
    const pkgPath = path.join(root, 'package.json');
    const [repository, pkg] = await Promise.all([
      detectGitRepo(root),
      fs.readJSON(pkgPath).catch((err: any) => {
        if (err?.code !== 'ENOENT') throw err;
        return null;
      })
    ]);

    if (pkg) {
      const scripts = pkg.scripts ? Object.keys(pkg.scripts) : [];
      const usageScript = pkg.scripts?.dev ? 'dev' : pkg.scripts?.start ? 'start' : scripts[0];

      return {
        projectName: pkg.name || path.basename(root),
        description: pkg.description || '',
        license: pkg.license || 'MIT',
        type: 'node',
        usageExample: usageScript ? `npm install && npm run ${usageScript}` : 'npm install && npm start',
        dependencies: Object.keys(pkg.dependencies || {}),
        author: pkg.author,
        repository: pkg.repository?.url || repository,
        scripts: scripts
      };
    }

    const reqPath = path.join(root, 'requirements.txt');
    let req: string | undefined;
    try {
      req = await fs.readFile(reqPath, 'utf-8');
    } catch (err: any) {
      if (err?.code !== 'ENOENT') throw err;
    }

    if (req !== undefined) {
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
