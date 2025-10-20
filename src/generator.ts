import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { scanProject } from './scanner.js';

async function loadTemplate(templateName: string) {
  const local = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);
  if (await fs.pathExists(local)) return fs.readFile(local, 'utf-8');
  return fs.readFile(path.join(process.cwd(), 'src', 'templates', 'default.hbs'), 'utf-8');
}

export async function generateReadme(root: string, templateName: string) {
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

  const out = path.join(root, 'README.md');
  await fs.writeFile(out, rendered, 'utf-8');
  console.log('✅ README.md generated');
}
