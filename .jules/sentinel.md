## 2025-05-18 - Path Traversal in Template Loading
**Vulnerability:** The `--template` CLI option allowed unvalidated user input to be passed into `path.join(__dirname, '..', 'src', 'templates', `${templateName}.hbs`)`, allowing arbitrary file loading outside the templates directory via path traversal sequences like `../../`.
**Learning:** CLI arguments specifying file identifiers or template names must never be joined directly with directories without strict format validation and directory containment checks.
**Prevention:** Enforce strict alphanumeric whitelist validation on template name identifiers (`/^[a-zA-Z0-9_-]+$/`) and verify that the resolved template path starts with the templates directory path.
