import { RalphConfig, AiModel, InterfaceType, GeneratedFile, CliTool, AppLanguage, CostEstimate } from '../types';
import { getOutputText, getInstructionText, InstructionKey, getUiText } from './i18n';
import { modelPricing } from './CostEstimator';
import { generatePayload } from './PayloadGenerator';

export const getEstimatedCost = (model: AiModel): CostEstimate => {
  return modelPricing[model] || { inputPer1M: 0, outputPer1M: 0, currency: 'USD' };
};

// Helper to determine Model Family properties
const getModelDetails = (model: AiModel, tool: CliTool, lang: AppLanguage) => {
  const isReasoning = model.includes('o1') || model.includes('o3') || model.includes('R1') || model.includes('Reasoning');
  const isGoogle = model.includes('Google');

  let modelId = "";
  let cliCommand = "";
  let commentWarning = false;
  let interactive = false;

  switch (model) {
    case AiModel.GOOGLE_GEMINI_3_PRO: modelId = "gemini-3-pro"; break;
    case AiModel.GOOGLE_GEMINI_3_FLASH: modelId = "gemini-3-flash"; break;
    case AiModel.CLAUDE_4_5_OPUS: modelId = "claude-4-5-opus"; break;
    case AiModel.CLAUDE_4_5_SONNET: modelId = "claude-sonnet-4-5"; break;
    case AiModel.CLAUDE_4_5_HAIKU: modelId = "claude-haiku-4-5"; break;
    case AiModel.OPENAI_GPT_5_2_CODEX: modelId = "gpt-5.2-codex"; break;
    case AiModel.OPENAI_GPT_5_2_PRO: modelId = "gpt-5.2-pro"; break;
    case AiModel.DEEPSEEK_V4: modelId = "deepseek-v4"; break;
    case AiModel.DEEPSEEK_V3: modelId = "deepseek-chat"; break;
    case AiModel.DEEPSEEK_R1: modelId = "deepseek-reasoner"; break;
    case AiModel.MISTRAL_3_SMALL: modelId = "mistral-small-2402"; break;
    case AiModel.MISTRAL_3_MEDIUM: modelId = "mistral-medium-2402"; break;
    case AiModel.MISTRAL_LARGE: modelId = "mistral-large-latest"; break;
    case AiModel.GROQ_LLAMA_3_70B: modelId = "llama3-70b-8192"; break;
    case AiModel.GROQ_DEEPSEEK_R1: modelId = "deepseek-r1-distill-llama-70b"; break;
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
    case CliTool.GEMINI_CLI:
      if (isGoogle) {
        cliCommand = "cat input_prompt.txt | gemini";
        interactive = true;
      } else {
        cliCommand = "# " + getOutputText(lang, 'err_google_model');
        commentWarning = true;
      }
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
      cliCommand = "cat input_prompt.txt | codex";
      interactive = true;
      break;
    case CliTool.OLLAMA:
      cliCommand = "cat input_prompt.txt | ollama run " + modelId;
      interactive = true;
      break;
    case CliTool.CURL:
      // Universal cURL Adapter using PayloadGenerator
      let apiUrl = "";
      let authHeader = "";

      if (model.includes('DeepSeek')) {
        apiUrl = "https://api.deepseek.com/chat/completions";
        authHeader = "Authorization: Bearer $DEEPSEEK_API_KEY";
      } else if (model.includes('Mistral')) {
        apiUrl = "https://api.mistral.ai/v1/chat/completions";
        authHeader = "Authorization: Bearer $MISTRAL_API_KEY";
      } else if (model.includes('Groq')) {
        apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        authHeader = "Authorization: Bearer $GROQ_API_KEY";
      } else {
        apiUrl = "http://localhost:11434/v1/chat/completions";
        authHeader = "Authorization: Bearer ollama";
      }

      let jqFilter = ".choices[0].message.content"; // Default (OpenAI/DeepSeek)

      if (model.includes('Gemini')) {
        jqFilter = ".candidates[0].content.parts[0].text";
      } else if (model.includes('Claude')) {
        jqFilter = ".content[0].text";
      }

      cliCommand = "curl " + apiUrl + " \\\n    -H \"Content-Type: application/json\" \\\n    -H \"" + authHeader + "\" \\\n    -d \"$(cat input_payload.json)\" | jq -r '" + jqFilter + "'";
      break;
    case CliTool.MANUAL:
    default:
      cliCommand = "# " + getOutputText(lang, 'err_manual_call') + "\n  # Command: <your-tool> run " + modelId + " < input_prompt.txt";
      commentWarning = true;
      break;
  }

  return { isReasoning, cliCommand, modelId, commentWarning, isGoogle, interactive };
};

const generatePromptPlan = (config: RalphConfig, modelId: string): string => {
  const { projectName } = config;
  const lang = config.outputLanguage;
  const t = (key: InstructionKey) => getInstructionText(lang, key);

  return `0a. Study \`specs/*\` to learn the application specifications.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.
0c. Study the existing source code to understand shared utilities & components.

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and compare existing source code against \`specs/*\`. Analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Ultrathink. Consider searching for TODO, minimal implementations, placeholders, skipped/flaky tests, and inconsistent patterns. Determine starting point for research and keep the plan up to date with items considered complete/incomplete.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first.

ULTIMATE GOAL: We want to achieve ${config.goal}. Consider missing elements and plan accordingly. If an element is missing, search first to confirm it doesn't exist, then if needed author the specification at specs/FILENAME.md.
`;
};

const generatePromptBuild = (config: RalphConfig, modelId: string): string => {
  const { projectName } = config;
  const lang = config.outputLanguage;
  const t = (key: InstructionKey) => getInstructionText(lang, key);

  return `0a. Study \`specs/*\` to learn the application specifications.
0b. Study @IMPLEMENTATION_PLAN.md.

1. Your task is to implement functionality per the specifications. Follow @IMPLEMENTATION_PLAN.md and choose the most important item to address. Before making changes, search the codebase (don't assume not implemented).
2. After implementing functionality or resolving problems, run the tests/validation defined in @AGENTS.md. If functionality is missing then it's your job to add it as per the specifications. Ultrathink.
3. When you discover issues, immediately update @IMPLEMENTATION_PLAN.md with your findings. When resolved, update and remove the item.
4. When the tests pass, update @IMPLEMENTATION_PLAN.md, then \`git add -A\` then \`git commit\` with a message describing the changes. After the commit, \`git push\`.

999. Important: When authoring documentation, capture the why — tests and implementation importance.
9999. Important: Single sources of truth. If tests unrelated to your work fail, resolve them as part of the increment.
99999. Keep @IMPLEMENTATION_PLAN.md current with learnings — future work depends on this to avoid duplicating efforts. Update especially after finishing your turn.
999999. When you learn something new about how to run the application, update @AGENTS.md but keep it brief.
9999999. For any bugs you notice, resolve them or document them in @IMPLEMENTATION_PLAN.md even if it is unrelated to the current piece of work.
99999999. Implement functionality completely. Placeholders and stubs waste efforts and time redoing the same work.
999999999. When @IMPLEMENTATION_PLAN.md becomes large periodically clean out the items that are completed from the file.
9999999999. IMPORTANT: Keep @AGENTS.md operational only — status updates and progress notes belong in \`IMPLEMENTATION_PLAN.md\`.
`;
};

const generateAgentsFile = (config: RalphConfig, modelId: string): string => {
  const lang = config.outputLanguage;
  const t = (key: InstructionKey) => getInstructionText(lang, key);

  return `## Build & Run

1. Setup: \`npm install\` (or equivalent)
2. Run: \`./run_ralph.sh\`

## Validation

Run these after implementing to get immediate feedback:

- Tests: \`npm test\`
- Typecheck: \`npx tsc --noEmit\`
- Security: \`grep -r "API_KEY" .\`

## Operational Notes
- Primary Agent: ${config.model} (${modelId})
- Project: ${config.projectName}
- Logic generated by Ralph System Generator.
`;
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
      keySetup = t('instr_keys_gemini');
      break;
    case CliTool.GEMINI_CLI:
      installSteps = "### " + getUiText(lang, 'tool_gemini') + "\n" + t('instr_setup_gemini_step1') + "\n" + t('instr_setup_gemini_step2');
      keySetup = "### " + t('instr_keys_title') + "\n" + t('instr_keys_gemini');
      break;
    case CliTool.OLLAMA:
      installSteps = "### " + getUiText(lang, 'tool_ollama') + "\n" + t('instr_setup_ollama').replace('{modelId}', modelId);
      keySetup = t('instr_keys_no_req');
      break;
    case CliTool.CLAUDE_CLI:
      installSteps = "### " + getUiText(lang, 'tool_claude') + "\n" + t('instr_setup_claude') + "\n2. Authenticate:\n   claude";
      keySetup = "### " + t('instr_keys_title') + "\n" + t('instr_keys_claude');
      break;
    case CliTool.OPENAI_CLI:
      installSteps = "### " + getUiText(lang, 'tool_openai') + "\n1. Install Official OpenAI Codex CLI:\n   npm install -g @openai/codex\n2. Run:\n   codex";
      keySetup = "### " + t('instr_keys_title') + "\n" + t('instr_keys_openai');
      break;
    case CliTool.CURL:
      installSteps = "### " + getUiText(lang, 'tool_curl') + "\n" + t('instr_setup_curl');
      keySetup = "### " + t('instr_keys_title') + "\n- DeepSeek: \`export DEEPSEEK_API_KEY=key\`\n- Mistral: \`export MISTRAL_API_KEY=key\`\n- Groq: \`export GROQ_API_KEY=key\`\n\n*(Set only the one you are using)*";
      break;
    case CliTool.MANUAL:
    default:
      installSteps = "### " + getUiText(lang, 'tool_manual') + "\n" + t('instr_setup_manual');
      keySetup = getOutputText(lang, 'err_manual_setup');
  }

  return "# " + t('instr_title') + ": " + config.projectName + "\n\n## " + t('instr_sys_req_title') + "\n" + t('instr_sys_req_body') + "\n\n## " + t('instr_setup_title') + "\n\n" + installSteps + "\n\n" + keySetup + "\n\n## " + t('instr_run_title') + "\n\n" + t('instr_run_step_chmod') + "\n\`\`\`bash\nchmod +x run_ralph.sh\n\`\`\`\n\n" + t('instr_run_step_git') + "\n\`\`\`bash\ngit init\ngit add .\ngit commit -m \"" + getOutputText(lang, 'git_init_commit') + "\"\n\`\`\`\n\n" + t('instr_run_step_start') + "\n\`\`\`bash\n" + runCommand + "\n\`\`\`\n\n## " + t('instr_workflow_title') + "\n" + t('instr_workflow_body').replace('{modelId}', modelId) + "\n\n---\n*" + getOutputText(lang, 'instr_generated_by') + "*\n";
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
  const costEst = getEstimatedCost(config.model);

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

  // 1.5 COSTS.md (New)
  files.push({
    filename: 'COSTS.md',
    language: 'markdown',
    content: "# " + tUi('out_cost_file_desc') + "\n\n" +
      "**" + getUiText(uiLang, 'sys_model_label') + "**: " + config.model + "\n\n" +
      "| Metric | Cost (Est.) |\n" +
      "| :--- | :--- |\n" +
      "| **Input (1M Tokens)** | $" + costEst.inputPer1M.toFixed(3) + " " + costEst.currency + " |\n" +
      "| **Output (1M Tokens)** | $" + costEst.outputPer1M.toFixed(3) + " " + costEst.currency + " |\n\n" +
      "> **Note**: These are estimates based on public pricing as of Jan 2026. Actual costs may vary based on caching, enterprise rates, or provider updates.\n",
    description: tUi('lbl_cost_est')
  });

  // 2. prd.json
  const prdItems = [
    { id: 1, title: tOut('prd_setup_title'), description: tOut('prd_setup_desc') + " '" + config.projectName + "'.", acceptance_criteria: tOut('prd_criteria_setup'), passes: false },
    { id: 2, title: tOut('prd_logic_title'), description: tOut('prd_logic_desc') + ": " + config.goal.substring(0, 80) + "...", acceptance_criteria: tOut('prd_criteria_logic'), passes: false }
  ];
  files.push({
    filename: 'prd.json',
    language: 'json',
    content: JSON.stringify({
      projectName: config.projectName,
      version: "1.0.0",
      items: prdItems
    }, null, 2),
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

  // 4. AGENTS.md (Operational Manual)
  files.push({
    filename: 'AGENTS.md',
    language: 'markdown',
    content: generateAgentsFile(config, modelId),
    description: tUi('desc_agents')
  });

  // 4.5 IMPLEMENTATION_PLAN.md (State)
  files.push({
    filename: 'IMPLEMENTATION_PLAN.md',
    language: 'markdown',
    content: "# " + config.projectName + " - Implementation Plan\n\n## Tasks\n- [ ] Initial setup and research\n",
    description: tUi('desc_impl_plan')
  });

  // 4.6 PROMPT_plan.md & PROMPT_build.md
  files.push({
    filename: 'PROMPT_plan.md',
    language: 'markdown',
    content: generatePromptPlan(config, modelId),
    description: tUi('desc_plan')
  });
  files.push({
    filename: 'PROMPT_build.md',
    language: 'markdown',
    content: generatePromptBuild(config, modelId),
    description: tUi('desc_build')
  });

  // 4.7 llm-review.ts (New evaluation scaffold)
  files.push({
    filename: 'src/lib/llm-review.ts',
    language: 'typescript',
    content: `/**
 * LLM-as-Judge Evaluation Utility
 * Use this to verify subjective criteria like UX quality, aesthetics, or tone.
 */
export interface ReviewResult {
  pass: boolean;
  feedback?: string;
}

export async function createReview(config: {
  criteria: string;
  artifact: string;
  intelligence?: 'fast' | 'smart';
}): Promise<ReviewResult> {
  console.log(\`Evaluating: \${config.criteria}\`);
  // This is a scaffold. In a real Ralph environment, 
  // this would call an LLM API to perform the evaluation.
  return { pass: true };
}
`,
    description: tUi('desc_llm_review')
  });

  // 5. progress.txt
  files.push({
    filename: 'progress.txt',
    language: 'text',
    content: "Iter 0: " + tOut('progress_init') + " " + modelId + ".",
    description: tUi('desc_progress')
  });

  // 6. System Prompt & Initial Payload
  const devBrowserInstruction = config.includeDevBrowser ? "\n" + tOut('sys_dev_browser') : "";
  const systemInstructions = tOut('sys_prompt_header') + "\n" + tOut('sys_prompt_project') + ": " + config.projectName + "\n" + tOut('sys_goal_label') + ": " + config.goal + "\n" + tOut('sys_model_label') + ": " + config.model + " (" + modelId + ")\n" + tOut('sys_prompt_core_rules') + ":\n1. \"" + tOut('sys_prompt_fresh') + "\"\n2. \"" + tOut('sys_prompt_atomic') + "\"\n3. \"" + tOut('sys_prompt_compound') + "\"\n4. \"" + tOut('sys_prompt_verification') + "\"\n" + devBrowserInstruction + "\n";
  files.push({
    filename: 'system_instruction.txt',
    language: 'text',
    content: systemInstructions,
    description: tUi('desc_sys_prompt')
  });

  // Initial Payload for Curl Adapter
  if (config.cliTool === CliTool.CURL) {
    files.push({
      filename: 'input_payload.json',
      language: 'json',
      content: generatePayload(config),
      description: 'Initial API Payload'
    });
  }

  // 7. Orchestration (BASH or TUI)
  if (config.interfaceType === InterfaceType.TUI) {
    const tuiScript = "import curses\nimport json\nimport time\nimport os\nimport sys\nimport subprocess\n\nSCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))\nPRD_FILE = os.path.join(SCRIPT_DIR, 'prd.json')\n\ndef load_prd():\n    if not os.path.exists(PRD_FILE):\n        return None, \"" + tOut('tui_err_load') + "\"\n    try:\n        with open(PRD_FILE, 'r') as f:\n            data = json.load(f)\n            # Support both root array and {items: []} structure\n            if isinstance(data, dict) and 'items' in data:\n                return data, \"\"\n            elif isinstance(data, list):\n                return {'items': data}, \"\"\n            return None, \"" + tOut('tui_err_json') + "\"\n    except json.JSONDecodeError:\n        return None, \"" + tOut('tui_err_json') + "\"\n    except Exception as e:\n        return None, f\"" + tOut('tui_err_gen') + ": {str(e)}\"\n\ndef save_prd(data):\n    try:\n        with open(PRD_FILE, 'w') as f:\n            json.dump(data, f, indent=2)\n        return True, \"" + tOut('tui_success_save') + "\"\n    except Exception as e:\n        return False, f\"" + tOut('tui_err_save') + ": {str(e)}\"\n\ndef main(stdscr):\n    curses.start_color()\n    curses.use_default_colors()\n    try:\n        curses.init_pair(1, curses.COLOR_WHITE, curses.COLOR_BLUE)\n        curses.init_pair(2, curses.COLOR_GREEN, -1)\n        curses.init_pair(3, curses.COLOR_RED, -1)\n        curses.init_pair(4, curses.COLOR_CYAN, -1)\n    except:\n        pass\n\n    status_msg = \"" + tOut('tui_waiting') + "\"\n    status_type = 4\n\n    while True:\n        stdscr.clear()\n        h, w = stdscr.getmaxyx()\n        title = \" " + tOut('tui_title') + " - " + config.projectName + " \"\n        try:\n            stdscr.attron(curses.color_pair(1))\n            stdscr.addstr(0, 0, title + ' ' * (w - len(title)))\n            stdscr.attroff(curses.color_pair(1))\n        except curses.error:\n            pass\n\n        prd_data, load_err = load_prd()\n        row = 2\n        if prd_data is None:\n            stdscr.addstr(row, 2, load_err, curses.color_pair(3))\n            stdscr.refresh()\n            time.sleep(2)\n            break\n\n        tasks = prd_data.get('items', [])\n        for task in tasks:\n            if row >= h - 4: break\n            is_pass = task.get('passes', False)\n            symbol = '[x]' if is_pass else '[ ]'\n            color = curses.color_pair(2) if is_pass else curses.A_NORMAL\n            line = f\"{symbol} {task.get('id', '?')}: {task.get('title', 'Unknown')}\"\n            stdscr.addstr(row, 2, line[:w-4], color)\n            row += 1\n\n        stdscr.addstr(row + 1, 2, '--- " + tOut('tui_agent_act') + " (" + modelId + ") ---')\n        stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(status_type))\n        stdscr.refresh()\n\n        key = stdscr.getch()\n        if key == ord('q'): break\n        elif key == ord('r'):\n            next_task = next((t for t in tasks if not t.get('passes')), None)\n            if next_task is None:\n                status_msg = '" + tOut('tui_all_done') + "'\n                status_type = 2\n                continue\n\n            status_msg = f'" + tOut('tui_running') + " {next_task.get(\"id\")}...'\n            stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(4))\n            stdscr.refresh()\n\n            with open('input_prompt.txt', 'w') as f:\n                sys_file = os.path.join(SCRIPT_DIR, 'system_instruction.txt')\n                if os.path.exists(sys_file):\n                    with open(sys_file, 'r') as sy: f.write(sy.read() + '\\n\\n')\n                f.write(f'\" + tOut('tui_context_label') + \": ')\n                mem_file = os.path.join(SCRIPT_DIR, 'agents.md')\n                if os.path.exists(mem_file):\n                    with open(mem_file, 'r') as m: f.write(m.read())\n                f.write(f'\\n\" + tOut('tui_task_label') + \": {next_task.get(\"description\", \"\")}\\n\" + tOut('tui_criteria_label') + \": {next_task.get(\"acceptance_criteria\", \"\")}')\n\n            try:\n                cmd = \"\"\"" + cliCommand + "\"\"\"\n                stdscr.endwin()\n                print('\\n\" + tOut('tui_calling_agent') + \"')\n                subprocess.run(cmd, shell=True)\n                result = input('\\n\" + tOut('script_manual_check') + \" ')\n                stdscr = curses.initscr()\n\n                if result.lower() == 'y':\n                    next_task['passes'] = True\n                    subprocess.run(['git', 'add', '.'], check=False)\n                    subprocess.run(['git', 'commit', '-m', f'\" + tOut('git_task_commit') + \" {next_task.get(\"id\")}'], check=False)\n                    status_msg = '\" + tOut('tui_success_save') + \"'\n                    status_type = 2\n                else:\n                    status_msg = '\" + tOut('script_failed') + \"'\n                    status_type = 3\n            except Exception as e:\n                stdscr = curses.initscr()\n                status_msg = f'Error: {str(e)}'\n                status_type = 3\n            save_prd(prd_data)\n\nif __name__ == '__main__':\n    curses.wrapper(main)\n";

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
        executionBlock = "  # 3. Call the Agent (REAL EXECUTION)\n  echo \">> " + tOut('script_calling') + " " + config.model + "...\"\n  if [ \"" + config.cliTool + "\" == \"" + CliTool.CURL + "\" ]; then\n    python3 \"$SCRIPT_DIR/payload_gen.py\" \"$TASK_DESC\" > input_payload.json\n  fi\n  OUTPUT=$(" + cliCommand + ")\n  echo \"$OUTPUT\"";
      }
    }

    const bashScript = "#!/bin/bash\n# " + tOut('sh_orchestrator_for') + " " + config.projectName + "\n# " + tOut('sh_optimized_for') + ": " + config.model + "\n# " + tOut('sh_cli_tool') + ": " + config.cliTool + "\n\n" +
      "SCRIPT_DIR=\"$(cd \"$(dirname \"$0\")\" && pwd)\"\n" +
      "PRD_FILE=\"$SCRIPT_DIR/prd.json\"\n" +
      "MEMORY_FILE=\"$SCRIPT_DIR/agents.md\"\n" +
      "PROGRESS_FILE=\"$SCRIPT_DIR/progress.txt\"\n" +
      "SYS_PROMPT=\"$SCRIPT_DIR/system_instruction.txt\"\n\n" +
      "if ! command -v jq &> /dev/null; then\n" +
      "    echo \"" + tOut('sh_jq_req') + " " + (config.cliTool === CliTool.ANTIGRAVITY ? 'Add to dev.nix' : tOut('sh_install_it')) + "\"\n" +
      "    exit 1\n" +
      "fi\n\n" +
      "if [ ! -f \"$PRD_FILE\" ]; then\n" +
      "    echo \"Error: $PRD_FILE not found.\"\n" +
      "    exit 1\n" +
      "fi\n\n" +
      "echo \"" + tOut('script_start') + " " + config.projectName + "...\"\n\n" +
      "# Mode selection\n" +
      "PROMPT_FILE=\"$SCRIPT_DIR/PROMPT_build.md\"\n" +
      "MODE=\"build\"\n" +
      "if [ \"$1\" == \"plan\" ]; then\n" +
      "  PROMPT_FILE=\"$SCRIPT_DIR/PROMPT_plan.md\"\n" +
      "  MODE=\"plan\"\n" +
      "  echo \"Running in PLANNING mode...\"\n" +
      "fi\n\n" +
      "while true; do\n" +
      "  echo \"---------------------------------------------------\"\n" +
      "  echo \"🤖 Running Ralph Loop...\"\n" +
      "  echo \"---------------------------------------------------\"\n\n" +
      "  # Prepare prompt\n" +
      "  cat \"$PROMPT_FILE\" > input_prompt.txt\n" +
      "  echo \"\" >> input_prompt.txt\n" +
      "  [ -f \"$MEMORY_FILE\" ] && cat \"$MEMORY_FILE\" >> input_prompt.txt\n" +
      "  [ -f \"$PRD_FILE\" ] && cat \"$PRD_FILE\" >> input_prompt.txt\n\n" +
      executionBlock + "\n\n" +
      "  if [ \"$MODE\" != \"plan\" ]; then\n" +
      "    read -p \"" + tOut('script_manual_check') + " \" RESULT\n\n" +
      "    if [ \"$RESULT\" == \"y\" ]; then\n" +
      "      git add .\n" +
      "      git commit -m \"Ralph task complete\"\n" +
      "      git push\n" +
      "    else\n" +
      "      echo \"❌ " + tOut('script_failed') + "\"\n" +
      "    fi\n" +
      "  else\n" +
      "    echo \"Plan updated. Review IMPLEMENTATION_PLAN.md\"\n" +
      "    break # Plan usually takes one pass\n" +
      "  fi\n" +
      "  sleep 2\n" +
      "done\n";


    files.push({ filename: 'run_ralph.sh', language: 'bash', content: bashScript, description: tUi('desc_sh') });
  }

  // Add Payload Gen Helper for CURL
  if (config.cliTool === CliTool.CURL) {
    const modelFamily = config.model.split(' ')[0].toLowerCase();
    const payloadGenScript = `import json
import sys
import os

def generate():
    task = sys.argv[1] if len(sys.argv) > 1 else ""
    goal = \"${config.goal.replace(/\"/g, '\\\"')}\"
    context = \"\"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    agents_file = os.path.join(script_dir, 'agents.md')
    if os.path.exists(agents_file):
        with open(agents_file, 'r') as f: context = f.read()
    
    prompt = f\"Goal: {goal}\\n\\nContext:\\n{context}\\n\\nTask: {task}\"
    
    model = \"${modelId}\"
    
    if "gemini" in model:
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 8192, "responseMimeType": "text/plain"}
        }
    elif "claude" in model:
        payload = {
            "model": model,
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}]
        }
    else:
        # OpenAI / DeepSeek / Mistral / Groq
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
    
    print(json.dumps(payload, indent=2))

if __name__ == "__main__":
    generate()
`;
    files.push({ filename: 'payload_gen.py', language: 'python', content: payloadGenScript, description: 'Helper for API Payloads' });
  }

  return files;
};
