#!/usr/bin/env bash
# Quick fix script for Electron install problems
# Usage: ./scripts/fix-electron.sh

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT_DIR"

echo "🔧 Killing any running Electron processes..."
pkill -f electron || true

echo "🧹 Cleaning node_modules, lockfile and pnpm store..."
rm -rf node_modules app/node_modules electron/node_modules pnpm-lock.yaml
pnpm store prune || true

rm -rf ~/.cache/electron ~/.cache/electron-builder || true

# Optional: set mirror if behind firewall
# export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
# export ELECTRON_CUSTOM_DIR="v"

echo "📦 Reinstalling dependencies..."
pnpm install

echo "⬇️ Triggering manual Electron binary download..."
pnpm -C electron exec node node_modules/electron/install.js || true

echo "✅ Verifying Electron installation..."
pnpm -C electron exec electron --version || {
  echo "❌ Electron still failed to install. Try pinning a stable version, e.g.:"
  echo "   pnpm -C electron add -D electron@31.3.0"
  exit 1
}

echo "🎉 Done! You can now run: pnpm dev"
