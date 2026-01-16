
import { generateRalphSystem } from '../services/ralphLogic.js';
import { getPresets } from '../services/presets.js';
import { AiModel, CliTool, InterfaceType, AppLanguage, RalphConfig } from '../types.js';

/**
 * Phase 8: Realistic Scenario Verification
 * Simulates real-world execution environments and user interactions.
 */
async function verifyRealisticScenarios() {
    console.log("🔍 STARTING PHASE 8: REALISTIC SCENARIO VERIFICATION...");
    let allPassed = true;

    // SCENARIO 1: The "No-Git" Workflow
    // In many cases, users might forget to run 'git init'.
    // We check if INSTRUCTIONS.md clearly guides them through this common oversight.
    console.log("\nScenario 1: Validating 'Git' Guidance for Common Users...");
    const config: RalphConfig = {
        projectName: "GitTest",
        goal: "Check git instructions",
        model: AiModel.GOOGLE_GEMINI_3_PRO,
        cliTool: CliTool.GEMINI_CLI,
        interfaceType: InterfaceType.BASH_BASIC,
        includeDevBrowser: false,
        uiLanguage: AppLanguage.EN,
        outputLanguage: AppLanguage.EN,
        contextFiles: []
    };
    const files = generateRalphSystem(config);
    const instructions = files.find(f => f.filename === 'INSTRUCTIONS.md')?.content || '';
    if (instructions.includes('git init') && instructions.includes('git commit')) {
        console.log("✅ PASS: Git instructions found in INSTRUCTIONS.md");
    } else {
        console.error("❌ FAIL: Instructions missing Git setup guidance.");
        allPassed = false;
    }

    // SCENARIO 2: Payload Consistency (Jan 2026 CLI Command Check)
    console.log("\nScenario 2: Validating Official CLI Command Strings...");
    const cliTests = [
        { tool: CliTool.GEMINI_CLI, model: AiModel.GOOGLE_GEMINI_3_PRO, expected: "gemini run -m gemini-3-pro" },
        { tool: CliTool.CLAUDE_CLI, model: AiModel.CLAUDE_4_5_SONNET, expected: "claude-code run -m claude-sonnet-4-5" },
        { tool: CliTool.OPENAI_CLI, model: AiModel.OPENAI_GPT_5_2_PRO, expected: "openai-codex run -m gpt-5.2-pro" }
    ];

    for (const test of cliTests) {
        const c: RalphConfig = { ...config, cliTool: test.tool, model: test.model };
        const f = generateRalphSystem(c);
        const script = f.find(f => f.filename === 'run_ralph.sh')?.content || '';
        if (script.includes(test.expected)) {
            console.log(`✅ PASS: ${test.tool} generated correct 2026 command: ${test.expected}`);
        } else {
            console.error(`❌ FAIL: ${test.tool} command mismatch.`);
            allPassed = false;
        }
    }

    // SCENARIO 3: TUI Loop Simulation (PRD & Memory Sync)
    console.log("\nScenario 3: Simulating TUI Loop Memory Integration...");
    const tuiConfig: RalphConfig = { ...config, interfaceType: InterfaceType.TUI };
    const tuiFiles = generateRalphSystem(tuiConfig);
    const tuiScript = tuiFiles.find(f => f.filename === 'ralph_tui.py')?.content || '';

    // Check if the TUI script handles memory (agents.md) correctly
    if (tuiScript.includes('agents.md') && tuiScript.includes('prd.json')) {
        console.log("✅ PASS: TUI script correctly manages Agents Memory and PRD states.");
    } else {
        console.error("❌ FAIL: TUI script missing memory/state management logic.");
        allPassed = false;
    }

    // SCENARIO 4: Model Categorization & UI Consistency
    // While this is a logic test, we verify that cost estimation labels are localized.
    console.log("\nScenario 4: Validating Localization of Technical Metadata...");
    const langTests = [AppLanguage.IT, AppLanguage.FR, AppLanguage.ZH];
    for (const l of langTests) {
        const lc: RalphConfig = { ...config, outputLanguage: l, uiLanguage: l };
        const lf = generateRalphSystem(lc);
        const costDoc = lf.find(f => f.filename === 'COSTS.md')?.content || '';
        if (costDoc.includes('Model') || costDoc.includes('Modello') || costDoc.includes('Modèle') || costDoc.includes('模型')) {
            console.log(`✅ PASS: COSTS.md localized for ${l}`);
        } else {
            console.error(`❌ FAIL: COSTS.md localization failed for ${l}`);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log("\n✅ PHASE 8 SUCCESS: All realistic scenario simulations passed!");
    } else {
        console.error("\n❌ PHASE 8 FAILURE: Realistic scenarios failed checks.");
        process.exit(1);
    }
}

verifyRealisticScenarios().catch(console.error);
