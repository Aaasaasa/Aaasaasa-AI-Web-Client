#!/usr/bin/env bash
set -Eeuo pipefail

# Aaasaasa AI — DEV bootstrap
# - Optional clean (only when --clean or CLEAN=1)
# - Loads .env (safely)
# - Ensures deps (incl. electron/cheerio)
# - Starts Nuxt (app/) then Electron (electron/)

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$ROOT_DIR/app"
ELEC_DIR="$ROOT_DIR/electron"
: "${DEV_SERVER_URL:=http://localhost:3000}"

YELLOW='[1;33m'; GREEN='[1;32m'; RED='[1;31m'; BLUE='[1;34m'; NC='[0m'
log() { echo -e "${BLUE}[BOOTSTRAP]${NC} $*"; }
ok()  { echo -e "${GREEN}[OK]${NC} $*"; }
warn(){ echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERR]${NC} $*"; }
need() { command -v "$1" >/dev/null 2>&1 || { err "Missing command: $1"; exit 1; }; }

usage() {
  cat <<EOF
Usage: ./bootstrap.sh [--clean] [--no-clean] [--dev-url URL]

Options:
  --clean        Perform full clean of caches before starting (default: off)
  --no-clean     Do not clean caches (default)
  --dev-url URL  Override DEV_SERVER_URL (default: $DEV_SERVER_URL)

Env vars:
  CLEAN=1        Same as --clean
  DEV_SERVER_URL Override dev server URL
EOF
}

CLEAN=${CLEAN:-0}
while (($#)); do
  case "$1" in
    --clean) CLEAN=1 ;;
    --no-clean) CLEAN=0 ;;
    --dev-url) DEV_SERVER_URL="$2"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) warn "Unknown arg: $1" ;;
  esac
  shift
done

load_env() {
  if [[ -f "$ROOT_DIR/.env" ]]; then
    log "Loading .env …"
    set -a; source "$ROOT_DIR/.env"; set +a
    ok ".env loaded"
  else
    warn ".env not found — using defaults"
  fi
}

clean_caches() {
  log "Cleaning caches …"
  rm -rf "$ROOT_DIR/.nuxt" "$ROOT_DIR/.output" "$ROOT_DIR/.cache" 2>/dev/null || true
  rm -rf "$APP_DIR/.nuxt" "$APP_DIR/.output" "$APP_DIR/node_modules/.cache" 2>/dev/null || true
  rm -rf "$ELEC_DIR/dist" "$ELEC_DIR/release" "$ELEC_DIR/node_modules/.cache" 2>/dev/null || true
  ok "Caches cleaned"
}

ensure_deps() {
  need pnpm
  log "Ensuring dependencies …"
  pushd "$APP_DIR" >/dev/null
  pnpm install
  popd >/dev/null

  pushd "$ELEC_DIR" >/dev/null
  pnpm install
  # Ensure cheerio exists inside electron package (web.cjs depends on it)
  if ! node -e "require('cheerio')" >/dev/null 2>&1; then
    warn "cheerio not found in electron — adding …"
    pnpm add cheerio@^1.1.2
  fi
  popd >/dev/null
  ok "Dependencies ready"
}

wait_for_http() {
  local url="$1"; local tries="${2:-60}"; local delay="${3:-500}"
  log "Waiting for $url …"
  for ((i=1; i<=tries; i++)); do
    if curl -sSf -m 2 "$url" >/dev/null; then ok "Nuxt dev is up"; return 0; fi
    sleep "$((delay))"e-3
  done
  err "Timeout waiting for $url"; return 1
}

start_nuxt() {
  pushd "$APP_DIR" >/dev/null
  log "Starting Nuxt dev (DEV_SERVER_URL=$DEV_SERVER_URL) …"
  pnpm dev &
  NUXT_PID=$!
  popd >/dev/null
  export DEV_SERVER_URL
  wait_for_http "$DEV_SERVER_URL"
}

start_electron() {
  pushd "$ELEC_DIR" >/dev/null
  log "Starting Electron (NODE_ENV=development) …"
  NODE_ENV=development DEV_SERVER_URL="$DEV_SERVER_URL" pnpm dev &
  ELECTRON_PID=$!
  popd >/dev/null
}

shutdown() {
  log "Shutting down …"
  [[ -n "${ELECTRON_PID:-}" ]] && kill "$ELECTRON_PID" 2>/dev/null || true
  [[ -n "${NUXT_PID:-}"     ]] && kill "$NUXT_PID" 2>/dev/null || true
}

main() {
  load_env
  if [[ "$CLEAN" == "1" ]]; then
    clean_caches
  else
    log "Skipping clean (use --clean or CLEAN=1 to enable)"
  fi
  ensure_deps
  start_nuxt
  start_electron
  trap shutdown SIGINT SIGTERM EXIT
  wait
}

main "$@"
