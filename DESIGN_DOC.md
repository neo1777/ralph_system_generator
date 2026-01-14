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