# Agile Media Solutions Runbook

Quick operational guide for local onboarding and common failures.

## 1) Standard startup

From repo root:

```bash
cp .env.example .env
docker compose up -d --build
```

Expected local URLs:

- Frontend: `http://localhost:8085`
- Backend: `http://localhost:4005`

## 2) First-line diagnostics

Run and paste these when reporting issues:

```bash
docker compose ps
docker compose logs --tail=120 frontend
docker compose logs --tail=120 backend
```

## 3) Common issues and fixes

### A) Docker daemon not available

Symptom: cannot connect to Docker daemon.

Fix: start Docker Desktop, then rerun startup command.

### B) Port conflicts

Symptom: bind errors on startup.

Fix: update `.env`:

- `FRONTEND_PORT`
- `BACKEND_EXT_PORT`
- `POSTGRES_EXT_PORT`
- `REDIS_EXT_PORT`

Then:

```bash
docker compose down
docker compose up -d --build
```

### C) Backend unhealthy

Symptom: backend is `unhealthy`, API calls fail.

Fix:

1. Verify `.env` values: `JWT_SECRET`, `CORS_ORIGIN`, DB settings.
2. Rebuild:

```bash
docker compose down
docker compose up -d --build
docker compose logs -f backend
```

### D) Database auth failures

Symptom: `password authentication failed` in backend logs.

Fix:

- Ensure `POSTGRES_PASSWORD` and `DATABASE_URL` password match.
- If local data reset is acceptable:

```bash
docker compose down -v
docker compose up -d --build
```

### E) Redis connection errors

Symptom: backend logs Redis connect/ping failures.

Fix:

```bash
docker compose restart redis backend
docker compose logs --tail=120 backend
```

### F) Frontend loads but API data missing

Symptom: UI appears but content/API is broken.

Fix:

- Check backend logs for errors.
- Verify `BACKEND_INTERNAL_URL` in `.env`.
- Rebuild app containers:

```bash
docker compose up -d --build frontend backend
```

## 4) Pre-PR validation

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
```

Backend:

```bash
docker compose logs --tail=120 backend
```

Ensure no startup/runtime errors relevant to your change.

## 5) Escalation packet (if unresolved)

Share all outputs:

```bash
docker compose ps
docker compose config
docker compose logs --tail=200 frontend
docker compose logs --tail=200 backend
docker compose logs --tail=200 postgres
docker compose logs --tail=200 redis
```

Also include:

- OS version
- Docker Desktop version
- exact command that failed
- exact error text
