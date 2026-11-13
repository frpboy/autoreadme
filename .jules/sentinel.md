## 2026-11-08 - Symlink Traversal Arbitrary File Overwrite
**Vulnerability:** Even when lexical path resolution (`path.resolve` / `path.relative`) confines the output path to the target root, an existing symlink inside the project pointing outside the root allowed arbitrary file writes outside the project directory.
**Learning:** Checking purely lexical paths with `path.relative` is insufficient when the target filesystem can contain symbolic links; realpath resolution of both the root directory and existing destination targets is required to ensure boundary confinement.
**Prevention:** Resolve canonical filesystem targets using `fs.realpath` and confirm `path.relative(realRoot, realOut)` does not begin with `..` before writing output files.

## 2026-11-05 - Path Traversal in Template and Output Resolution
**Vulnerability:** The CLI accepted unvalidated template names (`-t`) and output paths (`-o`), allowing arbitrary file reads and arbitrary file writes outside the project directory.
**Learning:** CLI utilities accepting file identifiers or destination paths must strictly validate character sets and verify directory boundaries using `path.relative` against the target root directory.
**Prevention:** Restrict template names to `/^[a-zA-Z0-9_-]+$/` and ensure resolved output paths do not escape the target project root.

## 2026-11-08 - Repository URL Protocol Injection in README Generator
**Vulnerability:** Repository URLs read from `.git/config` or `package.json` were rendered into Markdown link targets using unescaped Handlebars expressions without protocol validation, allowing malicious schemes (`javascript:`, `data:`).
**Learning:** External project metadata rendered directly into clickable links must be strictly parsed with `new URL()` to enforce safe network protocols (`http:` and `https:`).
**Prevention:** Validate and sanitize repository URLs through `sanitizeRepoUrl` to allow only `http:` and `https:` protocols before attaching them to project info.
