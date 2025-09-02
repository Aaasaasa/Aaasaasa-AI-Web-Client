# Aaasaasa AI Web Client — ROOT README.md

**Aaasaasa AI Web Client** is a **desktop (Electron) + web (Nuxt 4 SPA)** client for AI workflows: chat, local functions, RAG search, and PDF/HTML ingestion. Focus: speed, local control, and integration with vector search.

This repository covers the **Web Client**. For the complete system, it is recommended to also use:

* **`aaasaasad`** – local/remote **daemon** (REST/WS) for /chat, /memorize, /search, sessions…
* **`aaasaasa-cli`** – CLI tool (document ingest, export/import, collection management).
* **Qdrant** – vector database (RAG/top-K).
* **DuckDB** – local database (sessions, messages, metrics).

> Renderer is a **pure SPA** (SSR disabled). DuckDB and Qdrant are *not imported* from Nuxt — everything goes via **Electron IPC**.

---

## ✨ Features

* 🖥️ **Electron + Nuxt 4 (SPA)**: fast startup, isolated Chromium profile, DevTools.
* 🔐 **Secure preload bridge**: `contextIsolation`, `sandbox`, `nodeIntegration=false`.
* 🗃️ **DuckDB (Node-API)**: local SQL/analytics, CSV/Parquet ingest handled in the main process.
* 📊 **Qdrant**: RAG and semantic search (REST client in main process).
* ⚙️ **Config via JSON**: `aaasaasa.config.json` (dev: root, prod: packaged into resources).
* 🎛️ **Workspaces & UI**: theme (dark/light/system), accent color, font size.
* 🔌 **LLM provider layer**: `aaasaasa-cli`, OpenAI, Ollama, HF (via config).
* 🛡️ **Permissions** (planned): FS/NET/Shell with user approval.
* 🐧 **Linux build**: `.AppImage` and `.deb`.

---

## 🧱 Architecture

```
┌──────────────────────┐
│  Electron (main)     │  ← .env (dev) + aaasaasa.config.json (prod/resources)
│  - IPC handlers       │
│  - DuckDB (node-api)  │
│  - Qdrant REST        │
│  - fetch/cheerio      │
│  - security (CSP)     │
└─────────▲────────────┘
          │ IPC (preload exposes window.aaasaasa)
┌─────────┴────────────┐
│  Nuxt 4 SPA renderer  │
│  - UI (Tailwind/shadcn)│
│  - Chat store / RAG UI │
└─────────▲────────────┘
          │ HTTP/WS (optional)
┌─────────┴─────────────┐
│  aaasaasad (daemon)    │
│  - /chat, /memorize    │
│  - sessions, search    │
└────────────────────────┘
```

Additionally: Qdrant (vectors) • DuckDB (local records)

---

## ✅ Prerequisites

* **Node.js** 18+ (20+ recommended)
* **pnpm**
* **Qdrant** running on `http://localhost:6333` (or change in config)
* **Linux** for building (AppImage/deb)

---

## 🚀 Quick Start (dev)

1. Clone the repo and place `aaasaasa.config.json` in **root** (example below).
2. (Optional) `.env` in **root** (dev only), e.g.:

```env
NODE_ENV=development
DEV_SERVER_URL=http://localhost:3000
```

3. Run:

```bash
./bootstrap.sh
```

Script cleans build artifacts, loads `.env` from **root**, starts **Nuxt dev** (app/) and **Electron** (electron/main.cjs).

> In dev mode, Electron **explicitly** reads `.env` from root, not from `dist/`.

---

## 📦 Production build

```bash
./bootstrap-prod.sh
```

It will:

* Run Nuxt build (`app/.output`)
* Copy renderer to `electron/renderer`
* Copy `aaasaasa.config.json` from **root** to `electron/` (to be included in `resources/`)
* Run `electron-builder` (AppImage + deb)

> In **production** `.env` is **not used**; values come from `aaasaasa.config.json`.

---

## 🗂️ Project structure

```
aaasaasa-web-client/
├─ aaasaasa.config.json   # single source of truth (root)
├─ app/                   # Nuxt 4 (SPA)
│  ├─ assets/css/tailwind.css
│  ├─ plugins/*.client.ts
│  ├─ pages/index.vue
│  └─ nuxt.config.ts      # ssr:false, vite.ssr.external for DuckDB .node
├─ electron/
│  ├─ main.cjs            # window + IPC + DuckDB/Qdrant init
│  ├─ preload.js          # exposes window.aaasaasa (readonly)
│  ├─ web.cjs             # fetch/http + cheerio helpers
│  ├─ vector.js           # Qdrant REST adapter
│  ├─ security.js         # CSP/permissions
│  └─ renderer/           # (prod) Nuxt output
├─ qdrant/                # local storage (gitignored)
├─ bootstrap.sh
├─ bootstrap-prod.sh
└─ README.md
```

---

## ⚙️ Configuration (`aaasaasa.config.json`)

**Example:**

```json
{
  "apiBase": "http://localhost:3000",
  "wsBase": "ws://localhost:3000",
  "ui": { "appTitle": "Aaasaasa AI Tool by Aleks" },
  "duckdb": {
    "path": "./duckdb/aaasaasa.duckdb",
    "threads": "auto",
    "memoryLimit": "12GB"
  },
  "rag": {
    "vectorStore": {
      "url": "http://localhost:6333",
      "collection": "aaasaasa",
      "size": 384
    }
  },
  "security": {
    "allowedOrigins": [
      "http://localhost:3000",
      "http://localhost:6333",
      "https://api.openai.com",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com"
    ]
  },
  "ai": {
    "provider": "openai",
    "openai": { "baseURL": "https://api.openai.com/v1", "model": "gpt-4o-mini", "apiKey": null },
    "ollama": { "baseURL": "http://localhost:11434" },
    "hf": { "inferenceURL": "", "apiKey": null }
  },
  "features": { "streaming": true, "rollingSummary": true, "telemetry": false }
}
```

**Policy:** Dev reads `.env` + config from **root**; Prod copies config into `electron/` (resources) and does **not** use `.env`.

---

## 🔌 IPC bridge (preload → `window.aaasaasa`)

> Do not mutate/reassign `window.aaasaasa` from renderer; only **read/call** methods.

```ts
window.aaasaasa: {
  env:    { isDev: boolean, versions: Record<string,string> },
  config: { get(): Promise<any> },

  db: {
    sql(query: string, params?: any[]): Promise<any>
  },

  vector: {
    upsert(points: Array<{ id?: string|number, vector: number[], payload?: any }>, opts?: any): Promise<any>,
    search(vector: number[], opts?: { top?: number, limit?: number, score_threshold?: number }): Promise<any>
  },

  fs?: {
    readText(path: string): Promise<string>,
    writeText(path: string, text: string): Promise<void>
  },

  chat?: {
    open(): Promise<{ ok: true }>
  }
}
```

**Example (Nuxt):**

```ts
const rows = await (globalThis as any).aaasaasa.db.sql('SELECT 42 AS answer')
const hits = await (globalThis as any).aaasaasa.vector.search(new Array(384).fill(0), { top: 3 })
await (globalThis as any).aaasaasa.chat?.open?.() // optional
```

---

## 🧰 Scripts

* `./bootstrap.sh` — dev mode (cleans, loads `.env`, starts Nuxt and Electron)
* `./bootstrap-prod.sh` — prod build (Nuxt build, copy renderer + config, electron-builder)

---

## 🧯 Troubleshooting

* **`.env` searched in `dist/`** — in `electron/main.cjs` always resolve **root path**:

```js
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env'), override: true })
```

* **Vite/ESBuild `str.replace is not a function`** — **do not use RegExp** in `vite.ssr.external`. Use **string** packages:

```ts
ssr: {
  external: [
    '@duckdb/node-bindings-linux-arm64',
    '@duckdb/node-bindings-linux-x64',
    '@duckdb/node-bindings-darwin-arm64'
  ],
  noExternal: ['@duckdb/node-bindings']
}
```

* **DB `duckdb_not_initialized`** — call `initDuck()` before `createWindow()`.
* **„No handler registered for 'vector\:search'”** — main process did not register IPC, restart Electron.
* **DevTools not opening** — call in `ready-to-show` + globalShortcut:

```js
mainWindow.once('ready-to-show', () => {
  mainWindow.show()
  mainWindow.webContents.openDevTools({ mode: 'detach' })
})
```

---

## 🗺️ Roadmap

* [ ] Separate README files: `electron/README.md` (IPC/preload/security) and `app/README.md` (UI/store/plugins).
* [ ] Rolling summary util (stable chat > 300 messages).
* [ ] Qdrant top-K cache & chunking ingest.
* [ ] PDF generator and optional Python bridge.
* [ ] CI (lint/test/build) and release scripts.

---

## 📜 License

TBD (temporarily: All rights reserved / or MIT at your decision).

DuckDB and Qdrant are under their respective licenses.

---