# Local Docker: Making frontend changes show on :3000

Habitica’s Docker `server` service serves the **built frontend** from `website/client/dist` on **port 3000**.

This means:
- Changes to frontend source files (Vue, JS, CSS, etc.) are not visible on `http://localhost:3000` until they are built into `dist`.
- The server caches the static assets aggressively (long `maxAge`), so you need to rebuild and restart to ensure the latest build is served.

## ✅ Workflow to see your frontend changes on :3000

1. **Rebuild the server Docker image (includes latest source):**

```sh
docker compose build server
```

2. **Restart the server container (use updated image):**

```sh
docker compose up -d server
```

3. **Build the frontend assets inside the server container:**

```sh
docker compose exec server sh -c "cd website/client && npm run build"
```

4. **Reload** `http://localhost:3000` (or `http://<your-host>:3000`).

---

## 🔁 Quick dev alternative (fast feedback)

If you want fast UI iteration (hot reload), run the Vite dev server at **http://localhost:5173**. You can run it alongside the server on **http://localhost:3000** so you can quickly iterate on UI while still verifying the full app behavior on the server bundle.

> Note: port 5173 is Vite’s dev server (fast refresh), while port 3000 serves the built/production bundle from `website/client/dist`.

### 🧰 Running both at once (recommended)

To have the **production build on `:3000`** and the **hot-reload dev UI on `:5173`** at the same time, run:

```sh
docker compose up server mongo client-dev
```

Then:
- Visit **http://localhost:3000** to see the built bundle (matches what production would serve)
- Visit **http://localhost:5173** to develop with hot reload

### 🐳 Using Docker Compose for hot reload

When running the Vite dev server in Docker (`docker compose up client-dev`), the client service needs to proxy API requests to the **server container**, not `localhost`.

If the client logs show errors like `connect ECONNREFUSED 127.0.0.1:3000`, update `docker-compose.yml` so the `client-dev` service uses:

```yaml
BASE_URL: http://server:3000
```

That ensures Vite forwards `/api/*` requests to the server container via its Docker service name.
