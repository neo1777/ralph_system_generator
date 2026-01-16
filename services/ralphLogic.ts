import { RalphConfig, AiModel, InterfaceType, GeneratedFile, CliTool, AppLanguage } from '../types';
import { getOutputText, getInstructionText, InstructionKey, getUiText } from './i18n';

// Helper to determine Model Family properties
const getModelDetails = (model: AiModel, tool: CliTool, lang: AppLanguage) => {
  const isReasoning = model.includes('o1') || model.includes('o3') || model.includes('R1') || model.includes('Reasoning');
  const isGoogle = model.includes('Google');

  let modelId = "";
  let cliCommand = "";
  let commentWarning = false;
  let interactive = false;

  switch (model) {
    case AiModel.GOOGLE_GEMINI_3_PRO: modelId = "gemini-3.0-pro-001"; break;
    case AiModel.GOOGLE_GEMINI_3_FLASH: modelId = "gemini-3.0-flash-001"; break;
    case AiModel.GOOGLE_GEMINI_3_DEEP_THINK: modelId = "gemini-3.0-deep-think-001"; break;
    case AiModel.CLAUDE_OPUS_4_5: modelId = "claude-opus-4.5-20251124"; break;
    case AiModel.CLAUDE_SONNET_4_5: modelId = "claude-sonnet-4.5-20250929"; break;
    case AiModel.CLAUDE_HAIKU_4_5: modelId = "claude-haiku-4.5-20251015"; break;
    case AiModel.OPENAI_GPT_5_5: modelId = "gpt-5.5-turbo"; break;
    case AiModel.OPENAI_GPT_5_2: modelId = "gpt-5.2-turbo"; break;
    case AiModel.OPENAI_O3: modelId = "o3-2025-12"; break;
    case AiModel.DEEPSEEK_V3_2: modelId = "deepseek-v3.2"; break;
    case AiModel.DEEPSEEK_V3_2_SPECIALE: modelId = "deepseek-v3.2-speciale"; break;
    case AiModel.LLAMA_4_SCOUT: modelId = "llama-4-scout-109b"; break;
    case AiModel.LLAMA_4_MAVERICK: modelId = "llama-4-maverick-400b"; break;
    default: modelId = (model as string).toLowerCase().replace(/ /g, "-");
  }

  switch (tool) {
    case CliTool.ANTIGRAVITY:
      if (isGoogle) {
        cliCommand = "gcloud genai run --model=\"" + modelId + "\" < input_prompt.txt";
      } else {
        cliCommand = "# " + getOutputText(lang, 'err_antigravity_model') + "\n  # Command: llm -m " + modelId + " < input_prompt.txt";
        commentWarning = true;
      }
      break;
    case CliTool.LLM_CLI:
      cliCommand = "llm -m " + modelId + " < input_prompt.txt";
      break;
    case CliTool.GCLOUD:
      if (isGoogle) {
        cliCommand = "cat input_prompt.txt | gemini";
      } else {
        cliCommand = "# " + getOutputText(lang, 'err_google_model');
        commentWarning = true;
      }
      break;
    case CliTool.OLLAMA:
      cliCommand = "ollama run " + modelId + " \"$(cat input_prompt.txt)\"";
      break;
    case CliTool.CLAUDE_CLI:
      if (model.includes('Claude')) {
        cliCommand = "cat input_prompt.txt | claude";
        interactive = true;
      } else {
        cliCommand = "# " + getOutputText(lang, 'err_claude_model');
        commentWarning = true;
      }
      break;
    case CliTool.OPENAI_CLI:
      cliCommand = "openai api chat.completions.create -m " + modelId + " -g user \"$(cat input_prompt.txt)\"";
      break;
    case CliTool.MANUAL:
    default:
      cliCommand = "# " + getOutputText(lang, 'err_manual_call') + "\n  # Command: <your-tool> run " + modelId + " < input_prompt.txt";
      commentWarning = true;
      break;
  }

  return { isReasoning, cliCommand, modelId, commentWarning, isGoogle, interactive };
};

const generateInstructionsFile = (config: RalphConfig, modelId: string): string => {
  const { cliTool, interfaceType, model } = config;
  const lang = config.outputLanguage;
  const t = (key: InstructionKey) => getInstructionText(lang, key);
  let installSteps = "";
  let keySetup = "";
  let runCommand = interfaceType === InterfaceType.TUI ? "python3 ralph_tui.py" : "./run_ralph.sh";

  switch (cliTool) {
    case CliTool.ANTIGRAVITY:
      installSteps = "### " + getUiText(lang, 'tool_antigravity') + "\n" + t('instr_setup_idx');
      keySetup = t('instr_keys_gcloud_cmd');
      break;
    case CliTool.LLM_CLI:
      installSteps = "### " + getUiText(lang, 'tool_llm') + "\n1. Install LLM CLI:\n   pip install llm\n2. Install Plugins:\n   llm install llm-gemini llm-anthropic";
      keySetup = "### " + t('instr_keys_title') + "\nRun `llm keys set openai` (or equivalent) to setup keys.";
      break;
    case CliTool.OLLAMA:
      installSteps = "### " + getUiText(lang, 'tool_ollama') + "\n" + t('instr_setup_ollama').replace('{modelId}', modelId);
      keySetup = t('instr_keys_no_req');
      break;
    case CliTool.CLAUDE_CLI:
      installSteps = "### " + getUiText(lang, 'tool_claude') + "\n1. Install Claude Code CLI:\n   npm install -g @anthropic-ai/claude-code\n2. Authenticate:\n   claude";
      keySetup = "### " + t('instr_keys_title') + "\nAuthentication is handled via browser login.";
      break;
    case CliTool.OPENAI_CLI:
      installSteps = "### " + getUiText(lang, 'tool_openai') + "\n1. Install Codex CLI:\n   npm install -g @openai/codex";
      keySetup = "### " + t('instr_keys_title') + "\nRun `codex login` to authenticate.";
      break;
    case CliTool.GCLOUD:
      installSteps = "### " + getUiText(lang, 'tool_gcloud') + "\n1. Install Gemini CLI:\n   npm install -g @google/gemini-cli\n2. Authenticate:\n   gemini";
      keySetup = "### " + t('instr_keys_title') + "\nAuthentication via Google account on first run.";
      break;
    case CliTool.MANUAL:
    default:
      installSteps = "### " + getUiText(lang, 'tool_manual') + "\n" + t('instr_setup_manual');
      keySetup = getOutputText(lang, 'err_manual_setup');
  }

  return "# " + t('instr_title') + ": " + config.projectName + "\n\n## " + t('instr_sys_req_title') + "\n" + t('instr_sys_req_body') + "\n\n## " + t('instr_setup_title') + "\n\n" + installSteps + "\n\n" + keySetup + "\n\n## " + t('instr_run_title') + "\n\n" + t('instr_run_step_chmod') + "\n```bash\nchmod +x run_ralph.sh\n```\n\n" + t('instr_run_step_git') + "\n```bash\ngit init\ngit add .\ngit commit -m \"" + getOutputText(lang, 'git_init_commit') + "\"\n```\n\n" + t('instr_run_step_start') + "\n```bash\n" + runCommand + "\n```\n\n## " + t('instr_workflow_title') + "\n" + t('instr_workflow_body').replace('{modelId}', modelId) + "\n\n---\n*" + getOutputText(lang, 'instr_generated_by') + "*\n";
};

const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const b64 = arr[1].replace(/\s/g, '');
  const bstr = atob(b64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const generateRalphSystem = (config: RalphConfig): GeneratedFile[] => {
  const files: GeneratedFile[] = [];
  const lang = config.outputLanguage;
  const { cliCommand, modelId, commentWarning, interactive } = getModelDetails(config.model, config.cliTool, lang);
  const uiLang = config.uiLanguage;

  const tOut = (key: any) => getOutputText(lang, key);
  const tUi = (key: any) => getUiText(uiLang, key);

  // 0. SPECIAL: Antigravity/IDX Configuration
  if (config.cliTool === CliTool.ANTIGRAVITY) {
    files.push({
      filename: '.idx/dev.nix',
      language: 'nix',
      content: "# Google Antigravity / Project IDX Configuration\n{ pkgs, ... }: {\n  channel = \"stable-23.11\";\n  packages = [\n    pkgs.jq\n    pkgs.google-cloud-sdk\n    pkgs.python3\n" + (config.interfaceType === InterfaceType.TUI ? "    pkgs.ncurses\n" : "") + "  ];\n  env = {\n    RALPH_PROJECT = \"" + config.projectName + "\";\n  };\n  idx = {\n    extensions = [];\n    workspace = {\n      onCreate = {\n        init-ralph = \"chmod +x run_ralph.sh\";\n      };\n    };\n  };\n}",
      description: tUi('desc_nix')
    });
  }

  // 1. INSTRUCTIONS.md
  files.push({
    filename: 'INSTRUCTIONS.md',
    language: 'markdown',
    content: generateInstructionsFile(config, modelId),
    description: tUi('desc_instructions')
  });

  // 2. prd.json
  const prdItems = [
    { id: 1, title: tOut('prd_setup_title'), description: tOut('prd_setup_desc') + " '" + config.projectName + "'.", acceptance_criteria: tOut('prd_criteria_setup'), passes: false },
    { id: 2, title: tOut('prd_logic_title'), description: tOut('prd_logic_desc') + ": " + config.goal.substring(0, 80) + "...", acceptance_criteria: tOut('prd_criteria_logic'), passes: false }
  ];
  files.push({
    filename: 'prd.json',
    language: 'json',
    content: JSON.stringify(prdItems, null, 2),
    description: tUi('desc_prd')
  });

  // 3. Process Context Files
  let contextFileAppend = "";
  config.contextFiles.filter(f => !f.isImage).forEach(f => {
    contextFileAppend += "\n\n--- FILE: " + f.name + " ---\n" + f.content + "\n--- END FILE ---\n";
  });
  config.contextFiles.filter(f => f.isImage).forEach(f => {
    const cleanName = f.name.replace(/\s+/g, '_');
    contextFileAppend += "\n\n![Reference Image](assets/" + cleanName + ")\n*See 'assets/" + cleanName + "' for visual context.*";
    files.push({
      filename: "assets/" + cleanName,
      language: 'binary',
      content: "[Binary Image Data: " + f.name + "]",
      binaryData: dataURLToBlob(f.content),
      description: tUi('desc_ctx_img') + ": " + f.name
    });
  });

  // 4. agents.md
  files.push({
    filename: 'agents.md',
    language: 'markdown',
    content: "# " + config.projectName + " - Agents Memory\n" + tOut('sys_model_label') + ": " + config.model + "\n" + tOut('sys_goal_label') + ": " + config.goal + "\n" + tOut('agents_mem_intro') + "\n\n## " + tOut('agents_init_ctx') + "\n" + contextFileAppend + "\n" + (config.includeDevBrowser ? "\n> " + tOut('sys_dev_browser') + "\n" : "") + "\n## " + tOut('agents_lessons_title') + "\n<!-- " + tOut('agents_lessons_hint') + " -->\n- \n\n## " + tOut('agents_gotchas_title') + "\n<!-- " + tOut('agents_gotchas_hint') + " -->\n- \n",
    description: tUi('desc_agents')
  });

  // 5. progress.txt
  files.push({
    filename: 'progress.txt',
    language: 'text',
    content: "Iter 0: " + tOut('progress_init') + " " + modelId + ".",
    description: tUi('desc_progress')
  });

  // 6. System Prompt
  const devBrowserInstruction = config.includeDevBrowser ? "\n" + tOut('sys_dev_browser') : "";
  const systemInstructions = tOut('sys_prompt_header') + "\n" + tOut('sys_prompt_project') + ": " + config.projectName + "\n" + tOut('sys_goal_label') + ": " + config.goal + "\n" + tOut('sys_model_label') + ": " + config.model + " (" + modelId + ")\n" + tOut('sys_prompt_core_rules') + ":\n1. \"" + tOut('sys_prompt_fresh') + "\"\n2. \"" + tOut('sys_prompt_atomic') + "\"\n3. \"" + tOut('sys_prompt_compound') + "\"\n4. \"" + tOut('sys_prompt_verification') + "\"\n" + devBrowserInstruction + "\n";
  files.push({
    filename: 'system_instruction.txt',
    language: 'text',
    content: systemInstructions,
    description: tUi('desc_sys_prompt')
  });

  // 7. Orchestration (BASH or TUI)
  if (config.interfaceType === InterfaceType.TUI) {
    const tuiScript = "import curses\nimport json\nimport time\nimport os\nimport sys\nimport subprocess\n\ndef load_prd():\n    if not os.path.exists('prd.json'):\n        return None, \"" + tOut('tui_err_load') + "\"\n    try:\n        with open('prd.json', 'r') as f:\n            return json.load(f), \"\"\n    except json.JSONDecodeError:\n        return None, \"" + tOut('tui_err_json') + "\"\n    except Exception as e:\n        return None, f\"" + tOut('tui_err_gen') + ": {str(e)}\"\n\ndef save_prd(data):\n    try:\n        with open('prd.json', 'w') as f:\n            json.dump(data, f, indent=2)\n        return True, \"" + tOut('tui_success_save') + "\"\n    except Exception as e:\n        return False, f\"" + tOut('tui_err_save') + ": {str(e)}\"\n\ndef main(stdscr):\n    curses.start_color()\n    curses.use_default_colors()\n    try:\n        curses.init_pair(1, curses.COLOR_WHITE, curses.COLOR_BLUE)\n        curses.init_pair(2, curses.COLOR_GREEN, -1)\n        curses.init_pair(3, curses.COLOR_RED, -1)\n        curses.init_pair(4, curses.COLOR_CYAN, -1)\n    except:\n        pass\n\n    status_msg = \"" + tOut('tui_waiting') + "\"\n    status_type = 4\n\n    while True:\n        stdscr.clear()\n        h, w = stdscr.getmaxyx()\n        title = \" " + tOut('tui_title') + " - " + config.projectName + " \"\n        try:\n            stdscr.attron(curses.color_pair(1))\n            stdscr.addstr(0, 0, title + ' ' * (w - len(title)))\n            stdscr.attroff(curses.color_pair(1))\n        except curses.error:\n            pass\n\n        prd, load_err = load_prd()\n        row = 2\n        if prd is None:\n            stdscr.addstr(row, 2, load_err, curses.color_pair(3))\n            stdscr.refresh()\n            time.sleep(2)\n            break\n\n        for task in prd:\n            if row >= h - 4: break\n            is_pass = task.get('passes', False)\n            symbol = '[x]' if is_pass else '[ ]'\n            color = curses.color_pair(2) if is_pass else curses.A_NORMAL\n            line = f\"{symbol} {task.get('id', '?')}: {task.get('title', 'Unknown')}\"\n            stdscr.addstr(row, 2, line[:w-4], color)\n            row += 1\n\n        stdscr.addstr(row + 1, 2, '--- " + tOut('tui_agent_act') + " (" + modelId + ") ---')\n        stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(status_type))\n        stdscr.refresh()\n\n        key = stdscr.getch()\n        if key == ord('q'): break\n        elif key == ord('r'):\n            next_task = next((t for t in prd if not t.get('passes')), None)\n            if next_task is None:\n                status_msg = '" + tOut('tui_all_done') + "'\n                status_type = 2\n                continue\n\n            status_msg = f'" + tOut('tui_running') + " {next_task.get(\"id\")}...'\n            stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(4))\n            stdscr.refresh()\n\n            with open('input_prompt.txt', 'w') as f:\n                if os.path.exists('system_instruction.txt'):\n                    with open('system_instruction.txt', 'r') as sy: f.write(sy.read() + '\\n\\n')\n                f.write(f'" + tOut('tui_context_label') + ": ')\n                if os.path.exists('agents.md'):\n                    with open('agents.md', 'r') as m: f.write(m.read())\n                f.write(f'\\n" + tOut('tui_task_label') + ": {next_task.get(\"description\", \"\")}\\n" + tOut('tui_criteria_label') + ": {next_task.get(\"acceptance_criteria\", \"\")}')\n\n            try:\n                cmd = \"\"\"" + cliCommand + "\"\"\"\n                stdscr.endwin()\n                print('\\n" + tOut('tui_calling_agent') + "')\n                subprocess.run(cmd, shell=True)\n                result = input('\\n" + tOut('script_manual_check') + " ')\n                stdscr = curses.initscr()\n\n                if result.lower() == 'y':\n                    next_task['passes'] = True\n                    subprocess.run(['git', 'add', '.'], check=False)\n                    subprocess.run(['git', 'commit', '-m', f'" + tOut('git_task_commit') + " {next_task.get(\"id\")}'], check=False)\n                    status_msg = '" + tOut('tui_success_save') + "'\n                    status_type = 2\n                else:\n                    status_msg = '" + tOut('script_failed') + "'\n                    status_type = 3\n            except Exception as e:\n                stdscr = curses.initscr()\n                status_msg = f'Error: {str(e)}'\n                status_type = 3\n            save_prd(prd)\n\nif __name__ == '__main__':\n    curses.wrapper(main)\n";

    files.push({ filename: 'ralph_tui.py', language: 'python', content: tuiScript, description: tUi('desc_tui') });
    files.push({
      filename: 'run_ralph.sh',
      language: 'bash',
      content: "#!/bin/bash\n# Launcher for Ralph TUI\necho \"" + tOut('sh_start') + "\"\npython3 ralph_tui.py\n",
      description: tUi('desc_sh')
    });

  } else {
    // BASH MODE
    let executionBlock = "";
    if (commentWarning) {
      executionBlock = "  # 3. Call the Agent (Placeholder)\n  echo \">> " + tOut('script_calling') + " " + config.model + "...\"\n  " + cliCommand + "\n  # OUTPUT=\"... simulated output ...\"";
    } else {
      if (interactive) {
        executionBlock = "  # 3. Call the Agent (REAL EXECUTION - Interactive)\n  echo \">> " + tOut('script_calling') + " " + config.model + "...\"\n  " + cliCommand + "\n";
      } else {
        executionBlock = "  # 3. Call the Agent (REAL EXECUTION)\n  echo \">> " + tOut('script_calling') + " " + config.model + "...\"\n  OUTPUT=$(" + cliCommand + ")\n  echo \"$OUTPUT\"";
      }
    }

    const bashScript = "#!/bin/bash\n# " + tOut('sh_orchestrator_for') + " " + config.projectName + "\n# " + tOut('sh_optimized_for') + ": " + config.model + "\n# " + tOut('sh_cli_tool') + ": " + config.cliTool + "\n\nPRD_FILE=\"prd.json\"\nMEMORY_FILE=\"agents.md\"\nPROGRESS_FILE=\"progress.txt\"\n\nif ! command -v jq &> /dev/null; then\n    echo \"" + tOut('sh_jq_req') + " " + (config.cliTool === CliTool.ANTIGRAVITY ? 'Add to dev.nix' : tOut('sh_install_it')) + "\"\n    exit 1\nfi\n\necho \"" + tOut('script_start') + " " + config.projectName + "...\"\n\nwhile true; do\n  TASK_ID=$(jq -r 'map(select(.passes == false)) | .[0].id' $PRD_FILE)\n  if [ \"$TASK_ID\" == \"null\" ]; then\n    echo \"✅ " + tOut('script_all_passed') + "\"\n    break\n  fi\n\n  TASK_DESC=$(jq -r \"map(select(.id == $TASK_ID)) | .[0].description\" $PRD_FILE)\n  CRITERIA=$(jq -r \"map(select(.id == $TASK_ID)) | .[0].acceptance_criteria\" $PRD_FILE)\n\n  echo \"---------------------------------------------------\"\n  echo \"🤖 " + tOut('script_working') + " #$TASK_ID\"\n  echo \"---------------------------------------------------\"\n\ncat system_instruction.txt > input_prompt.txt\necho \"\" >> input_prompt.txt\ncat <<EOF >> input_prompt.txt\nCONTEXT: $(cat $MEMORY_FILE)\nTASK: $TASK_DESC\nCRITERIA: $CRITERIA\nEOF\n\n" + executionBlock + "\n\n  read -p \"" + tOut('script_manual_check') + " \" RESULT\n\n  if [ \"$RESULT\" == \"y\" ]; then\n    echo \"✨ " + tOut('script_ask_success') + "\"\n    git add .\n    git commit -m \"" + tOut('git_task_commit') + " $TASK_ID\"\n    tmp=$(mktemp)\n    jq \"map(if .id == $TASK_ID then .passes = true else . end)\" $PRD_FILE > \"$tmp\" && mv \"$tmp\" $PRD_FILE\n    echo \"Iter $(date): " + tOut('script_complete') + " $TASK_ID\" >> $PROGRESS_FILE\n  else\n    echo \"❌ " + tOut('script_failed') + "\"\n    echo \"Iter $(date): Failed Task $TASK_ID\" >> $PROGRESS_FILE\n  fi\n  sleep 2\ndone\n";

    files.push({ filename: 'run_ralph.sh', language: 'bash', content: bashScript, description: tUi('desc_sh') });
  }

  return files;
};
