#!/bin/bash
# Ralph Loop Orchestrator for Test_ralph_test_llm
# Optimized for: OpenAI GPT-4o
# CLI Tool: LLM CLI (simonw/llm) - Recommended

PRD_FILE="prd.json"
MEMORY_FILE="agents.md"
PROGRESS_FILE="progress.txt"

if ! command -v jq &> /dev/null; then
    echo "jq is required. Please install it."
    exit 1
fi

echo "Starting Ralph Loop for Test_ralph_test_llm..."

while true; do
  TASK_ID=$(jq -r 'map(select(.passes == false)) | .[0].id' $PRD_FILE)
  if [ "$TASK_ID" == "null" ]; then
    echo "✅ All tasks in PRD passed! Exiting."
    break
  fi

  TASK_DESC=$(jq -r "map(select(.id == $TASK_ID)) | .[0].description" $PRD_FILE)
  CRITERIA=$(jq -r "map(select(.id == $TASK_ID)) | .[0].acceptance_criteria" $PRD_FILE)

  echo "---------------------------------------------------"
  echo "🤖 Ralph is working on Task #$TASK_ID"
  echo "---------------------------------------------------"

cat system_instruction.txt > input_prompt.txt
echo "" >> input_prompt.txt
cat <<EOF >> input_prompt.txt
CONTEXT: $(cat $MEMORY_FILE)
TASK: $TASK_DESC
CRITERIA: $CRITERIA
EOF

  # 3. Call the Agent (REAL EXECUTION)
  echo ">> Calling OpenAI GPT-4o..."
  OUTPUT=$(llm -m gpt-4o < input_prompt.txt)
  echo "$OUTPUT"

  read -p "Did the agent satisfy the criteria? (y/n): " RESULT
  
  if [ "$RESULT" == "y" ]; then
    echo "✨ Task marked as SUCCESS."
    git add .
    git commit -m "Ralph: Completed Task $TASK_ID"
    tmp=$(mktemp)
    jq "map(if .id == $TASK_ID then .passes = true else . end)" $PRD_FILE > "$tmp" && mv "$tmp" $PRD_FILE
    echo "Iter $(date): Completed Task $TASK_ID" >> $PROGRESS_FILE
  else
    echo "❌ Task FAILED. Retrying..."
    echo "Iter $(date): Failed Task $TASK_ID" >> $PROGRESS_FILE
  fi
  sleep 2
done
