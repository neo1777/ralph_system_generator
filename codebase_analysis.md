# Comprehensive Codebase Analysis (Jan 2026)

## 1. State of the Union
The codebase (`v1.4.0`) is largely aligned with the Jan 2026 roadmap, specifically in `types.ts` and `ralphLogic.ts`. The recent updates to specific model IDs (`gemini-3-pro`, `gpt-5.2`) are present.

## 2. Gap Analysis & Refactoring Targets

### A. Cost Estimation (`CostEstimator.ts`)
*   **Current State**: Likely contains placeholder or outdated 2025 pricing.
*   **Target**: specific update to `modelPricing` map with verified 2026 data.
    *   Gemini 3 Flash: $0.10 / $0.40 (Aggressive pricing found in research).
    *   Gemini 3 Pro: $2.00 / $12.00.
    *   Claude Opus 4.5: $5.00 / $15.00.
    *   GPT-5.2 Codex: $1.75 / $14.00.

### B. Payload Generation (`ralphLogic.ts` -> `payload_gen.py`)
*   **Current State**: Basic generic JSON structures.
*   **Target**: Align strictly with `API_TECHNICAL_SPECS.md`.
    *   Ensure `generationConfig` is used for Gemini.
    *   Ensure `anthropic-version` header is handled in the Curl command generation if possible (or noted).

### C. Internationalization (`i18n.ts`)
*   **Current State**: Italian is fully supported. ES/FR/DE/etc. are empty (fallback to EN).
*   **Target**: While comprehensive, we can leave the fallbacks for now, but ensure the *technical* keys (like `tool_gemini`) are accurate in the EN/IT dicts.

## 3. Secondary Implementation Plan (File-Level)

### Phase 5 Execution
1.  **Modify `services/CostEstimator.ts`**:
    *   Update `modelPricing` object.
2.  **Modify `services/ralphLogic.ts`**:
    *   Update `payloadGenScript` string to match `API_TECHNICAL_SPECS.md`.
    *   Verify `cliCommand` construction for `CURL` option.
3.  **Modify `services/presets.ts`**:
    *   Ensure "Quick Start" presets use the new `AiModel` enum values (e.g. defaults to `GEMINI_3_FLASH` instead of older models).

## 4. Bug Vectors
*   **Vector**: Generated `run_ralph.sh` might fail if `jq` is not present (Checking logic exists, but need to be sure).
*   **Vector**: `payload_gen.py` might fail on Windows if not handled (App generates a `.sh` file, so implied Linux/Mac environment).
