# Concept route (`/newhomepage`)

## Why edits do not show in Docker until you rebuild

If the site is running from **production** `docker-compose.yml`, the `frontend` service uses a **pre-built** Next.js output copied into the image at build time. That includes everything under `app/newhomepage/`. Changing files on disk does not change what is inside the container until you **rebuild the frontend image**.

This is the same for `/newhomepage`, `/about`, or any other route — not specific to this folder.

## How to see changes immediately

From the **repo root**:

1. **Recommended:** `./scripts/dev-hot.sh` — then open **http://localhost:3000/newhomepage** (Next runs on your machine with hot reload; API/db stay in Docker).
2. **All in Docker:** `./scripts/dev-docker.sh` — then open **http://localhost:8085/newhomepage** (or your `FRONTEND_PORT`). The `./frontend` directory is bind-mounted, so `next dev` picks up edits without rebuilding an image.

From **`frontend/`** only: `npm run dev` → **http://localhost:3000/newhomepage**.

Ensure `.env` has `CORS_ORIGIN` including `http://localhost:3000` if you use `dev-hot` (see root `.env.example`).
