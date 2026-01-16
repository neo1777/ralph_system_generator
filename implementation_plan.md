# Implementation Plan - Comprehensive CLI & API Integration Overhaul

The research phase has identified the official and best-practice CLI tools and pricing models for each supported AI provider.

## User Review Required
> [!NOTE]
> **DeepSeek Support**: DeepSeek does not have an official CLI. The generated script will use `curl` to interact directly with their API.
> **OpenAI CLI**: The generated script will use `jq` to parse the JSON response from the `openai` Python CLI.
> **Cost Estimates**: Costs are estimates based on public pricing as of Jan 2026 and may vary.

## 1. Supported Ecosystems & Tools

### Google (Gemini)
*   **Tool**: `@google/gemini-cli` (Interactive)
*   **Cost**: Flash ($0.075/1M), Pro ($1.25/1M)

### Anthropic (Claude)
*   **Tool**: `@anthropic-ai/claude-code` (Interactive)
*   **Cost**: Haiku ($0.80/1M), Sonnet ($3.00/1M), Opus ($15.00/1M)

### OpenAI
*   **Tool**: `openai` (Python CLI) + `jq`
*   **Cost**: GPT-4o-mini ($0.15/1M), GPT-4o ($2.50/1M)

### Local / DeepSeek / Mistral
*   **Ollama**: Interactive/One-shot for local models.
*   **DeepSeek**: `curl` + `jq` (V3: $0.14/1M).
*   **Mistral**: `curl` + `jq` (Small: $0.10/1M, Large: $2.00/1M).
*   **Cohere**: `curl` + `jq` (Command R+: $3.00/1M).
*   **Groq (Llama 3)**: `curl` + `jq` (8B: $0.05/1M, 70B: $0.59/1M).

## 2. Proposed Architecture Changes

### `CliTool` Enum Expansion
We will define strict types for all verified tools:
```typescript
enum CliTool {
  MANUAL = "manual",
  GEMINI_CLI = "gemini",
  CLAUDE_CLI = "claude",
  OPENAI_CLI = "openai",
  OLLAMA = "ollama",
  CURL = "curl" // Generic handler for DeepSeek, Mistral, Cohere, Groq
}
```

### New Feature: Cost Estimation
- New Service: `CostEstimator` in `ralphLogic.ts`.
- Logic: `getEstimatedCost(model): { input, output }`.
- UI: Display estimated cost per 1M tokens in the generated `COSTS.md` and potentially in the UI.

### Logic Refactoring (`ralphLogic.ts`)
- **Interactive Flag**: `true` for Gemini, Claude, Ollama. `false` for others.
- **Command Generator**: robust generation for `curl` commands with correct headers for Groq, Mistral, DeepSeek.

## 3. Documentation & i18n Strategy
- **Audit**: Verify *every* string in `ralphLogic.ts` is localized.
- **New File**: `COSTS.md` generated in the project zip.
- **Update**: `README.md` and `INSTRUCTIONS.md` to reflect new capabilities.

## 4. Verification Strategy
1.  **Automated Interface Check**: Verify UI elements for new tools.
2.  **Logic Verification**: Manually inspect generated `run_ralph.sh` for all 7 providers.
3.  **Cost Verification**: Verify `COSTS.md` data accuracy.
4.  **E2E Test**: Run usage simulation for a sample project.
