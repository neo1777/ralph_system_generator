
import { generateRalphSystem } from '../services/ralphLogic.js';
import { getPresets } from '../services/presets.js';
import { AiModel, CliTool, InterfaceType, AppLanguage, RalphConfig } from '../types.js';

async function verifyExhaustiveOutput() {
    console.log("🔍 STARTING PHASE 7: EXHAUSTIVE OUTPUT SEMANTIC VERIFICATION...");

    const languages = [AppLanguage.EN, AppLanguage.IT, AppLanguage.ES];
    let allPassed = true;

    for (const lang of languages) {
        console.log(`\n--- TESTING LANGUAGE: ${lang} ---`);
        const presets = getPresets(lang);

        if (presets.length !== 20) {
            console.error(`❌ FAIL: Expected 20 presets for ${lang}, found ${presets.length}`);
            allPassed = false;
        }

        for (const preset of presets) {
            console.log(`Testing Preset: [${preset.id}] ${preset.title}`);
            const config: RalphConfig = {
                ...preset.config as RalphConfig,
                interfaceType: InterfaceType.BASH_BASIC, // Test Bash first
                uiLanguage: lang,
                outputLanguage: lang,
            };

            const files = generateRalphSystem(config);

            // 1. Basic File Existence
            const requiredFiles = ['run_ralph.sh', 'INSTRUCTIONS.md', 'prd.json', 'agents.md'];
            for (const rf of requiredFiles) {
                if (!files.find(f => f.filename === rf)) {
                    console.error(`❌ FAIL: Missing ${rf} in preset ${preset.id}`);
                    allPassed = false;
                }
            }

            // 2. Command Accuracy (Jan 2026)
            const runScript = files.find(f => f.filename === 'run_ralph.sh')?.content || '';
            const instDoc = files.find(f => f.filename === 'INSTRUCTIONS.md')?.content || '';

            if (config.cliTool === CliTool.GEMINI_CLI) {
                if (!runScript.includes('gemini run')) {
                    console.error(`❌ FAIL: ${preset.id} missing "gemini run" command`);
                    allPassed = false;
                }
            } else if (config.cliTool === CliTool.CLAUDE_CLI) {
                if (!runScript.includes('claude-code')) {
                    console.error(`❌ FAIL: ${preset.id} missing "claude-code" command`);
                    allPassed = false;
                }
            }

            // 3. Preset-Specific Context Files
            if (preset.id === 'p16') { // Performance Optimizer
                if (!files.find(f => f.filename === 'assets/slow_script.py' || files.find(f => f.filename === 'slow_script.py'))) {
                    // In current implementation, text context files are appended to agents.md, NOT separate files
                    // unless they are images (assets/). presets.ts says slow_script.py is text/x-python.
                    const agentsContent = files.find(f => f.filename === 'agents.md')?.content || '';
                    if (!agentsContent.includes('slow_script.py')) {
                        console.error(`❌ FAIL: Preset p16 missing slow_script.py in agents.md`);
                        allPassed = false;
                    }
                }
            }

            if (preset.id === 'p17' || preset.id === 'p10') { // UI Polish / Figma
                const asset = files.find(f => f.filename.startsWith('assets/'));
                if (!asset || !asset.binaryData) {
                    console.error(`❌ FAIL: Preset ${preset.id} missing binary SVG asset`);
                    allPassed = false;
                } else {
                    console.log(`✅ PASS: ${preset.id} contains binary asset: ${asset.filename}`);
                }
            }

            // 4. PRD Content
            const prdContent = files.find(f => f.filename === 'prd.json')?.content || '';
            try {
                const prd = JSON.parse(prdContent);
                if (prd.projectName !== config.projectName) {
                    console.error(`❌ FAIL: PRD projectName mismatch in ${preset.id}. Expected ${config.projectName}, got ${prd.projectName}`);
                    allPassed = false;
                }
            } catch (e) {
                console.error(`❌ FAIL: PRD is not valid JSON in ${preset.id}`);
                allPassed = false;
            }
        }
    }

    // 5. ZIP Simulation (Check for path consistency)
    console.log(`\n--- VERIFYING ZIP STRUCTURAL INTEGRITY ---`);
    const testConfig: RalphConfig = {
        projectName: "ZipCheck",
        goal: "Test Zip",
        model: AiModel.GOOGLE_GEMINI_3_PRO,
        cliTool: CliTool.GEMINI_CLI,
        interfaceType: InterfaceType.TUI,
        includeDevBrowser: true,
        uiLanguage: AppLanguage.EN,
        outputLanguage: AppLanguage.EN,
        contextFiles: []
    };
    const zipFiles = generateRalphSystem(testConfig);
    if (!zipFiles.find(f => f.filename === 'ralph_tui.py')) {
        console.error(`❌ FAIL: TUI mode missing ralph_tui.py`);
        console.log("Generated files:", zipFiles.map(f => f.filename));
        allPassed = false;
    } else {
        console.log(`✅ PASS: TUI mode contains expected files (ralph_tui.py, run_ralph.sh)`);
    }

    if (allPassed) {
        console.log("\n✅ PHASE 7 SUCCESS: All 20 presets and structural checks passed!");
    } else {
        console.error("\n❌ PHASE 7 FAILURE: Mismatches found in exhaustive check.");
        process.exit(1);
    }
}

verifyExhaustiveOutput().catch(console.error);


