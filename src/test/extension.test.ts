import * as assert from "assert";
import * as vscode from "vscode";

suite("Toggle Explorer Gitignore", () => {
  test("команда зарегистрирована", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("toggleExplorerGitignore.toggle"),
      "Команда toggleExplorerGitignore.toggle не найдена",
    );
  });

  test("toggleExplorerGitignore.showStatusBarItem существует в схеме", () => {
    const cfg = vscode.workspace.getConfiguration("toggleExplorerGitignore");
    const val = cfg.get<boolean>("showStatusBarItem");
    assert.strictEqual(typeof val, "boolean", "showStatusBarItem должен быть boolean");
  });

  test("toggleExplorerGitignore.multiRootBehavior имеет допустимое значение", () => {
    const cfg = vscode.workspace.getConfiguration("toggleExplorerGitignore");
    const val = cfg.get<string>("multiRootBehavior");
    assert.ok(
      val === "all" || val === "ask",
      `multiRootBehavior должен быть 'all' или 'ask', получено: ${val}`,
    );
  });

  test("команда toggle переключает explorer.excludeGitIgnore", async () => {
    const before = vscode.workspace
      .getConfiguration("explorer")
      .get<boolean>("excludeGitIgnore") ?? false;

    await vscode.commands.executeCommand("toggleExplorerGitignore.toggle");

    const after = vscode.workspace
      .getConfiguration("explorer")
      .get<boolean>("excludeGitIgnore") ?? false;

    assert.strictEqual(after, !before, "Значение должно было переключиться");

    // Возвращаем обратно
    await vscode.commands.executeCommand("toggleExplorerGitignore.toggle");
  });
});
