import { AiModel, CostEstimate } from '../types';

export const modelPricing: Record<AiModel, CostEstimate> = {
    [AiModel.GOOGLE_GEMINI_3_PRO]: { inputPer1M: 2.00, outputPer1M: 12.00, currency: 'USD' },
    [AiModel.GOOGLE_GEMINI_3_FLASH]: { inputPer1M: 0.10, outputPer1M: 0.40, currency: 'USD' },
    [AiModel.GOOGLE_GEMINI_2_5_FLASH]: { inputPer1M: 0.075, outputPer1M: 0.30, currency: 'USD' },
    [AiModel.CLAUDE_4_5_OPUS]: { inputPer1M: 5.00, outputPer1M: 15.00, currency: 'USD' },
    [AiModel.CLAUDE_4_5_SONNET]: { inputPer1M: 3.00, outputPer1M: 15.00, currency: 'USD' },
    [AiModel.CLAUDE_4_5_HAIKU]: { inputPer1M: 0.25, outputPer1M: 1.25, currency: 'USD' },
    [AiModel.OPENAI_GPT_5_2_CODEX]: { inputPer1M: 1.75, outputPer1M: 14.00, currency: 'USD' },
    [AiModel.OPENAI_GPT_5_2_PRO]: { inputPer1M: 25.00, outputPer1M: 100.00, currency: 'USD' }, // Est.
    [AiModel.DEEPSEEK_V4]: { inputPer1M: 0.14, outputPer1M: 0.28, currency: 'USD' },
    [AiModel.DEEPSEEK_V3]: { inputPer1M: 0.14, outputPer1M: 0.28, currency: 'USD' },
    [AiModel.DEEPSEEK_R1]: { inputPer1M: 0.55, outputPer1M: 2.19, currency: 'USD' },
    [AiModel.MISTRAL_3_SMALL]: { inputPer1M: 0.10, outputPer1M: 0.30, currency: 'USD' },
    [AiModel.MISTRAL_3_MEDIUM]: { inputPer1M: 0.40, outputPer1M: 2.00, currency: 'USD' },
    [AiModel.MISTRAL_LARGE]: { inputPer1M: 2.00, outputPer1M: 6.00, currency: 'USD' },
    [AiModel.GROQ_LLAMA_3_70B]: { inputPer1M: 0.59, outputPer1M: 0.79, currency: 'USD' },
    [AiModel.GROQ_DEEPSEEK_R1]: { inputPer1M: 0.55, outputPer1M: 2.19, currency: 'USD' }
};

export const estimateCost = (model: AiModel, inputTokens: number, outputTokens: number): number => {
    const pricing = modelPricing[model];
    if (!pricing) return 0;
    return (inputTokens * pricing.inputPer1M / 1_000_000) + (outputTokens * pricing.outputPer1M / 1_000_000);
};
