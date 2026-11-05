import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { scanProject } from './scanner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance optimization: Cache compiled Handlebars templates in memory.
// Handlebars compilation involves parsing AST and bytecode generation (~1ms+ per run),
// and disk I/O on every README generation is redundant when templates do not change.
const templateCache = new Map<string, HandlebarsTemplateDelegate>();

async function getCompiledTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
  const cached = templateCache.get(templateName);
  if (cached) {
    return cached;
  }

  try {
    const templatesDir = path.join(__dirname, '..', 'src', 'templates');
    const templatePath = path.join(templatesDir, `${templateName}.hbs`);

    let tplStr: string;
    if (await fs.pathExists(templatePath)) {
      tplStr = await fs.readFile(templatePath, 'utf-8');
    } else {
      const defaultPath = path.join(templatesDir, 'default.hbs');
      if (await fs.pathExists(defaultPath)) {
        tplStr = await fs.readFile(defaultPath, 'utf-8');
      } else {
        throw new Error(`Template not found: ${templateName}`);
      }
    }

    const compiled = Handlebars.compile(tplStr);
    templateCache.set(templateName, compiled);
    return compiled;
  } catch (error) {
    throw new Error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateReadme(root: string, templateName: string, outputPath = 'README.md'): Promise<void> {
  try {
    const info = await scanProject(root);
    const templateToUse = templateName === 'default' ? info.type : templateName;
    const tpl = await getCompiledTemplate(templateToUse);

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
