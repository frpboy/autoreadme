## 2026-10-28 - Template Name Path Traversal Vulnerability
**Vulnerability:** The template loader directly joined user-supplied template names (`-t, --template`) with the template directory path using `path.join(__dirname, '..', 'src', 'templates', `${templateName}.hbs`)` without validation, permitting path traversal outside the template directory.
**Learning:** CLI arguments passed directly to filesystem path constructors without character whitelist validation or boundary containment checks allow arbitrary file access when matching extensions or traversal sequences are provided.
**Prevention:** Whitelist permitted characters for template identifiers (e.g. `/^[a-zA-Z0-9_-]+$/`) and ensure resolved paths do not escape the intended root directory via `path.resolve` and `path.relative`.
