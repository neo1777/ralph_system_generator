# Istruzioni: techDoc_1777

## Requisiti di Sistema
Bash, Git, jq, e il tuo strumento CLI scelto

## Setup

### Anthropic Claude Code CLI
npm install -g @anthropic-ai/claude-code
2. Authenticate:
   claude

### Chiavi API
Esegui 'claude' per autenticarti

## Esecuzione

1. Rendi eseguibili gli script
```bash
chmod +x run_ralph.sh
```

2. Inizializza repository git
```bash
git init
git add .
git commit -m "Commit iniziale Ralph"
```

3. Avvia il loop
```bash
./run_ralph.sh
```

## Workflow
Ralph itererà attraverso i task, chiamando il modello AI per ognuno.

---
*Generato da Ralph System Generator*
