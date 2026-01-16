export enum CliTool {
  MANUAL = 'Manual / Template (Safe Mode)',
  ANTIGRAVITY = 'Google Antigravity / Project IDX (Cloud IDE)',
  GEMINI_CLI = 'Google Gemini CLI (@google/gemini-cli)',
  CLAUDE_CLI = 'Anthropic Claude CLI (@anthropic-ai/claude-code)',
  OPENAI_CLI = 'OpenAI Python CLI (pip install openai)',
  OLLAMA = 'Ollama (Local)',
  CURL = 'cURL (DeepSeek / Mistral / Cohere / Groq)'
}

export interface CostEstimate {
  inputPer1M: number;
  outputPer1M: number;
  currency: string;
}

export enum InterfaceType {
  BASH_BASIC = 'Basic Bash Loop',
  TUI = 'Ralph TUI (Terminal UI)'
}

export enum AiModel {
  // Google
  GOOGLE_GEMINI_2_5_FLASH = 'Gemini 1.5 Flash (Google)',
  GOOGLE_GEMINI_2_5_PRO = 'Gemini 1.5 Pro (Google)',
  // Anthropic
  CLAUDE_3_5_SONNET = 'Claude 3.5 Sonnet (Anthropic)',
  CLAUDE_3_5_HAIKU = 'Claude 3.5 Haiku (Anthropic)',
  CLAUDE_3_OPUS = 'Claude 3 Opus (Anthropic)',
  // OpenAI
  OPENAI_GPT_4O = 'GPT-4o (OpenAI)',
  OPENAI_GPT_4O_MINI = 'GPT-4o Mini (OpenAI)',
  // DeepSeek
  DEEPSEEK_V3 = 'DeepSeek V3 (DeepSeek)',
  DEEPSEEK_R1 = 'DeepSeek R1 (DeepSeek)',
  // Mistral
  MISTRAL_SMALL = 'Mistral Small (Mistral)',
  MISTRAL_LARGE = 'Mistral Large (Mistral)',
  // Cohere
  COHERE_COMMAND_R_PLUS = 'Command R+ (Cohere)',
  // Groq
  GROQ_LLAMA_3_8B = 'Llama 3 8B (Groq)',
  GROQ_LLAMA_3_70B = 'Llama 3 70B (Groq)'
}

export enum AppLanguage {
  EN = 'English',
  ES = 'Español',
  FR = 'Français',
  DE = 'Deutsch',
  IT = 'Italiano',
  PT = 'Português',
  ZH = '中文 (Chinese)',
  JA = '日本語 (Japanese)'
}

export interface ContextFile {
  name: string;
  type: string;
  content: string;
  isImage: boolean;
}

export interface RalphConfig {
  projectName: string;
  goal: string;
  model: AiModel;
  interfaceType: InterfaceType;
  cliTool: CliTool;
  includeDevBrowser: boolean;
  uiLanguage: AppLanguage;
  outputLanguage: AppLanguage;
  contextFiles: ContextFile[];
}

export interface GeneratedFile {
  filename: string;
  language: string;
  content: string;
  binaryData?: Blob;
  description: string;
}
