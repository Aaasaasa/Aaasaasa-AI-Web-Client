#!/usr/bin/env bash
set -euo pipefail

##
# Aaasaasa AI bootstrap (DEV)
# ---------------------------
# 1. Чисти node_modules кеш и dist/output
# 2. Учитaва .env (сигурно, ред по ред)
# 3. Покреће Nuxt + Electron у дев моду
##

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[BOOTSTRAP] Чишћење старих артефаката..."
rm -rf "$ROOT_DIR"/{.nuxt,.output,dist,build,.cache}
# Игнориши qdrant storage логове
find "$ROOT_DIR" -name "*.log" -not -path "$ROOT_DIR/qdrant/storage/*" -type f -delete

echo "[BOOTSTRAP] Учитавам .env..."
if [ -f "$ROOT_DIR/.env" ]; then
  while IFS='=' read -r key value; do
    if [[ -z "$key" ]] || [[ "$key" =~ ^# ]]; then
      continue
    fi
    export "$key=$value"
  done < "$ROOT_DIR/.env"
  echo "  → ENV променљиве су учитане."
else
  echo "  ⚠️  .env није пронађен!"
fi

echo "[BOOTSTRAP] Провјера ENV..."
echo "  NODE_ENV=$NODE_ENV"
echo "  DEV_SERVER_URL=$DEV_SERVER_URL"

echo "[BOOTSTRAP] Покрећем Nuxt dev server..."
cd "$ROOT_DIR/app"
pnpm install
pnpm dev &

NUXT_PID=$!

echo "[BOOTSTRAP] Покрећем Electron main.cjs..."
cd "$ROOT_DIR/electron"
pnpm install
NODE_ENV=development electron main.cjs &

ELECTRON_PID=$!

trap "kill $NUXT_PID $ELECTRON_PID" SIGINT SIGTERM EXIT

wait
