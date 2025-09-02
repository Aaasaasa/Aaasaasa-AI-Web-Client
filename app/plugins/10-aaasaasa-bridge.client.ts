// plugins/10-aaasaasa-bridge.client.ts

export default defineNuxtPlugin(() => {
  const g: any = globalThis
  const aa = g.aaasaasa ?? {}
  const env = aa.env ?? (() => {
    const ua = navigator.userAgent || ''
    return {
      isDev: !!(g.__NUXT_DEV__ || import.meta?.env?.DEV),
      versions: {
        electron: ua.includes('Electron') ? (ua.match(/Electron\/([\d.]+)/)?.[1] || 'unknown') : null,
        chrome: ua.match(/Chrome\/([\d.]+)/)?.[1] || null,
        node: null
      },
      platform: navigator.platform || null,
      arch: null
    }
  })()

  return {
    provide: {
      aaasaasa: aa,
      env,
      db: aa.db ?? null,
      vector: aa.vector ?? null,
      configApi: aa.config ?? null,
    }
  }
})
  
