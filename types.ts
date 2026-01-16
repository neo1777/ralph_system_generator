export enum CliTool {
  MANUAL = 'Manual / Template (Safe Mode)',
  ANTIGRAVITY = 'Google Antigravity / Project IDX (Cloud IDE)',
  GEMINI_CLI = 'Google Gemini CLI v0.23+',
  CLAUDE_CLI = 'Anthropic Claude Code CLI',
  OPENAI_CLI = 'OpenAI Codex CLI v0.87+',
  OLLAMA = 'Ollama (Local / DeepSeek R1)',
  CURL = 'cURL (Universal OpenAI-Compatible Adaptor)'
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
  GOOGLE_GEMINI_3_FLASH = 'Gemini 3 Flash (Google)',
  GOOGLE_GEMINI_3_PRO = 'Gemini 3 Pro (Google)',
  GOOGLE_GEMINI_2_5_FLASH = 'Gemini 2.5 Flash (Google)',
  // Anthropic
  CLAUDE_4_5_OPUS = 'Claude 4.5 Opus (Anthropic)',
  CLAUDE_4_5_SONNET = 'Claude 4.5 Sonnet (Anthropic)',
  CLAUDE_4_5_HAIKU = 'Claude 4.5 Haiku (Anthropic)',
  // OpenAI
  OPENAI_GPT_5_2_CODEX = 'GPT-5.2 Codex (OpenAI)',
  OPENAI_GPT_5_2_PRO = 'GPT-5.2 Pro (OpenAI)',
  // DeepSeek
  DEEPSEEK_V4 = 'DeepSeek V4 (DeepSeek)',
  DEEPSEEK_V3 = 'DeepSeek V3 (DeepSeek)',
  DEEPSEEK_R1 = 'DeepSeek R1 (DeepSeek)',
  // Mistral
  MISTRAL_3_SMALL = 'Mistral 3 Small (Mistral)',
  MISTRAL_3_MEDIUM = 'Mistral 3 Medium (Mistral)',
  MISTRAL_LARGE = 'Mistral Large (Mistral)',
  // Groq
  GROQ_LLAMA_3_70B = 'Llama 3 70B (Groq)',
  GROQ_DEEPSEEK_R1 = 'DeepSeek R1 (Groq)'
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
