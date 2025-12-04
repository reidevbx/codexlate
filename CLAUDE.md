# CodeXlate - 程式碼白話直譯器

## 專案概述

VS Code 擴充套件，將程式碼逐段直譯為非工程師能看懂的中文句子。

**核心原則**: 直譯 ≠ 摘要。輸出必須跟著程式碼結構走，不是總結功能。

## 技術棧

- **Runtime**: VS Code Extension API (^1.85.0)
- **Language**: TypeScript 5.3+ (strict mode)
- **Target**: ES2022
- **Module**: CommonJS

## 專案結構

```
src/
├── extension.ts        # 擴充套件入口、指令註冊
├── api/
│   └── llmClient.ts    # LLM API 呼叫邏輯
└── webview/
    └── panel.ts        # Webview 面板渲染
```

## 開發指令

```bash
npm install          # 安裝依賴
npm run compile      # 編譯 TypeScript
npm run watch        # 監聽模式編譯
npm run lint         # ESLint 檢查
```

## 程式碼規範

### TypeScript 風格

- 使用 `strict: true`，不允許 `any` 類型
- Interface 優先於 Type（除非需要 union/intersection）
- 函數必須有明確的回傳類型
- 使用 `async/await`，避免 callback hell

```typescript
// ✅ Good
async function fetchData(): Promise<Data> {
  const result = await api.call();
  return result;
}

// ❌ Bad
function fetchData() {
  return api.call().then(result => result);
}
```

### 命名規則

| 類型 | 格式 | 範例 |
|------|------|------|
| 檔案 | camelCase | `llmClient.ts` |
| 類別 | PascalCase | `TranslationPanel` |
| 函數/變數 | camelCase | `translateCode` |
| 常數 | UPPER_SNAKE | `MAX_TOKENS` |
| Interface | PascalCase | `ChatMessage` |

### VS Code API 慣例

- 使用 `vscode.workspace.getConfiguration()` 讀取設定
- Disposables 必須加入 `context.subscriptions`
- Webview 必須設定 `Content-Security-Policy`
- 錯誤使用 `vscode.window.showErrorMessage()` 顯示

```typescript
// ✅ Disposable 正確處理
const command = vscode.commands.registerCommand('cmd', handler);
context.subscriptions.push(command);
```

### 錯誤處理

- 使用 `Error` 類別，包含有意義的訊息
- API 錯誤需包含狀態碼和部分回應內容
- 網路錯誤加上超時處理（預設 60 秒）

```typescript
// ✅ 有意義的錯誤訊息
throw new Error(`API 錯誤 (${statusCode}): ${data.substring(0, 200)}`);

// ❌ 模糊的錯誤
throw new Error('發生錯誤');
```

### Webview 安全規範

- CSP 必須限制 `default-src 'none'`
- 只允許必要的 `style-src` 和 `script-src`
- HTML 內容必須經過 `escapeHtml()` 處理
- 使用 VS Code CSS 變數保持主題一致性

## 模組職責

### extension.ts

- 註冊指令與快捷鍵
- 取得編輯器選取內容
- 協調 API 呼叫與 Webview 顯示
- 處理使用者回饋（Progress、Error Message）

### api/llmClient.ts

- 管理多 Provider LLM API 請求（OpenAI / Anthropic / Gemini）
- 建構 System Prompt（直譯規則）
- 處理 HTTP/HTTPS 請求
- 根據 Provider 解析不同格式的 API 回應

### webview/panel.ts

- 管理 Webview Panel 生命週期
- 渲染 HTML 內容
- 簡易 Markdown 轉換
- 處理 Disposable 清理

## 設定項目

| 設定 | 類型 | 預設值 |
|------|------|--------|
| `codexlate.provider` | enum | openai |
| `codexlate.apiKey` | string | (empty) |
| `codexlate.model` | string | (依 provider) |
| `codexlate.apiEndpoint` | string | (選填，留空用預設) |
| `codexlate.language` | enum | 繁體中文 |

### 支援的 Provider

| Provider | 預設模型 | 預設端點 |
|----------|----------|----------|
| `openai` | gpt-4o | api.openai.com |
| `anthropic` | claude-sonnet-4-20250514 | api.anthropic.com |
| `gemini` | gemini-2.0-flash | generativelanguage.googleapis.com |

## 測試指南

### 手動測試步驟

1. `F5` 啟動 Extension Development Host
2. 開啟任意程式碼檔案
3. 選取程式碼（或不選取取得全檔）
4. `Cmd+K T` / `Ctrl+K T` 觸發翻譯
5. 驗證右側面板顯示直譯結果

### 測試檢查點

- [ ] 無 API Key 時顯示錯誤提示
- [ ] 空檔案/無選取時顯示警告
- [ ] API 超時正確處理（60s）
- [ ] Webview 正確渲染 Markdown
- [ ] 多次翻譯復用同一 Panel

## Git 規範

### Commit Message 格式

```
<type>: <description>

[optional body]
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

```bash
# 範例
feat: 新增日文翻譯支援
fix: 修復 API 超時未正確處理的問題
refactor: 重構 Webview HTML 生成邏輯
```

### 分支策略

- `main`: 穩定版本
- `feat/*`: 新功能開發
- `fix/*`: Bug 修復

## 建置與打包

使用 **esbuild** 打包所有依賴成單一檔案：

```bash
npm run compile      # 開發編譯（tsc）
npm run package      # 生產打包（esbuild bundle）
npm run vscode:prepublish  # 發布前自動打包
```

### 依賴管理

- **Runtime 依賴**：`markdown-it` - Markdown 渲染
- **打包方式**：esbuild bundle 到 `out/extension.js`
- **排除**：`vscode` 模組（由 VS Code 提供）

## 注意事項

1. **HTTP 請求** - 使用 Node.js 內建 `http/https` 模組
2. **保持 Webview 輕量** - 不使用外部 CSS/JS 框架
3. **API Key 安全** - 不要在日誌中輸出 API Key
4. **記憶體管理** - Webview Panel 關閉時正確 dispose
5. **國際化** - UI 文字使用繁體中文，保持一致性
6. **發布前必須打包** - 確保 `npm run package` 成功後再發布
