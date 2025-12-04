# CodeXlate - 程式碼白話直譯器

將程式碼逐段直譯為非工程師能看懂的中文句子。

> **直譯 ≠ 摘要**：輸出跟著程式碼結構走，不是總結功能。

![demo](images/demo-1.png)

## 功能特色

- **結構化直譯**：保留程式碼的巢狀層級，用縮排呈現邏輯結構
- **智慧命名翻譯**：`isLoading` → 是否載入中、`handleSubmit` → 處理提交
- **多框架支援**：React、Vue、Node.js 等常見框架術語自動翻譯
- **多語言輸出**：繁體中文、简体中文、English、日本語
- **多 AI 提供商**：OpenAI、Anthropic Claude、Google Gemini

## 安裝

1. 開啟 VS Code
2. 按 `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) 開啟擴充套件
3. 搜尋 `CodeXlate`
4. 點擊安裝

## 使用方式

1. 在編輯器中選取程式碼（或不選取則翻譯整個檔案）
2. 按下快捷鍵 `Cmd+K T` (Mac) / `Ctrl+K T` (Windows)
3. 右側面板顯示直譯結果

或使用命令面板：
- `Cmd+Shift+P` → 輸入 `CodeXlate: 翻譯程式碼`

## 設定

首次使用需設定 API Key：

1. 開啟設定：`Cmd+,` (Mac) / `Ctrl+,` (Windows)
2. 搜尋 `CodeXlate`
3. 選擇 Provider 並填入對應的 API Key

### 支援的 Provider

| Provider | 預設模型 | 取得 API Key |
|----------|----------|--------------|
| OpenAI | gpt-4o | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | claude-sonnet-4-20250514 | [console.anthropic.com](https://console.anthropic.com/) |
| Gemini | gemini-2.0-flash | [aistudio.google.com](https://aistudio.google.com/apikey) |

## 範例

### 輸入
```javascript
const [count, setCount] = useState(0);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  fetchUserData();
}, [userId]);

const handleClick = () => {
  if (count < 10) {
    setCount(count + 1);
  } else {
    alert("已達上限");
  }
};
```

### 輸出
```
【狀態定義】
定義狀態變數：
  - 「計數器」（初始為 0）
  - 「是否載入中」（初始為 false）

【副作用】
當「userId」變動時：
  執行「取得使用者資料」

【事件處理】
定義「處理點擊」函式：
  如果 「計數器」 < 10：
    設定「計數器」= 「計數器」+ 1
  否則：
    顯示提示 "已達上限"
```

## 快捷鍵

| 功能 | Mac | Windows |
|------|-----|---------|
| 翻譯程式碼 | `Cmd+K T` | `Ctrl+K T` |

## 常見問題

### Q: 出現「請先設定 API Key」錯誤？
A: 前往設定頁面，填入至少一個 Provider 的 API Key。

### Q: 翻譯結果太慢？
A: 可嘗試切換到 Gemini，通常回應較快。

### Q: 支援哪些程式語言？
A: 支援任何程式語言，但對 JavaScript/TypeScript、Python、Go 等主流語言的翻譯品質較佳。

## License

MIT License - 詳見 [LICENSE](LICENSE)

## 貢獻

歡迎提交 Issue 和 Pull Request！

- [回報問題](https://github.com/reihuang/codexlate/issues)
- [功能建議](https://github.com/reihuang/codexlate/issues/new)
