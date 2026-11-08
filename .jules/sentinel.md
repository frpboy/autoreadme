## 2026-11-05 - Path Traversal in Template and Output Resolution
**Vulnerability:** The CLI accepted unvalidated template names (`-t`) and output paths (`-o`), allowing arbitrary file reads and arbitrary file writes outside the project directory.
**Learning:** CLI utilities accepting file identifiers or destination paths must strictly validate character sets and verify directory boundaries using `path.relative` against the target root directory.
**Prevention:** Restrict template names to `/^[a-zA-Z0-9_-]+$/` and ensure resolved output paths do not escape the target project root.

## 2026-11-07 - Unsanitized Repository URL Schemes in Markdown Links
**Vulnerability:** Repository URLs from `package.json` or `.git/config` were interpolated directly into markdown links `[Repository]({{{repository}}})` without URI scheme validation, allowing `javascript:` or `data:` URIs that lead to XSS or malicious link injection.
**Learning:** Raw triple-stash Handlebars expressions (`{{{...}}}`) bypass HTML/URI escaping. Even within markdown files, link destinations can execute scripts when viewed in Markdown previewers, browsers, or documentation portals.
**Prevention:** Validate URL protocols strictly (allowing only `http:` and `https:`) using the standard `URL` parser before rendering them into templates.
