import { AppLanguage, InterfaceType, CliTool } from '../types';

type TranslationKey =
  | 'appTitle' | 'subTitle' | 'configTitle' | 'projectName' | 'goal' | 'goalPlaceholder'
  | 'goalHelp' | 'model' | 'modelHelp' | 'interface' | 'cliTool' | 'cliToolHelp'
  | 'capabilities' | 'devBrowser' | 'devBrowserHelp' | 'generateBtn'
  | 'freshContextTitle' | 'freshContextDesc' | 'generatedAssets' | 'filesCreated'
  | 'emptyStateTitle' | 'emptyStateDesc' | 'uiLang' | 'outputLang' | 'whyFreshContext'
  | 'uploadLabel' | 'uploadHelp' | 'filesAttached' | 'presetsTitle'
  | 'presetPlaceholder' | 'diffBeginner' | 'diffIntermediate' | 'diffAdvanced' | 'diffExpert'
  | 'themeLabel' | 'themeLight' | 'themeDark'
  | 'lbl_code' | 'tip_download' | 'tip_remove' | 'tip_copy' | 'lbl_download_zip' | 'tip_download_zip'
  | 'err_zip' | 'group_google' | 'group_anthropic' | 'group_openai' | 'group_deepseek' | 'placeholder_project'
  | 'desc_nix' | 'desc_instructions' | 'desc_prd' | 'desc_agents' | 'desc_progress'
  | 'desc_sys_prompt' | 'desc_tui' | 'desc_sh' | 'desc_ctx_img'
  | 'iface_bash' | 'iface_tui'
  | 'tool_manual' | 'tool_antigravity' | 'tool_llm' | 'tool_gcloud' | 'tool_ollama' | 'tool_claude' | 'tool_openai';

type OutputKey =
  | 'prd_setup_title' | 'prd_setup_desc' | 'prd_criteria_setup'
  | 'prd_logic_title' | 'prd_logic_desc' | 'prd_criteria_logic'
  | 'agents_mem_intro' | 'arch_patterns' | 'gotchas' | 'proj_context'
  | 'progress_init' | 'script_start' | 'script_all_passed' | 'script_working'
  | 'script_criteria' | 'script_calling' | 'script_manual_check' | 'script_ask_success'
  | 'script_complete' | 'script_failed' | 'sys_prompt_core_rules' | 'sys_prompt_fresh'
  | 'sys_prompt_atomic' | 'sys_prompt_compound' | 'sys_prompt_verification'
  | 'sys_intro_std' | 'sys_dev_browser' | 'sys_goal_label' | 'sys_model_label'
  | 'task_analysis_title' | 'task_analysis_desc' | 'task_analysis_crit'
  | 'task_verify_title' | 'task_verify_desc' | 'task_verify_crit'
  | 'task_checklist_title' | 'task_checklist_desc' | 'task_checklist_crit'
  | 'tui_waiting' | 'tui_agent_act' | 'tui_all_done' | 'tui_running'
  | 'tui_err_load' | 'tui_err_json' | 'tui_err_gen' | 'tui_err_save' | 'tui_success_save' | 'tui_retry'
  | 'tui_title' | 'sh_start'
  | 'sh_orchestrator_for' | 'sh_optimized_for' | 'sh_cli_tool' | 'sh_jq_req' | 'sh_install_it'
  | 'git_init_commit' | 'git_task_commit' | 'agents_lessons_title' | 'agents_lessons_hint'
  | 'agents_gotchas_title' | 'agents_gotchas_hint' | 'agents_init_ctx' | 'sys_prompt_header'
  | 'sys_prompt_project' | 'tui_calling_agent' | 'tui_end_session' | 'tui_you_are_ralph'
  | 'tui_context_label' | 'tui_task_label' | 'tui_criteria_label' | 'instr_generated_by'
  | 'err_google_model' | 'err_claude_model' | 'err_manual_setup' | 'err_antigravity_model' | 'err_manual_call';

export type InstructionKey =
  | 'instr_title' | 'instr_sys_req_title' | 'instr_sys_req_body'
  | 'instr_setup_title' | 'instr_setup_idx'
  | 'instr_setup_llm_step1' | 'instr_setup_llm_step2'
  | 'instr_setup_ollama'
  | 'instr_setup_claude'
  | 'instr_setup_openai'
  | 'instr_setup_gcloud' | 'instr_setup_manual'
  | 'instr_keys_title' | 'instr_keys_setup_cmd' | 'instr_keys_no_req' | 'instr_keys_gcloud_cmd' | 'instr_keys_claude' | 'instr_keys_openai'
  | 'instr_run_title' | 'instr_run_step_chmod' | 'instr_run_step_git' | 'instr_run_step_start'
  | 'instr_workflow_title' | 'instr_workflow_body';

const uiDictionary: Record<AppLanguage, any> = {
  [AppLanguage.EN]: {
    appTitle: "Ralph System Generator",
    subTitle: "Updated for 2026 Models",
    configTitle: "System Configuration",
    projectName: "Project Name",
    goal: "Goal / Context",
    goalPlaceholder: "Describe what Ralph needs to build...",
    generateBtn: "Generate Ralph System",
    freshContextTitle: "Why Fresh Context?",
    whyFreshContext: "Prevents Context Rot.",
    generatedAssets: "Generated Assets",
    filesCreated: "files created",
    emptyStateTitle: "Ready to Orchestrate",
    emptyStateDesc: "Configure and click Generate",
    uiLang: "UI Language",
    outputLang: "Code Language",
    placeholder_project: "e.g. MyProject",
    iface_bash: "Basic Bash Loop",
    iface_tui: "Ralph TUI",
    tool_manual: "Manual",
    tool_antigravity: "Google Antigravity",
    tool_llm: "LLM CLI",
    group_google: "Google Gemini",
    group_anthropic: "Anthropic",
    group_openai: "OpenAI",
    group_deepseek: "DeepSeek",
    lbl_code: "Code",
    tip_download: "Download",
    tip_copy: "Copy",
    lbl_download_zip: "Download ZIP",
    presetsTitle: "Presets",
    diffBeginner: "Beginner",
    diffIntermediate: "Intermediate",
    diffAdvanced: "Advanced",
    diffExpert: "Expert"
  },
  [AppLanguage.IT]: {
    appTitle: "Generatore Sistema Ralph",
    subTitle: "Aggiornato per modelli 2026",
    configTitle: "Configurazione Sistema",
    projectName: "Nome Progetto",
    goal: "Obiettivo / Contesto",
    goalPlaceholder: "Descrivi cosa deve costruire Ralph...",
    generateBtn: "Genera Sistema Ralph",
    freshContextTitle: "Perché Contesto Fresco?",
    whyFreshContext: "Previene il deterioramento del contesto.",
    generatedAssets: "Asset Generati",
    filesCreated: "file creati",
    emptyStateTitle: "Pronto per l'Orchestrazione",
    emptyStateDesc: "Configura e clicca Genera",
    uiLang: "Lingua UI",
    outputLang: "Lingua Codice",
    placeholder_project: "es. MioProgetto",
    iface_bash: "Loop Bash Base",
    iface_tui: "Ralph TUI",
    tool_manual: "Manuale",
    tool_antigravity: "Google Antigravity",
    tool_llm: "LLM CLI",
    group_google: "Google Gemini",
    group_anthropic: "Anthropic",
    group_openai: "OpenAI",
    group_deepseek: "DeepSeek",
    lbl_code: "Codice",
    tip_download: "Scarica",
    tip_copy: "Copia",
    lbl_download_zip: "Scarica ZIP",
    presetsTitle: "Preset",
    diffBeginner: "Principiante",
    diffIntermediate: "Intermedio",
    diffAdvanced: "Avanzato",
    diffExpert: "Esperto"
  }
};

// Fill gaps for build
[AppLanguage.ES, AppLanguage.FR, AppLanguage.DE, AppLanguage.PT, AppLanguage.RU, AppLanguage.JA].forEach(lang => {
  if (!uiDictionary[lang]) uiDictionary[lang] = uiDictionary[AppLanguage.EN];
});

export const getUiText = (lang: AppLanguage, key: TranslationKey): string => uiDictionary[lang]?.[key] || uiDictionary[AppLanguage.EN][key];
export const getOutputText = (lang: AppLanguage, key: OutputKey): string => uiDictionary[lang]?.[key] || uiDictionary[AppLanguage.EN][key];
export const getInstructionText = (lang: AppLanguage, key: InstructionKey): string => uiDictionary[lang]?.[key] || uiDictionary[AppLanguage.EN][key];

export const getInterfaceLabel = (lang: AppLanguage, type: InterfaceType): string => {
  return type === InterfaceType.TUI ? getUiText(lang, 'iface_tui') : getUiText(lang, 'iface_bash');
};

export const getCliToolLabel = (lang: AppLanguage, tool: CliTool): string => {
  const map: Record<CliTool, TranslationKey> = {
    [CliTool.MANUAL]: 'tool_manual',
    [CliTool.ANTIGRAVITY]: 'tool_antigravity',
    [CliTool.LLM_CLI]: 'tool_llm',
    [CliTool.GCLOUD]: 'tool_gcloud',
    [CliTool.OLLAMA]: 'tool_ollama',
    [CliTool.CLAUDE_CLI]: 'tool_claude',
    [CliTool.OPENAI_CLI]: 'tool_openai'
  };
  return getUiText(lang, map[tool]);
};
