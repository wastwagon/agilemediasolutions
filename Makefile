# Convenience targets — see scripts/dev-hot.sh and scripts/dev-docker.sh for details.

.PHONY: dev-hot dev-docker help

help:
	@echo "make dev-hot     — Next hot reload on :3000 + postgres/redis/backend in Docker"
	@echo "make dev-docker  — Full stack in Docker (next dev on FRONTEND_PORT, default :8085)"
	@echo "make up          — Production compose (rebuild frontend image after UI changes)"

dev-hot:
	@./scripts/dev-hot.sh

dev-docker:
	@./scripts/dev-docker.sh

up:
	@docker compose --env-file .env up -d --build
