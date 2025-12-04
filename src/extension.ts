import * as vscode from 'vscode';
import { translateCode } from './api/llmClient';
import { TranslationPanel } from './webview/panel';

export function activate(context: vscode.ExtensionContext) {
  console.log('CodeXlate 擴充套件已啟動');

  const translateCommand = vscode.commands.registerCommand(
    'codexlate.translate',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('請先開啟一個程式碼檔案');
        return;
      }

      // 取得選取的程式碼，若無選取則取得全檔內容
      const selection = editor.selection;
      const code = selection.isEmpty
        ? editor.document.getText()
        : editor.document.getText(selection);

      if (!code.trim()) {
        vscode.window.showWarningMessage('沒有可翻譯的程式碼');
        return;
      }

      // 取得語言識別碼
      const languageId = editor.document.languageId;

      // 顯示載入中訊息
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: '正在翻譯程式碼...',
          cancellable: false,
        },
        async () => {
          try {
            const translation = await translateCode(code, languageId);
            TranslationPanel.createOrShow(context.extensionUri, code, translation);
          } catch (error) {
            const message = error instanceof Error ? error.message : '翻譯過程發生錯誤';
            vscode.window.showErrorMessage(`翻譯失敗: ${message}`);
          }
        }
      );
    }
  );

  context.subscriptions.push(translateCommand);
}

export function deactivate() {
  console.log('CodeXlate 擴充套件已停用');
}
