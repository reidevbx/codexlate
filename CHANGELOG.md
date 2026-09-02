# Changelog

本專案的版本紀錄。格式依照 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)。

## [0.4.0] - 2026-09-02

### 重大變更

- 改用 VS Code 內建的 Language Model API（`vscode.lm`）呼叫模型，不再直接對 OpenAI / Anthropic / Gemini 發 HTTP 請求。
- 移除所有 API Key 設定。套件不保存、不讀取任何 API Key，金鑰由 VS Code 的「Chat: Manage Language Models」集中管理。
- 移除 `codexlate.provider`、`codexlate.*ApiKey`、`codexlate.*Model` 設定項，程式不再讀取。
- 最低 VS Code 版本提高到 1.90.0。使用模型管理畫面需登入 GitHub Copilot（Free 方案即可）。

### 新增

- `CodeXlate: 選擇模型` 指令：從 VS Code 可用模型中挑選翻譯要用的模型，選擇會被記住。
- 第一次翻譯時若尚未選模型，自動跳出模型選單。
- 啟動時偵測 0.3.x 殘留設定（含明文 API Key），提示一鍵從 `settings.json` 移除。
- 找不到任何模型時，錯誤訊息附「管理語言模型」按鈕，直接開啟 VS Code 的模型設定畫面。

### 變更

- 記住的模型不可用時，自動重新跳出模型選單。
- 翻譯改為串流讀取回應後合併顯示。

## [0.3.0] - 2026-04-21

### 新增

- 翻譯結果開頭新增「概要」區塊，先用一段話說明程式在做什麼，再逐段直譯。
- 翻譯面板新增概要區塊的樣式。

### 變更

- 更新各 Provider 的預設模型：OpenAI 改為 `gpt-5.4-mini`，Anthropic 改為 `claude-sonnet-4-6`，Gemini 改為 `gemini-2.5-flash`。

## [0.2.2] - 2025-12-09

### 變更

- 翻譯快捷鍵改為 `Cmd+K X`（Mac）/ `Ctrl+K X`（Windows）。
- 移除 demo 影片檔案，改用外部連結。

## [0.2.1] - 2025-12-07

### 變更

- 翻譯快捷鍵改為 `Cmd+T X` / `Ctrl+T X`。

## [0.2.0] - 2025-12-07

### 新增

- README 新增繁體中文與日文版本。

### 變更

- 更新套件顯示名稱與描述。

## [0.1.9] - 2025-12-05

### 變更

- 翻譯面板新增 nonce，強化 Webview 的 Content-Security-Policy。
- 調整翻譯面板樣式與排版。
- 加強 Markdown 輸出格式要求，並在 Prompt 中加入輸出語言指示。
- README 新增繁體中文、英文、日文的輸出範例與安裝說明。

## [0.1.3] - 2025-12-04

### 新增

- 建置與打包指令（esbuild bundle）。

## [0.1.0] - 2025-12-04

### 新增

- 首次發布。選取程式碼後一鍵直譯成非工程師能看懂的中文句子。
- 支援 OpenAI、Anthropic、Gemini 三種 Provider。
- 翻譯結果顯示在右側 Webview 面板。
