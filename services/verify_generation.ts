
import { generateRalphSystem } from './ralphLogic';
import { RalphConfig, AiModel, InterfaceType, CliTool, AppLanguage } from '../types';

// Polyfill for Blob if needed (Node 18+ has it, but just in case)
if (typeof Blob === 'undefined') {
    global.Blob = class Blob {
        content: any[];
        options: any;
        constructor(content: any[], options: any) {
            this.content = content;
            this.options = options;
        }
    } as any;
}

const mockConfig: RalphConfig = {
    projectName: 'Test Project',
    goal: 'Test Goal',
    model: AiModel.GOOGLE_GEMINI_3_PRO,
    interfaceType: InterfaceType.BASH_BASIC,
    cliTool: CliTool.GEMINI_CLI,
    includeDevBrowser: false,
    uiLanguage: AppLanguage.EN,
    outputLanguage: AppLanguage.EN,
    contextFiles: []
};

const mockConfigTui: RalphConfig = {
    ...mockConfig,
    interfaceType: InterfaceType.TUI
};

console.log("Running Verification...");

try {
    // Test 1: Bash Script
    const filesBash = generateRalphSystem(mockConfig);
    const bashScript = filesBash.find(f => f.filename === 'run_ralph.sh');

    if (!bashScript) {
        console.error("❌ Bash script not found!");
        process.exit(1);
    }

    if (bashScript.content.includes('[ -f "$SYS_PROMPT" ] && cat "$SYS_PROMPT" > input_prompt.txt')) {
        console.log("✅ Bash script contains robust system_instruction logic.");
    } else {
        console.error("❌ Bash script MISSING robust system_instruction logic!");
        process.exit(1);
    }

    if (bashScript.content.includes("TASK_ID=$(jq -r '.items | map(select(.passes == false)) | .[0].id' \"$PRD_FILE\")")) {
        console.log("✅ Bash script contains correct jq path for .items.");
    } else {
        console.error("❌ Bash script MISSING correct jq path!");
        process.exit(1);
    }

    // Test 2: TUI Script
    const filesTui = generateRalphSystem(mockConfigTui);
    const tuiScript = filesTui.find(f => f.filename === 'ralph_tui.py');

    if (!tuiScript) {
        console.error("❌ TUI script not found!");
        process.exit(1);
    }

    if (tuiScript.content.includes("sys_file = os.path.join(SCRIPT_DIR, 'system_instruction.txt')")) {
        console.log("✅ TUI script contains directory-aware logic.");
    } else {
        console.error("❌ TUI script MISSING directory-aware logic!");
        process.exit(1);
    }

    // Test 3: Claude CLI command
    const mockConfigClaude: RalphConfig = {
        ...mockConfig,
        cliTool: CliTool.CLAUDE_CLI,
        model: AiModel.CLAUDE_4_5_SONNET
    };
    const filesClaude = generateRalphSystem(mockConfigClaude);
    const bashClaude = filesClaude.find(f => f.filename === 'run_ralph.sh');
    if (bashClaude?.content.includes("claude run -m")) {
        console.log("✅ Claude CLI command is correct ('claude' instead of 'claude-code').");
    } else {
        console.error("❌ Claude CLI command is INCORRECT!");
        process.exit(1);
    }

    console.log("🎉 All Checks Passed!");

} catch (error) {
    console.error("Execution Error:", error);
    process.exit(1);
}
