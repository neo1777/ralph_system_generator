export enum AiModel {
  GOOGLE_GEMINI_3_PRO = 'Google Gemini 3.0 Pro',
  GOOGLE_GEMINI_3_FLASH = 'Google Gemini 3.0 Flash',
  GOOGLE_GEMINI_3_DEEP_THINK = 'Google Gemini 3.0 Deep Think',
  CLAUDE_OPUS_4_5 = 'Claude Opus 4.5',
  CLAUDE_SONNET_4_5 = 'Claude Sonnet 4.5',
  CLAUDE_HAIKU_4_5 = 'Claude Haiku 4.5',
  OPENAI_GPT_5_5 = 'OpenAI GPT-5.5',
  OPENAI_GPT_5_2 = 'OpenAI GPT-5.2',
  OPENAI_O3 = 'OpenAI o3 (Reasoning)',
  DEEPSEEK_V3_2 = 'DeepSeek V3.2',
  DEEPSEEK_V3_2_SPECIALE = 'DeepSeek V3.2 Speciale (Reasoning)',
  LLAMA_4_SCOUT = 'Llama 4 Scout (109B)',
  LLAMA_4_MAVERICK = 'Llama 4 Maverick (400B)'
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
