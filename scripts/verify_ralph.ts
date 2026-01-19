
import { generateRalphSystem } from '../services/ralphLogic';
import { getPresets } from '../services/presets';
import { AppLanguage, InterfaceType, CliTool, RalphConfig, GeneratedFile, AiModel } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Polyfill for automated environments if needed (though Node 18+ has these)
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

// Colors for console output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';

interface TestResult {
    lang: AppLanguage;
    presetId: string;
    passed: boolean;
    errors: string[];
}

const RESULTS: TestResult[] = [];

// Helper to check if file exists in generated array
const hasFile = (files: GeneratedFile[], name: string) => files.some(f => f.filename === name);
const getFile = (files: GeneratedFile[], name: string) => files.find(f => f.filename === name);

const verifyScenario = (lang: AppLanguage, preset: any) => {
    const errors: string[] = [];
    const config: RalphConfig = {
        projectName: preset.config.projectName || 'test-project',
        goal: preset.config.goal || 'Test Goal',
        model: preset.config.model || AiModel.GOOGLE_GEMINI_3_FLASH,
        cliTool: CliTool.GEMINI_CLI, // Default testing tool
        interfaceType: InterfaceType.BASH_BASIC, // Verify Bash by default
        includeDevBrowser: false,
        uiLanguage: lang,
        outputLanguage: lang,
        contextFiles: preset.config.contextFiles || []
    };

    // 1. GENERATE
    let files: GeneratedFile[] = [];
    try {
        files = generateRalphSystem(config);
    } catch (e: any) {
        errors.push(`Generation Exception: ${e.message}`);
        return { lang, presetId: preset.id, passed: false, errors };
    }

    // 2. CHECK LEVEL 1: STRUCTURE
    const requiredFiles = ['prd.json', 'agents.md', 'progress.txt', 'INSTRUCTIONS.md', 'run_ralph.sh', 'system_instruction.txt'];
    requiredFiles.forEach(req => {
        if (!hasFile(files, req)) errors.push(`Missing required file: ${req}`);
    });

    // Check assets if present in preset
    if (preset.config.contextFiles.some((f: any) => f.isImage)) {
        // We expect at least one file in assets/ or similar. The logic puts them in assets/
        const hasAsset = files.some(f => f.filename.startsWith('assets/'));
        if (!hasAsset) errors.push(`Preset has images but no assets/ file generated.`);
    }

    // 3. CHECK LEVEL 2: CONTENT & I18N
    const prdFile = getFile(files, 'prd.json');
    if (prdFile) {
        try {
            let tasks = JSON.parse(prdFile.content);
            // Handle { items: [...] } wrapper used by newer logic
            if (!Array.isArray(tasks) && tasks.items && Array.isArray(tasks.items)) {
                tasks = tasks.items;
            }
            if (!Array.isArray(tasks) || tasks.length === 0) {
                errors.push(`prd.json is empty or not an array (or missing 'items' wrapper)`);
            } else {
                // Check Localization of the first task title (Setup task usually)
                // We know specific strings from i18n.ts
                const firstTaskTitle = tasks[0].title;
                if (lang === AppLanguage.IT && !firstTaskTitle.toLowerCase().includes('setup')) {
                    errors.push(`[i18n] IT: prd.json title '${firstTaskTitle}' does not seem Italian (expected 'Setup...')`);
                }
                if (lang === AppLanguage.ES && !firstTaskTitle.toLowerCase().includes('configuración')) {
                    errors.push(`[i18n] ES: prd.json title '${firstTaskTitle}' does not seem Spanish`);
                }

                // Verify Goal Injection
                // Note: The logic might NOT inject the goal into the tasks directly, but into agents.md or prd.json logic task.
                // Let's check if 'prd_logic_title' equivalent is present in the second task.
                if (tasks.length > 1) {
                    // Check preset goal is somewhere? 
                    // Actually, verify that the preset title/description matches the language.
                    // But we are passing the Config, which already has the translated goal from the Preset Object?
                    // Wait, getPresets(lang) returns translated strings. 
                    // So config.goal is ALREADY translated.
                    // We just check if config.goal is present in agents.md check or system instruction.
                }
            }
        } catch (e) {
            errors.push(`prd.json Invalid JSON`);
        }
    }

    const instrFile = getFile(files, 'INSTRUCTIONS.md');
    if (instrFile) {
        // Check for "Setup" or "Istruzioni" in IT (since i18n uses "Setup" for instr_setup_title)
        if (lang === AppLanguage.IT && !instrFile.content.includes('Setup')) {
            errors.push(`[i18n] IT: INSTRUCTIONS.md missing 'Setup'`);
        }
    }

    // 4. CHECK LEVEL 3: RALPH COMPLIANCE
    const sysPrompt = getFile(files, 'system_instruction.txt')?.content || '';

    // Check Fresh Context / Tabula Rasa
    if (lang === AppLanguage.EN && !sysPrompt.includes('Fresh Context')) {
        errors.push(`[Compliance] EN: Missing 'Fresh Context' rule`);
    }
    if (lang === AppLanguage.IT && !sysPrompt.includes('Contesto Fresco')) {
        errors.push(`[Compliance] IT: Missing 'Contesto Fresco' rule`);
    }

    const runScript = getFile(files, 'run_ralph.sh')?.content || '';
    if (!runScript.includes('jq')) {
        errors.push(`[Compliance] run_ralph.sh missing dependency check for 'jq'`);
    }

    // 5. MOCK DATA CHECK (Expert Presets)
    if (preset.id === 'p20' || preset.id === 'p19') {
        const agentsMd = getFile(files, 'agents.md')?.content || '';
        // p19 is Security Auditor -> vulnerable_server.js
        if (preset.id === 'p19' && !files.find(f => f.filename === 'agents.md')?.content.includes('vulnerable_server.js')) {
            // Logic appends context files to agents.md
            errors.push(`[MockData] p19 missing 'vulnerable_server.js' in agents.md`);
        }
    }

    return {
        lang,
        presetId: preset.id,
        passed: errors.length === 0,
        errors
    };
};

async function run() {
    console.log(`${CYAN}Starting Ralph System Verification...${RESET}`);
    console.log(`========================================`);

    const languages = Object.values(AppLanguage);
    let totalTests = 0;
    let failedTests = 0;

    for (const lang of languages) {
        console.log(`\nTesting Language: ${GREEN}${lang}${RESET}`);
        const presets = getPresets(lang);

        for (const preset of presets) {
            // Process stdout indicator
            process.stdout.write('.');

            const result = verifyScenario(lang, preset);
            RESULTS.push(result);
            totalTests++;

            if (!result.passed) {
                failedTests++;
                process.stdout.write('X');
            }
        }
    }

    console.log(`\n\n${CYAN}Verification Complete.${RESET}`);
    console.log(`Total: ${totalTests}, Failed: ${failedTests}`);

    // Generate Markdown Report
    let reportMd = `# Ralph Verification Report\n\nGenerated: ${new Date().toISOString()}\n\n`;
    reportMd += `| Language | Preset ID | Status | Errors |\n|---|---|---|---|\n`;

    let failDetails = `\n## Failure Details\n`;

    for (const r of RESULTS) {
        const statusIcon = r.passed ? '✅' : '❌';
        const errSummary = r.errors.length > 0 ? `${r.errors.length} errors` : 'None';
        reportMd += `| ${r.lang} | ${r.presetId} | ${statusIcon} | ${errSummary} |\n`;

        if (!r.passed) {
            failDetails += `\n### ${r.lang} - ${r.presetId}\n`;
            r.errors.forEach(e => failDetails += `- ${e}\n`);
        }
    }

    if (failedTests > 0) {
        reportMd += failDetails;
    } else {
        reportMd += `\n\n## Summary\nAll ${totalTests} scenarios passed successfully! 🚀\n`;
    }

    const reportPath = path.resolve('RALPH_VERIFICATION_REPORT.md');
    fs.writeFileSync(reportPath, reportMd);
    console.log(`Report written to: ${reportPath}`);

    if (failedTests > 0) process.exit(1);
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
