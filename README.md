# Ralph System Generator

**Ralph System Generator** è una dashboard web "Single-File" (Client-side only) progettata per scafoldare istantaneamente ambienti di sviluppo per Agenti AI basati sulla metodologia **"Ralph Loop"** (Recursive Agent Loop with Persistent History).

Questa applicazione permette agli sviluppatori di generare configurazioni pronte all'uso per orchestrare LLM (Gemini, Claude, GPT, Open Source) in cicli di lavoro autonomi, mantenendo il principio del "Fresh Context" (Tabula Rasa) ad ogni iterazione.

## 🚀 Caratteristiche Principali

*   **Generazione Istantanea:** Crea automaticamente la struttura di file necessaria (`prd.json` formattato, `agents.md`, `INSTRUCTIONS.md`, script di orchestrazione).
*   **Catalogo Preset Internazionalizzato (Nuovo):** Include 20 template pronti all'uso (Siti Web, Flutter, Backend Go, Python Data). **Tutto il contenuto dei preset**, inclusi i prompt, le descrizioni e persino i file di mock (codice legacy commentato, README.md simulati), viene tradotto automaticamente in base alla lingua dell'interfaccia scelta (Default: Italiano).
*   **Supporto Multi-Modello (Jan 2026):** Configurazioni ottimizzate per **Claude 4.5 Sonnet (Default)**, **Google Gemini 3 Pro/Flash**, **OpenAI GPT-5.2 Pro/Codex** e modelli all'avanguardia (**DeepSeek V4/R1**, Llama 4). Supporto nativo per **Mistral 3 AI**, **Cohere Command R+** e **Groq**.
*   **Stima dei Costi Integrata (Nuovo):** Genera automaticamente un file `COSTS.md` con il calcolo dei costi stimati per il modello selezionato (Input/Output per 1M token), basato sui prezzi pubblici aggiornati a Gennaio 2026.
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
*   **Download ZIP Intelligente:** Scarica l'intero pacchetto pronto all'uso con un nome file coerente e sanitizzato basato sul nome del tuo progetto (es. `mio_progetto.zip`). Gestione robusta dei file binari e compatibilità cross-platform.
*   **User Experience (UX) Ottimizzata:**
    *   **Rilevamento Lingua Automatico:** L'app si avvia nella lingua del tuo browser (fallback su Italiano).
    *   **Notifiche Toast:** Feedback visivo immediato per ogni azione (successo/errore).
    *   **Layout Fluido:** Design responsivo che si adatta naturalmente a qualsiasi schermo senza scroll trap.
    *   **Reset Automatico:** L'output si resetta al cambio di preset per evitare confusione.

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
### Versione Live (Consigliata)
Visita semplicemente il sito ufficiale:
👉 **[https://neo1777.github.io/ralph_system_generator/](https://neo1777.github.io/ralph_system_generator/)**

### Uso
1.  **L'App parte nella tua lingua** (rilevata automaticamente) e in Tema Scuro.
2.  **Seleziona un Preset** dal menu a tendina. Titoli, descrizioni e mock code si adatteranno alla lingua.
3.  Personalizza il **Nome Progetto** e l'**Obiettivo**.
4.  Clicca su **Genera Sistema Ralph**.
5.  Leggi l'anteprima dei file generati nel pannello di destra.
6.  Clicca su **Scarica ZIP**.

### Sviluppo Locale
```bash
git clone https://github.com/neo1777/ralph_system_generator.git
cd ralph_system_generator
npm install
npm run dev
```

## ✅ Verifica e QA

Il sistema è stato sottoposto a un rigoroso processo di validazione automatizzata per garantire stabilità e correttezza (Gennaio 2026):

1.  **Test Headless (Matrice Completa):**
    *   Verificati **320 scenari** (8 Lingue x 20 Preset x 2 Interfacce).
    *   Risultato: **100% Pass** su struttura file, internazionalizzazione e conformità "Ralph Loop".
2.  **Verifica Semantica Esaustiva (Nuovo):**
    *   **Preset Matrix Analysis**: 100% success rate su tutti i **20 preset** in tutte le lingue.
    *   **Command Accuracy**: Validata l'esattezza letterale di ogni comando CLI 2026 (`gemini run`, `claude-code`).
3.  **Simulazione "Real-Life" (Phase 8):**
    *   Testati scenari di errore comuni (mancanza Git, payload corrotti, cambi lingua in corsa).
    *   Verificata l'integrità strutturale degli ZIP generati (percorsi assets binari e file TUI).
4.  **E2E Loop Automation:**
    *   Validazione fisica con **@anthropic-ai/claude-code**, **@google/gemini-cli**, **openai-codex** e **ollama**.


## 💻 Stack Tecnologico

L'applicazione è sviluppata con un approccio "No-Build" moderno per la massima portabilità:

*   **Vite**: Build system moderno e velocissimo.
*   **React 19**: Componenti funzionali e Hooks.
*   **Tailwind CSS**: Via CDN con configurazione Dark Mode.
*   **JSZip & FileSaver**: Generazione ZIP client-side (inclusi file binari).
*   **TypeScript**: Transpiling in-browser (in development) o pre-compilato.

## 🤝 Contribuire

Sentiti libero di aprire issue o pull request.

---
*Generated by Ralph System Generator Dashboard*