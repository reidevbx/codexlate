import * as vscode from 'vscode';
import * as https from 'https';
import * as http from 'http';

type Provider = 'openai' | 'anthropic' | 'gemini';

interface Config {
  provider: Provider;
  apiKey: string;
  model: string;
  endpoint: string;
  language: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 預設端點
const DEFAULT_ENDPOINTS: Record<Provider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
};

function getConfig(): Config {
  const config = vscode.workspace.getConfiguration('codexlate');
  const provider = config.get<Provider>('provider', 'openai');

  // 根據 provider 讀取對應的設定
  let apiKey: string;
  let model: string;
  let endpoint: string;

  switch (provider) {
    case 'openai':
      apiKey = config.get<string>('openaiApiKey', '');
      model = config.get<string>('openaiModel', 'gpt-4o');
      endpoint = DEFAULT_ENDPOINTS.openai;
      break;
    case 'anthropic':
      apiKey = config.get<string>('anthropicApiKey', '');
      model = config.get<string>('anthropicModel', 'claude-sonnet-4-20250514');
      endpoint = DEFAULT_ENDPOINTS.anthropic;
      break;
    case 'gemini':
      apiKey = config.get<string>('geminiApiKey', '');
      model = config.get<string>('geminiModel', 'gemini-2.0-flash');
      endpoint = DEFAULT_ENDPOINTS.gemini;
      break;
  }

  return {
    provider,
    apiKey,
    model,
    endpoint,
    language: config.get<string>('language', '繁體中文'),
  };
}

function getAvailableProviders(): Provider[] {
  const config = vscode.workspace.getConfiguration('codexlate');
  const providers: Provider[] = [];

  if (config.get<string>('openaiApiKey', '')) {
    providers.push('openai');
  }
  if (config.get<string>('anthropicApiKey', '')) {
    providers.push('anthropic');
  }
  if (config.get<string>('geminiApiKey', '')) {
    providers.push('gemini');
  }

  return providers;
}

function buildSystemPrompt(language: string): string {
  return `你是一個程式碼直譯器，將程式碼翻譯成${language}虛擬碼描述，讓人能快速理解程式邏輯。

## 核心原則
- 嚴格按照程式碼結構逐段翻譯，不是摘要或總結
- 用縮排反映程式碼的巢狀層級
- 禁止說「這段程式碼的功能是...」或「這是一個用來...的程式」

## 命名翻譯規則
| 英文模式 | 中文翻譯 |
|---------|---------|
| isXxx / hasXxx | 是否Xxx |
| xxxList / xxxArray | Xxx清單 |
| xxxCount / xxxNum | Xxx數量 |
| handleXxx | 處理Xxx |
| onXxx | 當Xxx時 |
| fetchXxx / getXxx | 取得Xxx |
| setXxx | 設定Xxx |
| createXxx | 建立Xxx |
| updateXxx | 更新Xxx |
| deleteXxx | 刪除Xxx |

## 邏輯關鍵字翻譯
| 程式語法 | 中文表達 |
|---------|---------|
| if | 如果 |
| else if | 否則如果 |
| else | 否則 |
| for / forEach | 對每個...執行 |
| while | 當...持續執行 |
| return | 回傳 |
| try | 嘗試 |
| catch | 若失敗 |
| finally | 最後 |
| await | 等待 |
| throw | 拋出錯誤 |

## React/Vue 專用翻譯
| 語法 | 中文表達 |
|-----|---------|
| useState | 定義狀態變數 |
| useEffect(() => {}, []) | 當元件載入時 |
| useEffect(() => {}, [dep]) | 當「dep」變動時 |
| useMemo | 計算並快取 |
| useCallback | 定義並快取函式 |
| props | 傳入參數 |
| children | 子元素 |
| ref / reactive | 定義響應式變數 |
| computed | 計算屬性 |
| watch | 監聽變化 |
| onMounted | 當元件掛載時 |

## 輸出格式（必須嚴格遵守）
直接輸出 Markdown 內容，禁止用 \`\`\` 包住整個輸出：
- 每個功能區塊用 ## 開頭
- 變數名、函式名、API 路徑用單個反引號 \`名稱\` 包住
- 用 - 符號做列表，子項目用兩個空格縮排
- 字串值用 "" 包住

## 範例

輸入：
const [count, setCount] = useState(0);
useEffect(() => { fetchUserData(); }, [userId]);
const handleClick = () => { if (count < 10) { setCount(count + 1); } };

正確輸出：
## 狀態定義
- 定義 \`計數器\` 狀態變數，初始值為 0

## 副作用
當 \`userId\` 變動時：
- 執行 \`取得使用者資料\`

## 事件處理
定義 \`處理點擊\` 函式：
- 如果 \`計數器\` < 10：
  - 設定 \`計數器\` = \`計數器\` + 1

錯誤輸出（禁止）：
\`\`\`markdown
## 狀態定義
...
\`\`\``;
}

function buildUserPrompt(code: string, languageId: string, language: string): string {
  return `請將以下 ${languageId} 程式碼直譯成${language}：\n\n\`\`\`${languageId}\n${code}\n\`\`\``;
}

// ============ OpenAI 格式 ============
function buildOpenAIRequest(code: string, languageId: string, config: Config): string {
  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(config.language) },
    { role: 'user', content: buildUserPrompt(code, languageId, config.language) },
  ];

  return JSON.stringify({
    model: config.model,
    messages,
    temperature: 0.3,
    max_tokens: 4096,
  });
}

function buildOpenAIHeaders(apiKey: string, bodyLength: number): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': String(bodyLength),
  };
}

function parseOpenAIResponse(data: string): string {
  const response = JSON.parse(data);
  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI API 回應格式錯誤');
  }
  return content;
}

// ============ Anthropic 格式 ============
function buildAnthropicRequest(code: string, languageId: string, config: Config): string {
  return JSON.stringify({
    model: config.model,
    max_tokens: 4096,
    system: buildSystemPrompt(config.language),
    messages: [
      { role: 'user', content: buildUserPrompt(code, languageId, config.language) },
    ],
  });
}

function buildAnthropicHeaders(apiKey: string, bodyLength: number): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Length': String(bodyLength),
  };
}

function parseAnthropicResponse(data: string): string {
  const response = JSON.parse(data);
  const content = response.content?.[0]?.text;
  if (!content) {
    throw new Error('Anthropic API 回應格式錯誤');
  }
  return content;
}

// ============ Gemini 格式 ============
function buildGeminiRequest(code: string, languageId: string, config: Config): string {
  const systemPrompt = buildSystemPrompt(config.language);
  const userPrompt = buildUserPrompt(code, languageId, config.language);

  return JSON.stringify({
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });
}

function buildGeminiHeaders(bodyLength: number): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Content-Length': String(bodyLength),
  };
}

function parseGeminiResponse(data: string): string {
  const response = JSON.parse(data);
  const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Gemini API 回應格式錯誤');
  }
  return content;
}

// ============ 統一請求處理 ============
export async function translateCode(code: string, languageId: string): Promise<string> {
  const config = getConfig();
  const availableProviders = getAvailableProviders();

  if (!config.apiKey) {
    if (availableProviders.length === 0) {
      throw new Error('請先設定至少一個 API Key (設定 > CodeXlate)');
    } else {
      const providerNames = availableProviders.join(', ');
      throw new Error(`目前選擇的 ${config.provider} 未設定 API Key。可用的 Provider: ${providerNames}`);
    }
  }

  let requestBody: string;
  let headers: Record<string, string>;
  let endpoint = config.endpoint;
  let parseResponse: (data: string) => string;

  switch (config.provider) {
    case 'openai':
      requestBody = buildOpenAIRequest(code, languageId, config);
      headers = buildOpenAIHeaders(config.apiKey, Buffer.byteLength(requestBody));
      parseResponse = parseOpenAIResponse;
      break;

    case 'anthropic':
      requestBody = buildAnthropicRequest(code, languageId, config);
      headers = buildAnthropicHeaders(config.apiKey, Buffer.byteLength(requestBody));
      parseResponse = parseAnthropicResponse;
      break;

    case 'gemini':
      requestBody = buildGeminiRequest(code, languageId, config);
      headers = buildGeminiHeaders(Buffer.byteLength(requestBody));
      // Gemini API Key 透過 URL 參數傳遞
      endpoint = endpoint.replace('{model}', config.model) + `?key=${config.apiKey}`;
      parseResponse = parseGeminiResponse;
      break;
  }

  return makeRequest(endpoint, headers, requestBody, parseResponse);
}

function makeRequest(
  endpoint: string,
  headers: Record<string, string>,
  body: string,
  parseResponse: (data: string) => string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const isHttps = url.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers,
    };

    const req = httpModule.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(parseResponse(data));
          } catch {
            reject(new Error(`無法解析 API 回應: ${data.substring(0, 200)}`));
          }
        } else {
          reject(new Error(`API 錯誤 (${res.statusCode}): ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`網路錯誤: ${error.message}`));
    });

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('請求超時'));
    });

    req.write(body);
    req.end();
  });
}
