import { AiModel, RalphConfig } from '../types';

export const generatePayload = (config: RalphConfig): string => {
    const { model, goal, contextFiles } = config;

    // Base structure for text-based prompts
    const prompt = `Goal: ${goal}\n\nContext:\n${contextFiles.map(f => `File: ${f.name}\nContent:\n${f.content}`).join('\n\n')}`;

    switch (model) {
        // GOOGLE GEMINI (3.0 & 2.5)
        case AiModel.GOOGLE_GEMINI_3_PRO:
        case AiModel.GOOGLE_GEMINI_3_FLASH:
        case AiModel.GOOGLE_GEMINI_2_5_FLASH:
            return JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain"
                }
            }, null, 2);

        // ANTHROPIC CLAUDE (4.5)
        case AiModel.CLAUDE_4_5_OPUS:
        case AiModel.CLAUDE_4_5_SONNET:
        case AiModel.CLAUDE_4_5_HAIKU:
            let anthropicModel = 'claude-3-5-sonnet-20240620'; // Fallback
            if (model === AiModel.CLAUDE_4_5_OPUS) anthropicModel = 'claude-4-5-opus-20251201';
            if (model === AiModel.CLAUDE_4_5_SONNET) anthropicModel = 'claude-sonnet-4-5'; // Hypothetical ID
            if (model === AiModel.CLAUDE_4_5_HAIKU) anthropicModel = 'claude-haiku-4-5';

            return JSON.stringify({
                model: anthropicModel,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }]
            }, null, 2);

        // OPENAI (GPT-5.2)
        case AiModel.OPENAI_GPT_5_2_CODEX:
        case AiModel.OPENAI_GPT_5_2_PRO:
            return JSON.stringify({
                model: model === AiModel.OPENAI_GPT_5_2_CODEX ? 'gpt-5.2-codex-preview' : 'gpt-5.2-pro',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            }, null, 2);

        // OPENAI COMPATIBLE (DeepSeek, Mistral, Groq)
        case AiModel.DEEPSEEK_V4:
        case AiModel.DEEPSEEK_V3:
        case AiModel.DEEPSEEK_R1:
        case AiModel.MISTRAL_3_SMALL:
        case AiModel.MISTRAL_3_MEDIUM:
        case AiModel.MISTRAL_LARGE:
        case AiModel.GROQ_LLAMA_3_70B:
        case AiModel.GROQ_DEEPSEEK_R1:
            let compatModelId = 'deepseek-chat';
            if (model === AiModel.DEEPSEEK_V4) compatModelId = 'deepseek-v4';
            if (model === AiModel.DEEPSEEK_R1) compatModelId = 'deepseek-reasoner';
            if (model === AiModel.MISTRAL_LARGE) compatModelId = 'mistral-large-latest';
            if (model === AiModel.GROQ_LLAMA_3_70B) compatModelId = 'llama3-70b-8192';

            return JSON.stringify({
                model: compatModelId,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            }, null, 2);

        default:
            return JSON.stringify({
                model: 'unknown-model',
                messages: [{ role: 'user', content: prompt }]
            }, null, 2);
    }
};
