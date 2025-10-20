# AutoReadMe

**Auto-generate a clear `README.md` from your project structure — fast, opinionated, and extensible.**

[![build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/frpboy/autoreadme) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## What is AutoReadMe?

AutoReadMe inspects a project (Node or Python) and generates a clean, useful `README.md`.  
It is a small CLI that you can run locally or add to CI so READMEs stay up-to-date without manual editing.

---

## Features

- Detects project type from `package.json` (Node) or `requirements.txt` (Python).  
- Generates sections: Title, Description, Badges, Installation, Usage, Tech stack, License.  
- Handlebars templates (`src/templates`) — add/override templates easily.  
- CLI: `autoreadme generate` or `node dist/index.js generate`.  
- Includes a GitHub Action to re-generate README on push (optional).

---

## Quick start (dev)

```bash
# install dev deps and build
npm install
npm run build

# generate README for the current repo
node dist/index.js generate
# or write to a file:
node dist/index.js generate --out docs/README.md
If you want the CLI globally (optional):

bash
Copy code
# from the project folder
npm link

# then anywhere:
autoreadme generate
Usage & options
text
Copy code
Usage: autoreadme generate [options]

Options:
  -t, --template <name>   Template: node | python | default (default: "default")
  -o, --out <path>        Output path for README (default: README.md)
  --ai                    Optional: enable AI polish (requires config; currently stub)
  -h, --help              Display help
Examples:

bash
Copy code
# detect project type and generate README in-place
node dist/index.js generate

# write README to docs/README.md
node dist/index.js generate --out docs/README.md

# force the node template and use the installed global CLI
autoreadme generate --template node
Templates
Templates live under src/templates/ as Handlebars (.hbs) files.
Variables available to templates:

projectName, description, license

usageExample (note: templates use triple-brace {{{usageExample}}} to avoid HTML escaping)

dependencies (array)

badges (object)

Add rust.hbs, go.hbs, etc. to support more languages.

Contributing
PRs welcome. Edit or add templates under src/templates/, update scanProject in src/scanner.ts to extend detection logic, and add tests under test/.

License
MIT © your name

yaml
Copy code

---

# 2) Save, stage, commit, push (exact commands)
Run these from your repo folder (`C:\Users\os\Desktop\K4NN4N\GIT\AutoReadMe\autoreadme`):

```powershell
# show file to check
notepad README.md   # or code README.md

# then commit & push
git add README.md
git commit -m "docs: add polished README"
## License

This project is released under the **MIT License**.

In short: you are free to use, copy, modify, and distribute this software — including for commercial purposes — as long as you include the original copyright
notice and license text. The software is provided *as is*; the authors are not liable for any damages.

git push
If git push asks for credentials, use Git Credential Manager sign-in or your GitHub username and a Personal Access Token (PAT) as the password.
