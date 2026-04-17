# Contributing to Agile Media Solutions

Thanks for contributing. This guide keeps team workflow consistent and review-friendly.

## 1) Branching

```bash
git checkout main
git pull
git checkout -b feature/<short-description>
```

Examples:

- `feature/public-i18n-legal-pages`
- `fix/mobile-tabbar-footer-overlap`
- `docs/update-onboarding`

## 2) Local setup

From repo root:

```bash
cp .env.example .env
docker compose up -d --build
```

Local endpoints:

- Frontend: `http://localhost:8085`
- Backend: `http://localhost:4005`

Hot reload:

- macOS/Linux: `./scripts/dev-hot.sh`
- Windows: `scripts\dev-hot.bat`

## 3) Scope and standards

- Keep PRs focused on one feature/fix.
- Avoid unrelated refactors in the same PR.
- Keep diffs minimal and maintainable.
- Preserve public locale routing:
  - English unprefixed
  - `/fr`, `/pt`, `/ar`

## 4) Validation before PR

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm ci
npm test
node --check index.js
```

Optional: watch API logs after changes:

```bash
docker compose logs -f backend
```

Confirm healthy startup and no runtime errors when using Docker.

## 5) Commit style

Use intent-first messages:

- `feat: add locale-aware legal page renderer`
- `fix: prevent mobile tab bar from overlapping footer`
- `docs: align onboarding commands with docker workflow`

## 6) Pull request checklist

- [ ] Branch up to date with `main`
- [ ] Changes are focused and intentional
- [ ] Frontend lint/build pass
- [ ] Backend `npm test` and `node --check index.js` pass (when backend changed)
- [ ] Manual checks completed
- [ ] No secrets committed
- [ ] PR description includes summary + test plan + risks

## 7) Deployment notes

- `main` deploys via Coolify.
- If deploy fails, check Coolify logs first and share actionable errors.
