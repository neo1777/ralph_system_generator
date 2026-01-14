import { RalphConfig, AiModel, InterfaceType, GeneratedFile, CliTool } from '../types';
import { getOutputText, getInstructionText, InstructionKey, getUiText } from './i18n';

// Helper to determine Model Family properties
const getModelDetails = (model: AiModel, tool: CliTool) => {
  const isReasoning = model.includes('o1') || model.includes('o3') || model.includes('R1') || model.includes('Reasoning');
  const isGoogle = model.includes('Google');
  
  let modelId = "";
  let cliCommand = "";
  let commentWarning = false;

  // 1. Determine base Model ID based on Enum
  switch (model) {
    case AiModel.GOOGLE_GEMINI_3_PRO: modelId = "gemini-3-pro-preview"; break;
    case AiModel.GOOGLE_GEMINI_3_FLASH: modelId = "gemini-3-flash-preview"; break;
    case AiModel.GOOGLE_GEMINI_2_5_FLASH: modelId = "gemini-flash-latest"; break;
    
    case AiModel.CLAUDE_3_7_SONNET: modelId = "claude-3-7-sonnet-20260224"; break;
    case AiModel.CLAUDE_3_5_OPUS: modelId = "claude-3-5-opus-latest"; break;
    case AiModel.CLAUDE_3_5_SONNET: modelId = "claude-3-5-sonnet-latest"; break;
    
    case AiModel.OPENAI_O3: modelId = "o3-mini"; break;
    case AiModel.OPENAI_O1: modelId = "o1"; break;
    case AiModel.OPENAI_GPT_5: modelId = "gpt-5-preview"; break;
    case AiModel.OPENAI_GPT_4O: modelId = "gpt-4o"; break;
    
    case AiModel.DEEPSEEK_R1: modelId = "deepseek-r1"; break;
    case AiModel.DEEPSEEK_V3: modelId = "deepseek-v3"; break;
    case AiModel.LLAMA_4_405B: modelId = "llama-4-405b"; break;
    
    default: modelId = (model as string).toLowerCase().replace(/ /g, "-");
  }

  // 2. Generate Command based on CLI Tool
  switch (tool) {
    case CliTool.ANTIGRAVITY:
      // Google Antigravity / Project IDX Environment
      if (isGoogle) {
         cliCommand = `gcloud genai run --model="${modelId}" < input_prompt.txt`;
      } else {
         cliCommand = `# NOTE: In Antigravity/IDX, using a non-Google model requires external keys.\n  # Command: llm -m ${modelId} < input_prompt.txt`;
         commentWarning = true;
      }
      break;

    case CliTool.LLM_CLI:
      if (isGoogle) cliCommand = `llm -m ${modelId} -o json`; 
      else if (model.includes('Claude')) cliCommand = `llm -m ${modelId}`;
      else cliCommand = `llm -m ${modelId}`;
      cliCommand = `llm -m ${modelId} < input_prompt.txt`;
      break;

    case CliTool.GCLOUD:
      if (isGoogle) {
          cliCommand = `gcloud genai run --model="${modelId}" < input_prompt.txt`;
      } else {
          cliCommand = `# ERROR: You selected Google Cloud SDK but the model is not Google.\n  # Please select a Google Gemini model or change CLI tool.`;
          commentWarning = true;
      }
      break;

    case CliTool.OLLAMA:
      cliCommand = `ollama run ${modelId} "$(cat input_prompt.txt)"`;
      break;

    case CliTool.CLAUDE_CLI:
      if (model.includes('Claude')) {
        cliCommand = `claude -p "${modelId}" < input_prompt.txt`;
      } else {
        cliCommand = `# ERROR: Claude CLI only supports Claude models.`;
        commentWarning = true;
      }
      break;
    
    case CliTool.OPENAI_CLI:
       // Using the official python library CLI mode
       cliCommand = `openai api chat.completions.create -m ${modelId} -g user "$(cat input_prompt.txt)"`;
       break;

    case CliTool.MANUAL:
    default:
      cliCommand = `# ACTUAL MODEL CALL - Placeholder\n  # Command: <your-tool> run ${modelId} < input_prompt.txt`;
      commentWarning = true;
      break;
  }

  return { isReasoning, cliCommand, modelId, commentWarning, isGoogle };
};

const generateInstructionsFile = (config: RalphConfig, modelId: string): string => {
  const { cliTool, interfaceType, model } = config;
  const lang = config.outputLanguage;
  const t = (key: InstructionKey) => getInstructionText(lang, key);
  
  let installSteps = "";
  let keySetup = "";
  let runCommand = interfaceType === InterfaceType.TUI ? "python3 ralph_tui.py" : "./run_ralph.sh";
  
  // Define Steps based on CLI Tool (Fully utilizing Enum keys)
  switch (cliTool) {
    case CliTool.ANTIGRAVITY:
      installSteps = `### Google Project IDX / Antigravity\n${t('instr_setup_idx')}`;
      keySetup = t('instr_keys_gcloud_cmd');
      break;

    case CliTool.LLM_CLI:
      installSteps = `### LLM CLI (by Simon Willison)
${t('instr_setup_llm_step1')}
${t('instr_setup_llm_step2')}
   ${model.includes('Google') ? '`llm install llm-gemini`' : ''}
   ${model.includes('Claude') ? '`llm install llm-claude-3`' : ''}
   ${model.includes('OpenAI') ? '(No plugin needed for OpenAI)' : ''}`;
      
      keySetup = `### ${t('instr_keys_title')}
${t('instr_keys_setup_cmd')}
${model.includes('Google') ? '`llm keys set gemini`' : ''}
${model.includes('Claude') ? '`llm keys set claude`' : ''}
${model.includes('OpenAI') ? '`llm keys set openai`' : ''}`;
      break;

    case CliTool.OLLAMA:
      installSteps = `### Ollama (Local)\n` + t('instr_setup_ollama').replace('{modelId}', modelId);
      keySetup = t('instr_keys_no_req');
      break;

    case CliTool.CLAUDE_CLI:
      installSteps = `### Claude CLI (Anthropic)\n${t('instr_setup_claude')}`;
      keySetup = `### ${t('instr_keys_title')}\nManaged via \`claude login\` or env variable \`ANTHROPIC_API_KEY\`.`;
      break;
      
    case CliTool.OPENAI_CLI:
      installSteps = `### OpenAI CLI (Python)\n${t('instr_setup_openai')}`;
      keySetup = `### ${t('instr_keys_title')}\nExport the variable:\n\`export OPENAI_API_KEY=sk-...\``;
      break;

    case CliTool.GCLOUD:
        installSteps = `### Google Cloud SDK\n${t('instr_setup_gcloud')}`;
        keySetup = t('instr_keys_gcloud_cmd');
        break;

    case CliTool.MANUAL:
    default:
      installSteps = `### Manual Setup\n${t('instr_setup_manual')}`;
      keySetup = `Configure your specific CLI tool's API keys manually.`;
  }

  return `# ${t('instr_title')}: ${config.projectName}

## ${t('instr_sys_req_title')}
${t('instr_sys_req_body')}

## ${t('instr_setup_title')}

${installSteps}

${keySetup}

## ${t('instr_run_title')}

${t('instr_run_step_chmod')}
   \`\`\`bash
   chmod +x run_ralph.sh
   ${interfaceType === InterfaceType.TUI ? 'chmod +x ralph_tui.py' : ''}
   \`\`\`

${t('instr_run_step_git')}
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial Ralph Setup"
   \`\`\`

${t('instr_run_step_start')}
   \`\`\`bash
   ${runCommand}
   \`\`\`

## ${t('instr_workflow_title')}
${t('instr_workflow_body').replace('{modelId}', modelId)}

---
*Generated by Ralph System Generator (2026 Edition)*
`;
};

// Convert DataURL to Blob for zip generation
const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const generateRalphSystem = (config: RalphConfig): GeneratedFile[] => {
  const files: GeneratedFile[] = [];
  const { isReasoning, cliCommand, modelId, commentWarning, isGoogle } = getModelDetails(config.model, config.cliTool);
  const lang = config.outputLanguage;
  const uiLang = config.uiLanguage; // Use UI language for descriptions

  const tOut = (key: any) => getOutputText(lang, key);
  const tUi = (key: any) => getUiText(uiLang, key);

  // 0. SPECIAL: Antigravity/IDX Configuration
  if (config.cliTool === CliTool.ANTIGRAVITY) {
    files.push({
      filename: '.idx/dev.nix',
      language: 'nix',
      content: `# Google Antigravity / Project IDX Configuration
{ pkgs, ... }: {
  channel = "stable-23.11"; 
  
  packages = [
    pkgs.jq
    pkgs.google-cloud-sdk
    pkgs.python3
    ${config.interfaceType === InterfaceType.TUI ? 'pkgs.ncurses' : ''}
  ];
  
  env = {
    RALPH_PROJECT = "${config.projectName}";
  };
  
  idx = {
    extensions = [];
    workspace = {
      onCreate = {
        init-ralph = "chmod +x run_ralph.sh";
      };
    };
  };
}`,
      description: tUi('desc_nix')
    });
  }

  // 1. INSTRUCTIONS.md (NEW)
  files.push({
    filename: 'INSTRUCTIONS.md',
    language: 'markdown',
    content: generateInstructionsFile(config, modelId),
    description: tUi('desc_instructions')
  });

  // 2. prd.json
  const prdContent = `[
  {
    "id": 1,
    "title": "${tOut('prd_setup_title')}",
    "description": "${tOut('prd_setup_desc')} '${config.projectName}'.",
    "acceptance_criteria": "${tOut('prd_criteria_setup')}",
    "passes": false
  },
  {
    "id": 2,
    "title": "${tOut('prd_logic_title')}",
    "description": "${tOut('prd_logic_desc')}: ${config.goal.substring(0, 50)}...",
    "acceptance_criteria": "${tOut('prd_criteria_logic')}",
    "passes": false
  }
]`;
  files.push({
    filename: 'prd.json',
    language: 'json',
    content: prdContent,
    description: tUi('desc_prd')
  });

  // 3. Process Context Files
  let contextFileAppend = "";
  
  // Handle Text Files (append directly)
  config.contextFiles.filter(f => !f.isImage).forEach(f => {
     contextFileAppend += `\n\n--- FILE: ${f.name} ---\n${f.content}\n--- END FILE ---\n`;
  });

  // Handle Image Files (save to assets/ and reference)
  config.contextFiles.filter(f => f.isImage).forEach(f => {
     const cleanName = f.name.replace(/\s+/g, '_');
     contextFileAppend += `\n\n![Reference Image](assets/${cleanName})\n*See 'assets/${cleanName}' for visual context.*`;
     
     // Add to generated files array (binary)
     files.push({
       filename: `assets/${cleanName}`,
       language: 'binary',
       content: `[Binary Image Data: ${f.name}]`, // Fallback for text viewer
       binaryData: dataURLToBlob(f.content),
       description: `${tUi('desc_ctx_img')}: ${f.name}`
     });
  });

  // 4. agents.md
  files.push({
    filename: 'agents.md',
    language: 'markdown',
    content: `# ${config.projectName} - Agents Memory
${tOut('sys_model_label')}: ${config.model}
${tOut('sys_goal_label')}: ${config.goal}
${tOut('agents_mem_intro')}

## Initial Context & Reference Files
${contextFileAppend}
${config.includeDevBrowser ? `\n> ${tOut('sys_dev_browser')}\n` : ''}
`,
    description: tUi('desc_agents')
  });

  // 5. progress.txt
  files.push({
    filename: 'progress.txt',
    language: 'text',
    content: `Iter 0: ${tOut('progress_init')} ${modelId}.`,
    description: tUi('desc_progress')
  });

  // 6. System Prompt
  let systemInstructions = "";
  let devBrowserInstruction = config.includeDevBrowser ? `\n${tOut('sys_dev_browser')}` : "";

  if (isReasoning) {
    systemInstructions = `[RALPH SYSTEM PROMPT]
Project: ${config.projectName}
${tOut('sys_goal_label')}: ${config.goal}
${tOut('sys_prompt_core_rules')}:
1. "${tOut('sys_prompt_fresh')}"
2. "${tOut('sys_prompt_atomic')}"
3. "${tOut('sys_prompt_compound')}"
4. "${tOut('sys_prompt_verification')}"
${devBrowserInstruction}
`;
  } else {
    systemInstructions = `${tOut('sys_intro_std')}
${tOut('sys_model_label')}: ${config.model} (${modelId})
${tOut('sys_goal_label')}: '${config.goal}'
${devBrowserInstruction}
`;
  }
  files.push({
    filename: 'system_instruction.txt',
    language: 'text',
    content: systemInstructions,
    description: tUi('desc_sys_prompt')
  });


  // 7. Orchestration (BASH or TUI)
  
  if (config.interfaceType === InterfaceType.TUI) {
      // TUI MODE: Generate a Python Script + Shell Launcher
      
      const tuiScript = `import curses
import json
import time
import os
import sys

def load_prd():
    if not os.path.exists('prd.json'):
        return None, "${tOut('tui_err_load')}"
    try:
        with open('prd.json', 'r') as f:
            return json.load(f), ""
    except json.JSONDecodeError:
        return None, "${tOut('tui_err_json')}"
    except Exception as e:
        return None, f"${tOut('tui_err_gen')}: {str(e)}"

def save_prd(data):
    try:
        with open('prd.json', 'w') as f:
            json.dump(data, f, indent=2)
        return True, "${tOut('tui_success_save')}"
    except PermissionError:
        return False, "${tOut('tui_err_save')} (Permission denied)."
    except Exception as e:
        return False, f"${tOut('tui_err_save')}: {str(e)}"

def main(stdscr):
    # Setup Colors
    curses.start_color()
    curses.use_default_colors()
    try:
        curses.init_pair(1, curses.COLOR_WHITE, curses.COLOR_BLUE)  # Header
        curses.init_pair(2, curses.COLOR_GREEN, -1)                 # Success Text
        curses.init_pair(3, curses.COLOR_RED, -1)                   # Error Text
        curses.init_pair(4, curses.COLOR_CYAN, -1)                  # Info Text
    except:
        pass # Fallback if colors fail

    # State
    status_msg = "${tOut('tui_waiting')}"
    status_type = 4 # 2=Success, 3=Error, 4=Info

    while True:
        stdscr.clear()
        h, w = stdscr.getmaxyx()
        
        # 1. Header
        title = " ${tOut('tui_title')} - ${config.projectName} "
        try:
            stdscr.attron(curses.color_pair(1))
            stdscr.addstr(0, 0, title + " " * (w - len(title)))
            stdscr.attroff(curses.color_pair(1))
        except curses.error:
            pass # Screen too small

        # 2. Load Data
        prd, load_err = load_prd()
        
        row = 2
        if prd is None:
            stdscr.addstr(row, 2, load_err, curses.color_pair(3))
            stdscr.addstr(row + 1, 2, "${tOut('tui_retry')}", curses.color_pair(4))
            stdscr.refresh()
            time.sleep(2)
            # check for exit during error state
            stdscr.nodelay(True)
            k = stdscr.getch()
            if k == ord('q'): break
            stdscr.nodelay(False)
            continue
        
        # 3. Display Tasks
        try:
            for task in prd:
                if row >= h - 4: break # Prevent overflow
                is_pass = task.get('passes', False)
                symbol = "[x]" if is_pass else "[ ]"
                color = curses.color_pair(2) if is_pass else curses.A_NORMAL
                
                # Truncate to fit screen width
                line = f"{symbol} {task.get('id', '?')}: {task.get('title', 'Unknown')}"
                if len(line) > w - 4: line = line[:w-4] + "..."
                
                stdscr.addstr(row, 2, line, color)
                row += 1
        except Exception:
             stdscr.addstr(row, 2, "Error displaying tasks (Bad JSON structure)", curses.color_pair(3))
             row += 1

        # 4. Agent Status Area
        stdscr.addstr(row + 1, 2, "--- ${tOut('tui_agent_act')} (${modelId}) ---")
        
        # 5. Status Bar
        try:
            stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(status_type))
        except curses.error:
            pass

        stdscr.refresh()
        
        # Input Handling
        key = stdscr.getch()
        
        if key == ord('q'):
            break
        elif key == ord('r'):
            # Find next task
            next_task = next((t for t in prd if not t.get('passes', False)), None)
            
            if not next_task:
                status_msg = "${tOut('tui_all_done')}"
                status_type = 2
                continue

            # Simulate Execution
            status_msg = f"${tOut('tui_running')} {next_task.get('id')}..."
            status_type = 4
            stdscr.addstr(row + 3, 2, status_msg, curses.color_pair(status_type))
            stdscr.refresh()
            
            # Here we would call the actual CLI command:
            # ${cliCommand}
            time.sleep(1.5) # Fake delay for TUI demo
            
            # Logic Update (Simulation for demo)
            next_task['passes'] = True 
            
            # Save
            success, save_msg = save_prd(prd)
            status_msg = save_msg
            status_type = 2 if success else 3

if __name__ == "__main__":
    try:
        curses.wrapper(main)
    except Exception as e:
        print(f"Critical UI Error: {e}")
`;

    files.push({
        filename: 'ralph_tui.py',
        language: 'python',
        content: tuiScript,
        description: tUi('desc_tui')
    });

    files.push({
        filename: 'run_ralph.sh',
        language: 'bash',
        content: `#!/bin/bash
# Launcher for Ralph TUI
echo "${tOut('sh_start')}"
python3 ralph_tui.py
`,
        description: tUi('desc_sh')
    });

  } else {
    // BASH MODE (Standard)
    
    let executionBlock = "";
    if (commentWarning) {
       executionBlock = `  # 3. Call the Agent (Placeholder)
  echo ">> ${tOut('script_calling')} ${config.model}..."
  ${cliCommand}
  # OUTPUT="... simulated output ..."`;
    } else {
       executionBlock = `  # 3. Call the Agent (REAL EXECUTION)
  echo ">> ${tOut('script_calling')} ${config.model}..."
  OUTPUT=$(${cliCommand})
  echo "$OUTPUT"`;
    }

    const bashScript = `#!/bin/bash
# Ralph Loop Orchestrator for ${config.projectName}
# Optimized for: ${config.model}
# CLI Tool: ${config.cliTool}

PRD_FILE="prd.json"
MEMORY_FILE="agents.md"
PROGRESS_FILE="progress.txt"

if ! command -v jq &> /dev/null; then
    echo "jq is required. ${config.cliTool === CliTool.ANTIGRAVITY ? 'Add to dev.nix' : 'Please install it.'}"
    exit 1
fi

echo "${tOut('script_start')} ${config.projectName}..."

while true; do
  TASK_ID=$(jq -r 'map(select(.passes == false)) | .[0].id' $PRD_FILE)
  if [ "$TASK_ID" == "null" ]; then
    echo "✅ ${tOut('script_all_passed')}"
    break
  fi

  TASK_DESC=$(jq -r "map(select(.id == $TASK_ID)) | .[0].description" $PRD_FILE)
  CRITERIA=$(jq -r "map(select(.id == $TASK_ID)) | .[0].acceptance_criteria" $PRD_FILE)

  echo "---------------------------------------------------"
  echo "🤖 ${tOut('script_working')} #$TASK_ID"
  echo "---------------------------------------------------"

  cat <<EOF > input_prompt.txt
You are Ralph.
CONTEXT: $(cat $MEMORY_FILE)
TASK: $TASK_DESC
CRITERIA: $CRITERIA
EOF

${executionBlock}

  read -p "${tOut('script_manual_check')} " RESULT
  
  if [ "$RESULT" == "y" ]; then
    echo "✨ ${tOut('script_ask_success')}"
    tmp=$(mktemp)
    jq "map(if .id == $TASK_ID then .passes = true else . then end)" $PRD_FILE > "$tmp" && mv "$tmp" $PRD_FILE
    echo "Iter $(date): ${tOut('script_complete')} $TASK_ID" >> $PROGRESS_FILE
  else
    echo "❌ ${tOut('script_failed')}"
    echo "Iter $(date): Failed Task $TASK_ID" >> $PROGRESS_FILE
  fi
  sleep 2
done
`;

    files.push({
      filename: 'run_ralph.sh',
      language: 'bash',
      content: bashScript,
      description: tUi('desc_sh')
    });
  }

  return files;
};