# AgentFlow Builder - Ralph Wiggum Loop Demo

Companion repository for [Ralph Wiggum Loop: The Two Architectures You Need to Understand](https://agenteer.com/blog/ralph-wiggum-loop-the-two-architectures-you-need-to-understand).

**Video walkthrough:** [Watch on YouTube](https://www.youtube.com/watch?v=T_JfTji3xfc)

## What Is Ralph Wiggum Loop?

[Ralph Wiggum Loop](https://ghuntley.com/ralph/) is a technique created by Geoffrey Huntley that lets your AI agent persist through failures for hours—without you having to keep re-prompting it. Watch it like a fireplace, or let it run while you sleep.

This repo demonstrates both approaches discussed in the article: the **plugin approach** and the **bash approach**. Same project, different loop mechanisms.

## What This Demo Builds

**AgentFlow Builder** - a simple drag-and-drop workflow designer - built in 3 iterations:

1. **Canvas** - Dark-themed canvas with draggable nodes
2. **Connections** - Bezier curves connecting nodes
3. **Execution Animation** - Animated pulse through the workflow

The agent builds everything from scratch and verifies everything. You just watch.

## Prerequisites

- [Claude Code CLI](https://code.claude.com/docs/en/overview) (subscription or API key)
- Chrome (for visual testing via [Chrome integration](https://code.claude.com/docs/en/chrome))

**For Plugin Approach only:**
- [ralph-loop plugin](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-loop)

```bash
/plugin marketplace add anthropics/claude-plugins-official
/plugin install ralph-loop
# Restart Claude Code after installing
```

**For Bash Approach:** No plugin needed—just Claude CLI.

## Running the Demo

### Option 1: Plugin Approach

```bash
# Reset to clean state
./reset.sh

# Start Claude with Chrome MCP
claude --model haiku --chrome

# Run the loop
/ralph-loop:ralph-loop "Read ralph/prompt.md for your full instructions. Follow them exactly." --completion-promise "COMPLETE" --max-iterations 5
```

### Option 2: Bash Approach

```bash
# Reset to clean state
./reset.sh

# Run the bash loop (max 5 iterations)
./ralph/run.sh 5
```

### View the Result

After completion, open the generated app:

```bash
python3 -m http.server 8080
# Then open http://localhost:8080/index.html
```

## How It Works

1. **`ralph/spec.md`** - Defines what to build with checkboxes for each iteration
2. **`ralph/prompt.md`** - Instructions that enforce one-task-per-iteration
3. **`reset.sh`** - Resets everything for a fresh run
4. **`ralph/run.sh`** - Bash loop that spawns fresh Claude instances

Each iteration:
- Reads spec.md to find the first unchecked task
- Implements that one task
- Tests with Chrome MCP
- Marks the checkbox complete
- Stops (the loop spawns the next iteration)

## Related

- [Geoffrey Huntley's original Ralph](https://ghuntley.com/ralph/)
- [Huntley on "one task per loop"](https://ghuntley.com/loop/)
- [Ryan Carson's PRD-based Ralph](https://github.com/snarktank/ralph)

## License

MIT
