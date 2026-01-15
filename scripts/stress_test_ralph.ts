
import { generateRalphSystem } from '../services/ralphLogic';
import { AppLanguage, InterfaceType, CliTool, RalphConfig, GeneratedFile, AiModel } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// --- Polyfills ---
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

// --- Fuzzing Generators ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBool = () => Math.random() > 0.5;

function randomString(length: number, type: 'alphanumeric' | 'unicode' | 'mixed' = 'mixed'): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?/`~"\'\\';
    const unicode = '🚀汉字😊äöüßñç';

    let result = '';
    const pool = type === 'alphanumeric' ? chars : type === 'mixed' ? chars + special : chars + special + unicode;

    for (let i = 0; i < length; i++) {
        result += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    return result;
}

function randomEnum<T>(enumObj: any): T {
    const values = Object.values(enumObj);
    return values[Math.floor(Math.random() * values.length)] as T;
}

function generateRandomConfig(iteration: number): RalphConfig {
    const contextCount = randomInt(0, 5);
    const contextFiles = [];

    for (let i = 0; i < contextCount; i++) {
        const isImage = randomBool();
        contextFiles.push({
            name: `random_file_${i}_${randomString(5, 'alphanumeric')}.${isImage ? 'png' : 'txt'}`,
            type: isImage ? 'image/png' : 'text/plain',
            isImage: isImage,
            content: isImage
                ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
                : `Random text content: ${randomString(50)}`
        });
    }

    return {
        projectName: `stress_test_${iteration}_${randomString(10, 'alphanumeric')}`,
        goal: randomBool() ? randomString(100, 'mixed') : randomString(1000, 'unicode'), // Long or Unicode
        model: randomEnum(AiModel),
        cliTool: randomEnum(CliTool),
        interfaceType: randomEnum(InterfaceType),
        includeDevBrowser: randomBool(),
        uiLanguage: randomEnum(AppLanguage),
        outputLanguage: randomEnum(AppLanguage),
        contextFiles: contextFiles
    };
}

// --- Execution ---

async function runStressTest() {
    console.log('Starting Ralph Stress Test (Fuzzing)...');
    console.log('Target: 500 Iterations');

    let passed = 0;
    let failed = 0;
    const errors: { iter: number, config: RalphConfig, error: string }[] = [];
    const TOTAL_ITERATIONS = 500;

    for (let i = 0; i < TOTAL_ITERATIONS; i++) {
        if (i % 50 === 0) process.stdout.write(`\n${i}: `);

        const config = generateRandomConfig(i);

        try {
            const files = generateRalphSystem(config);

            // Basic Integrity Checks
            if (!files || files.length === 0) throw new Error('No files generated');

            const hasPrd = files.some(f => f.filename === 'prd.json');
            if (!hasPrd) throw new Error('Missing prd.json');

            const prdFile = files.find(f => f.filename === 'prd.json');
            try {
                JSON.parse(prdFile?.content || '');
            } catch (e) {
                throw new Error('prd.json is invalid JSON');
            }

            process.stdout.write('.');
            passed++;
        } catch (e: any) {
            process.stdout.write('F');
            failed++;
            errors.push({
                iter: i,
                config,
                error: e.message
            });
        }
    }

    console.log('\n\nStress Test Complete.');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    // Report
    let report = `# Stress Test Report\n\nDate: ${new Date().toISOString()}\nTotal: ${TOTAL_ITERATIONS}\nPassed: ${passed}\nFailed: ${failed}\n\n`;

    if (failed > 0) {
        report += `## Failures\n`;
        errors.forEach(e => {
            report += `### Iteration ${e.iter}\nError: ${e.error}\nConfig:\n\`\`\`json\n${JSON.stringify(e.config, null, 2)}\n\`\`\`\n\n`;
        });
    } else {
        report += `## Success\nSystem was stable under random fuzzing.\n`;
    }

    fs.writeFileSync(path.resolve('STRESS_TEST_REPORT.md'), report);
    console.log('Report written to STRESS_TEST_REPORT.md');

    if (failed > 0) process.exit(1);
}

runStressTest().catch(e => {
    console.error(e);
    process.exit(1);
});
