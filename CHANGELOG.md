# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dependabot auto-merge workflow for patch & minor updates (majors stay manual).
- Dependabot `ignore` rule for `@types/vscode` so it stays pinned to the minimum supported engine.
- Grouped Dependabot config: patch/minor dev-dependencies and all GitHub Actions bundle into single PRs.

### Changed
- Upgraded to **TypeScript 6.0** (pinned to `~6.0.3` for typescript-eslint compatibility); added `@types/mocha` and an explicit `types` list in `tsconfig.json` (TS 6 no longer auto-includes all `@types`). Dependabot now ignores TypeScript major bumps until the lint toolchain supports TS 7.
- Rewrote the README in English with badges, feature table and usage guide.
- Translated all user-facing strings, comments and tests to English.
- Added repository metadata (repository, bugs, homepage, keywords, author) to `package.json`.

### Added
- Project documentation: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- GitHub Actions CI workflow (lint, type-check, build, test).
- Release workflow that publishes to the VS Code Marketplace and Open VSX on tag, plus a `PUBLISHING.md` guide.
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
