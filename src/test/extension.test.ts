import * as assert from "assert";
import * as vscode from "vscode";

suite("Toggle Explorer Gitignore", () => {
  test("command is registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("toggleExplorerGitignore.toggle"),
      "Command toggleExplorerGitignore.toggle was not found",
    );
  });

  test("toggleExplorerGitignore.showStatusBarItem exists in the schema", () => {
    const cfg = vscode.workspace.getConfiguration("toggleExplorerGitignore");
    const val = cfg.get<boolean>("showStatusBarItem");
    assert.strictEqual(typeof val, "boolean", "showStatusBarItem should be a boolean");
  });

  test("toggleExplorerGitignore.multiRootBehavior has a valid value", () => {
    const cfg = vscode.workspace.getConfiguration("toggleExplorerGitignore");
    const val = cfg.get<string>("multiRootBehavior");
    assert.ok(
      val === "all" || val === "ask",
      `multiRootBehavior should be 'all' or 'ask', got: ${val}`,
    );
  });

  test("toggle command flips explorer.excludeGitIgnore", async () => {
    const before = vscode.workspace
      .getConfiguration("explorer")
      .get<boolean>("excludeGitIgnore") ?? false;

    await vscode.commands.executeCommand("toggleExplorerGitignore.toggle");

    const after = vscode.workspace
      .getConfiguration("explorer")
      .get<boolean>("excludeGitIgnore") ?? false;

    assert.strictEqual(after, !before, "The value should have toggled");

    // Restore the original value
    await vscode.commands.executeCommand("toggleExplorerGitignore.toggle");
  });
});
