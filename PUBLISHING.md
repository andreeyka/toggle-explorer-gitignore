# Publishing Guide

This document describes how to publish **Toggle Explorer Gitignore** to both
extension marketplaces:

- **VS Code Marketplace** (Microsoft) — used by official VS Code.
- **Open VSX Registry** (Eclipse Foundation) — used by Cursor, VSCodium,
  Windsurf, Gitpod, code-server and other VS Code–compatible editors.

Publishing to **both** makes the extension installable everywhere.

---

## One-time setup

### 0. Pick a publisher id

The `publisher` field in `package.json` is currently `"local"`, which only
works for local `.vsix` installs. Before publishing, replace it with a real,
globally-unique id (the **same** id must exist in both registries):

```jsonc
// package.json
"publisher": "your-publisher-id"
```

Also update the `repository`, `bugs` and `homepage` URLs if the repo moves.

### 1. VS Code Marketplace credentials (`VSCE_PAT`)

1. Create an organization in **Azure DevOps**: <https://dev.azure.com>.
2. Create a **Personal Access Token (PAT)**:
   - User settings → **Personal access tokens** → **New Token**
   - **Organization:** *All accessible organizations*
   - **Scopes:** *Custom defined* → **Marketplace → Manage**
   - Copy the token (shown once).
3. Create your **Publisher** at
   <https://marketplace.visualstudio.com/manage> — the id must match
   `package.json`'s `publisher`.
4. (Optional) Verify a domain to earn the blue **Verified Publisher** badge.

### 2. Open VSX credentials (`OVSX_TOKEN`)

1. Sign in at <https://open-vsx.org> with GitHub.
2. Settings → **Access Tokens** → generate a token.
3. Sign the **Eclipse Publisher Agreement** (required, one-time).
4. Create the namespace (matches your `publisher`):
   ```bash
   npx ovsx create-namespace your-publisher-id -p <OVSX_TOKEN>
   ```

### 3. Store the tokens as GitHub Secrets

In the repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `VSCE_PAT`  | Azure DevOps PAT |
| `OVSX_TOKEN`| Open VSX token |

The release workflow skips a registry automatically if its secret is missing,
so you can start with just one.

---

## Releasing a new version

The automated flow is driven by a **git tag**:

```bash
# 1. Bump the version and update CHANGELOG.md
#    (edit package.json "version" and move Unreleased → the new version)
git commit -am "chore: release v0.4.0"

# 2. Tag and push
git tag v0.4.0
git push origin main --tags
```

Pushing a `v*` tag triggers [`.github/workflows/release.yml`](.github/workflows/release.yml), which:

1. Installs dependencies and runs **lint → type-check → test**.
2. Packages a single `.vsix` with `vsce package`.
3. Publishes to the VS Code Marketplace (if `VSCE_PAT` is set).
4. Publishes to Open VSX (if `OVSX_TOKEN` is set).
5. Creates a **GitHub Release** with auto-generated notes and attaches the `.vsix`.

> The tag version **must** match `package.json`'s `version`, and each version
> can only be published once (bump it, never re-publish the same number).

---

## Publishing manually (without CI)

```bash
# VS Code Marketplace
npm i -g @vscode/vsce
vsce login your-publisher-id     # paste the PAT once
vsce publish                     # or: vsce publish minor

# Open VSX
npm i -g ovsx
ovsx publish -p <OVSX_TOKEN>
```

Or build a `.vsix` locally and hand it out / install it directly:

```bash
npm run vsix
code --install-extension toggle-explorer-gitignore-*.vsix
```

---

## Pre-publish checklist

- [ ] `publisher` in `package.json` is a real, registered id (not `local`)
- [ ] `version` bumped (SemVer) and `CHANGELOG.md` updated
- [ ] `README.md` renders correctly (it becomes the marketplace page)
- [ ] `icon`, `displayName`, `description`, `categories`, `keywords` are set
- [ ] `npm run lint`, `npm run check-types`, `npm test` all pass
- [ ] `VSCE_PAT` / `OVSX_TOKEN` secrets are configured
- [ ] Tag matches the package version (`v<version>`)
