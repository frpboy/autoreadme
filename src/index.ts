#!/usr/bin/env node
import { Command } from 'commander';
import { generateReadme } from './generator.js';

const program = new Command();
program
  .name('autoreadme')
  .description('Auto-generate or update README.md based on your project');

program
  .command('generate')
  .description('Generate README.md in the current folder')
  .option('-t, --template <name>', 'Template: node|python|default', 'default')
  .option('-o, --out <path>', 'Output path for README', 'README.md')
  .action(async (opts) => {
    await generateReadme(process.cwd(), opts.template, opts.out);
  });

program.parse();
