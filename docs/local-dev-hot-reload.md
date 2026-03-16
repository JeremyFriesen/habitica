# Local dev (hot reload) + production build side-by-side

This repo supports running two frontends at once:

- **Production-style (built) bundle** served by the server on **http://localhost:3000**
- **Hot-reload dev bundle** served by Vite on **http://localhost:5173**

Both can run simultaneously via Docker Compose.

---

## ✅ Start both (`:3000` + `:5173`)

```sh
docker compose up server mongo client-dev
```

Then you can use:
- **http://localhost:3000** — the server’s built/production bundle (from `website/client/dist`)
- **http://localhost:5173** — Vite dev server with hot reload

---

## ✅ Why `:5173` works in Docker

The Vite dev server proxies API calls to the backend. When run in Docker, it must target the **server container** by service name, not `localhost`.

That is why the `client-dev` service in `docker-compose.yml` sets:

```yaml
BASE_URL: http://server:3000
```

If you see errors like:

```
connect ECONNREFUSED 127.0.0.1:3000
```

it means the proxy is trying to reach `localhost` instead of the server container.

---

## ✅ Stopping / starting everything

- Stop everything:

  ```sh
docker compose down
  ```

- Start everything:

  ```sh
docker compose up -d
  ```

This will bring up `mongo`, `server`, and `client-dev` together.

---

## ✅ When `:3000` needs a rebuild

Whenever you change frontend source files and want `:3000` to reflect the changes, you must rebuild the frontend and restart the server:

```sh
docker compose build server
docker compose up -d server
docker compose exec server sh -c "cd website/client && npm run build"
```

After that, refresh `http://localhost:3000`.
