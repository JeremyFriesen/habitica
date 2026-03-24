# Architecture & Code Flow

## Layers

| Layer | Path | Purpose |
|---|---|---|
| API Server | `website/server/` | Express.js, Node 20. Entry: `index.js` → `server.js` |
| Vue Client | `website/client/` | Vue 2.x SPA, built with Vite. Has its own `package.json`. |
| Shared Logic | `website/common/script/` | Imported by **both** server and client. Game mechanics live here. |

## Task Scoring Flow

When a user checks off a task, TWO things happen:

1. **Optimistic frontend update** — `website/client/src/mixins/scoreTask.js` calls `scoreTask()` from `website/common/script/ops/scoreTask.js` directly on the local in-memory user object. The UI updates immediately.

2. **API call** — `store/actions/tasks.js` fires `POST /api/v4/tasks/:id/score/:direction`. The frontend does NOT apply stats from the API response — it relies entirely on the local call for display.

On the **backend**, the same `scoreTask.js` runs via `website/server/libs/tasks/index.js` → `shared.ops.scoreTask(...)`, then `user.save()` persists to MongoDB.

> If frontend and backend run different versions of `scoreTask.js`, the UI will show values that don't match the database. After a page reload, the server's saved value wins.

## API Routing: v3 vs v4

- `/api/v3/*` — routes from `website/server/controllers/api-v3/`
- `/api/v4/*` — **proxies v3 by default**, then adds/overrides with `website/server/controllers/api-v4/`
- Specific v3 routes skipped by v4 are listed in `v4RouterOverrides` in `website/server/middlewares/appRoutes.js`
- The frontend calls `/api/v4/` exclusively

## Key Files

| File | Role |
|---|---|
| `website/common/script/ops/scoreTask.js` | GP/EXP/MP calculation — primary file for custom scoring |
| `website/common/script/fns/updateStats.js` | Applies a stats delta object back onto the user Mongoose doc |
| `website/server/libs/tasks/index.js` | Server-side `scoreTasks()` — loads task, calls shared ops, saves user |
| `website/server/controllers/api-v3/tasks.js` | `POST /tasks/:id/score/:dir` handler |
| `website/server/middlewares/auth.js` | `authWithHeaders()` — loads user with field projection |
| `website/server/middlewares/appRoutes.js` | Mounts v3/v4 routers, defines v4 overrides |
| `website/server/models/task.js` | Task Mongoose schema. Uses `typeKey: '$type'` throughout. |
| `website/server/models/user/schema.js` | User schema. `stats.gp` is `{ $type: Number, default: 0, min: 0 }` |
| `website/server/models/user/hooks.js` | Pre-save hooks. Caps stats. Uses `isDirectSelected()` guards for partial loads. |
