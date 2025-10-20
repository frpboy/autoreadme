import fs from 'fs-extra';
import path from 'path';

export type ProjectInfo = {
  projectName: string;
  description?: string;
  license?: string;
  type: 'node'|'python'|'default';
  usageExample?: string;
  dependencies?: string[];
};

export async function scanProject(root: string): Promise<ProjectInfo> {
  const pkgPath = path.join(root, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJSON(pkgPath);
    return {
      projectName: pkg.name || path.basename(root),
      description: pkg.description || '',
      license: pkg.license || 'MIT',
      type: 'node',
      usageExample: 'npm install && npm run start',
      dependencies: Object.keys(pkg.dependencies || {})
    };
  }

  const reqPath = path.join(root, 'requirements.txt');
  if (await fs.pathExists(reqPath)) {
    const req = await fs.readFile(reqPath, 'utf-8');
    const deps = req.split('\n').map(s => s.trim()).filter(Boolean);
    return {
      projectName: path.basename(root),
      description: '',
      license: 'MIT',
      type: 'python',
      usageExample: 'pip install -r requirements.txt && python main.py',
      dependencies: deps
    };
  }

  return {
    projectName: path.basename(root),
    description: '',
    license: 'MIT',
    type: 'default',
    usageExample: 'See examples in README',
    dependencies: []
  };
}
