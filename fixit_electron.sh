# 0) Zatvori sve dev procese (ako nešto visi)
pkill -f electron || true

# 1) Očisti instalaciju i cache (bitno zbog Electron binarija)
rm -rf node_modules app/node_modules electron/node_modules pnpm-lock.yaml
pnpm store prune
rm -rf ~/.cache/electron ~/.cache/electron-builder  # Linux cache lokacije

# 2) (Ako si iza firewalla/ograničenja) koristi mirror
#   -> Ako nisi, preskoči ova dva 'export' reda.
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export ELECTRON_CUSTOM_DIR="v"  # (neka ostane ovako)

# 3) Ponovna instalacija svih paketa
pnpm install

# 4) Verifikuj da je electron binarij zaista tu
pnpm -C electron exec node -e "console.log(require('electron'))"
pnpm -C electron exec electron --version

# 5) Pokreni dev
pnpm dev
