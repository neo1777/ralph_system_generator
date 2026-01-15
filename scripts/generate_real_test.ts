
import { generateRalphSystem } from '../services/ralphLogic';
import { getPresets } from '../services/presets';
import { AppLanguage, InterfaceType, CliTool, RalphConfig, AiModel } from '../types';
import * as fs from 'fs';
import * as path from 'path';

if (typeof Blob === 'undefined') {
    global.Blob = class Blob {
        content: any[];
        constructor(content: any[], options: any) { this.content = content; }
    } as any;
}

const config: RalphConfig = {
    projectName: "TodoApp",
    goal: "Create a modern Todo List app with HTML, CSS and JS. Features: add, delete, mark as done.",
    model: AiModel.CLAUDE_3_5_SONNET,
    cliTool: CliTool.CLAUDE_CLI,
    interfaceType: InterfaceType.BASH_BASIC,
    includeDevBrowser: false,
    uiLanguage: AppLanguage.EN,
    outputLanguage: AppLanguage.EN,
    contextFiles: []
};

const files = generateRalphSystem(config);
const outDir = 'todo_test';

files.forEach(f => {
    const p = path.join(outDir, f.filename);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!f.binaryData) fs.writeFileSync(p, f.content);
});

console.log(`Generated ${files.length} files in ${outDir}/`);
files.forEach(f => console.log(`  - ${f.filename}`));
