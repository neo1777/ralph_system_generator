#!/bin/bash
# Ralph Orchestrator per techDoc_1777
# Ottimizzato per: Claude 4.5 Sonnet (Anthropic)
# Strumento CLI: Anthropic Claude Code CLI

PRD_FILE="prd.json"
MEMORY_FILE="agents.md"
PROGRESS_FILE="progress.txt"

if ! command -v jq &> /dev/null; then
    echo "jq è richiesto. Per favore installalo."
    exit 1
fi

echo "Avvio Ralph Loop per techDoc_1777..."

while true; do
  TASK_ID=$(jq -r 'map(select(.passes == false)) | .[0].id' $PRD_FILE)
  if [ "$TASK_ID" == "null" ]; then
    echo "✅ Tutti i task completati!"
    break
  fi

  TASK_DESC=$(jq -r "map(select(.id == $TASK_ID)) | .[0].description" $PRD_FILE)
  CRITERIA=$(jq -r "map(select(.id == $TASK_ID)) | .[0].acceptance_criteria" $PRD_FILE)

  echo "---------------------------------------------------"
  echo "🤖 Lavorando su task #$TASK_ID"
  echo "---------------------------------------------------"

cat system_instruction.txt > input_prompt.txt
echo "" >> input_prompt.txt
cat <<EOF >> input_prompt.txt
CONTEXT: $(cat $MEMORY_FILE)
TASK: $TASK_DESC
CRITERIA: $CRITERIA
EOF

  # 3. Call the Agent (REAL EXECUTION - Interactive)
  echo ">> Chiamando Claude 4.5 Sonnet (Anthropic)..."
  claude-code run -m claude-sonnet-4-5 < input_prompt.txt


  read -p "Il task è passato? (y/n): " RESULT

  if [ "$RESULT" == "y" ]; then
    echo "✨ Task marcato come completato!"
    git add .
    git commit -m "Completa task $TASK_ID"
    tmp=$(mktemp)
    jq "map(if .id == $TASK_ID then .passes = true else . end)" $PRD_FILE > "$tmp" && mv "$tmp" $PRD_FILE
    echo "Iter $(date): Task completato $TASK_ID" >> $PROGRESS_FILE
  else
    echo "❌ Task fallito. Riprovo..."
    echo "Iter $(date): Failed Task $TASK_ID" >> $PROGRESS_FILE
  fi
  sleep 2
done
