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

/** Пишем в тот уровень, где уже задано значение; иначе в Global (или Workspace при открытой папке). */
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
  // Для статус-бара показываем состояние первой папки (или глобальное)
  const scope = folders?.[0]?.uri;
  const on = effectiveExcludeGitIgnore(scope);
  item.text = on ? "$(exclude) gitignore" : "$(eye) gitignore";
  item.tooltip = on
    ? "Explorer: скрыты файлы из .gitignore — клик, чтобы показать"
    : "Explorer: видны игнорируемые — клик, чтобы скрыть";
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
      `Не удалось изменить explorer.excludeGitIgnore: ${msg}`,
    );
    log.appendLine(`update error: ${msg}`);
    return;
  }
  const after = effectiveExcludeGitIgnore(folderUri);
  if (after !== next) {
    void vscode.window.showWarningMessage(
      "Значение не применилось: проверьте User/Workspace settings и JSON-переопределения для explorer.excludeGitIgnore.",
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

  // Показываем статус-бар согласно настройке
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
      // Один workspace folder или нет — обычное поведение
      await applyToggle(folders?.[0]?.uri, log);
    } else {
      const behavior = extConfig().get<string>("multiRootBehavior") ?? "all";

      if (behavior === "all") {
        await Promise.all(folders.map((f) => applyToggle(f.uri, log)));
      } else {
        // ask — показываем QuickPick со списком папок
        const items = folders.map((f) => ({
          label: f.name,
          description: f.uri.fsPath,
          uri: f.uri,
        }));
        const picked = await vscode.window.showQuickPick(items, {
          title: "Применить excludeGitIgnore для папки:",
          canPickMany: true,
          placeHolder: "Выберите одну или несколько папок",
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
