# electron/README.md

Electron app runs the **main process**: creates window, exposes **IPC**, and handles local resources (DuckDB/Qdrant, filesystem, network). Renderer is Nuxt SPA, but has **no direct Node access** (security isolation).

## Commands

```bash
pnpm -C electron dev          # waits for Nuxt :3000 and starts Electron
pnpm -C electron build        # copies renderer and builds (.AppImage/.deb)
```

## Structure

```
electron/
├─ main.cjs         # window + IPC + init DuckDB/Qdrant
├─ preload.js       # contextBridge → window.aaasaasa (readonly)
├─ web.cjs          # http helpers + cheerio parsing
├─ vector.js        # Qdrant REST adapter
├─ security.js      # CSP and security settings
└─ renderer/        # (prod) Nuxt output
```

## Preload API (summary)

```ts
window.aaasaasa: {
  env: { isDev: boolean, versions: Record<string,string> },
  config: { get(): Promise<any> },
  db: { sql(q: string, params?: any[]): Promise<any> },
  vector: {
    upsert(points: Array<{ id?: string|number, vector: number[], payload?: any }>, o?: any): Promise<any>,
    search(vec: number[], o?: { top?: number, limit?: number, score_threshold?: number }): Promise<any>
  },
  chat?: { open(): Promise<{ ok: true }> }
}
```

**Note:** do not mutate `window.aaasaasa` from renderer (read-only).

## DuckDB init (short)

```js
const { DuckDBConnection } = require('@duckdb/node-api')
let connection = null
async function initDuck() {
  connection = await DuckDBConnection.create()
  await connection.run('PRAGMA threads = ' + require('os').cpus().length)
  await connection.run("PRAGMA memory_limit = '12GB'")
}
```

## IPC examples

```js
ipcMain.handle('config:get', async () => configCache)
ipcMain.handle('db:sql', async (_e, sql, params) => {
  if (!connection) throw new Error('duckdb_not_initialized')
  const r = await connection.runAndReadAll(sql, params)
  return r.getRowObjects()
})
ipcMain.handle('vector:search', async (_e, vec, o={}) => vectorSearch(vec, o, configCache?.rag?.vectorStore))
```

## Security

* `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`
* CSP headers via `security.js`
* IPC channel whitelist

## DevTools & Shortcuts

* Toggle DevTools: `Ctrl/Cmd + Shift + I`
* Reload: `Ctrl/Cmd + R`
* Open ChatGPT window: `Ctrl/Cmd + Alt + G`

---

# app/README.md

Nuxt 4 **SPA** renderer (no SSR). UI layer (Tailwind/shadcn), calls to Electron go via `window.aaasaasa` (preload bridge).

## Commands

```bash
pnpm -C app dev        # http://localhost:3000
pnpm -C app build      # .output/ (used by electron build)
```

## nuxt.config.ts (summary)

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  app: { renderMode: 'spa', baseURL: '/' },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: [
        '@duckdb/node-bindings-linux-arm64',
        '@duckdb/node-bindings-linux-x64',
        '@duckdb/node-bindings-darwin-arm64'
      ],
      noExternal: ['@duckdb/node-bindings']
    },
    optimizeDeps: {
      include: ['electron', '@duckdb/node-api'],
      exclude: [
        '@duckdb/node-bindings',
        '@duckdb/node-bindings-linux-arm64',
        '@duckdb/node-bindings-linux-x64',
        '@duckdb/node-bindings-darwin-arm64'
      ]
    }
  },
  runtimeConfig: {
    dbUrl: process.env.NUXT_DB_URL || '',
    s3Bucket: process.env.NUXT_S3_BUCKET || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      wpBase: process.env.NUXT_PUBLIC_WP_BASE || 'http://localhost:8080',
      duckdbBase: process.env.NUXT_PUBLIC_DUCKDB_BASE || '/duckdb'
    }
  },
  devtools: { enabled: true }
})
```

## Plugin rules

* All plugin files using `window`, `ipcRenderer` etc. → **`.client.ts`**
* Avoid SSR-only patterns (SSR is disabled)
* UI should display a non-intrusive banner if `aaasaasa.db.sql` is not available (fallback without native DB)

## Usage examples

```ts
const rows = await (globalThis as any).aaasaasa.db.sql('SELECT 1 AS ok')
const hits = await (globalThis as any).aaasaasa.vector.search(new Array(384).fill(0), { top: 3 })
```

## Styling

* Tailwind minimal entry: `@tailwind base; @tailwind components; @tailwind utilities;`
* shadcn: add in `modules` if needed

---

> Note: Additional README files per folder can be added if needed (detailed IPC diagram, store architecture, RAG utils).
