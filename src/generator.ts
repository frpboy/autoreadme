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
    // Security: Validate templateName against path traversal / arbitrary file read
    if (!/^[a-zA-Z0-9_-]+$/.test(templateName)) {
      throw new Error(`Invalid template name: "${templateName}"`);
    }

    const templatesDir = path.resolve(__dirname, '..', 'src', 'templates');
    const templatePath = path.resolve(templatesDir, `${templateName}.hbs`);
    const relTemplate = path.relative(templatesDir, templatePath);
    if (relTemplate.startsWith('..') || path.isAbsolute(relTemplate)) {
      throw new Error('Access denied: template path traversal detected');
    }

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
      // A build badge is deliberately omitted until a project-specific CI
      // result can be verified. Never imply that an unrelated or absent build passed.
      badges: {
        license: `![license](https://img.shields.io/badge/license-${encodeURIComponent(info.license || 'MIT')}-blue)`
      }
    });

    // Security: Prevent path traversal outside the target root directory
    const resolvedRoot = path.resolve(root);
    const out = path.resolve(resolvedRoot, outputPath);
    const relOut = path.relative(resolvedRoot, out);
    if (relOut.startsWith('..') || path.isAbsolute(relOut)) {
      throw new Error(`Access denied: Output path "${outputPath}" escapes the root directory`);
    }

    await fs.writeFile(out, rendered, 'utf-8');
    console.log(`✅ README generated at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate README:', error);
    throw error;
  }
}
