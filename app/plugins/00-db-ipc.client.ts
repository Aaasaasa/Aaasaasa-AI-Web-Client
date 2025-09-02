// Nuxt 4 plugin (client only) — koristi SAMO Electron IPC backend.
// Izlaže helper: window.__dbSql(query, params?) i Nuxt state flagove.
// import { defineNuxtPlugin, useState } from '#imports'
export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  const w = window as any

  // Nuxt state za UI indikatore
  const ready = useState<boolean>('dbNativeReady', () => false)
  const error = useState<string | null>('dbNativeError', () => null)

  // Helper koji zove IPC ako postoji; ne pišemo u window.aaasaasa (read-only)
  Object.defineProperty(w, '__dbSql', {
    value: async (q: string, params?: any[]) => {
      const fn = w?.aaasaasa?.db?.sql
      if (typeof fn !== 'function') {
        throw new Error('Native DB IPC not available (aaasaasa.db.sql missing)')
      }
      return await fn(q, params)
    },
    configurable: true,
    writable: true
  })

  // “Ping” da označimo spremnost — ne blokira render
  queueMicrotask(async () => {
    try {
      const fn = w?.aaasaasa?.db?.sql
      if (typeof fn !== 'function') {
        throw new Error('aaasaasa.db.sql not exposed by preload')
      }
      // brzi sanity check
      await fn('SELECT 1 AS ok')
      ready.value = true
      console.info('[db-ipc] native DuckDB via IPC is ready')
    } catch (e: any) {
      const msg = e?.message || String(e)
      error.value = msg
      console.warn('[db-ipc] init check failed:', msg)
    }
  })
})
