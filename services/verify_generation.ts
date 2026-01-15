
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
    cliTool: CliTool.LLM_CLI,
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

    if (bashScript.content.includes('cat system_instruction.txt > input_prompt.txt')) {
        console.log("✅ Bash script contains system_instruction logic.");
    } else {
        console.error("❌ Bash script MISSING system_instruction logic!");
        console.log("Content preview:\n", bashScript.content.substring(500, 1000));
        process.exit(1);
    }

    // Test 2: TUI Script
    const filesTui = generateRalphSystem(mockConfigTui);
    const tuiScript = filesTui.find(f => f.filename === 'ralph_tui.py');

    if (!tuiScript) {
        console.error("❌ TUI script not found!");
        process.exit(1);
    }

    if (tuiScript.content.includes("if os.path.exists('system_instruction.txt'):")) {
        console.log("✅ TUI script contains system_instruction logic.");
    } else {
        console.error("❌ TUI script MISSING system_instruction logic!");
        console.log("Content preview:\n", tuiScript.content.substring(400, 800));
        process.exit(1);
    }

    console.log("🎉 All Checks Passed!");

} catch (error) {
    console.error("Execution Error:", error);
    process.exit(1);
}
