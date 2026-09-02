# CodeXlate - 程式碼白話直譯器

繁體中文 | [English](README.md) | [日本語](README.ja.md)

將程式碼逐段直譯為非工程師能看懂的中文句子。

> **直譯 ≠ 摘要**：輸出跟著程式碼結構走，不是總結功能。

https://github.com/user-attachments/assets/09398329-d723-4349-84a5-f106b56e5d38

## 功能特色

- **白話概要**：開頭先用 1~2 句大白話說明這份程式大致在做什麼，醒目顯示
- **結構化直譯**：保留程式碼的巢狀層級，用縮排呈現邏輯結構
- **智慧命名翻譯**：`isLoading` → 是否載入中、`handleSubmit` → 處理提交
- **多框架支援**：React、Vue、Node.js 等常見框架術語自動翻譯
- **多語言輸出**：繁體中文、简体中文、English、日本語
- **套件不保存 API Key**：直接使用你在 VS Code 登記的模型（Copilot、Anthropic、OpenAI、Gemini、Ollama…），金鑰留在 VS Code 的安全儲存區

## 安裝

1. 開啟 VS Code
2. 按 `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) 開啟擴充套件
3. 搜尋 `CodeXlate`
4. 點擊安裝

## 使用方式

1. 在編輯器中選取程式碼（或不選取則翻譯整個檔案）
2. 按下快捷鍵 `Cmd+K X` (Mac) / `Ctrl+K X` (Windows)
3. 右側面板顯示直譯結果

或使用命令面板：
- `Cmd+Shift+P` → 輸入 `CodeXlate: 翻譯程式碼`

## 設定

CodeXlate 不保存、也不讀取任何 API Key。翻譯時透過 VS Code 內建的 Language Model API 呼叫模型，金鑰集中由 VS Code 管理，其他擴充套件讀不到。

**需求**：VS Code 1.90 以上。模型管理畫面由 GitHub Copilot Chat 提供，請先登入 GitHub Copilot（Free 方案即可）。

1. 命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）→ `Chat: Manage Language Models`
2. 選擇提供商（Anthropic、OpenAI、Gemini、Ollama…）並填入 API Key。Copilot 模型不用另外填 Key。
3. 執行 `CodeXlate: 選擇模型`，挑選翻譯要用的模型。略過此步驟的話，第一次翻譯時會自動跳出選單。

> **第一次執行**：VS Code 會詢問是否允許 CodeXlate 使用所選模型。這是正常的一次性授權提示，請選「允許」。

**從 0.3.x 升級**：舊的 `codexlate.*ApiKey` 與 `codexlate.provider` 設定不再讀取。啟動時 CodeXlate 會詢問是否從 `settings.json` 移除這些設定。

## 範例

### 輸入
```javascript
const [count, setCount] = useState(0);
useEffect(() => { fetchUserData(); }, [userId]);
const handleClick = () => {
  if (count < 10) { setCount(count + 1); }
};
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

## 快捷鍵

| 功能 | Mac | Windows |
|------|-----|---------|
| 翻譯程式碼 | `Cmd+K X` | `Ctrl+K X` |

> 備註：`Cmd+T X` / `Ctrl+T X` 也可使用，但可能與 VS Code 的「前往符號」快捷鍵衝突。

## 常見問題

### Q: 出現「找不到可用的語言模型」錯誤？
A: 開啟 `Chat: Manage Language Models`，新增提供商並填入 API Key，再執行 `CodeXlate: 選擇模型`。請確認已登入 GitHub Copilot。

### Q: 怎麼換模型？
A: 在命令面板執行 `CodeXlate: 選擇模型`，選擇會被記住。

### Q: 翻譯結果太慢？
A: 在 `CodeXlate: 選擇模型` 改選較輕量的模型，例如 Gemini Flash 或 GPT mini。

### Q: 支援哪些程式語言？
A: 支援任何程式語言，但對 JavaScript/TypeScript、Python、Go 等主流語言的翻譯品質較佳。

## 支持開發

如果這個工具對你有幫助，歡迎請我喝杯咖啡！

<a href="https://buymeacoffee.com/reihuang" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## License

MIT License - 詳見 [LICENSE](LICENSE)

## 貢獻

歡迎提交 Issue 和 Pull Request！

- [回報問題](https://github.com/reidevbx/codexlate/issues)
- [功能建議](https://github.com/reidevbx/codexlate/issues/new)
