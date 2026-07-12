# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Rewrote the README in English with badges, feature table and usage guide.
- Translated all user-facing strings, comments and tests to English.
- Added repository metadata (repository, bugs, homepage, keywords, author) to `package.json`.

### Added
- Project documentation: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- GitHub Actions CI workflow (lint, type-check, build, test).
- Issue and pull request templates, Dependabot configuration.
- `.editorconfig` and a `test-fixtures` workspace for the test suite.
- `check-types` and `pretest` npm scripts.

## [0.3.0] - 2026

### Added
- Status bar toggle for `explorer.excludeGitIgnore`.
- Keyboard shortcut `Ctrl+Shift+G` / `Cmd+Shift+G`.
- Command `Toggle Explorer: Exclude Git Ignore`.
- Multi-root workspace support with `all` / `ask` behavior.
- Smart write-scope resolution (Workspace Folder → Workspace → User).
- Post-update verification with a warning when a JSON override blocks the change.

[Unreleased]: https://github.com/andreeyka/toggle-explorer-gitignore/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/andreeyka/toggle-explorer-gitignore/releases/tag/v0.3.0
