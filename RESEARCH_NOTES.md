# RESEARCH_NOTES.md - Jan 2026 Landscape

## 1. LLM Landscape (Jan 2026)

### Major Providers
*   **Google (DeepMind)**:
    *   **Flagship**: Gemini 3 Pro (Multimodal, 1M+ context).
    *   **Speed/Cost**: Gemini 3 Flash.
    *   **Capability**: Top-tier reasoning and coding.
*   **OpenAI**:
    *   **Flagship**: GPT-5.2 (Unified reasoning).
    *   **Coding**: GPT-5.2 Codex (Specialized for CLI/Coding).
    *   **Legacy**: GPT-4o phasing out.
*   **Anthropic**:
    *   **Flagship**: Claude Opus 4.5 (200k context, creative/coding).
    *   **Efficiency**: Claude Sonnet 4.5, Haiku 3.5.
*   **DeepSeek**:
    *   **Flagship**: DeepSeek V3/V4.
    *   **Status**: Strong open model contender, accessible via API & Local.
*   **Meta**:
    *   **Flagship**: LLaMA 4 (Maverick/Scout).
    *   **Focus**: Mobile/Local inference leader.
*   **Others**:
    *   **Mistral**: Mistral Large 3.
    *   **Groq**: Hardware/Cloud provider for ultra-low latency.
    *   **Cerebras**: Wafer-scale inference.

### Emerging/Niche
*   **xAI**: Grok 4.1.
*   **Cohere**: Enterprise secure models.

## 2. CLI & Execution Environments

### Official CLIs
*   **Google**: `gcloud` (General Cloud), `gemini` (Agent/CLI specific).
*   **Anthropic**: `claude` (Claude Code CLI - specialized for terminal usage).
*   **OpenAI**: `codex` (CLI for coding), `openai` (General API).

### Community/Local CLIs
*   **Ollama**: Standard for running local models (Llama 4, Mistral, Gemma).
*   **LLM**: `llm` (Simon Willison's tool) - likely updated for 2026 providers.

### Cloud IDEs
*   **Google Antigravity**: Agent-first architecture, multi-agent workflows.
*   **Project IDX (Firebase Studio)**: Web-based, Gemini integrated.
*   **Replit**: AI-assisted, "vibe coding" (Mobile apps via prompt).
*   **Lovable / Bolt**: Visual/Agentic app builders for non-coders.

## 3. Mobile & Cross-Platform

### Flutter/Dart
*   **Official SDKs**: `google_generative_ai` (Google), `dart_openai` (OpenAI).
*   **Meta-Frameworks**: `langchain_dart`, `flutter_ai_toolkit`.
*   **Pattern**: Hybrid Cloud (Gemini/GPT) + On-Device (Gemma/Llama via `ollama_dart` or TFLite).

### Node.js (Web/Backend)
*   **Runtime**: Node.js 22/24 LTS.
*   **SDKs**: `vercel/ai` (Unified), `langchain.js`.
*   **Official**: `@google/generative-ai`, `openai`, `@anthropic-ai/sdk`.
*   **Agentic**: Trends toward "Context Engines" and Agentic workflows rather than simple completion.
