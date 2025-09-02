#!/usr/bin/env bash
set -euo pipefail

##
# Aaasaasa AI bootstrap-prod (PRODUCTION)
# ---------------------------------------
# 1. Чисти node_modules кеш и dist/output
# 2. Учитaва .env (сигурно, ред по ред)
# 3. Ради Nuxt build
# 4. Копира renderer у Electron (public + server/index.mjs или server/)
# 5. Ради Electron build (AppImage + .deb)
##

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[BOOTSTRAP-PROD] Чишћење старих артефаката..."
rm -rf "$ROOT_DIR"/{.nuxt,.output,dist,build,.cache}
find "$ROOT_DIR" -name "*.log" -not -path "$ROOT_DIR/qdrant/storage/*" -type f -delete

echo "[BOOTSTRAP-PROD] Учитавам .env..."
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

echo "[BOOTSTRAP-PROD] Провјера ENV..."
echo "  NODE_ENV=$NODE_ENV"
echo "  DEV_SERVER_URL=$DEV_SERVER_URL"

echo "[BOOTSTRAP-PROD] Buildujem Nuxt..."
cd "$ROOT_DIR/app"
pnpm install
pnpm build

echo "[BOOTSTRAP-PROD] Копирам Nuxt renderer у Electron..."
rm -rf "$ROOT_DIR/electron/renderer"
mkdir -p "$ROOT_DIR/electron/renderer"

# увек копирај public
cp -r "$ROOT_DIR/app/.output/public" "$ROOT_DIR/electron/renderer/"

# сервер: различите верзије Nuxt-а
if [ -d "$ROOT_DIR/app/.output/server" ]; then
  cp -r "$ROOT_DIR/app/.output/server" "$ROOT_DIR/electron/renderer/"
elif [ -f "$ROOT_DIR/app/.output/server/index.mjs" ]; then
  mkdir -p "$ROOT_DIR/electron/renderer/server"
  cp "$ROOT_DIR/app/.output/server/index.mjs" "$ROOT_DIR/electron/renderer/server/"
  cp "$ROOT_DIR/app/.output/nitro.json" "$ROOT_DIR/electron/renderer/server/" 2>/dev/null || true
else
  echo "⚠️  Nuxt server output није пронађен."
fi

echo "[BOOTSTRAP-PROD] Buildujem Electron app..."
cd "$ROOT_DIR/electron"
pnpm install

if [ -f "package.json" ]; then
  npx electron-builder --linux AppImage deb
else
  echo "⚠️ Electron build конфигурација није пронађена!"
fi

echo "[BOOTSTRAP-PROD] ✅ Production build завршен!"
