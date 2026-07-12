# Contributing

Thanks for your interest in improving **Toggle Explorer Gitignore**! 🎉

## Getting started

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the folder in VS Code and press `F5` to launch an **Extension Development Host** with the extension loaded.

## Development workflow

| Task | Command |
|------|---------|
| Bundle the extension | `npm run compile` |
| Rebuild on change | `npm run watch` |
| Type-check | `npm run check-types` |
| Lint | `npm run lint` |
| Auto-fix lint | `npm run lint:fix` |
| Run tests | `npm test` |
| Build a `.vsix` | `npm run vsix` |

Before opening a pull request, please make sure that:

- `npm run lint` passes with no errors,
- `npm run check-types` passes,
- `npm test` passes,
- new behavior is covered by a test where practical.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) where possible, e.g.:

```
feat: add per-folder toggle in multi-root workspaces
fix: preserve workspace-folder override when writing setting
docs: clarify multi-root behavior in README
```

## Pull requests

- Keep PRs focused and reasonably small.
- Describe **what** changed and **why**.
- Update `CHANGELOG.md` under the `Unreleased` section.
- Reference any related issues (e.g. `Closes #12`).

## Reporting bugs & requesting features

Please use the [issue templates](https://github.com/andreeyka/toggle-explorer-gitignore/issues/new/choose). Include your editor (VS Code / Cursor), version, OS, and clear reproduction steps.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
