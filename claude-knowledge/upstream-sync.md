# Upstream Sync Tracking

Tracks upstream HabitRPG/habitica commits since the fork diverged, and their disposition in this fork.

**Merge base**: `486f15df0f` (the last upstream commit this fork shares)
**Upstream remote**: `https://github.com/HabitRPG/habitica.git` (fetch with `git fetch upstream`)

---

## Status Key

| Status | Meaning |
|---|---|
| ✅ Incorporated | Already cherry-picked or equivalent change exists in this fork |
| ⏭ Skipped | Reviewed and intentionally left out |
| 🔲 Pending | Not yet reviewed or applied |

---

## Upstream Commits Since Merge Base

### Already Incorporated ✅

| Upstream commit | Our commit | Description |
|---|---|---|
| `7ae059e2` | `13105b64` | fix(sprites): restore missing animations |
| `e85a2bae` | `b803b8020` | fix: prevent duplicate streak achievement notifications |
| `07275bd5` | `10987460` | fix(security): don't reuse IV for cryptography |
| `74fc543e` | `278e7190` | Orb of Rebirth UI updates (count usage, new modal) |
| `836e6324` | `815dad61` | fix(emails): correct variable name in group plan invites |
| `7a6d64f1` | `c2736dd6` | Duplicate tags bug fix in task modal |
| `c3c2607b` | `a575fc79` | Remove join retired public guild loophole |
| `31b27813` | `2eb336a4` | April Fools content + seasonal quests/potions/sprites |
| `a6e87452` | `9a3ff9c1` | fix(background): add price for mobile logic |

---

### Skipped ⏭

None currently.

---

### Pending 🔲

None currently. All commits since merge base have been reviewed.

---

## Notes

- Version bump commits (`5.46.2`, `5.46.3`, etc.), translation commits (Weblate), and submodule updates are excluded — they are never merged.
- Run `git fetch upstream && git log 486f15df0f..upstream/develop --oneline` to check for new upstream commits.
- When cherry-picking, watch for conflicts with custom mods (scoreTask.js, user schema, header menu, task.vue).
