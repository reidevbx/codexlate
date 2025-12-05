import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

export class TranslationPanel {
  public static currentPanel: TranslationPanel | undefined;
  private static readonly viewType = 'codexlateTranslation';

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    code: string,
    translation: string
  ) {
    const column = vscode.ViewColumn.Beside;

    if (TranslationPanel.currentPanel) {
      TranslationPanel.currentPanel._panel.reveal(column);
      TranslationPanel.currentPanel._update(translation);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      TranslationPanel.viewType,
      'CodeXlate 翻譯結果',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    TranslationPanel.currentPanel = new TranslationPanel(panel);
    TranslationPanel.currentPanel._update(translation);
  }

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    TranslationPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _update(translation: string) {
    this._panel.webview.html = this._getHtmlContent(translation);
  }

  private _getHtmlContent(translation: string): string {
    const processedTranslation = this._processTranslation(translation);

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>CodeXlate 翻譯結果</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-editor-foreground);
      background-color: var(--vscode-editor-background);
      margin: 0;
      padding: 20px;
      line-height: 1.7;
    }
    .container {
      max-width: 100%;
    }
    .header {
      font-size: 1em;
      font-weight: 400;
      color: var(--vscode-descriptionForeground);
      padding-bottom: 8px;
      border-bottom: 1px solid var(--vscode-widget-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .copy-btn {
      background-color: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      padding: 4px 10px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 0.85em;
      transition: background-color 0.2s ease;
    }
    .copy-btn:hover {
      background-color: var(--vscode-button-secondaryHoverBackground);
    }
    .copy-btn.copied {
      background-color: var(--vscode-testing-iconPassed);
      color: var(--vscode-editor-background);
    }
    .translation-content {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      line-height: 1.8;
      word-break: break-word;
      margin: 0;
      padding: 0;
    }
    .translation-content code {
      background-color: rgba(127, 127, 127, 0.2);
      color: var(--vscode-editor-foreground);
      padding: .2em .4em;
      margin: 0;
      font-size: 85%;
      white-space: break-spaces;
      border-radius: 6px;
      font-family: var(--vscode-editor-font-family);
    }
    .translation-content pre {
      background-color: var(--vscode-textCodeBlock-background);
      padding: 12px 16px;
      border-radius: 6px;
      overflow-x: auto;
      border: 1px solid var(--vscode-widget-border);
    }
    .translation-content pre code {
      background: none;
      padding: 0;
      color: var(--vscode-editor-foreground);
    }
    .translation-content ul, .translation-content ol {
      padding-left: 12px;
      margin: 2px 0;
    }
    .translation-content li {
      margin: 0;
    }
    .translation-content li::marker {
      color: var(--vscode-descriptionForeground);
    }
    .translation-content h1, .translation-content h2, .translation-content h3 {
      color: var(--vscode-textLink-foreground);
      margin: 10px 0 10px 0;
      border-bottom: 1px solid var(--vscode-widget-border);
    }
    .translation-content p {
      margin: 8px 0;
    }
    /* 區塊標題【】*/
    .block-title {
      color: var(--vscode-textLink-foreground);
      font-weight: 700;
      font-size: 1.05em;
    }
    /* 變數名「」*/
    .variable {
      color: var(--vscode-debugTokenExpression-string);
    }
    /* 關鍵字 */
    .keyword {
      color: var(--vscode-symbolIcon-keywordForeground, var(--vscode-textPreformat-foreground));
      font-weight: 500;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--vscode-widget-border);
      font-size: 0.85em;
      color: var(--vscode-descriptionForeground);
      text-align: center;
    }
    kbd {
      background-color: var(--vscode-keybindingLabel-background);
      border: 1px solid var(--vscode-keybindingLabel-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-family: var(--vscode-editor-font-family);
      font-size: 0.9em;
      color: var(--vscode-keybindingLabel-foreground);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="header-title">白話直譯</span>
      <button class="copy-btn" onclick="copyToClipboard()">複製</button>
    </div>
    <div class="translation-content" id="translation">${processedTranslation}</div>
    <div class="footer">
      按下 <kbd>Cmd+K T</kbd> / <kbd>Ctrl+K T</kbd> 重新翻譯
    </div>
  </div>
  <script>
    const rawText = ${JSON.stringify(translation)};
    function copyToClipboard() {
      navigator.clipboard.writeText(rawText).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '已複製';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '複製';
          btn.classList.remove('copied');
        }, 2000);
      });
    }
  </script>
</body>
</html>`;
  }

  private _processTranslation(text: string): string {
    // 用 markdown-it 渲染
    let html = md.render(text);

    // 額外上色處理（在 HTML 渲染後）
    // 區塊標題【...】→ 藍色粗體
    html = html.replace(/【([^】]+)】/g, '<span class="block-title">【$1】</span>');

    // 變數名「...」→ 橘色
    html = html.replace(/「([^」]+)」/g, '<span class="variable">「$1」</span>');

    // 關鍵字上色
    const keywords = [
      '如果', '否則如果', '否則',
      '對每個', '執行', '當', '持續執行',
      '回傳', '嘗試', '若失敗', '最後',
      '等待', '拋出錯誤',
      '定義', '設定', '取得', '建立', '更新', '刪除',
      '呼叫', '傳入', '匯入', '匯出',
      '當元件載入時', '當元件卸載時',
      '計算並快取', '定義並快取函式',
      '定義狀態變數', '定義響應式變數',
      '計算屬性', '監聽變化'
    ];
    for (const kw of keywords) {
      html = html.replace(
        new RegExp(`(^|[\\s：])${kw}`, 'gm'),
        `$1<span class="keyword">${kw}</span>`
      );
    }

    return html;
  }
}
