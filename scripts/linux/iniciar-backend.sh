#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERRO] Docker nao foi encontrado no PATH." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "[ERRO] curl e necessario para verificar a disponibilidade da API." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ERRO] Inicie o Docker Engine/Desktop e tente novamente." >&2
  exit 1
fi

echo "Subindo banco de desenvolvimento e API Spring Boot..."
(
  cd "$BACKEND_DIR"
  docker compose up --build --remove-orphans -d api
)

echo "Aguardando a API ficar pronta..."
for ((attempt = 1; attempt <= 60; attempt++)); do
  if curl --fail --silent --output /dev/null http://localhost:8080/api-docs; then
    echo "Backend pronto: http://localhost:8080"
    echo "Swagger: http://localhost:8080/swagger-ui.html"
    exit 0
  fi
  sleep 2
done

echo "[AVISO] Os containers iniciaram, mas a API nao respondeu dentro do prazo." >&2
echo "Consulte os logs: (cd \"$BACKEND_DIR\" && docker compose logs -f api)" >&2
exit 1
