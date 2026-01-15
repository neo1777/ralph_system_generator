# compliance-check - Agents Memory
Modello: Google Gemini 3 Pro (Preview)
Obiettivo: Agisci come Lead Architect/QA. Hai il `README.md` (Requisiti Business) e `DESIGN_DOC.md` (Vincoli Tecnici). 1) Incrociali contro una implementazione ipotetica. 2) Genera una checklist di 5 controlli critici che una pipeline CI/CD dovrebbe eseguire per assicurare che il codice rispetti questi documenti. 3) Controlla specificamente se il vincolo "Monolite" nel Design Doc entra in conflitto con pattern microservizi comuni.
Questo file serve come memoria a lungo termine per Ralph. Contiene contesto, decisioni e knowledge base.

## Initial Context & Reference Files


--- FILE: README.md ---
# Ralph System Generator

**Ralph System Generator** è una dashboard web "Single-File" (Client-side only) progettata per scafoldare istantaneamente ambienti di sviluppo per Agenti AI basati sulla metodologia **"Ralph Loop"** (Recursive Agent Loop with Persistent History).

Questa applicazione permette agli sviluppatori di generare configurazioni pronte all'uso per orchestrare LLM (Gemini, Claude, GPT, Open Source) in cicli di lavoro autonomi, mantenendo il principio del "Fresh Context" (Tabula Rasa) ad ogni iterazione.

## 🚀 Caratteristiche Principali

*   **Generazione Istantanea:** Crea automaticamente la struttura di file necessaria (`prd.json`, `agents.md`, `INSTRUCTIONS.md`, script di orchestrazione).
*   **Catalogo Preset Internazionalizzato (Nuovo):** Include 20 template pronti all'uso (Siti Web, Flutter, Backend Go, Python Data). **Tutto il contenuto dei preset**, inclusi i prompt, le descrizioni e persino i file di mock (codice legacy commentato, README.md simulati), viene tradotto automaticamente in base alla lingua dell'interfaccia scelta (Default: Italiano).
*   **Supporto Multi-Modello:** Configurazioni ottimizzate per **Google Gemini 3 Pro/Flash**, **Claude 3.7**, **OpenAI o1/o3** e modelli locali (**DeepSeek R1**, Llama).
*   **Contesto Avanzato con Upload:** Carica file di testo (es. documentazione, snippet di codice) e immagini (es. mockup UI) direttamente nel contesto iniziale. I file di testo vengono formattati in `agents.md` con delimitatori chiari, le immagini salvate nella cartella `assets/`.
*   **Mock Data Injection:** I preset includono automaticamente file "simulati" (codice legacy sporco, wireframe SVG, log di errori) per permetterti di testare immediatamente le capacità dell'agente.
*   **Dev Browser Integration:** Opzione per iniettare istruzioni specifiche nel System Prompt che abilitano l'agente a "vedere" e verificare l'output visivo su localhost.
*   **Supporto Google Antigravity / Project IDX:** Genera automaticamente il file `.idx/dev.nix` configurato per il comando `nix build` (con flag sperimentali), garantendo un ambiente cloud riproducibile con tutte le dipendenze (`jq`, `gcloud`, `python3`).
*   **UI Moderno e Accessibile:** Design responsivo con **Tema Chiaro/Scuro** (Default: Dark Mode) integrato, accessibile da header.
*   **Interfaccia Duale:**
    *   **Bash Basic:** Script di loop standard per terminali Linux/Mac.
    *   **TUI (Terminal UI):** Interfaccia grafica in Python (`curses`) con **gestione robusta degli errori** (file mancanti, JSON corrotto) e feedback visivo dello stato in tempo reale.
*   **Guida Personalizzata:** Genera un file `INSTRUCTIONS.md` su misura con i comandi esatti per configurare le chiavi API e le dipendenze per l'ambiente scelto.
*   **Internazionalizzazione 100% (i18n):** Interfaccia utente, preset, file di esempio e **tutto il codice generato** (incluso `INSTRUCTIONS.md`, `ralph_tui.py` e script Bash) sono completamente tradotti in 8 lingue (EN, IT, ES, FR, DE, PT, ZH, JA).
*   **Download ZIP:** Scarica l'intero pacchetto pronto per essere estratto ed eseguito, con gestione corretta dei file binari.

## 📦 Catalogo Preset

L'applicazione offre 4 categorie di preset per coprire diversi casi d'uso:

### 1. Web Starters
*   **Personal Portfolio:** Sito statico HTML5/CSS.
*   **React Todo App:** Classica SPA con persistenza LocalStorage.
*   **Chrome Extension:** Manifest V3 con blocco siti (Focus Mode).
*   **Next.js SaaS:** Boilerplate completo con Auth e Dashboard.

### 2. Mobile & Desktop Apps
*   **Flutter Habit Tracker:** App mobile base in Dart (Material 3).
*   **Flutter E-Commerce:** Gestione stato complessa con Provider.
*   **Rust Tauri App:** App desktop con backend Rust e frontend HTML.

### 3. Backend & Data
*   **Python Data Cleaner:** Script Pandas per automazione CSV.
*   **Streamlit Dashboard:** Visualizzazione dati finanziari in Python.
*   **Express.js REST API:** Server Node.js con endpoint CRUD.
*   **Go Microservice:** API ad alte prestazioni con Gin Framework.
*   **RAG CLI Tool:** Chat con documenti locali usando Embeddings.

### 4. Analisi, QA & Refactoring (Expert)
Questi preset caricano automaticamente file "problematici" nel contesto per testare le capacità di reasoning dell'AI. I commenti nel codice e la documentazione simulata sono tradotti nella lingua selezionata:
*   **Performance Optimizer:** Analizza uno script Python O(n^2) e propone ottimizzazioni.
*   **Security Auditor:** Trova e corregge vulnerabilità SQL Injection in codice Express.js.
*   **Bug Hunter:** Debugga codice legacy con gestione asincrona errata.
*   **UI/UX Polish:** Implementa un componente Pixel-Perfect partendo da un wireframe SVG allegato.
*   **Spec Compliance:** Verifica la conformità del codice rispetto a README e Design Doc simulati.

## 🛠️ Come Usare

1.  Scarica il file `index.html`.
2.  Apri `index.html` nel tuo browser.
3.  **L'App parte in Italiano e Tema Scuro** (configurabile dall'header).
4.  **Seleziona un Preset** dal menu a tendina. Vedrai che titolo e descrizione si adattano alla lingua scelta.
5.  Carica ulteriori file di contesto se necessario.
6.  Clicca su **Genera**.
7.  **Leggi il file `INSTRUCTIONS.md`** nell'anteprima per vedere i comandi di setup specifici.
8.  Clicca su **Download ZIP**.

## 💻 Stack Tecnologico

L'applicazione è sviluppata con un approccio "No-Build" moderno per la massima portabilità:

*   **React 19**: Importato via ESM (esm.sh).
*   **Tailwind CSS**: Via CDN con configurazione Dark Mode.
*   **JSZip & FileSaver**: Generazione ZIP client-side (inclusi file binari).
*   **TypeScript**: Transpiling in-browser (in development) o pre-compilato.

## 🤝 Contribuire

Sentiti libero di aprire issue o pull request.

---
*Generated by Ralph System Generator Dashboard*
--- END FILE ---


--- FILE: DESIGN_DOC.md ---
# Design Document: Ralph System Generator

| Documento | Design Tecnico & Specifiche Funzionali |
| :--- | :--- |
| **Progetto** | Ralph System Generator (Web Dashboard) |
| **Versione** | 1.6.0 |
| **Stato** | Implementato |

## 1. Introduzione e Obiettivi

### 1.1 Problema
Configurare un "Ralph Loop" richiede non solo boilerplate, ma spesso l'inclusione di documentazione esistente o mockup grafici per dare contesto iniziale all'agente. Inoltre, l'interazione da terminale può risultare fragile se i file di configurazione (`prd.json`) vengono corrotti.

### 1.2 Soluzione
Creare un'applicazione web "Single File" che generi il codice, le istruzioni dinamiche e integri automaticamente file di contesto. L'interfaccia generata (TUI) deve essere resiliente agli errori di I/O. **Nuovo in v1.6.0:** L'intero sistema, inclusi i contenuti dei preset e i file di esempio, deve essere completamente localizzabile.

## 2. Architettura del Sistema

### 2.1 Stack Tecnologico "No-Build"
*   **Core:** React 19 (via ESM).
*   **Styling:** Tailwind CSS (con configurazione `darkMode: 'class'`).
*   **Logic:** TypeScript.
*   **Zip:** JSZip (Client-side generation).

### 2.2 Componenti Chiave
*   **`services/ralphLogic.ts`**: Gestisce l'array `contextFiles` e genera codice TUI robusto.
    *   *Text Handling:* Legge il contenuto stringa e lo appende ad `agents.md` con delimitatori chiari (`--- FILE: name ---`).
    *   *Image Handling:* Converte DataURL in Blob binari e li aggiunge alla struttura ZIP.
*   **`services/presets.ts` (Rifattorizzato):** Motore di template dinamico.
    *   Invece di esportare una costante statica `RALPH_PRESETS`, ora esporta una funzione `getPresets(lang: AppLanguage)`.
    *   Contiene generatori di funzioni per "Mock Data" (`getMockReadme`, `getLegacyCode`) che ritornano stringhe diverse in base alla lingua (es. commenti in italiano nel codice, requisiti tradotti nei file markdown).
*   **`services/i18n.ts`**: Layer di internazionalizzazione completo per UI e Output generato.

## 3. Specifiche Funzionali

### 3.1 Input Utente
L'utente seleziona parametri critici e ora può caricare file:
1.  **Preset Selector (Localizzato):** Menu a tendina che popola automaticamente la configurazione. I titoli e le descrizioni cambiano dinamicamente se l'utente cambia lingua UI.
2.  **Tool CLI/Model/Goal:** Parametri standard (sovrascritti dal preset se selezionato).
3.  **Context Files:** Input File multiplo. Supporta testo (append) e immagini (assets).
4.  **Theme Toggle:** Switch globale per passare dalla modalità Chiara (default) a quella Scura, con persistenza `localStorage`.

### 3.2 Preset Engine & Deep Localization
Il sistema di preset è stato potenziato per supportare una localizzazione profonda:
*   **Configurazione Dinamica:** Quando si seleziona un preset (es. "Security Auditor"), l'obiettivo (Goal) viene inserito nella casella di testo nella lingua corrente dell'utente.
*   **File Mock Tradotti:** I file allegati automaticamente dai preset (es. `README.md`, `legacy_script.js`) contengono testo e commenti nella lingua dell'utente. Questo permette all'LLM di ricevere un contesto coerente con la lingua di output richiesta.

### 3.3 Logica di Generazione ("The Ralph Logic")

#### 3.3.1 File Generati
Oltre a `prd.json`, `agents.md` e `INSTRUCTIONS.md`, il sistema ora produce:
*   **`agents.md` (Arricchito):** Contiene sezioni `--- FILE: [nome] ---` con il contenuto dei file di testo caricati e riferimenti alle immagini. Include istruzioni "Dev Browser" se abilitate.
*   **`assets/` (Directory):** Contiene i file immagine fisici (PNG/JPG) caricati dall'utente o iniettati dai preset.
*   **`ralph_tui.py` (Robusto):** Include funzioni `load_prd` e `save_prd` con gestione esplicita di `JSONDecodeError`, `FileNotFoundError` e `PermissionError`. Fornisce feedback visivo (colori) sullo stato delle operazioni.
*   **`INSTRUCTIONS.md` (Localizzato):** La guida viene generata dinamicamente nella lingua di output scelta (IT/ES/FR/DE/ecc.), non più hardcoded in inglese.

#### 3.3.2 Gestione Environment
Il sistema riconosce se l'utente è su cloud o locale e adatta i comandi.
*   **Project IDX:** Genera istruzioni specifiche per `nix build` con flag `flakes` abilitati.

### 3.4 Validazione "2026"
Le istruzioni sono state verificate contro le best practice attuali/previste per i seguenti backend CLI:
*   **LLM (simonw):** Supporto plugin (OpenAI, Claude, Gemini).
*   **Project IDX (Nix):** Integrazione nativa environment. Comando esatto:
    `nix build --extra-experimental-features 'nix-command flakes' -o .idx/result idx dev.nix`
*   **Ollama:** Integrazione locale standard.
*   **Claude CLI:** Supporto CLI ufficiale Anthropic.
*   **OpenAI Python:** Supporto CLI via libreria ufficiale.

## 4. Flusso Dati (Upload)

1.  **Upload:** Utente seleziona `docs.txt` e `mockup.png`.
2.  **App.tsx:** `FileReader` legge `docs.txt` come stringa e `mockup.png` come DataURL. Salva nello stato `config`.
3.  **Generate:** `ralphLogic` itera i file.
4.  **Process Text:** `docs.txt` viene concatenato alla stringa template di `agents.md`.
5.  **Process Image:** `mockup.png` (DataURL) viene convertito in Blob binario e aggiunto all'array `files` con path `assets/mockup.png`.
6.  **Zip:** JSZip impacchetta tutto.

## 5. Sicurezza
Le istruzioni spiegano come settare le chiavi API. I file caricati vengono processati **solo nel browser** dell'utente e non vengono mai inviati a nessun server remoto.

## 6. Futuri Sviluppi
*   Rilevamento automatico dell'OS utente (UserAgent).
*   Integrazione WebContainer per esecuzione live.
--- END FILE ---


> Dev Browser: ATTIVO. Assumi che HTML/JS/CSS siano renderizzati su localhost. Verifica l'output visivo.


## Lessons Learned & Intelligence (Compound Engineering)
<!-- L'agente deve aggiornare questa sezione ad ogni iterazione -->
- 

## Architecture Gotchas
<!-- Note specifiche sull'architettura scoperte durante lo sviluppo -->
- 
