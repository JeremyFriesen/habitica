# Commands

All development commands for this project.

## Docker

```sh
docker compose up -d                    # Start everything (server :3000, client-dev :5173, mongo)
docker compose up -d server mongo       # API + DB only, no hot-reload client

docker compose build server             # Rebuild server image (after package/Dockerfile changes)
docker compose up -d server             # Restart server after rebuild
cd website/client && npm run build      # Build production client bundle (run on host — server container has stale source)
```

## Server

```sh
npm start            # Start server with --watch (hot reload)
npm run debug        # Start server with --inspect (debugger on port 9229)
npm run lint         # ESLint with auto-fix (server + client)
npm run lint-no-fix  # Lint check only, no changes
```

## Client

```sh
npm run client:dev      # Vite dev server (localhost, non-Docker)
npm run client:build    # Build production bundle to website/client/dist/
npm run client:unit     # Run Vitest unit tests
```

Inside `website/client/`:
```sh
npm run test:unit        # Vitest run
npm run test:unit:watch  # Vitest watch mode
```

## Testing

```sh
npm run test:common               # Shared common script tests (fast, no DB needed)
npm run test:sanity               # Sanity checks
npm run test:content              # Content data tests
npm run test:api:unit             # API unit tests (requires MongoDB)
npm run test:api-v3:integration   # v3 integration tests (requires MongoDB)
npm run test:api-v4:integration   # v4 integration tests (requires MongoDB)
```

Single test file:
```sh
NODE_ENV=test npx mocha test/common/ops/scoreTask.js --require @babel/register
```

## MongoDB for Tests

```sh
npm run docker:mongo:test   # Start test MongoDB via Docker Compose
npm run mongo:test          # Start local MongoDB for tests
```
