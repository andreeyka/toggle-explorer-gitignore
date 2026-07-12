<div align="center">

<img src="images/icon.png" alt="Toggle Explorer Gitignore icon" width="128" height="128" />

# Toggle Explorer Gitignore

**Show or hide your `.gitignore`'d files in the VS Code Explorer with a single click.**

[![CI](https://github.com/andreeyka/toggle-explorer-gitignore/actions/workflows/ci.yml/badge.svg)](https://github.com/andreeyka/toggle-explorer-gitignore/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## Overview

VS Code ships with the built-in setting [`explorer.excludeGitIgnore`](https://code.visualstudio.com/updates/v1_82#_hide-gitignored-files-in-the-explorer), which hides every file matched by your `.gitignore` from the Explorer tree. It's a great way to declutter your workspace — but the only way to flip it is by digging through Settings.

**Toggle Explorer Gitignore** puts that switch one click (or one keystroke) away, with a live status bar indicator, a keyboard shortcut, a command, and first-class multi-root workspace support.

> Works in **VS Code** and **Cursor** and any other VS Code–compatible editor (engine `^1.85.0`).

## Features

- 🖱️ **Status bar toggle** — a button that reflects the current state at a glance:
  - `$(exclude) gitignore` — ignored files are **hidden** → click to show them
  - `$(eye) gitignore` — ignored files are **visible** → click to hide them
- ⌨️ **Keyboard shortcut** — `Ctrl+Shift+G` (`Cmd+Shift+G` on macOS), fully rebindable
- 🎯 **Command palette** — `Toggle Explorer: Exclude Git Ignore`
- 🗂️ **Multi-root aware** — apply to every folder at once, or pick specific folders
- 🧠 **Smart scope resolution** — writes the setting to the level where it's already defined (Workspace Folder → Workspace → User), so it never clobbers your existing overrides
- ✅ **Verified writes** — confirms the value actually took effect and warns you if a JSON override is silently blocking it

## Demo

<div align="center">

<!-- Replace with an actual GIF/screenshot, e.g. images/demo.gif -->
<em>Click the status bar item to toggle `.gitignore` visibility in the Explorer.</em>

| State | Status bar | Meaning |
|-------|------------|---------|
| Hidden | 🚫 `gitignore` | `.gitignore`'d files are excluded from the Explorer |
| Visible | 👁️ `gitignore` | `.gitignore`'d files are shown in the Explorer |

</div>

## Installation

### From a `.vsix` package (local)

1. Build the package:
   ```bash
   npm install
   npm run vsix
   ```
2. In VS Code / Cursor: **Extensions → ⋯ → Install from VSIX…** and pick the generated `.vsix` file.

Alternatively, install from the command line:

```bash
code --install-extension toggle-explorer-gitignore-*.vsix
```

## Usage

Once installed, the extension activates automatically. You can toggle `.gitignore` visibility in any of these ways:

| Method | How |
|--------|-----|
| **Status bar** | Click the `gitignore` item in the bottom-left status bar |
| **Keyboard** | `Ctrl+Shift+G` (Windows / Linux) · `Cmd+Shift+G` (macOS) |
| **Command palette** | `F1` → *Toggle Explorer: Exclude Git Ignore* |

The shortcut can be changed via **File → Preferences → Keyboard Shortcuts** (search for the command `toggleExplorerGitignore.toggle`).

## Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `toggleExplorerGitignore.showStatusBarItem` | `boolean` | `true` | Show the toggle button in the status bar |
| `toggleExplorerGitignore.multiRootBehavior` | `"all"` \| `"ask"` | `"all"` | What to do in a multi-root workspace |

### Multi-root workspaces

When more than one folder is open in the same window:

- **`"all"`** — the toggle is applied to every folder simultaneously.
- **`"ask"`** — a quick-pick list appears so you can choose one or several folders to apply it to.

## Development

Requires **Node.js 18+**.

```bash
npm install        # install dependencies
npm run compile    # bundle with esbuild → out/extension.js
npm run watch      # rebuild on change
npm run lint       # run ESLint
npm run lint:fix   # auto-fix lint issues
npm test           # run the extension test suite (downloads VS Code)
npm run vsix       # produce a .vsix package
npm run gen-icon   # regenerate images/icon.png from the inline SVG
```

The extension entry point is [`src/extension.ts`](src/extension.ts); tests live in [`src/test/`](src/test).

## How it works

The extension is a thin, well-behaved wrapper around the native `explorer.excludeGitIgnore` setting:

1. **Reading state** — the effective value is read per workspace-folder scope so the status bar always reflects reality.
2. **Choosing where to write** — `resolveWriteScope` inspects the setting and writes back to the most specific level that already has a value (Workspace Folder → Workspace → User), preserving your configuration layering.
3. **Applying & verifying** — after updating, it re-reads the effective value and surfaces a warning if a `settings.json` override prevented the change from taking effect.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request. Found a bug or have an idea? [Open an issue](https://github.com/andreeyka/toggle-explorer-gitignore/issues/new/choose).

## License

[MIT](LICENSE) © Toggle Explorer Gitignore contributors
