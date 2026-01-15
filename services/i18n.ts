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

// Complete UI Dictionary with all languages
const uiDict: Record<AppLanguage, Record<string, string>> = {
  [AppLanguage.EN]: {
    appTitle: "Ralph System Generator",
    subTitle: "Updated for 2026 Models",
    configTitle: "System Configuration",
    projectName: "Project Name",
    goal: "Goal / Context",
    goalPlaceholder: "Describe what Ralph needs to build...",
    goalHelp: "Provide detailed requirements, tech stack, and desired features.",
    model: "AI Model",
    modelHelp: "Reasoning models (o1/o3/R1) are slower but write better code.",
    interface: "Interface Type",
    cliTool: "CLI Tool",
    cliToolHelp: "Select the tool installed on your machine to drive the AI.",
    devBrowser: "Dev Browser",
    devBrowserHelp: "Enable visual verification on localhost",
    generateBtn: "Generate Ralph System",
    freshContextTitle: "Why Fresh Context?",
    whyFreshContext: "Prevents Context Rot. Each iteration starts clean.",
    generatedAssets: "Generated Assets",
    filesCreated: "files created",
    emptyStateTitle: "Ready to Orchestrate",
    emptyStateDesc: "Configure and click Generate",
    uiLang: "UI Language",
    outputLang: "Code Language",
    placeholder_project: "e.g. MyProject",
    uploadLabel: "Upload Context Files",
    uploadHelp: "Text files or images for initial context",
    filesAttached: "files attached",
    presetsTitle: "Quick Start Presets",
    presetPlaceholder: "Select a preset...",
    iface_bash: "Basic Bash Loop",
    iface_tui: "Ralph TUI (Terminal UI)",
    tool_manual: "Manual / Template",
    tool_antigravity: "Google Antigravity / IDX",
    tool_llm: "LLM CLI (simonw/llm)",
    tool_gcloud: "Gemini CLI (@google/gemini-cli)",
    tool_ollama: "Ollama (Local)",
    tool_claude: "Claude CLI (@anthropic-ai/claude-code)",
    tool_openai: "OpenAI CLI (Python)",
    group_google: "Google Gemini",
    group_anthropic: "Anthropic Claude",
    group_openai: "OpenAI",
    group_deepseek: "DeepSeek / Open Source",
    lbl_code: "Code",
    tip_download: "Download",
    tip_copy: "Copy",
    tip_remove: "Remove",
    lbl_download_zip: "Download ZIP",
    tip_download_zip: "Download all files as ZIP",
    err_zip: "Error creating ZIP",
    diffBeginner: "Beginner",
    diffIntermediate: "Intermediate",
    diffAdvanced: "Advanced",
    diffExpert: "Expert",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    desc_nix: "Project IDX Configuration",
    desc_instructions: "Setup Instructions",
    desc_prd: "Product Requirements Document",
    desc_agents: "Agent Memory File",
    desc_progress: "Progress Log",
    desc_sys_prompt: "System Prompt",
    desc_tui: "Terminal UI Script",
    desc_sh: "Orchestration Script",
    desc_ctx_img: "Context Image",
    // Output keys
    prd_setup_title: "Project Setup",
    prd_setup_desc: "Initialize project structure for",
    prd_criteria_setup: "Project folder structure exists with all required files",
    prd_logic_title: "Core Logic Implementation",
    prd_logic_desc: "Implement the main business logic",
    prd_criteria_logic: "Core functionality works as expected",
    agents_mem_intro: "This file stores learned patterns and gotchas.",
    progress_init: "Initialized Ralph session with model",
    script_start: "Starting Ralph Loop for",
    script_all_passed: "All tasks completed!",
    script_working: "Working on task",
    script_calling: "Calling",
    script_manual_check: "Did the task pass? (y/n):",
    script_ask_success: "Task marked as complete!",
    script_complete: "Completed task",
    script_failed: "Task failed. Retrying...",
    sys_prompt_header: "You are Ralph, an AI development agent.",
    sys_prompt_project: "Project",
    sys_prompt_core_rules: "Core Rules",
    sys_prompt_fresh: "Fresh Context - Read ALL files before each task",
    sys_prompt_atomic: "Atomic Changes - Small, verifiable commits",
    sys_prompt_compound: "Compound Verification - Test thoroughly",
    sys_prompt_verification: "Manual Verification - Wait for human approval",
    sys_goal_label: "Goal",
    sys_model_label: "Model",
    sys_dev_browser: "You can use a dev browser to verify UI changes on localhost.",
    agents_lessons_title: "Lessons Learned",
    agents_lessons_hint: "Add discoveries and patterns here",
    agents_gotchas_title: "Gotchas",
    agents_gotchas_hint: "Document edge cases and issues",
    agents_init_ctx: "Initial Context",
    tui_waiting: "Press 'r' to run next task, 'q' to quit",
    tui_agent_act: "Agent Activity",
    tui_all_done: "All tasks completed!",
    tui_running: "Running task",
    tui_err_load: "Error loading prd.json",
    tui_err_json: "Invalid JSON in prd.json",
    tui_err_gen: "General error",
    tui_err_save: "Error saving prd.json",
    tui_success_save: "State saved successfully",
    tui_retry: "Retrying...",
    tui_title: "Ralph TUI",
    sh_start: "Starting Ralph TUI...",
    sh_orchestrator_for: "Ralph Orchestrator for",
    sh_optimized_for: "Optimized for",
    sh_cli_tool: "CLI Tool",
    sh_jq_req: "jq is required.",
    sh_install_it: "Please install it.",
    git_init_commit: "Initial Ralph commit",
    git_task_commit: "Complete task",
    tui_calling_agent: "Calling AI agent...",
    tui_end_session: "Agent session ended.",
    tui_you_are_ralph: "You are Ralph, an AI coding agent.",
    tui_context_label: "CONTEXT",
    tui_task_label: "TASK",
    tui_criteria_label: "CRITERIA",
    instr_generated_by: "Generated by Ralph System Generator",
    err_google_model: "Warning: Non-Google model selected for Antigravity",
    err_claude_model: "Warning: Non-Claude model selected for Claude CLI",
    err_manual_setup: "Configure your preferred CLI tool manually",
    err_antigravity_model: "Model not supported in Antigravity environment",
    err_manual_call: "Manual invocation required",
    task_analysis_title: "Analysis",
    task_analysis_desc: "Analyze project requirements",
    task_analysis_crit: "Analysis document completed",
    task_verify_title: "Verification",
    task_verify_desc: "Verify implementation",
    task_verify_crit: "All tests passing",
    task_checklist_title: "Checklist",
    task_checklist_desc: "Complete compliance checklist",
    task_checklist_crit: "All items checked",
    // Instruction keys
    instr_title: "Instructions",
    instr_sys_req_title: "System Requirements",
    instr_sys_req_body: "Bash, Git, jq, and your chosen CLI tool",
    instr_setup_title: "Setup",
    instr_setup_idx: "Already configured in Project IDX",
    instr_setup_llm_step1: "Install LLM CLI: pip install llm",
    instr_setup_llm_step2: "Install model plugin",
    instr_setup_ollama: "Install Ollama and pull your model",
    instr_setup_claude: "npm install -g @anthropic-ai/claude-code",
    instr_setup_openai: "pip install openai",
    instr_setup_gcloud: "npm install -g @google/gemini-cli",
    instr_setup_manual: "Use your preferred AI CLI tool",
    instr_keys_title: "API Keys",
    instr_keys_setup_cmd: "Configure your API key",
    instr_keys_no_req: "No API key required (local)",
    instr_keys_gcloud_cmd: "Run 'gcloud auth login'",
    instr_keys_claude: "Run 'claude' to authenticate",
    instr_keys_openai: "export OPENAI_API_KEY=your_key",
    instr_run_title: "Running",
    instr_run_step_chmod: "1. Make scripts executable",
    instr_run_step_git: "2. Initialize git repository",
    instr_run_step_start: "3. Start the loop",
    instr_workflow_title: "Workflow",
    instr_workflow_body: "Ralph will iterate through tasks, calling the AI model for each one."
  },
  [AppLanguage.IT]: {
    appTitle: "Generatore Sistema Ralph",
    subTitle: "Aggiornato per modelli 2026",
    configTitle: "Configurazione Sistema",
    projectName: "Nome Progetto",
    goal: "Obiettivo / Contesto",
    goalPlaceholder: "Descrivi cosa deve costruire Ralph...",
    goalHelp: "Fornisci requisiti dettagliati, stack tecnologico e funzionalità desiderate.",
    model: "Modello AI",
    modelHelp: "I modelli Reasoning (o1/o3/R1) sono più lenti ma scrivono codice migliore.",
    interface: "Tipo Interfaccia",
    cliTool: "Strumento CLI",
    cliToolHelp: "Seleziona lo strumento installato sulla tua macchina per guidare l'AI.",
    devBrowser: "Dev Browser",
    devBrowserHelp: "Abilita verifica visiva su localhost",
    generateBtn: "Genera Sistema Ralph",
    freshContextTitle: "Perché Contesto Fresco?",
    whyFreshContext: "Previene il deterioramento. Ogni iterazione parte pulita.",
    generatedAssets: "Asset Generati",
    filesCreated: "file creati",
    emptyStateTitle: "Pronto per l'Orchestrazione",
    emptyStateDesc: "Configura e clicca Genera",
    uiLang: "Lingua UI",
    outputLang: "Lingua Codice",
    placeholder_project: "es. MioProgetto",
    uploadLabel: "Carica File Contesto",
    uploadHelp: "File testo o immagini per contesto iniziale",
    filesAttached: "file allegati",
    presetsTitle: "Preset Rapidi",
    presetPlaceholder: "Seleziona un preset...",
    iface_bash: "Loop Bash Base",
    iface_tui: "Ralph TUI (Interfaccia Terminale)",
    tool_manual: "Manuale / Template",
    tool_antigravity: "Google Antigravity / IDX",
    tool_llm: "LLM CLI (simonw/llm)",
    tool_gcloud: "Gemini CLI (@google/gemini-cli)",
    tool_ollama: "Ollama (Locale)",
    tool_claude: "Claude CLI (@anthropic-ai/claude-code)",
    tool_openai: "OpenAI CLI (Python)",
    group_google: "Google Gemini",
    group_anthropic: "Anthropic Claude",
    group_openai: "OpenAI",
    group_deepseek: "DeepSeek / Open Source",
    lbl_code: "Codice",
    tip_download: "Scarica",
    tip_copy: "Copia",
    tip_remove: "Rimuovi",
    lbl_download_zip: "Scarica ZIP",
    tip_download_zip: "Scarica tutti i file come ZIP",
    err_zip: "Errore creazione ZIP",
    diffBeginner: "Principiante",
    diffIntermediate: "Intermedio",
    diffAdvanced: "Avanzato",
    diffExpert: "Esperto",
    themeLabel: "Tema",
    themeLight: "Chiaro",
    themeDark: "Scuro",
    desc_nix: "Configurazione Project IDX",
    desc_instructions: "Istruzioni di Setup",
    desc_prd: "Documento Requisiti Prodotto",
    desc_agents: "File Memoria Agente",
    desc_progress: "Log Progressi",
    desc_sys_prompt: "Prompt di Sistema",
    desc_tui: "Script Interfaccia Terminale",
    desc_sh: "Script Orchestrazione",
    desc_ctx_img: "Immagine Contesto",
    prd_setup_title: "Setup Progetto",
    prd_setup_desc: "Inizializza la struttura per",
    prd_criteria_setup: "Struttura cartelle esistente con tutti i file",
    prd_logic_title: "Implementazione Logica Core",
    prd_logic_desc: "Implementa la logica business principale",
    prd_criteria_logic: "Funzionalità core funziona come atteso",
    agents_mem_intro: "Questo file memorizza pattern e problemi risolti.",
    progress_init: "Sessione Ralph inizializzata con modello",
    script_start: "Avvio Ralph Loop per",
    script_all_passed: "Tutti i task completati!",
    script_working: "Lavorando su task",
    script_calling: "Chiamando",
    script_manual_check: "Il task è passato? (y/n):",
    script_ask_success: "Task marcato come completato!",
    script_complete: "Task completato",
    script_failed: "Task fallito. Riprovo...",
    sys_prompt_header: "Sei Ralph, un agente AI di sviluppo.",
    sys_prompt_project: "Progetto",
    sys_prompt_core_rules: "Regole Core",
    sys_prompt_fresh: "Contesto Fresco - Leggi TUTTI i file prima di ogni task",
    sys_prompt_atomic: "Cambiamenti Atomici - Commit piccoli e verificabili",
    sys_prompt_compound: "Verifica Composta - Testa approfonditamente",
    sys_prompt_verification: "Verifica Manuale - Attendi approvazione umana",
    sys_goal_label: "Obiettivo",
    sys_model_label: "Modello",
    sys_dev_browser: "Puoi usare un dev browser per verificare cambiamenti UI su localhost.",
    agents_lessons_title: "Lezioni Apprese",
    agents_lessons_hint: "Aggiungi scoperte e pattern qui",
    agents_gotchas_title: "Problemi Noti",
    agents_gotchas_hint: "Documenta casi limite e problemi",
    agents_init_ctx: "Contesto Iniziale",
    tui_waiting: "Premi 'r' per eseguire il prossimo task, 'q' per uscire",
    tui_agent_act: "Attività Agente",
    tui_all_done: "Tutti i task completati!",
    tui_running: "Eseguendo task",
    tui_err_load: "Errore caricamento prd.json",
    tui_err_json: "JSON non valido in prd.json",
    tui_err_gen: "Errore generico",
    tui_err_save: "Errore salvataggio prd.json",
    tui_success_save: "Stato salvato con successo",
    tui_retry: "Riprovo...",
    tui_title: "Ralph TUI",
    sh_start: "Avvio Ralph TUI...",
    sh_orchestrator_for: "Ralph Orchestrator per",
    sh_optimized_for: "Ottimizzato per",
    sh_cli_tool: "Strumento CLI",
    sh_jq_req: "jq è richiesto.",
    sh_install_it: "Per favore installalo.",
    git_init_commit: "Commit iniziale Ralph",
    git_task_commit: "Completa task",
    tui_calling_agent: "Chiamando agente AI...",
    tui_end_session: "Sessione agente terminata.",
    tui_you_are_ralph: "Sei Ralph, un agente AI di coding.",
    tui_context_label: "CONTESTO",
    tui_task_label: "TASK",
    tui_criteria_label: "CRITERI",
    instr_generated_by: "Generato da Ralph System Generator",
    err_google_model: "Attenzione: Modello non-Google selezionato per Antigravity",
    err_claude_model: "Attenzione: Modello non-Claude selezionato per Claude CLI",
    err_manual_setup: "Configura manualmente il tuo strumento CLI preferito",
    err_antigravity_model: "Modello non supportato in ambiente Antigravity",
    err_manual_call: "Invocazione manuale richiesta",
    task_analysis_title: "Analisi",
    task_analysis_desc: "Analizza i requisiti del progetto",
    task_analysis_crit: "Documento di analisi completato",
    task_verify_title: "Verifica",
    task_verify_desc: "Verifica implementazione",
    task_verify_crit: "Tutti i test passati",
    task_checklist_title: "Checklist",
    task_checklist_desc: "Completa checklist conformità",
    task_checklist_crit: "Tutti gli elementi verificati",
    instr_title: "Istruzioni",
    instr_sys_req_title: "Requisiti di Sistema",
    instr_sys_req_body: "Bash, Git, jq, e il tuo strumento CLI scelto",
    instr_setup_title: "Setup",
    instr_setup_idx: "Già configurato in Project IDX",
    instr_setup_llm_step1: "Installa LLM CLI: pip install llm",
    instr_setup_llm_step2: "Installa plugin modello",
    instr_setup_ollama: "Installa Ollama e scarica il tuo modello",
    instr_setup_claude: "npm install -g @anthropic-ai/claude-code",
    instr_setup_openai: "pip install openai",
    instr_setup_gcloud: "npm install -g @google/gemini-cli",
    instr_setup_manual: "Usa il tuo strumento AI CLI preferito",
    instr_keys_title: "Chiavi API",
    instr_keys_setup_cmd: "Configura la tua chiave API",
    instr_keys_no_req: "Nessuna chiave API richiesta (locale)",
    instr_keys_gcloud_cmd: "Esegui 'gcloud auth login'",
    instr_keys_claude: "Esegui 'claude' per autenticarti",
    instr_keys_openai: "export OPENAI_API_KEY=your_key",
    instr_run_title: "Esecuzione",
    instr_run_step_chmod: "1. Rendi eseguibili gli script",
    instr_run_step_git: "2. Inizializza repository git",
    instr_run_step_start: "3. Avvia il loop",
    instr_workflow_title: "Workflow",
    instr_workflow_body: "Ralph itererà attraverso i task, chiamando il modello AI per ognuno."
  },
  [AppLanguage.ES]: {},
  [AppLanguage.FR]: {},
  [AppLanguage.DE]: {},
  [AppLanguage.PT]: {},
  [AppLanguage.ZH]: {},
  [AppLanguage.JA]: {}
};

// Fill missing languages with English fallback
[AppLanguage.ES, AppLanguage.FR, AppLanguage.DE, AppLanguage.PT, AppLanguage.ZH, AppLanguage.JA].forEach(lang => {
  uiDict[lang] = { ...uiDict[AppLanguage.EN] };
});

export const getUiText = (lang: AppLanguage, key: TranslationKey): string =>
  uiDict[lang]?.[key] || uiDict[AppLanguage.EN]?.[key] || key;

export const getOutputText = (lang: AppLanguage, key: OutputKey): string =>
  uiDict[lang]?.[key] || uiDict[AppLanguage.EN]?.[key] || key;

export const getInstructionText = (lang: AppLanguage, key: InstructionKey): string =>
  uiDict[lang]?.[key] || uiDict[AppLanguage.EN]?.[key] || key;

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
