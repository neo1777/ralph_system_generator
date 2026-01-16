# Ralph Ecosystem Candidate List (Jan 2026)

## 1. Core AI Models (The "Brains")
Selected for optimal balance of reasoning, coding capability, and cost.

*   **Google Ecosystem**: `Gemini 3 Pro` & `Gemini 3 Flash`
    *   *Reason*: Best-in-class context window (2M+) and multimodal reasoning. Flash is unbeatable for speed/cost.
*   **Anthropic Ecosystem**: `Claude Opus 4.5` & `Claude Sonnet 4.5`
    *   *Reason*: Superior coding agent capabilities and "human-like" reasoning.
*   **OpenAI Ecosystem**: `GPT-5.2 Codex`
    *   *Reason*: The gold standard for pure code generation and refactoring.
*   **DeepSeek/Local**: `DeepSeek V3` (via API or Ollama)
    *   *Reason*: Best price/performance ratio for open models.

## 2. Execution Environments (The "Hands")
Selected for official support and feature parity.

*   **Google**: `gemini-cli` (Official)
    *   *Command*: `gemini agent run ...`
    *   *Status*: OFFICIAL.
*   **Anthropic**: `claude-code` (Official)
    *   *Command*: `claude ...`
    *   *Status*: OFFICIAL.
*   **OpenAI**: `codex-cli` (Official)
    *   *Command*: `codex ...`
    *   *Status*: OFFICIAL.
*   **Local**: `ollama`
    *   *Command*: `ollama run deepseek-r1 ...`
    *   *Status*: COMMUNITY STANDARD.

## 3. Tech Stack Compatibility
*   **Web/Backend**: Node.js 22 LTS (using `vercel/ai` SDK).
*   **Mobile**: Flutter 4.x (using `google_generative_ai` & `langchain_dart`).
