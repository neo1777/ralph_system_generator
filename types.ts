export enum AiModel {
  GOOGLE_GEMINI_3_PRO = 'Google Gemini 3 Pro (Preview)',
  GOOGLE_GEMINI_3_FLASH = 'Google Gemini 3 Flash (Preview)',
  GOOGLE_GEMINI_2_5_FLASH = 'Google Gemini 2.5 Flash',
  CLAUDE_3_7_SONNET = 'Claude 3.7 Sonnet',
  CLAUDE_3_5_OPUS = 'Claude 3.5 Opus',
  CLAUDE_3_5_SONNET = 'Claude 3.5 Sonnet',
  OPENAI_GPT_5 = 'OpenAI GPT-5 (Preview)',
  OPENAI_O3 = 'OpenAI o3 (Reasoning)',
  OPENAI_O1 = 'OpenAI o1',
  OPENAI_GPT_4O = 'OpenAI GPT-4o',
  DEEPSEEK_R1 = 'DeepSeek R1 (Distill)',
  DEEPSEEK_V3 = 'DeepSeek V3',
  LLAMA_4_405B = 'Llama 4 405B'
}

export enum InterfaceType {
  BASH_BASIC = 'Basic Bash Loop',
  TUI = 'Ralph TUI (Terminal UI)'
}

export enum CliTool {
  MANUAL = 'Manual / Template (Safe Mode)',
  ANTIGRAVITY = 'Google Antigravity / Project IDX (Cloud IDE)',
  LLM_CLI = 'LLM CLI (simonw/llm) - Recommended',
  GCLOUD = 'Google Cloud SDK (gcloud)',
  OLLAMA = 'Ollama (Local)',
  CLAUDE_CLI = 'Claude CLI (Anthropic)',
  OPENAI_CLI = 'OpenAI CLI (Python)'
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
