import * as vscode from "vscode";

function explorerConfig(scope?: vscode.Uri): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("explorer", scope);
}

function effectiveExcludeGitIgnore(scope?: vscode.Uri): boolean {
  return explorerConfig(scope).get<boolean>("excludeGitIgnore") ?? false;
}

function extConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("toggleExplorerGitignore");
}

/** Write to the level where a value is already defined; otherwise fall back to Global (or Workspace when a folder is open). */
function resolveWriteScope(folderUri?: vscode.Uri): {
  config: vscode.WorkspaceConfiguration;
  target: vscode.ConfigurationTarget;
} {
  const merged = explorerConfig(folderUri);

  if (folderUri) {
    const folderCfg = explorerConfig(folderUri);
    const fi = folderCfg.inspect<boolean>("excludeGitIgnore");
    if (fi?.workspaceFolderValue !== undefined) {
      return { config: folderCfg, target: vscode.ConfigurationTarget.WorkspaceFolder };
    }
  }

  const mi = merged.inspect<boolean>("excludeGitIgnore");
  if (mi?.workspaceValue !== undefined) {
    return { config: merged, target: vscode.ConfigurationTarget.Workspace };
  }

  return { config: merged, target: vscode.ConfigurationTarget.Global };
}

function refreshStatus(item: vscode.StatusBarItem): void {
  const folders = vscode.workspace.workspaceFolders;
  // For the status bar, reflect the state of the first folder (or the global value)
  const scope = folders?.[0]?.uri;
  const on = effectiveExcludeGitIgnore(scope);
  item.text = on ? "$(exclude) gitignore" : "$(eye) gitignore";
  item.tooltip = on
    ? "Explorer: .gitignore'd files are hidden — click to show them"
    : "Explorer: ignored files are visible — click to hide them";
}

async function applyToggle(
  folderUri: vscode.Uri | undefined,
  log: vscode.OutputChannel,
): Promise<void> {
  const before = effectiveExcludeGitIgnore(folderUri);
  const next = !before;
  const { config, target } = resolveWriteScope(folderUri);
  try {
    await config.update("excludeGitIgnore", next, target);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    void vscode.window.showErrorMessage(
      `Failed to update explorer.excludeGitIgnore: ${msg}`,
    );
    log.appendLine(`update error: ${msg}`);
    return;
  }
  const after = effectiveExcludeGitIgnore(folderUri);
  if (after !== next) {
    void vscode.window.showWarningMessage(
      "The value did not take effect: check your User/Workspace settings and any JSON overrides for explorer.excludeGitIgnore.",
    );
    log.appendLine(
      `effective after update: expected ${next}, got ${after} (target=${target})`,
    );
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const log = vscode.window.createOutputChannel("Toggle Explorer Gitignore");
  context.subscriptions.push(log);
  log.appendLine(`activate ${context.extension.id}`);

  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    10_000,
  );
  status.name = "Explorer gitignore";
  status.command = "toggleExplorerGitignore.toggle";
  refreshStatus(status);

  // Show the status bar item according to the setting
  const updateVisibility = (): void => {
    const show = extConfig().get<boolean>("showStatusBarItem") ?? true;
    if (show) {
      status.show();
    } else {
      status.hide();
    }
  };
  updateVisibility();

  const toggle = async (): Promise<void> => {
    const folders = vscode.workspace.workspaceFolders;

    if (!folders || folders.length <= 1) {
      // A single workspace folder (or none) — the ordinary path
      await applyToggle(folders?.[0]?.uri, log);
    } else {
      const behavior = extConfig().get<string>("multiRootBehavior") ?? "all";

      if (behavior === "all") {
        await Promise.all(folders.map((f) => applyToggle(f.uri, log)));
      } else {
        // ask — show a QuickPick with the list of folders
        const items = folders.map((f) => ({
          label: f.name,
          description: f.uri.fsPath,
          uri: f.uri,
        }));
        const picked = await vscode.window.showQuickPick(items, {
          title: "Apply excludeGitIgnore to folder:",
          canPickMany: true,
          placeHolder: "Select one or more folders",
        });
        if (!picked || picked.length === 0) {
          return;
        }
        await Promise.all(picked.map((p) => applyToggle(p.uri, log)));
      }
    }

    refreshStatus(status);
  };

  context.subscriptions.push(
    status,
    vscode.commands.registerCommand("toggleExplorerGitignore.toggle", toggle),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("explorer.excludeGitIgnore")) {
        refreshStatus(status);
      }
      if (e.affectsConfiguration("toggleExplorerGitignore.showStatusBarItem")) {
        updateVisibility();
      }
    }),
  );
}

export function deactivate(): void {}
