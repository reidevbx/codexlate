# CodeXlate - 程式碼白話直譯器

## 專案概述

VS Code 擴充套件，將程式碼逐段直譯為非工程師能看懂的中文句子。

**核心原則**: 直譯 ≠ 摘要。輸出必須跟著程式碼結構走，不是總結功能。

## 技術棧

- **Runtime**: VS Code Extension API (^1.90.0)，模型呼叫走 `vscode.lm`
- **Language**: TypeScript 5.3+ (strict mode)
- **Target**: ES2022
- **Module**: CommonJS

## 專案結構

```
src/
├── extension.ts        # 擴充套件入口、指令註冊、舊設定清理
├── modelSelector.ts    # 從 vscode.lm 挑選模型、記住選擇
├── api/
│   └── llmClient.ts    # 組 Prompt、透過 vscode.lm 呼叫模型
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

- 註冊指令與快捷鍵（`codexlate.translate`、`codexlate.selectModel`）
- 取得編輯器選取內容
- 協調模型選擇、API 呼叫與 Webview 顯示
- 處理使用者回饋（Progress、Error Message、找不到模型時導向「Chat: Manage Language Models」）
- 啟動時偵測 0.3.x 殘留設定（含明文 API Key），提供一鍵移除。只用 `config.has()` 檢查存在，不讀值

### modelSelector.ts

- `vscode.lm.selectChatModels()` 列出可用模型，用 QuickPick 讓使用者選
- 選擇存在 `globalState`（vendor + id），下次直接沿用
- 記住的模型不可用時重新跳選單；完全沒有模型時拋 `NoModelError`

### api/llmClient.ts

- 建構 System Prompt（直譯規則）與 User Prompt
- 透過 `model.sendRequest()` 呼叫，`for await` 讀取 `response.text` 串流後合併
- `vscode.lm` 只有 User / Assistant 角色，System Prompt 以第一則 User 訊息送出
- 套件不保存、不讀取任何 API Key

### webview/panel.ts

- 管理 Webview Panel 生命週期
- 渲染 HTML 內容
- 簡易 Markdown 轉換
- 處理 Disposable 清理

## 設定項目

| 設定 | 類型 | 預設值 |
|------|------|--------|
| `codexlate.language` | enum | 繁體中文 |

模型不在設定裡選，由 `CodeXlate: 選擇模型` 指令選擇並存在 `globalState`。

### 模型來源

模型由 VS Code 的 Language Model API 提供。使用者在「Chat: Manage Language Models」登記 Anthropic / OpenAI / Gemini / Ollama 等 Key，或直接用 Copilot 模型。API Key 由 VS Code SecretStorage 保管，套件碰不到。

### 0.3.x 舊設定

`codexlate.provider`、`codexlate.*ApiKey`、`codexlate.*Model` 已移除，程式不再讀取。啟動時若偵測到殘留，提示使用者一鍵移除。

## 測試指南

### 手動測試步驟

1. `F5` 啟動 Extension Development Host
2. 確認已登入 GitHub Copilot，並在「Chat: Manage Language Models」設定至少一個模型
3. 開啟任意程式碼檔案
4. 選取程式碼（或不選取取得全檔）
5. `Cmd+K X` / `Ctrl+K X` 觸發翻譯，第一次會跳模型選單與 VS Code 授權提示
6. 驗證右側面板顯示直譯結果

### 測試檢查點

- [ ] 沒有任何模型時顯示錯誤，按鈕能開啟「Chat: Manage Language Models」
- [ ] 第一次翻譯跳 QuickPick，選擇後下次不再問
- [ ] `CodeXlate: 選擇模型` 可換模型
- [ ] 空檔案/無選取時顯示警告
- [ ] Progress 通知按取消能中止請求，且不跳錯誤
- [ ] settings.json 有舊 `*ApiKey` 時，啟動跳出移除提示，按「移除舊設定」後 settings.json 不再有這些鍵
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

1. **模型呼叫** - 只透過 `vscode.lm`，不直接發 HTTP 請求到任何 LLM API
2. **保持 Webview 輕量** - 不使用外部 CSS/JS 框架
3. **API Key 安全** - 套件不保存、不讀取、不記錄任何 API Key；不要新增讀 Key 的設定項
4. **記憶體管理** - Webview Panel 關閉時正確 dispose
5. **國際化** - UI 文字使用繁體中文，保持一致性
6. **發布前必須打包** - 確保 `npm run package` 成功後再發布
