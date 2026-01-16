# Implementation Plan: Comprehensive Research & Development Strategy

This plan outlines the execution strategy for the multi-phase roadmap defined in `task.md`.

## Phase 1: Broad Research & Discovery (The "Sweep")
**Objective**: Gather raw intelligence on the Jan 2026 AI landscape.
*   **Search Targets**:
    *   **LLMs**: Google, OpenAI, Anthropic, DeepSeek, Mistral, Cohere, Meta, Groq, Cerebras.
    *   **CLIs**: Official vs Community.
    *   **Cloud IDEs**: Antigravity, Project IDX, Replit, Lovable, Bolt.
    *   **Cross-Platform**: Flutter/Dart integration patterns, Node/Web compatibility.
*   **Deliverable**: Populated `RESEARCH_NOTES.md` with links, pricing, and capabilities.

## Phase 2: Screening & Selection (The "Funnel")
**Objective**: Filter the raw data to select the "Best-in-Class" tools for Ralph.
*   **Criteria**:
    *   **Stability**: Is it maintained? (Official > Community).
    *   **Features**: Does it support the required API features (Streaming, JSON mode)?
    *   **Cost**: Is the pricing competitive?
*   **Deliverable**: A finalized list of "Ralph Ecosystem Candidates" to be approved by the user.

## Phase 2.1: Roadmap Refinement (Adaptive Planning)
**Objective**: Use the gathered intelligence to sharpen the subsequent phases.
*   **Action**:
    *   Review `task.md` Phase 3-7.
    *   Update terminology (e.g., if "DeepSeek CLI" doesn't exist, rename task to "DeepSeek via generic Curl").
    *   Refine "Deep Dive" lists to match the selected candidates.

## Phase 3: Deep Dive Research (Usage & Costs)
**Objective**: Gather precise technical specs for implementation.
*   **For Each Selected Candidate**:
    *   **API Spec**: Exact JSON payload structure (Header, Body, Response).
    *   **Auth**: Environment variable names (e.g., `GEMINI_API_KEY`).
    *   **Costing**: Exact price per 1k cost units for Input/Output/Cache.
*   **Specific Focus**:
    *   **Flutter**: How to authenticate and call these APIs from Dart.
    *   **Node/Python**: Official SDK usage patterns.

## Phase 4: System Architecture & Design
**Objective**: Plan the code structure before writing it.
*   **Data Modeling**: Update `types.ts` with new `CliTool` and `AiModel` enums derived from Phase 2.
*   **Service Design**:
    *   `CostEstimator`: Design the lookup table structure.
    *   `PayloadGenerator`: Design the factory pattern for generating payloads.
*   **UI/UX**: Plan the responsive layout and accessibility improvements.

## Phase 5: Implementation (Atomic & Capillary)
**Objective**: Write the code in small, atomic, verified steps.
*   **Step 1**: Core Types & Interfaces.
*   **Step 2**: `CostEstimator` Service (Logic only).
*   **Step 3**: `ralphLogic` Refactoring (The heavy lifting).
    *   Implement one provider at a time (e.g., "Implement Gemini", verify, then "Implement Claude").
*   **Step 4**: Internationalization (Update `i18n.ts` with new strings).

## Phase 6: UI/UX Design & Polish
**Objective**: Make it beautiful and usable.
*   **Tasks**: Implement responsive controls, dark/light mode refinements, and real-time cost feedback in the UI.

## Phase 7: Verification (Multi-Level)
**Objective**: Prove it works.
*   **Level 1 (Browser)**: Verify UI generation and zip formatting.
*   **Level 2 (Terminal)**: Execute generated scripts in a real shell.
*   **Level 3 (Deployment)**: Verify documentation accuracy and deployment readiness.
