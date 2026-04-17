# Agile Media Solutions

Marketing site and CMS/API stack for Agile Media Solutions.

## Stack

- Frontend: Next.js (App Router)
- Backend: Node.js + Express
- Data: PostgreSQL + Redis
- Infrastructure: Docker Compose
- Deployment: Coolify (Docker Compose resource)

## Quick Start for Contributors

### Prerequisites

- Docker Desktop
- Git
- Optional: Node.js 20+ for local tooling

### Clone and boot

```bash
git clone <repo-url>
cd "<repo-folder>"
cp .env.example .env
docker compose up -d --build
```

### Local URLs

- Frontend: `http://localhost:8085`
- Backend: `http://localhost:4005`

### Fast development (hot reload)

- macOS/Linux:

```bash
./scripts/dev-hot.sh
```

- Windows:

```bat
scripts\dev-hot.bat
```

### Common commands

```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f backend
docker compose down
```

### Pre-PR checks

```bash
cd frontend
npm install
npm run lint
npm run build
```

When you change the API or `backend/`:

```bash
cd backend
npm ci
npm test
node --check index.js
```

Also verify backend logs are healthy when using Docker:

```bash
docker compose logs -f backend
```

### Troubleshooting

- Docker not running: start Docker Desktop.
- Stale/broken containers:

```bash
docker compose down
docker compose up -d --build
```

- Port conflicts: update `.env` and restart.
- Backend unhealthy: verify `.env` values (`JWT_SECRET`, `CORS_ORIGIN`, DB settings).

## Next documents

- Contributor standards: `CONTRIBUTING.md`
- Triage and debugging: `RUNBOOK.md`
- Deployment details: `DEPLOY.md`
