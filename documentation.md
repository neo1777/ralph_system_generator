# Ralph System Generator - Documentation

## 1. Genesi e Filosofia: Il "Ciclo Ralph"
**Perché esiste questo tool?**
L'idea nasce da un limite fondamentale degli attuali LLM: il **Context Drift**. Quando si lavora a progetti complessi in una singola lunga chat, il modello perde coerenza, "dimentica" le specifiche iniziali o entra in loop di correzione infiniti.

La soluzione è il **Ralph Loop** (Recursive Agent Loop with Persistent History), un pattern architetturale che questa applicazione automatizza.

### Il Concetto
Invece di una "Chat", trattiamo lo sviluppo come una serie di **Transazioni Atomiche**:
1.  **Stato Persistente Esterno**: L'LLM non ha memoria. La memoria è nel file `prd.json` (Task Todo) e nel codice su disco.
2.  **Tabula Rasa (Fresh Context)**: Ad ogni singolo task (iterazione), l'agente viene "riavviato". Gli forniamo:
    *   Le Regole del Gioco (`system_instruction.txt`):
        1. Tabula Rasa (Fresh Context)
        2. Atomic Changes
        3. Compound Verification
        4. Manual Verification
    *   La Memoria Aggiornata (`agents.md` + File di Contesto).
    *   *Solo* il Task Corrente (`prd.json` item).
3.  **Output Deterministico**: L'agente non "chatta". Esegue un comando o scrive un file, e il ciclo termina.
4.  **Verifica Umana**: L'uomo approva o rifiuta. Se approva, il task viene marcato `done` nel DB (`prd.json`).

L'applicazione **Ralph System Generator** è il "Bootstrapper" di questo ecosistema. Non esegue l'agente, ma *costruisce la fabbrica* dove l'agente lavorerà.

## 2. Flusso Logico e Algoritmo Generativo

Come trasformiamo questa filosofia in un file ZIP scaricabile? Ecco il flusso logico ad alto livello che avviene nel browser (`services/ralphLogic.ts`):

### Fase A: Definizione dello Stato (Input)
L'utente definisce l'intento (`Goal`) e il dominio (`Preset`).
*   *Esempio*: "Voglio un E-commerce" (Goal) con "Flutter" (Preset).
*   **Algoritmo**: Il sistema carica il template di task ("Schema Scheletrico") dal preset e inietta l'obiettivo utente nelle descrizioni dei task.

### Fase B: Context Assembly (La "Memoria")
Qui avviene la magia della preparazione del contesto "Tabula Rasa".
1.  **Aggregazione**: L'app prende i file caricati dall'utente (PDF specifiche, Immagini wireframe).
2.  **Normalizzazione**:
    *   *Testo*: Viene concatenato in `agents.md` con header delimitatori (`--- FILE: specs.txt ---`). Questo permette all'LLM di distinguere file diversi in un unico prompt.
    *   *Immagini*: Vengono convertite in Blob binari e mappate in una cartella virtuale `assets/`.
3.  **Injection**: In `agents.md` viene iniettato un riferimento esplicito: *"Refer to assets/mockup.png for UI details"*.

### Fase C: Generazione dell'Orchestratore (Il "Loop")
L'app scrive dinamicamente lo script (`run_ralph.sh` o `ralph_tui.py`) che eseguirà materialmente il ciclo.
*   **Logica generata**:
    ```bash
    WHILE (esistono task non completati in prd.json):
       1. Leggi prd.json (jq) -> `jq .items`.
       2. Prendi il primo task 'false'.
       3. Costruisci Prompt = [System Rules] + [Agents.md] + [Current Task].
       3. Chiama CLI (Gemini/Claude) con il Prompt.
       4. Mostra Output all'Umano.
       5. SE Umano approva -> Aggiorna prd.json (task: true).
       6. ELSE -> Aggiungi feedback umano al prossimo prompt.
    ```
L'app deve generare questo codice *adattandolo* al tool CLI scelto dall'utente (es. sintassi diversa per Gemini vs Claude).

### Fase D: Packaging (Output)
Tutto viene serializzato in memoria.
*   I file di testo diventano stringhe UTF-8.
*   Gli asset rimangono dati binari.
*   **Zip**: `JSZip` comprime la struttura di directory virtuale.

---

## 3. Directory Structure & Key Files

### Root
- **`App.tsx`**: The main entry point and UI orchestrator. Manages application state (`RalphConfig`), handles file uploads (drag & drop), and renders the interactive preview.
- **`types.ts`**: TypeScript definitions for the core domain (`RalphConfig`, `GeneratedFile`, `AppLanguage`, `AiModel`).
- **`DESIGN_DOC.md`**: High-level architectural decisions and version history.

### Services (`/services`)
- **`ralphLogic.ts`**: The core generator engine.
    - Takes `RalphConfig` as input.
    - Returns `GeneratedFile[]`.
    - Contains the logic for constructing `run_ralph.sh` (Bash loop) and `ralph_tui.py` (Python TUI).
    - Handles dynamic construction of `agents.md` (injecting user uploads).
- **`presets.ts`**: Defines the templates (`getPresets(lang)`).
    - Contains logic to generate localized "mock data" (e.g., legacy code, READMEs) to populate the agent's context for testing.
- **`i18n.ts`**: Localization dictionary.
    - Manages translations for UI labels and *generated content* (e.g., comments in the Bash script, system prompts).
- **`PayloadGenerator.ts`**: Generates JSON payloads for cURL-based CLI tools (Gemini/Claude).
- **`CostEstimator.ts`**: Calculates expected token costs based on model selection.

### Scripts (`/scripts`)
A robust set of verification scripts used for CI/CD and integrity checking (written in TypeScript/Node.js):
- **`verify_ralph.ts`**: Structural integrity check (Level 1).
- **`verify_output_content.ts`**: Semantic verification of all 20 presets across languages (Level 7).
- **`verify_realistic_scenarios.ts`**: Simulates user errors (missing Git, generic CLI names) and verifies fixes (Level 8).
- **`stress_test_ralph.ts`**: Fuzzing tool that generates 500+ random configurations to test stability.
- **`final_e2e_test.ts`**: Mocks an entire agent loop execution, verifying Git commits and PRD updates.

## Application Logic Flow

1.  **Configuration**: User selects a Preset or configures manually (Model, Language, Interface).
2.  **Context Injection**: User uploads files. Images are converted to DataURLs; Text is read as string.
3.  **Generation (`ralphLogic.ts`)**:
    *   **PRD Generation**: Creates `prd.json` with tasks derived from the Preset Goal.
    *   **Memory Assembly**: Creates `agents.md`, appending interpreted text files and referencing image assets.
    *   **Orchestration Script**: Generates `run_ralph.sh` or `ralph_tui.py` tailored to the selected CLI tool (Gemini, Claude, etc.).
    *   **Instruction Guide**: Dynamic `INSTRUCTIONS.md` with step-by-step setup commands for the specific OS/Tool combination.
4.  **Download**: The `CodeViewer` component uses `JSZip` to bundle the virtual file objects into a ZIP and triggers `file-saver`.

## Output Structure (The "Ralph System")

The generated ZIP contains:

| File | Description |
| :--- | :--- |
| **`prd.json`** | The "Database". A JSON Object containing an `items` array of tasks. The agent reads this to know what to do next. |
| **`agents.md`** | The "Long-term Memory". Contains project goals, rules (System Prompt), and all user-uploaded context files. Refreshed at every loop iteration. |
| **`run_ralph.sh`** | (Bash Mode) The loop script. Checks dependencies (`jq`, `git`), constructs the prompt, calls the CLI, and asks for user verification. |
| **`ralph_tui.py`** | (TUI Mode) A Python `curses` interface that wraps the loop. Provides a safer UX with JSON error handling and visual status indicators. |
| **`system_instruction.txt`** | The core personality and rules for the Agent (e.g., "Always start with fresh context"). |
| **`INSTRUCTIONS.md`** | A README for the human user on how to install tools and start the system. |
| **`COSTS.md`** | Estimated running costs for the project based on the selected LLM. |
| **`assets/`** | Directory containing uploaded images or mock binaries. |

## Verification Strategy

The codebase emphasizes "High Assurance" through its script suite:
- **Structural**: Ensures all essential files exist.
- **Linguistic**: Verifies that Italian presets generate Italian PRDs and System Prompts.
- **Functional**: "Mock" execution ensures that the generated bash scripts actually run and interact with Git correctly.
