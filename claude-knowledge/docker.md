# Docker Dev Environment

## Services

| Service | Port | Purpose |
|---|---|---|
| `server` | 3000 | Express API + production client bundle (`website/client/dist/`) |
| `client-dev` | 5173 | Vite dev server with hot reload |
| `mongo` | 27017 | MongoDB 7 with replica set |

```sh
# Start everything (detached)
docker compose up -d

# API + DB only — skip client-dev when you don't need :5173
docker compose up -d server mongo
```

## Volume Mounts

### server
Both `server` and `client-dev` mount the full repo (matching `docker-compose.example.yml`):
```
.  →  /usr/src/habitica         (full repo, both containers)
/usr/src/habitica/node_modules  (anonymous volume, protects node_modules)
```
`client-dev` additionally protects `/usr/src/habitica/website/client/node_modules`.

This unified single-mount approach is required for reliable hot reload. Selective subdirectory mounts (e.g. only `website/server/` and `website/common/`) break inotify event propagation and cause `node --watch` / Vite HMR to miss host file changes.

### client-dev
Mounts the entire repo (with node_modules overrides to keep container deps):
```
./  →  /usr/src/habitica
```

> `website/client/dist/` is live-mounted so production builds propagate to `:3000` immediately without a container restart.

## Picking Up Server Changes

The server container runs `node --watch`, which should auto-restart when source files change via the volume mount. In practice it can miss changes — if server-side edits (models, controllers, middleware) don't seem to take effect, restart manually:

```sh
docker compose restart server
```

This is required any time you change Mongoose schema files, since the schema is loaded once at startup. If you set a new schema field in MongoDB *before* restarting the server, `strict: true` may strip it on the next `user.save()` — always restart first, then set the field.

## Rebuild Commands

```sh
# After package/Dockerfile changes
docker compose build server && docker compose up -d server

# Build production client bundle (served on :3000)
# Must run on the host (or in client-dev) — the server container has stale baked-in source
cd website/client && npm run build
```

## History: Why the Volume Mounts Were Fixed

See [bugs-and-fixes.md](bugs-and-fixes.md) → "Docker volume mounts caused frontend/backend GP split".
