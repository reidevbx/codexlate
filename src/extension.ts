import * as vscode from 'vscode';
import { translateCode } from './api/llmClient';
import { MANAGE_MODELS_COMMAND, NoModelError, pickModel, resolveModel } from './modelSelector';
import { TranslationPanel } from './webview/panel';

/** 0.3.x 以前的設定項，0.4.0 起不再讀取 */
const LEGACY_SETTING_KEYS = [
  'provider',
  'openaiApiKey',
  'openaiModel',
  'anthropicApiKey',
  'anthropicModel',
  'geminiApiKey',
  'geminiModel',
];
const LEGACY_PROMPT_DISMISSED_KEY = 'codexlate.legacySettingsPromptDismissed';

export function activate(context: vscode.ExtensionContext): void {
  console.log('CodeXlate 擴充套件已啟動');

  const translateCommand = vscode.commands.registerCommand('codexlate.translate', () =>
    runTranslate(context)
  );
  const selectModelCommand = vscode.commands.registerCommand('codexlate.selectModel', () =>
    runSelectModel(context)
  );
  context.subscriptions.push(translateCommand, selectModelCommand);

  void offerLegacySettingsCleanup(context);
}

export function deactivate(): void {
  console.log('CodeXlate 擴充套件已停用');
}

async function runTranslate(context: vscode.ExtensionContext): Promise<void> {
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

  const languageId = editor.document.languageId;

  try {
    const model = await resolveModel(context);
    if (!model) {
      return; // 使用者取消選模型
    }

    const translation = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `正在翻譯程式碼（${model.name}）...`,
        cancellable: true,
      },
      (_progress, token) => translateCode(model, code, languageId, token)
    );
    TranslationPanel.createOrShow(context.extensionUri, code, translation);
  } catch (error) {
    await handleTranslateError(error);
  }
}

async function runSelectModel(context: vscode.ExtensionContext): Promise<void> {
  try {
    const model = await pickModel(context);
    if (model) {
      vscode.window.showInformationMessage(`CodeXlate 將使用模型：${model.name}`);
    }
  } catch (error) {
    await handleTranslateError(error);
  }
}

async function handleTranslateError(error: unknown): Promise<void> {
  if (error instanceof vscode.CancellationError) {
    return;
  }

  if (error instanceof NoModelError) {
    const openManage = '開啟 Manage Language Models';
    const choice = await vscode.window.showErrorMessage(error.message, openManage);
    if (choice === openManage) {
      await openManageModels();
    }
    return;
  }

  const message = error instanceof Error ? error.message : '翻譯過程發生錯誤';
  vscode.window.showErrorMessage(`翻譯失敗: ${message}`);
}

async function openManageModels(): Promise<void> {
  try {
    await vscode.commands.executeCommand(MANAGE_MODELS_COMMAND);
  } catch {
    vscode.window.showErrorMessage(
      '無法開啟模型管理畫面。請在命令面板執行「Chat: Manage Language Models」。'
    );
  }
}

/**
 * 偵測 settings.json 是否殘留 0.3.x 的設定項（含明文 API Key），
 * 提供一鍵移除。只檢查是否存在，不讀取、不記錄內容。
 */
async function offerLegacySettingsCleanup(context: vscode.ExtensionContext): Promise<void> {
  if (context.globalState.get<boolean>(LEGACY_PROMPT_DISMISSED_KEY)) {
    return;
  }

  const config = vscode.workspace.getConfiguration('codexlate');
  const present = LEGACY_SETTING_KEYS.filter((key) => config.has(key));
  if (present.length === 0) {
    return;
  }

  const remove = '移除舊設定';
  const later = '稍後';
  const never = '不再提醒';
  const choice = await vscode.window.showWarningMessage(
    'CodeXlate 0.4 起改用 VS Code 內建的模型管理，settings.json 裡的舊 API Key 與 provider 設定已不再使用。是否移除？',
    remove,
    later,
    never
  );

  if (choice === remove) {
    await removeLegacySettings(present);
    vscode.window.showInformationMessage('已移除 CodeXlate 舊設定。');
  } else if (choice === never) {
    await context.globalState.update(LEGACY_PROMPT_DISMISSED_KEY, true);
  }
}

async function removeLegacySettings(keys: string[]): Promise<void> {
  const config = vscode.workspace.getConfiguration('codexlate');

  for (const key of keys) {
    const info = config.inspect<unknown>(key);
    if (!info) {
      continue;
    }
    if (info.globalValue !== undefined) {
      await config.update(key, undefined, vscode.ConfigurationTarget.Global);
    }
    if (info.workspaceValue !== undefined) {
      await config.update(key, undefined, vscode.ConfigurationTarget.Workspace);
    }
  }
}
