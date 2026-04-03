# Claude Knowledge Index

## Rule: One Source of Truth

Every piece of knowledge must exist in exactly one place. When referencing knowledge from another file, link to it — never copy it. If the same information appears in two places, one of them is wrong.

This applies across all knowledge types: project knowledge, claude knowledge, and your knowledge (memory files).

**Exception**: Behavioral rules ([claude-behavior.md](claude-behavior.md)) are intentionally mirrored in both the repo and memory, because they serve two audiences: the user (repo) and Claude's auto-loaded context (memory). When they conflict, the repo copy wins — flag the conflict immediately and resolve it.

---

## Knowledge Categories

| Category | Where it lives | What it covers |
|---|---|---|
| **Project knowledge** | `CLAUDE.md` + this folder (all files except claude-capabilities.md and claude-behavior.md) | This Habitica fork — architecture, custom mods, Docker, code patterns, bugs, commands |
| **Claude knowledge** | [`claude-capabilities.md`](claude-capabilities.md) | Claude Code skills, agents, tools, and custom commands |
| **Claude behavior** | [`claude-behavior.md`](claude-behavior.md) + Claude's memory | Behavioral rules — mirrored in both; repo copy takes precedence |
| **Your knowledge** | Claude's memory | Learned feedback and project-specific corrections |

---

## Index

| Topic | File | What's in it |
|---|---|---|
| System architecture, request flow, key files | [architecture.md](architecture.md) | Layer overview, task scoring flow, API routing, file map |
| Fork divergences from upstream Habitica | [custom-modifications.md](custom-modifications.md) | GP scoring, criticalityChance, variableValue, admin mode, habit buttons, copper points (CP) |
| Docker services, volumes, hot reload, rebuild | [docker.md](docker.md) | Service ports, volume mounts, rebuild commands |
| Mongoose, shared code rules, module system | [code-patterns.md](code-patterns.md) | typeKey, partial loads, browser-only API restrictions |
| All npm and docker commands | [commands.md](commands.md) | Server, client, test, and docker commands |
| Bug history and root-cause resolutions | [bugs-and-fixes.md](bugs-and-fixes.md) | Volume mount split, nested schema crash, uncheck GP sign bug |
| Upstream sync status | [upstream-sync.md](upstream-sync.md) | Which upstream commits are incorporated, skipped, or pending |
| Admin operations | [admin-ops.md](admin-ops.md) | Granting items, inventory paths, MongoDB admin tasks |
| Skills, agents, custom commands, tools | [claude-capabilities.md](claude-capabilities.md) | What Claude can do and how to invoke it |
| Behavioral rules and guidelines | [claude-behavior.md](claude-behavior.md) | Never guess, proactive knowledge, Vue comments, commit rules, knowledge precedence |
