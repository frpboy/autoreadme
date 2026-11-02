## 2025-05-18 - Path Traversal Vulnerability in Template and Output Resolution
**Vulnerability:** CLI allowed arbitrary file read via unvalidated template names (e.g. `../../etc/passwd`) and arbitrary file write via unvalidated output paths escaping the project root directory.
**Learning:** CLI utilities accepting user-controlled path parameters must resolve them relative to safe directories and explicitly verify boundaries (`path.relative` or prefix checking) and restrict file identifiers to safe alphanumeric sets.
**Prevention:** Whitelist valid template names (`/^[a-zA-Z0-9_-]+$/`) and assert that resolved output file paths are contained within the project's target root before performing filesystem reads or writes.
