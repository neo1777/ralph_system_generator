
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

// Configuration
const LANG = AppLanguage.IT;
const PRESET_ID = 'p2';
const TOOL = CliTool.CLAUDE_CLI;
const MODEL = AiModel.CLAUDE_3_5_SONNET;
const OUT_DIR = 'ralph_live_test';

async function run() {
    console.log(`Generating Real Life Test: ${PRESET_ID} / ${TOOL} / ${LANG} ...`);

    // 1. Get Preset
    const presets = getPresets(LANG);
    const preset = presets.find(p => p.id === PRESET_ID);
    if (!preset) throw new Error(`Preset ${PRESET_ID} not found`);

    const config: RalphConfig = {
        projectName: preset.config.projectName,
        goal: preset.config.goal,
        model: MODEL,
        cliTool: TOOL,
        interfaceType: InterfaceType.BASH_BASIC,
        includeDevBrowser: false,
        uiLanguage: LANG,
        outputLanguage: LANG,
        contextFiles: preset.config.contextFiles || []
    };

    // 2. Generate
    const files = generateRalphSystem(config);

    // 3. Write to Disk
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    // Also create assets dir if needed
    if (files.some(f => f.filename.startsWith('assets/'))) {
        fs.mkdirSync(path.join(OUT_DIR, 'assets'), { recursive: true });
    }

    files.forEach(f => {
        const filePath = path.join(OUT_DIR, f.filename);
        if (f.filename.startsWith('.idx/')) {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }

        // Handle binary or text
        if (f.binaryData) {
            // Mock binary write (the fuzz test used fake, here we might have real base64 if preset has it)
            // But p2 doesn't have images.
            console.log(`Writing binary: ${f.filename}`);
        } else {
            console.log(`Writing: ${f.filename}`);
            fs.writeFileSync(filePath, f.content);
        }
    });

    console.log(`\nSuccess! Generated ${files.length} files in ${OUT_DIR}`);
}

run().catch(console.error);
