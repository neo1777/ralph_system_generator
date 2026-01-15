# Istruzioni Sistema Ralph: csv-cleaner-bot

## Requisiti di Sistema
- Git
- jq (Processore JSON da riga di comando)
- Python 3.8+ (per TUI/Orchestrator)
- Node.js (se si usano progetti JS/TS)
- Tool CLI selezionato installato (vedi sotto)

## Installazione & Setup

### Claude CLI (via llm - Anthropic)
1. Installa LLM di Simon Willison:
   `pip install llm` o `brew install llm`
   `llm install llm-claude-3`

### Configurazione Chiavi API
Esegui quanto segue per impostare le chiavi:
`llm keys set claude`

## Esecuzione di Ralph

1. Rendi gli script eseguibili:
   ```bash
   chmod +x run_ralph.sh
   
   ```

2. Inizializza Git (per cronologia atomica):
   ```bash
   git init
   git add .
   git commit -m "Configurazione Iniziale Ralph"
   ```

3. Avvia il Ciclo:
   ```bash
   ./run_ralph.sh
   ```

## Ciclo di Lavoro
1. Ralph legge `prd.json` per trovare il prossimo compito incompleto.
2. Legge `agents.md` per il contesto a lungo termine.
3. Genera un prompt e chiama **claude-3-5-sonnet-latest**.
4. Tu verifichi l'output. Se valido, il compito è segnato come fatto.
5. Ripeti finché tutti i compiti sono completi.

---
*Generato da Ralph System Generator (Edizione 2026)*
