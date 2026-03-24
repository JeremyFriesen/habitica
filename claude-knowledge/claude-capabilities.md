# Claude Capabilities

What Claude Code can do in this project.

## Skills (invoke with `/skill-name`)

| Skill | When to use |
|---|---|
| `/commit` | Create a well-formatted git commit for staged changes |
| `/statusline` | Configure the Claude Code terminal status line |
| `/simplify` | Review changed code for quality and clean it up |
| `/update-config` | Modify `settings.json` — hooks, permissions, env vars, automated behaviors |
| `/keybindings-help` | Customize keyboard shortcuts in `~/.claude/keybindings.json` |
| `/loop` | Run a prompt or command on a recurring interval |
| `/schedule` | Create scheduled remote agents on a cron schedule |
| `/claude-api` | Build apps using the Anthropic/Claude API or Agent SDK |

## Agents (launched automatically or on request)

| Agent | Purpose |
|---|---|
| `Explore` | Fast codebase search — files by pattern, keywords, architecture questions |
| `Plan` | Architecture design and implementation planning |
| `statusline-setup` | Configure the Claude Code status line |
| `claude-code-guide` | Answer questions about Claude Code features, hooks, MCP, settings |
| `general-purpose` | Multi-step autonomous research and task execution |

## Custom Slash Commands

User-defined commands live in `.claude/commands/`. Claude executes them when invoked by name.

## Tools

| Tool | Use |
|---|---|
| `Read`, `Write`, `Edit` | File operations |
| `Grep`, `Glob` | Code and file search |
| `Bash` | Shell — git, docker, npm, etc. |
| `WebFetch`, `WebSearch` | External research |
| `TaskCreate`, `TaskUpdate` | Track multi-step work within a session |
| `mcp__ide__executeCode` | Run code via IDE integration |
| `mcp__ide__getDiagnostics` | Get IDE diagnostics/errors |
