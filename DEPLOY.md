# Docker Desktop & Coolify deployment

## Logo asset

The site logo lives at **`frontend/public/images/agilemediasolutionslogo.png`**. Next.js serves everything under `public/` at the site root (`/images/...`). The header uses this path.

## Local development (Docker Desktop)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. From the **repository root** (where `docker-compose.yml` is):

   **Command Prompt (Windows):**

   ```bat
   scripts\docker-up.bat
   ```

   **PowerShell:**

   ```powershell
   .\scripts\docker-up.ps1
   ```

   **macOS / Linux:**

   ```bash
   chmod +x scripts/docker-up.sh
   ./scripts/docker-up.sh
   ```

3. On first run, copy `.env.example` → `.env` if needed, then edit **`POSTGRES_PASSWORD`**, **`JWT_SECRET`**, and any ports you need to change.
4. Open **http://localhost:8085** (or whatever you set as `FRONTEND_PORT`).
5. After schema changes or first deploy, sign in to **Admin** and run **Migrate** so Postgres is seeded.

**Handy commands (repo root):**

```bash
docker compose logs -f frontend
docker compose logs -f backend
docker compose down
docker compose up -d --build
```

## Coolify on a VPS (recommended pattern)

Deploy this repo as **one Docker Compose resource** so service names (`frontend`, `backend`, `postgres`, `redis`) stay on the same user-defined network. That way `BACKEND_INTERNAL_URL=http://backend:4000` keeps working for Next.js rewrites.

1. In Coolify: **New resource** → **Docker Compose** → connect your Git repo.
2. Set the compose file path to the root **`docker-compose.yml`**.
3. In **Environment variables** (or Coolify “Shared variables”), set at least:
   - **`CORS_ORIGIN`** — your public site URL, e.g. `https://www.yourdomain.com` (no trailing slash).
   - **`POSTGRES_PASSWORD`** — strong password.
   - **`JWT_SECRET`** — long random string for admin JWTs.
   - Optional: **`FRONTEND_PORT`** / host binding if Coolify maps ports automatically (often you attach a **domain** to the `frontend` service instead of publishing random host ports).
4. **Domains:** attach your public hostname to the **frontend** service (port **3000** inside the container). Expose the **backend** only if you need direct API access; normally the browser only talks to Next, which proxies `/api` to the backend.
5. Rebuild after env changes that affect the Next **build** (`NEXT_PUBLIC_*`, `BACKEND_INTERNAL_URL`).

If Coolify renames services (e.g. prefixed container names), keep the **Compose service name** as `backend` in YAML, or set **`BACKEND_INTERNAL_URL`** to whatever internal URL reaches the API from the frontend container (include port **4000**).

## Security checklist (production)

- Replace default **`JWT_SECRET`** and **`POSTGRES_PASSWORD`**.
- Set **`CORS_ORIGIN`** to your real frontend origin only.
- Use HTTPS on the public domain (Coolify / Lett’s Encrypt).
