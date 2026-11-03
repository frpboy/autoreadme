## 2026-11-03 - Path Traversal in Template and Output Resolution
**Vulnerability:** The CLI accepted unvalidated template names (`-t`) and output paths (`-o`), allowing arbitrary file reads and arbitrary file writes outside the project directory.
**Learning:** CLI utilities accepting file identifiers or destination paths must strictly validate character sets and verify directory boundaries using `path.relative` against the target root directory.
**Prevention:** Restrict template names to `/^[a-zA-Z0-9_-]+$/` and ensure resolved output paths do not escape the target project root.
