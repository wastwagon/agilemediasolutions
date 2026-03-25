# Agile Media Solutions — Frontend (Next.js)

Marketing site and admin UI for **Agile Media Solutions**, built with **Next.js** (App Router), React, and CSS. There are no standalone HTML pages; everything is rendered by Next.js.

## Run locally

From this `frontend` folder:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

### Windows shortcuts

- Double-click **`Start-Site.bat`** — installs dependencies if needed, then starts the dev server and opens the browser.
- Or run **`start-server.ps1`** in PowerShell.

## Run with Docker (full stack)

From the **repository root** (not only `frontend`), use the main compose file so the API and database are available:

```bash
docker compose up -d --build
```

The site is typically at **http://localhost:8085** (see root `.env.example` for `FRONTEND_PORT`).

## Build for production

```bash
npm run build
npm start
```

The `Dockerfile` in this folder builds the **standalone** Next.js output (see `next.config.mjs`).

## Project layout (high level)

- `app/` — routes, pages, layouts, global styles
- `components/` — shared UI
- `public/` — static assets (images, favicon)
- `hooks/` — client hooks

## Tech stack

- Next.js 15+, React 19
- Framer Motion, Lenis (where used)
- Backend API is separate (see repo `backend/`); `/api` is rewritten to the backend in Docker.
