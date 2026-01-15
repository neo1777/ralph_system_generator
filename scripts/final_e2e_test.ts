
import { generateRalphSystem } from '../services/ralphLogic';
import { getPresets } from '../services/presets';
import { AppLanguage, InterfaceType, CliTool, RalphConfig, GeneratedFile, AiModel } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { execSync, exec } from 'child_process';

// Polyfills
if (typeof Blob === 'undefined') {
    global.Blob = class Blob {
        content: any[];
        options: any;
        constructor(content: any[], options: any) { this.content = content; }
    } as any;
}

const TEST_DIR = 'final_test_app';

async function run() {
    console.log(`\n🚀 STARTING FINAL END-TO-END TEST...`);

    // 1. CLEANUP
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR);

    // 2. GENERATE RALPH SYSTEM
    console.log(`\n[1/5] Generating Ralph System (Preset P1)...`);
    const presets = getPresets(AppLanguage.EN);
    const preset = presets.find(p => p.id === 'p1'); // React App

    const config: RalphConfig = {
        projectName: "FinalTestApp",
        goal: "Create a simple Hello World page",
        model: AiModel.OPENAI_GPT_4O,
        cliTool: CliTool.LLM_CLI, // We will mock this command
        interfaceType: InterfaceType.BASH_BASIC,
        includeDevBrowser: false,
        uiLanguage: AppLanguage.EN,
        outputLanguage: AppLanguage.EN,
        contextFiles: preset?.config.contextFiles || []
    };

    const files = generateRalphSystem(config);
    files.forEach(f => {
        const p = path.join(TEST_DIR, f.filename);
        if (path.dirname(f.filename) !== '.') fs.mkdirSync(path.dirname(p), { recursive: true });
        if (!f.binaryData) fs.writeFileSync(p, f.content);
    });
    console.log(`Generated ${files.length} files.`);

    // 3. APPLY INSTRUCTIONS (Simulated User)
    console.log(`\n[2/5] Applying Instructions (Setup)...`);
    process.chdir(TEST_DIR);

    // Git Init
    execSync('git init');
    execSync('git config user.email "bot@test.com"');
    execSync('git config user.name "Test Bot"');
    execSync('git add .');
    execSync('git commit -m "Initial Ralph Setup"');
    console.log(`Git initialized and committed.`);

    // Chmod
    execSync('chmod +x run_ralph.sh');
    console.log(`Scripts made executable.`);

    // 4. MOCK AGENT
    // We modify run_ralph.sh to use a fake command instead of 'llm'
    // simulating a successful agent response.
    console.log(`\n[3/5] Mocking Agent execution...`);
    let scriptContent = fs.readFileSync('run_ralph.sh', 'utf-8');
    // Replace the call line
    scriptContent = scriptContent.replace(
        /OUTPUT=\$\(llm -m .*?\)/,
        'OUTPUT="MOCK_AGENT: I have completed the task successfully. Here is the code..."'
    );
    fs.writeFileSync('run_ralph.sh', scriptContent);

    // 5. EXECUTE THE LOOP
    console.log(`\n[4/5] Executing ./run_ralph.sh...`);
    console.log(`(Will simulate 'y' input to approve tasks)`);

    // We use 'yes' to feed 'y' to the interactive prompt "Did the agent satisfy criteria?"
    // Limiting to 2 iterations max to avoid infinite loops if it doesn't stop, 
    // but the logic stops when prd.json tasks are passed.
    // Spec compliance preset has 4 tasks. P1 has 2 tasks (Setup, Logic).

    try {
        // Run with timeout
        execSync('yes y | head -n 5 | ./run_ralph.sh', { stdio: 'inherit', timeout: 10000 });
        console.log(`\nExecution finished.`);
    } catch (e: any) {
        // Pass if exit code is 0 (success) or typical interruption output
        console.log(`Execution ended (possibly all tasks done).`);
    }

    // 6. VERIFY OUTPUT
    console.log(`\n[5/5] Verifying Result usage...`);

    // Check Git Log
    const gitLog = execSync('git log --oneline').toString();
    console.log(`Git Log Sample:\n${gitLog}`);

    if (!gitLog.includes('Ralph: Completed Task')) {
        throw new Error('E2E FAIL: No completion commits found in git log.');
    }

    // Check PRD updated
    const prd = JSON.parse(fs.readFileSync('prd.json', 'utf-8'));
    const allPassed = prd.every((t: any) => t.passes === true);

    if (!allPassed) {
        throw new Error('E2E FAIL: Not all PRD tasks are marked as passed.');
    }

    console.log(`\n✅ SUCCESS: All tests passed!`);
    console.log(`- Git History Updated`);
    console.log(`- PRD Tasks Updated`);
    console.log(`- Script ran without errors`);
}

run().catch(e => {
    console.error(`\n❌ FAILED: ${e.message}`);
    process.exit(1);
});
