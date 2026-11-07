#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo " Iniciando backend e frontend"
echo "=========================================="

bash "$SCRIPT_DIR/linux/iniciar-backend.sh"
bash "$SCRIPT_DIR/linux/iniciar-frontend.sh"

echo "Aplicacao pronta: http://localhost:8082"
