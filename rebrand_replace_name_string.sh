#!/usr/bin/env bash
set -euo pipefail

######################################
# VARIJABLE – mijenjaj samo ovdje!
######################################
OLD_UPPER="Aaasaas"
OLD_PROPER="aaasaasa"
OLD_LOWER="aaasaasa"

NEW_UPPER="Aaasaas"
NEW_PROPER="aaasaasa"
NEW_LOWER="aaasaasa"
######################################

ROOT="."
APPLY=0

# Parse CLI args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --path) ROOT="${2:?}"; shift 2 ;;
    --apply) APPLY=1; shift ;;
    -h|--help) echo "Usage: $0 [--path DIR] [--apply]"; exit 0 ;;
    *) echo "Nepoznata opcija: $1"; exit 1 ;;
  esac
done

# Nađi fajlove (tekstualne ekstenzije, preskače .git i node_modules)
mapfile -t FILES < <(find "$ROOT" \
  -path "$ROOT/.git" -prune -o \
  -path "$ROOT/node_modules" -prune -o \
  -type f -print)

echo "Nađeno fajlova: ${#FILES[@]}"

replace_in_file() {
  local f="$1"
  perl -0777 -pe "s/\Q$OLD_UPPER\E/$NEW_UPPER/g;
                  s/\Q$OLD_PROPER\E/$NEW_PROPER/g;
                  s/\Q$OLD_LOWER\E/$NEW_LOWER/g;" "$f" > "$f.__tmp__" \
  && mv "$f.__tmp__" "$f"
}

# STEP 1: zamjena u sadržaju
for f in "${FILES[@]}"; do
  if grep -qE "$OLD_UPPER|$OLD_PROPER|$OLD_LOWER" "$f" 2>/dev/null; then
    if [[ "$APPLY" -eq 1 ]]; then
      replace_in_file "$f"
      echo "[EDIT] $f"
    else
      echo "[PLAN] izmjena u $f"
    fi
  fi
done

# STEP 2: preimenovanje fajlova/foldera
mapfile -t PATHS < <(find "$ROOT" -depth \
  -name "*$OLD_UPPER*" -o -name "*$OLD_PROPER*" -o -name "*$OLD_LOWER*")

for p in "${PATHS[@]}"; do
  newp="$p"
  newp="${newp//$OLD_UPPER/$NEW_UPPER}"
  newp="${newp//$OLD_PROPER/$NEW_PROPER}"
  newp="${newp//$OLD_LOWER/$NEW_LOWER}"
  [[ "$p" == "$newp" ]] && continue
  if [[ "$APPLY" -eq 1 ]]; then
    git mv -f "$p" "$newp" 2>/dev/null || mv -f "$p" "$newp"
    echo "[REN] $p -> $newp"
  else
    echo "[PLAN] rename $p -> $newp"
  fi
done

if [[ "$APPLY" -eq 1 ]]; then
  echo "✅ Završeno."
else
  echo "🛈 Dry-run završen. Pokreni sa --apply da primijeniš."
fi

