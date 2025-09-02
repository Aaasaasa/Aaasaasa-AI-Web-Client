#!/usr/bin/env bash
set -euo pipefail

# scripts/setup-shadcn.sh
# One-shot setup for shadcn-vue in the app/ workspace (Nuxt 4)
# - Ensures app/components.json exists
# - Ensures assets/css/tailwind.css exists (basic directives)
# - Runs shadcn-vue CLI in the app/ workspace to add selected components
#
# Usage:
#   bash scripts/setup-shadcn.sh
#   bash scripts/setup-shadcn.sh button card input   # (optional custom list)

APP_DIR="app"
COMPONENTS_JSON="$APP_DIR/components.json"
CSS_FILE="$APP_DIR/assets/css/tailwind.css"

# Default component set if not provided as args
DEFAULT_COMPONENTS=("scroll-area" "separator" "sheet" "tooltip" "button" "input" "card" "dialog")

# Resolve components to install
if [ "$#" -gt 0 ]; then
  COMPONENTS=("$@")
else
  COMPONENTS=("${DEFAULT_COMPONENTS[@]}")
fi

# 0) Pre-flight checks
if [ ! -d "$APP_DIR" ]; then
  echo "✗ $APP_DIR not found. Run this at the repo root."
  exit 1
fi

# 1) Ensure components.json
if [ ! -f "$COMPONENTS_JSON" ]; then
  echo "• Creating $COMPONENTS_JSON"
  mkdir -p "$APP_DIR"
  cat > "$COMPONENTS_JSON" <<'JSON'
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "assets/css/tailwind.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
JSON
else
  echo "✓ Found $COMPONENTS_JSON"
fi

# 2) Ensure Tailwind entry CSS
if [ ! -f "$CSS_FILE" ]; then
  echo "• Creating $CSS_FILE"
  mkdir -p "$(dirname "$CSS_FILE")"
  cat > "$CSS_FILE" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
/* Optionally:
@import "@nuxt/ui";
*/
CSS
else
  echo "✓ Found $CSS_FILE"
fi

# 3) Run shadcn-vue CLI in app/ workspace
echo "• Installing components: ${COMPONENTS[*]}"
# Use --cwd to make sure CLI operates in app/
pnpm dlx shadcn-vue@latest add "${COMPONENTS[@]}" --cwd "$APP_DIR"

echo "• Done. Components should be in $APP_DIR/components/ui/*"
echo "  If Nuxt warns about duplicate names (UiX vs index.ts), you can remove barrel index.* files:"
echo "  find $APP_DIR/components/ui -maxdepth 2 -name 'index.*' -delete"
