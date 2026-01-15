import { RalphConfig, AiModel, InterfaceType, GeneratedFile, CliTool, AppLanguage } from '../types';
import { getOutputText, getInstructionText, InstructionKey, getUiText } from './i18n';

const getModelDetails = (model: AiModel, tool: CliTool, lang: AppLanguage) => {
  const isReasoning = model.includes('o1') || model.includes('o3') || model.includes('R1') || model.includes('Reasoning');
  const isGoogle = model.includes('Google');
  let modelId = "";
  let cliCommand = "";
  let commentWarning = false;

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

  switch (tool) {
    case CliTool.ANTIGRAVITY:
      if (isGoogle) {
        cliCommand = `gcloud genai run --model="${modelId}" < input_prompt.txt`;
      } else {
        cliCommand = `# ${getOutputText(lang, 'err_antigravity_model')}\n  # Command: llm -m ${modelId} < input_prompt.txt`;
        commentWarning = true;
      }
      break;
    case CliTool.LLM_CLI:
      cliCommand = `llm -m ${modelId} < input_prompt.txt`;
      break;
    case CliTool.GCLOUD:
      if (isGoogle) {
        cliCommand = `cat input_prompt.txt | gemini`;
      } else {
        cliCommand = `# ${getOutputText(lang, 'err_google_model')}`;
        commentWarning = true;
      }
      break;
    case CliTool.OLLAMA:
      cliCommand = `ollama run ${modelId} "$(cat input_prompt.txt)"`;
      break;
    case CliTool.CLAUDE_CLI:
      if (model.includes('Claude')) {
        cliCommand = `cat input_prompt.txt | claude --print`;
      } else {
        cliCommand = `# ${getOutputText(lang, 'err_claude_model')}`;
        commentWarning = true;
      }
      break;
    case CliTool.OPENAI_CLI:
      cliCommand = `openai api chat.completions.create -m ${modelId} -g user "$(cat input_prompt.txt)"`;
      break;
    default:
      cliCommand = `# ${getOutputText(lang, 'err_manual_call')}\n  # Command: <your-tool> run ${modelId} < input_prompt.txt`;
      commentWarning = true;
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

  switch (cliTool) {
    case CliTool.ANTIGRAVITY:
      installSteps = `### ${getUiText(lang, 'tool_antigravity')}\n${t('instr_setup_idx')}`;
      keySetup = t('instr_keys_gcloud_cmd');
      break;
    case CliTool.LLM_CLI:
      installSteps = `### ${getUiText(lang, 'tool_llm')}\n${t('instr_setup_llm_step1')}\n${t('instr_setup_llm_step2')}\n   ${model.includes('Google') ? '`llm install llm-gemini`' : ''}\n   ${model.includes('Claude') ? '`llm install llm-claude-3`' : ''}`;
      keySetup = `### ${t('instr_keys_title')}\n${t('instr_keys_setup_cmd')}\n${model.includes('Google') ? '`llm keys set gemini`' : ''}\n${model.includes('Claude') ? '`llm keys set claude`' : ''}`;
      break;
    case CliTool.OLLAMA:
      installSteps = `### ${getUiText(lang, 'tool_ollama')}\n` + t('instr_setup_ollama').replace('{modelId}', modelId);
      keySetup = t('instr_keys_no_req');
      break;
    default:
      installSteps = `### ${getUiText(lang, 'tool_manual')}\n${t('instr_setup_manual')}`;
      keySetup = getOutputText(lang, 'err_manual_setup');
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
   git commit -m "${getOutputText(lang, 'git_init_commit')}"
   \`\`\`
${t('instr_run_step_start')}
   \`\`\`bash
   ${runCommand}
   \`\`\`
## ${t('instr_workflow_title')}
${t('instr_workflow_body').replace('{modelId}', modelId)}`;
};

const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const b64 = arr[1].replace(/\s/g, '');
  const bstr = atob(b64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

export const generateRalphSystem = (config: RalphConfig): GeneratedFile[] => {
  const files: GeneratedFile[] = [];
  const lang = config.outputLanguage;
  const { isReasoning, cliCommand, modelId, commentWarning, isGoogle } = getModelDetails(config.model, config.cliTool, lang);
  const tOut = (key: any) => getOutputText(lang, key);
  const tUi = (key: any) => getUiText(config.uiLanguage, key);

  if (config.cliTool === CliTool.ANTIGRAVITY) {
    files.push({
      filename: '.idx/dev.nix',
      language: 'nix',
      content: `{ pkgs, ... }: { packages = [ pkgs.jq pkgs.google-cloud-sdk pkgs.python3 ]; }`,
      description: tUi('desc_nix')
    });
  }

  files.push({
    filename: 'INSTRUCTIONS.md',
    language: 'markdown',
    content: generateInstructionsFile(config, modelId),
    description: tUi('desc_instructions')
  });

  const prdItems = [{ id: 1, title: tOut('prd_setup_title'), description: tOut('prd_setup_desc'), passes: false }];
  files.push({
    filename: 'prd.json',
    language: 'json',
    content: JSON.stringify(prdItems, null, 2),
    description: tUi('desc_prd')
  });

  files.push({
    filename: 'agents.md',
    language: 'markdown',
    content: `# ${config.projectName}\n${config.goal}`,
    description: tUi('desc_agents')
  });

  files.push({
    filename: 'run_ralph.sh',
    language: 'bash',
    content: `#!/bin/bash\necho "Running Ralph..."`,
    description: tUi('desc_sh')
  });

  return files;
};
