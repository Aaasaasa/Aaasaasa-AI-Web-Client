#!/usr/bin/env bash
set -euo pipefail

# Rebrand script: replace "aaasaasa" -> "aaasaasa" (i varijante) u sadržaju fajlova i u imenima fajlova/foldera.
# - Podržava git (ako postoji .git, koristi git mv)
# - Default: dry-run (prikaže šta bi uradila). Dodaj --apply za stvarne izmjene.
# - Preskače uobičajene direktorije: .git, node_modules, vendor, dist, build, .next, .nuxt, .idea, .vscode, var, pub/static
# - Target ekstenzije su tekstualne; možeš suziti listu sa --ext.
#
# Primjeri:
#   bash rebrand.sh --path .                       # dry-run
#   bash rebrand.sh --path . --apply               # primijeni izmjene
#   bash rebrand.sh --path ./srv --ext js,ts,php   # ograniči na određene tipove
#   bash rebrand.sh --path . --upper Aaasaas          # zamijeni Aaasaas -> Aaasaas (default)
#   bash rebrand.sh --path . --keep-backups        # čuvaj .bak fajlove od zamjene u sadržaju

ROOT="."
APPLY=0
KEEP_BACKUPS=0
# Mapiranja vrijednosti (možeš ih mijenjati kroz CLI)
LOWER_TO="aaasaasa"  # aaasaasa -> aaasaasa
PROPER_TO="aaasaasa" # aaasaasa -> aaasaasa
UPPER_TO="Aaasaas"  # Aaasaas -> Aaasaas  (ako želiš sve malo, stavi aaasaasa)

# -depth -name '*Aaasaas*' -o -name '*aaasaasa*' -o -name '*aaasaasa*' -print 

# Default ekstenzije (pokrivaju najčešći tekstualni sadržaj)
EXTENSIONS="js,ts,tsx,jsx,vue,php,html,css,scss,less,md,txt,json,yaml,yml,xml,ini,env,py,rb,go,rs,java,kt,c,cpp,h,cs,sh,zsh,bash,pl,sql,twig,liquid,graphql,mdx,conf,properties"

# Exclude direktoriji (glob)
EXCLUDES=( ".git" "node_modules" "vendor" "dist" "build" ".next" ".nuxt" ".idea" ".vscode" "var" "pub/static" "coverage" "tmp" ".cache" )

usage() {
  sed -n '1,70p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --path) ROOT="${2:?}"; shift 2 ;;
    --apply) APPLY=1; shift ;;
    --keep-backups) KEEP_BACKUPS=1; shift ;;
    --ext) EXTENSIONS="${2:?}"; shift 2 ;;
    --lower) LOWER_TO="${2:?}"; shift 2 ;;
    --proper) PROPER_TO="${2:?}"; shift 2 ;;
    --upper) UPPER_TO="${2:?}"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Nepoznata opcija: $1"; usage ;;
  esac
done

if [[ ! -d "$ROOT" ]]; then
  echo "Greška: path ne postoji: $ROOT" >&2
  exit 1
fi

# Detekcija git moda
GIT_MODE=0
if [[ -d "$ROOT/.git" ]]; then
  GIT_MODE=1
fi

# Izgradnja -prune izraza za find
PRUNE_ARGS=()
for ex in "${EXCLUDES[@]}"; do
  PRUNE_ARGS+=( -path "$ROOT/$ex" -prune -o )
done

# Izgradnja -name filtera po ekstenzijama
IFS=',' read -r -a EXT_ARR <<< "$EXTENSIONS"
NAME_ARGS=()
for ext in "${EXT_ARR[@]}"; do
  ext="${ext##*.}"
  NAME_ARGS+=( -name "*.${ext}" -o )
done
# ukloni zadnje -o
unset 'NAME_ARGS[${#NAME_ARGS[@]}-1]'

# Lista kandidata (tekstualni fajlovi po ekstenzijama)
mapfile -t FILES < <(find "$ROOT" \
  \( "${PRUNE_ARGS[@]}" -false \) -o \
  \( -type f \( "${NAME_ARGS[@]}" \) -print \))

echo "Nađeno fajlova za provjeru: ${#FILES[@]}"

# Funkcija zamjene u sadržaju (tri case varijante)
replace_in_file() {
  local file="$1"
  # koristimo perl radi pouzdanog inplace edit-a i \Q...\E quoting
  # 1) Aaasaas -> $UPPER_TO
  perl -0777 -pe "s/\\QAaasaas\\E/${UPPER_TO}/g" "$file" > "$file.__tmp__" || return 1
  mv "$file.__tmp__" "$file"

  # 2) aaasaasa -> $PROPER_TO
  perl -0777 -pe "s/\\Qaaasaasa\\E/${PROPER_TO}/g" "$file" > "$file.__tmp__" || return 1
  mv "$file.__tmp__" "$file"

  # 3) aaasaasa -> $LOWER_TO
  perl -0777 -pe "s/\\Qaaasaasa\\E/${LOWER_TO}/g" "$file" > "$file.__tmp__" || return 1
  mv "$file.__tmp__" "$file"
}

# Dry-run report funkcije
report_change() { printf "[PLAN] %s\n" "$*"; }
do_or_echo() { if [[ "$APPLY" -eq 1 ]]; then eval "$*"; else report_change "$*"; fi; }

# 1) CONTENT replacement
echo
echo "===== STEP 1: Zamjena u sadržaju fajlova ====="
for f in "${FILES[@]}"; do
  # preskoči binarne koji su slučajno u listi (brza provjera preko 'file')
  if command -v file >/dev/null 2>&1; then
    mime=$(file -b --mime "$f")
    [[ "$mime" == *"charset=binary"* ]] && continue
  fi

  if [[ "$APPLY" -eq 1 ]]; then
    # Kreiraj .bak ako je traženo
    if [[ "$KEEP_BACKUPS" -eq 1 ]]; then cp -p "$f" "$f.bak"; fi
    replace_in_file "$f" || { echo "Greška pri zamjeni u: $f" >&2; exit 1; }
  else
    # Prikaži diff plan (samo ako ima poklapanja)
    if grep -qE 'Aaasaas|aaasaasa|aaasaasa' "$f" 2>/dev/null; then
      report_change "edit $f   (Aaasaas/aaasaasa/aaasaasa -> ${UPPER_TO}/${PROPER_TO}/${LOWER_TO})"
    fi
  fi
done

# 2) RENAME fajlova/foldera
echo
echo "===== STEP 2: Preimenovanje fajlova/foldera ====="
# Prvo skupljamo sve putanje koje u imenu sadrže ključne riječi
mapfile -t PATHS_TO_RENAME < <(find "$ROOT" \
  \( "${PRUNE_ARGS[@]}" -false \) -o \
  \( -depth -name '*Aaasaas*' -o -name '*aaasaasa*' -o -name '*aaasaasa*' -print \))

# Sortiraj po dužini opadajuće (da preimenujemo dublje prije plićih)
IFS=$'\n' PATHS_TO_RENAME=($(printf "%s\n" "${PATHS_TO_RENAME[@]}" | awk '{print length, $0}' | sort -rn | cut -d" " -f2-))
unset IFS

rename_one() {
  local src="$1"
  local dst="$src"
  dst="${dst//Aaasaas/${UPPER_TO}}"
  dst="${dst//aaasaasa/${PROPER_TO}}"
  dst="${dst//aaasaasa/${LOWER_TO}}"

  # Preskoči ako je isto
  [[ "$src" == "$dst" ]] && return 0

  # Kreiraj parent dir ako treba
  local dstdir
  dstdir="$(dirname "$dst")"
  [[ -d "$dstdir" ]] || mkdir -p "$dstdir"

  if [[ "$GIT_MODE" -eq 1 ]]; then
    do_or_echo "git mv --force \"${src}\" \"${dst}\""
  else
    do_or_echo "mv -f \"${src}\" \"${dst}\""
  fi
}

for p in "${PATHS_TO_RENAME[@]}"; do
  rename_one "$p"
done

echo
if [[ "$APPLY" -eq 1 ]]; then
  echo "✅ Završeno (APPLY mode)."
  echo "Napomena: pregledaj diff (git status / git diff) i testiraj build."
else
  echo "🛈 Dry-run izvještaj gotov. Pokreni sa --apply da primijeniš promjene."
fi
