#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
FRONTEND_DIR="$REPO_ROOT/frontend"

if ! command -v docker >/dev/null 2>&1; then
  echo "[ERRO] Docker nao foi encontrado no PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[ERRO] Inicie o Docker Engine/Desktop e tente novamente." >&2
  exit 1
fi

remover_volumes=false
read -r -p "Apagar tambem os dados dos bancos para recomecar do zero? (s/N): " resposta
if [[ "$resposta" =~ ^[sS]$ ]]; then
  remover_volumes=true
fi

echo "Encerrando backend e bancos..."
if $remover_volumes; then
  (cd "$BACKEND_DIR" && docker compose down --volumes --remove-orphans)
else
  (cd "$BACKEND_DIR" && docker compose down --remove-orphans)
fi

echo "Encerrando frontend..."
(cd "$FRONTEND_DIR" && docker compose down --remove-orphans)

echo "Backend e frontend encerrados."
