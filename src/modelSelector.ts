import * as vscode from 'vscode';

const SELECTED_MODEL_KEY = 'codexlate.selectedModel';

/** 開啟「Chat: Manage Language Models」的 VS Code 內建指令 ID */
export const MANAGE_MODELS_COMMAND = 'workbench.action.chat.manage';

interface SavedModel {
  vendor: string;
  id: string;
  name: string;
}

interface ModelQuickPickItem extends vscode.QuickPickItem {
  model: vscode.LanguageModelChat;
}

/** VS Code 內沒有任何可用的語言模型 */
export class NoModelError extends Error {
  constructor() {
    super('找不到可用的語言模型。請先在「Chat: Manage Language Models」設定模型。');
    this.name = 'NoModelError';
  }
}

/**
 * 顯示 QuickPick 讓使用者從 vscode.lm 可用模型中挑一個，並記在 globalState。
 * 使用者取消時回傳 undefined。
 */
export async function pickModel(
  context: vscode.ExtensionContext
): Promise<vscode.LanguageModelChat | undefined> {
  const models = await vscode.lm.selectChatModels();
  if (models.length === 0) {
    throw new NoModelError();
  }

  const saved = context.globalState.get<SavedModel>(SELECTED_MODEL_KEY);
  const items: ModelQuickPickItem[] = models.map((model) => ({
    label: model.name,
    description: `${model.vendor} · ${model.family}`,
    detail: model.id,
    picked: saved?.vendor === model.vendor && saved?.id === model.id,
    model,
  }));

  const picked = await vscode.window.showQuickPick(items, {
    title: 'CodeXlate: 選擇模型',
    placeHolder: '選擇翻譯程式碼要使用的模型',
    matchOnDescription: true,
    matchOnDetail: true,
  });
  if (!picked) {
    return undefined;
  }

  const record: SavedModel = {
    vendor: picked.model.vendor,
    id: picked.model.id,
    name: picked.model.name,
  };
  await context.globalState.update(SELECTED_MODEL_KEY, record);
  return picked.model;
}

/**
 * 取得翻譯要用的模型：
 * 1. 先找 globalState 記住的模型，仍可用就直接回傳
 * 2. 沒記過或已不可用，就跳 QuickPick 讓使用者選
 */
export async function resolveModel(
  context: vscode.ExtensionContext
): Promise<vscode.LanguageModelChat | undefined> {
  const saved = context.globalState.get<SavedModel>(SELECTED_MODEL_KEY);
  if (saved) {
    const [model] = await vscode.lm.selectChatModels({ vendor: saved.vendor, id: saved.id });
    if (model) {
      return model;
    }
    vscode.window.showInformationMessage(
      `先前選擇的模型「${saved.name}」目前不可用，請重新選擇。`
    );
  }
  return pickModel(context);
}
