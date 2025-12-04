import * as vscode from 'vscode';

export class TranslationPanel {
  public static currentPanel: TranslationPanel | undefined;
  private static readonly viewType = 'codexlateTranslation';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    code: string,
    translation: string
  ) {
    const column = vscode.ViewColumn.Beside;

    if (TranslationPanel.currentPanel) {
      TranslationPanel.currentPanel._panel.reveal(column);
      TranslationPanel.currentPanel._update(code, translation);
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

    TranslationPanel.currentPanel = new TranslationPanel(panel, extensionUri);
    TranslationPanel.currentPanel._update(code, translation);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

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

  private _update(code: string, translation: string) {
    this._panel.webview.html = this._getHtmlContent(code, translation);
  }

  private _getHtmlContent(_code: string, translation: string): string {
    const processedTranslation = this._processTranslation(translation);

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <title>CodeXlate 翻譯結果</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: var(--vscode-font-family), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: var(--vscode-font-size, 14px);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      margin: 0;
      padding: 20px;
      line-height: 1.7;
    }
    .container {
      max-width: 100%;
    }
    .header {
      font-size: 1.2em;
      font-weight: 600;
      color: var(--vscode-textPreformat-foreground);
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--vscode-textLink-foreground);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .translation-content {
      background-color: var(--vscode-editor-background);
      font-family: var(--vscode-font-family), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: var(--vscode-font-size, 14px);
      line-height: 2;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
      padding: 0;
      tab-size: 2;
    }
    .translation-content code {
      background-color: var(--vscode-textCodeBlock-background);
      color: var(--vscode-textPreformat-foreground);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--vscode-editor-font-family), 'Fira Code', 'Consolas', monospace;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid var(--vscode-panel-border);
      font-size: 0.85em;
      color: var(--vscode-descriptionForeground);
      text-align: center;
    }
    kbd {
      background-color: var(--vscode-textCodeBlock-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-family: var(--vscode-editor-font-family), monospace;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">📖 白話直譯</div>
    <pre class="translation-content">${processedTranslation}</pre>
    <div class="footer">
      按下 <kbd>Cmd+K T</kbd> / <kbd>Ctrl+K T</kbd> 重新翻譯
    </div>
  </div>
</body>
</html>`;
  }

  private _processTranslation(text: string): string {
    // 先 escape HTML，再把反引號轉成 <code>
    return this._escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  private _escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
