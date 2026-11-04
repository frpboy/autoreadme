# Bolt Performance Journal

## 2026-11-04 - Concurrent I/O in Project Scanner
**Learning:** In project scanners that read metadata from multiple independent sources (.git config and package manifests), performing Git discovery sequentially before manifest discovery introduces unnecessary sequential I/O latency.
**Action:** Initiate independent file read promises concurrently when scanning project root directories to overlap I/O wait times.
