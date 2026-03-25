# Known Bugs & Fixes

A record of non-obvious bugs found in this fork, their root causes, and resolutions.

---

## 2026-03-23 — Docker volume mounts caused frontend/backend GP split

**Symptom**: Checking tasks showed correct GP in the UI, but the database was never updated with the custom amounts. After a page reload, GP reverted.

**Root cause**: `docker-compose.yml` mounted `./server` (an empty top-level dir) to an unused container path. `website/common/` was never live-mounted, so the server always ran code baked into the Docker image at build time. The `client-dev` container had a full repo mount and always used the latest code, creating a split.

**Fix**: First corrected to `./website/server` and `./website/common`, but this caused inotify to stop propagating and broke hot reload. Final fix: reverted to a full repo mount (`.:/usr/src/habitica:z`) matching `docker-compose.example.yml`. See [docker.md](docker.md).

---

## 2026-03-23 — Nested Mongoose Schema crashed server on startup

**Symptom**: After the volume mount fix, the server crashed immediately with:
`TypeError: Invalid schema configuration: 'true' is not a valid type at path 'required'`

**Root cause**: The `criticalityChance` sub-schema in `task.js` was created with `new Schema({...}, { _id: false })` without `typeKey: '$type'`. Mongoose 8 interpreted `required: true` as a path (not a schema option). This was hidden before because the server was running old baked-in image code that predated the `criticalityChance` schema.

**Fix**: Added `typeKey: '$type'` to the nested schema options. See [code-patterns.md](code-patterns.md#nested-schema-constructors-must-also-declare-typekey).

---

## 2026-03-24 — Unchecking a daily added GP instead of subtracting

**Symptom**: Unchecking a completed daily awarded GP instead of reversing the award.

**Root cause**: The custom `gpByPriority` lookup in `_addPoints` always returns a positive value. The original code used `delta` (negative when direction is `'down'`) for natural sign handling. When the fixed-amount lookup replaced `delta`, direction was no longer factored in.

**Fix**: `stats.gp += direction === 'down' ? -gpMod : gpMod` in `scoreTask.js` → `_addPoints`.
