#!/bin/bash

# Aaasaasa Web Client: SHADCN + Nuxt + Tailwind Fix Script
# --------------------------------------------------------
# Ovaj skript popravlja probleme sa `shadcn-nuxt` modulом
# koji se ne инсталира правилно преко GitHub линка.
# Проблем: `pnpm add shadcn-nuxt` као GitHub линк прави празан линк у `node_modules`
# Разлог: pnpm не увијек повлачи фајлове из GitHub-а ако није правилно структуриран репо
# Рјешење: ручно уклањање, директно инсталирање, и чишћење кеша.

set -e  # прекини на прву грешку

APP_DIR="$(pwd)"

# 1. Уклањање постојећег модула
echo "[1/5] Removing broken shadcn-nuxt installation..."
pnpm remove shadcn-nuxt || true
rm -rf node_modules/shadcn-nuxt

# 2. Чишћење кеша и старих фајлова
echo "[2/5] Cleaning pnpm lock and cache..."
rm -f pnpm-lock.yaml
m -rf node_modules

# 3. Поновна инсталација директно са GitHub-а (стабилна верзија)
echo "[3/5] Installing shadcn-nuxt from GitHub..."
pnpm add -D github:shadcn-ui/shadcn-nuxt

# 4. Провјера садржаја
if [ -d "node_modules/shadcn-nuxt" ] && [ -f "node_modules/shadcn-nuxt/module.ts" ]; then
  echo "[4/5] shadcn-nuxt successfully installed."
else
  echo "[ERROR] shadcn-nuxt not found or incomplete. Abort."
  exit 1
fi

# 5. Поновна инсталација свих зависности
echo "[5/5] Reinstalling all dependencies..."
pnpm install

echo "✅ shadcn-nuxt setup complete. Run 'pnpm dev' to start development."

# ===========================================
# Следећи корак:
# Направити сличан .sh за DuckDB + IPC preload
# ===========================================
