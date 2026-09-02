# CodeXlate - Code-to-Plain-Language Translator

[繁體中文](README.zh-TW.md) | English | [日本語](README.ja.md)

Translate code into plain language that non-engineers can understand, line by line.

> **Translation ≠ Summary**: Output follows code structure, not just summarizing functionality.

https://github.com/user-attachments/assets/09398329-d723-4349-84a5-f106b56e5d38

## Features

- **Plain-Language Summary**: A quick 1–2 sentence overview of what the code does, highlighted at the top
- **Structured Translation**: Preserves code's nested hierarchy with indentation
- **Smart Naming Translation**: `isLoading` → "is loading", `handleSubmit` → "handle submit"
- **Multi-Framework Support**: React, Vue, Node.js and other popular frameworks
- **Multi-Language Output**: Traditional Chinese, Simplified Chinese, English, Japanese
- **No API Key Stored by the Extension**: Uses the models you register in VS Code (Copilot, Anthropic, OpenAI, Gemini, Ollama, ...). Your keys stay in VS Code's secure storage

## Installation

1. Open VS Code
2. Press `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) to open Extensions
3. Search for `CodeXlate`
4. Click Install

## Usage

1. Select code in the editor (or leave unselected to translate entire file)
2. Press `Cmd+K X` (Mac) / `Ctrl+K X` (Windows)
3. Translation appears in the right panel

Or use Command Palette:
- `Cmd+Shift+P` → Type `CodeXlate: 翻譯程式碼`

## Configuration

CodeXlate does not store or read any API key. It calls models through VS Code's built-in Language Model API, so you manage keys in one place and other extensions cannot read them.

**Requirements**: VS Code 1.90+. The model management UI is provided by GitHub Copilot Chat, so sign in to GitHub Copilot first (the Free plan is enough).

1. Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → `Chat: Manage Language Models`
2. Pick a provider (Anthropic, OpenAI, Gemini, Ollama, ...) and enter your API key. Copilot models are available without any extra key.
3. Run `CodeXlate: 選擇模型` and pick the model to translate with. If you skip this step, the picker appears on your first translation.

> **First run**: VS Code asks whether to allow CodeXlate to use the selected model. This is a normal one-time prompt; choose **Allow**.

**Upgrading from 0.3.x**: the old `codexlate.*ApiKey` and `codexlate.provider` settings are no longer read. On startup CodeXlate offers to delete them from `settings.json`.

## Example

### Input
```javascript
const [count, setCount] = useState(0);
useEffect(() => { fetchUserData(); }, [userId]);
const handleClick = () => {
  if (count < 10) { setCount(count + 1); }
};
```

### English Output
```
## Summary
This code tracks a counter and increments it when the user clicks (up to 10); it also refetches user data whenever the user ID changes.

## State Definition
- Define `counter` state variable, initial value is 0

## Side Effect
When `userId` changes:
- Execute `fetch user data`

## Event Handler
Define `handle click` function:
- If `counter` < 10:
  - Set `counter` = `counter` + 1
```

### 繁體中文輸出
```
## 概要
這段程式負責記錄一個計數，並在使用者點擊時把數字加一（最多加到 10）；另外在使用者資料變動時，重新抓取該使用者的資料。

## 狀態定義
- 定義 `計數器` 狀態變數，初始值為 0

## 副作用
當 `userId` 變動時：
- 執行 `取得使用者資料`

## 事件處理
定義 `處理點擊` 函式：
- 如果 `計數器` < 10：
  - 設定 `計數器` = `計數器` + 1
```

### 日本語出力
```
## 概要
このコードはカウンターを記録し、ユーザーがクリックするたびに数字を 1 ずつ増やします（最大 10 まで）。また、ユーザーデータが変わったときに、そのデータを再取得します。

## 状態定義
- `カウンター` 状態変数を定義、初期値は 0

## 副作用
`userId` が変更されたとき：
- `ユーザーデータを取得` を実行

## イベント処理
`クリック処理` 関数を定義：
- もし `カウンター` < 10：
  - `カウンター` = `カウンター` + 1 に設定
```

## Keyboard Shortcuts

| Action | Mac | Windows |
|--------|-----|---------|
| Translate Code | `Cmd+K X` | `Ctrl+K X` |

> Note: `Cmd+T X` / `Ctrl+T X` also works, but may conflict with VS Code's "Go to Symbol" shortcut.

## FAQ

### Q: Getting "No language model available" error?
A: Open `Chat: Manage Language Models`, add a provider and your API key, then run `CodeXlate: 選擇模型`. Make sure you are signed in to GitHub Copilot.

### Q: How do I switch models?
A: Run `CodeXlate: 選擇模型` from the Command Palette. The choice is remembered.

### Q: Translation is too slow?
A: Pick a lighter model (for example Gemini Flash or GPT mini) in `CodeXlate: 選擇模型`.

### Q: Which programming languages are supported?
A: All programming languages are supported, but translation quality is best for JavaScript/TypeScript, Python, Go and other mainstream languages.

## Support Development

If you find this tool helpful, consider buying me a coffee!

<a href="https://buymeacoffee.com/reihuang" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## License

MIT License - See [LICENSE](LICENSE) for details.

## Contributing

Issues and Pull Requests are welcome!

- [Report Issues](https://github.com/reidevbx/codexlate/issues)
- [Feature Requests](https://github.com/reidevbx/codexlate/issues/new)
