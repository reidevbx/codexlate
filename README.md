# CodeXlate - Code-to-Plain-Language Translator

[繁體中文](README.zh-TW.md) | English | [日本語](README.ja.md)

Translate code into plain language that non-engineers can understand, line by line.

> **Translation ≠ Summary**: Output follows code structure, not just summarizing functionality.

https://github.com/user-attachments/assets/09398329-d723-4349-84a5-f106b56e5d38

## Features

- **Structured Translation**: Preserves code's nested hierarchy with indentation
- **Smart Naming Translation**: `isLoading` → "is loading", `handleSubmit` → "handle submit"
- **Multi-Framework Support**: React, Vue, Node.js and other popular frameworks
- **Multi-Language Output**: Traditional Chinese, Simplified Chinese, English, Japanese
- **Multiple AI Providers**: OpenAI, Anthropic Claude, Google Gemini

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

Set up your API Key on first use:

1. Open Settings: `Cmd+,` (Mac) / `Ctrl+,` (Windows)
2. Search for `CodeXlate`
3. Select Provider and enter your API Key

### Supported Providers

| Provider | Default Model | Get API Key |
|----------|---------------|-------------|
| OpenAI | gpt-4o | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | claude-sonnet-4-20250514 | [console.anthropic.com](https://console.anthropic.com/) |
| Gemini | gemini-2.0-flash | [aistudio.google.com](https://aistudio.google.com/apikey) |

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

### Q: Getting "Please set API Key first" error?
A: Go to Settings and enter an API Key for at least one Provider.

### Q: Translation is too slow?
A: Try switching to Gemini, which typically responds faster.

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
