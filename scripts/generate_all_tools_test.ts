
import { generateRalphSystem } from '../services/ralphLogic';
import { getPresets } from '../services/presets';
import { AppLanguage, InterfaceType, CliTool, RalphConfig, GeneratedFile, AiModel } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Polyfills
if (typeof Blob === 'undefined') {
    global.Blob = class Blob {
        content: any[];
        options: any;
        constructor(content: any[], options: any) { this.content = content; }
    } as any;
}

const TOOLS_TO_TEST = [
    { tool: CliTool.LLM_CLI, model: AiModel.OPENAI_GPT_4O, dir: 'ralph_test_llm' },
    { tool: CliTool.OLLAMA, model: AiModel.LLAMA_4_405B, dir: 'ralph_test_ollama' },
    { tool: CliTool.GCLOUD, model: AiModel.GOOGLE_GEMINI_3_FLASH, dir: 'ralph_test_gcloud' },
    { tool: CliTool.OPENAI_CLI, model: AiModel.OPENAI_GPT_4O, dir: 'ralph_test_openai' },
    { tool: CliTool.MANUAL, model: AiModel.CLAUDE_3_5_SONNET, dir: 'ralph_test_manual' },
    { tool: CliTool.ANTIGRAVITY, model: AiModel.GOOGLE_GEMINI_3_PRO, dir: 'ralph_test_antigravity' },
    { tool: CliTool.CLAUDE_CLI, model: AiModel.CLAUDE_3_5_SONNET, dir: 'ralph_test_claude' }
];

async function run() {
    console.log(`Generating Test Cases for All Tools...`);
    const preset = getPresets(AppLanguage.EN)[0]; // Use Preset 1

    for (const t of TOOLS_TO_TEST) {
        console.log(`\nGenerating: ${t.tool} -> ${t.dir}`);
        const config: RalphConfig = {
            projectName: `Test_${t.dir}`,
            goal: "Verify tool instructions",
            model: t.model,
            cliTool: t.tool,
            interfaceType: InterfaceType.BASH_BASIC,
            includeDevBrowser: false,
            uiLanguage: AppLanguage.EN,
            outputLanguage: AppLanguage.EN,
            contextFiles: []
        };

        const files = generateRalphSystem(config);

        if (!fs.existsSync(t.dir)) fs.mkdirSync(t.dir, { recursive: true });

        files.forEach(f => {
            const filePath = path.join(t.dir, f.filename);
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            if (!f.binaryData) {
                fs.writeFileSync(filePath, f.content);
            }
        });

        console.log(`Created ${t.dir}/run_ralph.sh`);
        console.log(`Created ${t.dir}/INSTRUCTIONS.md`);
    }
}

run().catch(console.error);
