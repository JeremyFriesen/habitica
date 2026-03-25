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

## Rebuild Commands

```sh
# After package/Dockerfile changes
docker compose build server && docker compose up -d server

# Build production client bundle (served on :3000)
# Must run on the host (or in client-dev) — the server container has stale baked-in source
cd website/client && npm run build
```

## History: Why the Volume Mounts Were Fixed

The original `docker-compose.yml` mounted `./server:/usr/src/habitica/server:z` — an empty top-level directory to an unused container path. `website/common/` was never live-mounted, so changes to `scoreTask.js` required a full image rebuild. Meanwhile `client-dev` had a full repo mount and always used the latest code. This caused a frontend/backend split where UI showed custom GP values but the DB was updated with old code.

An intermediate fix pointed at `website/server/` and `website/common/`, but this broke inotify propagation and caused hot reload to stop working for both `node --watch` and Vite HMR. Final fix (2026-03-24): reverted to a full repo mount (`.:/usr/src/habitica:z`) matching `docker-compose.example.yml`.
