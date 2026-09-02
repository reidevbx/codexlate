# CodeXlate - コード平易翻訳ツール

[繁體中文](README.zh-TW.md) | [English](README.md) | 日本語

コードを非エンジニアにも分かる言葉に、行ごとに翻訳します。

> **翻訳 ≠ 要約**：出力はコード構造に沿って行われ、機能の要約ではありません。

https://github.com/user-attachments/assets/09398329-d723-4349-84a5-f106b56e5d38

## 特徴

- **平易な概要**：冒頭に 1〜2 文でコードの大まかな役割を分かりやすく提示
- **構造化翻訳**：コードのネスト階層をインデントで保持
- **スマートな命名翻訳**：`isLoading` → 読み込み中かどうか、`handleSubmit` → 送信処理
- **マルチフレームワーク対応**：React、Vue、Node.js などの一般的なフレームワーク用語を自動翻訳
- **多言語出力**：繁體中文、简体中文、English、日本語
- **拡張機能は API Key を保存しません**：VS Code に登録済みのモデル（Copilot、Anthropic、OpenAI、Gemini、Ollama など）をそのまま利用。キーは VS Code の安全なストレージに保管されます

## インストール

1. VS Code を開く
2. `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) で拡張機能を開く
3. `CodeXlate` を検索
4. インストールをクリック

## 使い方

1. エディタでコードを選択（選択しない場合はファイル全体を翻訳）
2. `Cmd+K X` (Mac) / `Ctrl+K X` (Windows) を押す
3. 右側のパネルに翻訳結果が表示される

またはコマンドパレットを使用：
- `Cmd+Shift+P` → `CodeXlate: 翻譯程式碼` と入力

## 設定

CodeXlate は API Key を保存も読み取りもしません。翻訳時は VS Code 内蔵の Language Model API を通じてモデルを呼び出すため、キーは VS Code で一元管理され、他の拡張機能からは読めません。

**必要条件**：VS Code 1.90 以上。モデル管理画面は GitHub Copilot Chat が提供するため、先に GitHub Copilot にサインインしてください（Free プランで可）。

1. コマンドパレット（`Cmd+Shift+P` / `Ctrl+Shift+P`）→ `Chat: Manage Language Models`
2. プロバイダー（Anthropic、OpenAI、Gemini、Ollama など）を選び、API Key を入力。Copilot のモデルは追加のキー不要です。
3. `CodeXlate: 選擇模型` を実行し、翻訳に使うモデルを選択。この手順を省略した場合、初回翻訳時に自動で選択画面が表示されます。

> **初回実行時**：VS Code が「CodeXlate に選択したモデルの使用を許可するか」を確認します。これは正常な一度きりの確認です。「許可」を選んでください。

**0.3.x からのアップグレード**：旧設定 `codexlate.*ApiKey` と `codexlate.provider` は読み取られなくなりました。起動時に CodeXlate が `settings.json` からの削除を提案します。

## 例

### 入力
```javascript
const [count, setCount] = useState(0);
useEffect(() => { fetchUserData(); }, [userId]);
const handleClick = () => {
  if (count < 10) { setCount(count + 1); }
};
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

## キーボードショートカット

| 機能 | Mac | Windows |
|------|-----|---------|
| コードを翻訳 | `Cmd+K X` | `Ctrl+K X` |

> 注：`Cmd+T X` / `Ctrl+T X` も使用できますが、VS Code の「シンボルへ移動」ショートカットと競合する可能性があります。

## よくある質問

### Q:「利用可能な言語モデルが見つかりません」エラーが表示される？
A: `Chat: Manage Language Models` を開いてプロバイダーと API Key を追加し、`CodeXlate: 選擇模型` を実行してください。GitHub Copilot にサインイン済みか確認してください。

### Q: モデルを切り替えるには？
A: コマンドパレットで `CodeXlate: 選擇模型` を実行してください。選択は記憶されます。

### Q: 翻訳が遅い？
A: `CodeXlate: 選擇模型` で Gemini Flash や GPT mini など軽量なモデルを選んでください。

### Q: どのプログラミング言語に対応していますか？
A: すべてのプログラミング言語に対応していますが、JavaScript/TypeScript、Python、Go などの主流言語で翻訳品質が最も優れています。

## 開発を支援

このツールが役に立ったら、コーヒーをおごってください！

<a href="https://buymeacoffee.com/reihuang" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50">
</a>

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## コントリビュート

Issue と Pull Request を歓迎します！

- [問題を報告](https://github.com/reidevbx/codexlate/issues)
- [機能リクエスト](https://github.com/reidevbx/codexlate/issues/new)
