import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { scanProject } from './scanner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadTemplate(templateName: string): Promise<string> {
  try {
    // Security: Validate templateName to prevent path traversal (e.g. '../', absolute paths)
    if (!/^[a-zA-Z0-9_-]+$/.test(templateName)) {
      throw new Error(`Invalid template name: ${templateName}. Only alphanumeric characters, hyphens, and underscores are allowed.`);
    }

    const templatesDir = path.resolve(__dirname, '..', 'src', 'templates');
    const templatePath = path.resolve(templatesDir, `${templateName}.hbs`);

    // Defense-in-depth: Ensure templatePath does not escape templatesDir
    if (!templatePath.startsWith(templatesDir + path.sep)) {
      throw new Error(`Access denied: template path traversal detected for ${templateName}`);
    }

    if (await fs.pathExists(templatePath)) {
      return fs.readFile(templatePath, 'utf-8');
    }

    const defaultPath = path.join(templatesDir, 'default.hbs');
    if (await fs.pathExists(defaultPath)) {
      return fs.readFile(defaultPath, 'utf-8');
    }

    throw new Error(`Template not found: ${templateName}`);
  } catch (error) {
    throw new Error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateReadme(root: string, templateName: string, outputPath = 'README.md'): Promise<void> {
  try {
    const info = await scanProject(root);
    const templateToUse = templateName === 'default' ? info.type : templateName;
    const tplStr = await loadTemplate(templateToUse);
    const tpl = Handlebars.compile(tplStr);

    const rendered = tpl({
      ...info,
      badges: {
        build: '![build](https://img.shields.io/badge/build-passing-brightgreen)',
        license: `![license](https://img.shields.io/badge/license-${encodeURIComponent(info.license || 'MIT')}-blue)`
      }
    });

    const out = path.isAbsolute(outputPath) ? outputPath : path.join(root, outputPath);
    await fs.writeFile(out, rendered, 'utf-8');
    console.log(`✅ README generated at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate README:', error);
    throw error;
  }
}
