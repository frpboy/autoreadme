# Palette's Journal

## 2026-11-05 - CLI Version Discovery and Conventional Flags
**Learning:** For command-line utilities, users intuitively expect standard version flags (`-v`, `--version`) to inspect the tool's installed release version. Omitting this triggers an unknown option error and hurts developer ergonomics and troubleshooting workflows.
**Action:** Always configure `.version(version, '-v, --version')` when setting up Commander CLI interfaces to meet standard CLI UX expectations.
