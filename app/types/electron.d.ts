
// types/electron.d.ts
export {}

declare global {
  interface Window {
    aaasaasa: {
      env?: {
        isDev?: boolean
        versions?: Record<string, string>
      }
      db?: {
        sql?: (q: string, params?: any[]) => Promise<any>
      }
      vector?: {
        search?: (vector: number[], opts: { top: number }) => Promise<any>
      }
      config?: {
        get?: () => Promise<any>
      }
      chatgpt?: () => void // ✅ додато
      deepseek?: () => void
    }
      // додаш и друге IPC методе ако их имаш
  }
}
