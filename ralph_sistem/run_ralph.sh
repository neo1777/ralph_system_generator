#!/bin/bash
# Ralph Loop Orchestrator for compliance-check
# Optimized for: Google Gemini 3 Pro (Preview)
# CLI Tool: Google Antigravity / Project IDX (Cloud IDE)

PRD_FILE="prd.json"
MEMORY_FILE="agents.md"
PROGRESS_FILE="progress.txt"

if ! command -v jq &> /dev/null; then
    echo "jq is required. Add to dev.nix"
    exit 1
fi

echo "Avvio Ciclo Ralph per compliance-check..."

while true; do
  TASK_ID=$(jq -r 'map(select(.passes == false)) | .[0].id' $PRD_FILE)
  if [ "$TASK_ID" == "null" ]; then
    echo "✅ Tutti i compiti nel PRD superati! Uscita."
    break
  fi

  TASK_DESC=$(jq -r "map(select(.id == $TASK_ID)) | .[0].description" $PRD_FILE)
  CRITERIA=$(jq -r "map(select(.id == $TASK_ID)) | .[0].acceptance_criteria" $PRD_FILE)

  echo "---------------------------------------------------"
  echo "🤖 Ralph sta lavorando al Compito #$TASK_ID"
  echo "---------------------------------------------------"

  cat <<EOF > input_prompt.txt
You are Ralph.
CONTEXT: $(cat $MEMORY_FILE)
TASK: $TASK_DESC
CRITERIA: $CRITERIA
EOF

  # 3. Call the Agent (REAL EXECUTION)
  echo ">> Chiamata a Google Gemini 3 Pro (Preview)..."
  OUTPUT=$(gcloud genai run --model="gemini-3-pro-preview" < input_prompt.txt)
  echo "$OUTPUT"

  read -p "L'agente ha soddisfatto i criteri? (y/n): " RESULT
  
  if [ "$RESULT" == "y" ]; then
    echo "✨ Compito segnato come SUCCESSO."
    tmp=$(mktemp)
    jq "map(if .id == $TASK_ID then .passes = true else . then end)" $PRD_FILE > "$tmp" && mv "$tmp" $PRD_FILE
    echo "Iter $(date): Compito Completato $TASK_ID" >> $PROGRESS_FILE
  else
    echo "❌ Compito FALLITO. Riprovo..."
    echo "Iter $(date): Failed Task $TASK_ID" >> $PROGRESS_FILE
  fi
  sleep 2
done
