#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERRO] Docker nao foi encontrado no PATH." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "[ERRO] curl e necessario para verificar a disponibilidade do frontend." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ERRO] Inicie o Docker Engine/Desktop e tente novamente." >&2
  exit 1
fi

echo "Construindo e iniciando somente o frontend..."
(
  cd "$FRONTEND_DIR"
  docker compose up --build --remove-orphans -d
)

echo "Aguardando o frontend ficar pronto..."
for ((attempt = 1; attempt <= 45; attempt++)); do
  if curl --fail --silent --output /dev/null http://localhost:8082; then
    echo "Frontend pronto: http://localhost:8082"
    exit 0
  fi
  sleep 2
done

echo "[AVISO] O container iniciou, mas o frontend ainda nao respondeu dentro do prazo." >&2
echo "Consulte os logs: (cd \"$FRONTEND_DIR\" && docker compose logs -f frontend)" >&2
exit 1
