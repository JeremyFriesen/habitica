# Claude Knowledge Index

## Rule: One Source of Truth

Every piece of knowledge must exist in exactly one place. When referencing knowledge from another file, link to it — never copy it. If the same information appears in two places, one of them is wrong.

This applies across all knowledge types: project knowledge, claude knowledge, and your knowledge (memory files).

---

## Knowledge Categories

| Category | Where it lives | What it covers |
|---|---|---|
| **Project knowledge** | `CLAUDE.md` + this folder (all files except claude-capabilities.md) | This Habitica fork — architecture, custom mods, Docker, code patterns, bugs, commands |
| **Claude knowledge** | [`claude-capabilities.md`](claude-capabilities.md) | Claude Code skills, agents, tools, and custom commands |
| **Your knowledge** | `~/.claude/projects/-home-jeremy-docker-habitica/memory/` | Claude's learned behaviors and meta-rules for this project |

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
| Skills, agents, custom commands, tools | [claude-capabilities.md](claude-capabilities.md) | What Claude can do and how to invoke it |
