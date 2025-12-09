# CodeXlate - コード平易翻訳ツール

[繁體中文](README.zh-TW.md) | [English](README.md) | 日本語

コードを非エンジニアにも分かる言葉に、行ごとに翻訳します。

> **翻訳 ≠ 要約**：出力はコード構造に沿って行われ、機能の要約ではありません。

https://github.com/user-attachments/assets/09398329-d723-4349-84a5-f106b56e5d38

## 特徴

- **構造化翻訳**：コードのネスト階層をインデントで保持
- **スマートな命名翻訳**：`isLoading` → 読み込み中かどうか、`handleSubmit` → 送信処理
- **マルチフレームワーク対応**：React、Vue、Node.js などの一般的なフレームワーク用語を自動翻訳
- **多言語出力**：繁體中文、简体中文、English、日本語
- **複数AIプロバイダー**：OpenAI、Anthropic Claude、Google Gemini

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

初回使用時に API Key を設定：

1. 設定を開く：`Cmd+,` (Mac) / `Ctrl+,` (Windows)
2. `CodeXlate` を検索
3. Provider を選択し、対応する API Key を入力

### 対応プロバイダー

| プロバイダー | デフォルトモデル | API Key 取得 |
|-------------|-----------------|--------------|
| OpenAI | gpt-4o | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | claude-sonnet-4-20250514 | [console.anthropic.com](https://console.anthropic.com/) |
| Gemini | gemini-2.0-flash | [aistudio.google.com](https://aistudio.google.com/apikey) |

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

## キーボードショートカット

| 機能 | Mac | Windows |
|------|-----|---------|
| コードを翻訳 | `Cmd+K X` | `Ctrl+K X` |

> 注：`Cmd+T X` / `Ctrl+T X` も使用できますが、VS Code の「シンボルへ移動」ショートカットと競合する可能性があります。

## よくある質問

### Q:「API Key を設定してください」エラーが表示される？
A: 設定ページで、少なくとも1つの Provider の API Key を入力してください。

### Q: 翻訳が遅い？
A: Gemini に切り替えてみてください。通常、応答が速いです。

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
