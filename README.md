# Toggle Explorer Gitignore

Расширение для VS Code / Cursor, которое добавляет кнопку в статус-бар для быстрого переключения настройки `explorer.excludeGitIgnore`.

## Что делает

Позволяет одним кликом (или хоткеем) включать и выключать скрытие файлов из `.gitignore` в файловом дереве Explorer.

- **$(exclude) gitignore** — файлы из `.gitignore` скрыты → клик, чтобы показать
- **$(eye) gitignore** — файлы из `.gitignore` видны → клик, чтобы скрыть

## Установка (локально)

1. Собрать VSIX: `npm run vsix`
2. В VS Code: `Extensions → ... → Install from VSIX...` → выбрать файл `.vsix`

## Горячая клавиша

| Платформа | Клавиша |
|-----------|---------|
| Windows / Linux | `Ctrl+Shift+G` |
| macOS | `Cmd+Shift+G` |

Можно переопределить через `File → Preferences → Keyboard Shortcuts` (команда `Toggle Explorer: Exclude Git Ignore`).

## Настройки

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `toggleExplorerGitignore.showStatusBarItem` | boolean | `true` | Показывать кнопку в статус-баре |
| `toggleExplorerGitignore.multiRootBehavior` | `"all"` \| `"ask"` | `"all"` | Поведение при Multi-root workspace |

### Multi-root workspace

Если в одном окне открыто несколько папок (Multi-root workspace):

- `"all"` — настройка применяется ко всем папкам одновременно
- `"ask"` — появляется список папок, можно выбрать одну или несколько

## Разработка

```bash
npm install
npm run compile   # сборка через esbuild
npm run watch     # сборка в режиме наблюдения
npm run lint      # проверка ESLint
npm run lint:fix  # автоисправление
npm run test      # запуск тестов (требует VS Code)
npm run vsix      # сборка .vsix пакета
```

## Лицензия

MIT
