declare global {
  interface Window {
    electron?: { ipcRenderer?: { invoke: (ch: string, ...a: any[]) => Promise<any> } }
    aaasaasa?: {
      env?: {
        isDev?: boolean
        versions?: { electron?: string|null; chrome?: string|null; node?: string|null }
        platform?: string|null
        arch?: string|null
      }
      db?: { sql?: (q: string, p?: any[]) => Promise<any> }
      vector?: { search?: (vec: number[], opts: any) => Promise<any> }
      config?: { get?: () => Promise<any> }
      chatgpt?: () => Promise<any>
    }
    __duckdb?: { conn?: { query: (q: string) => Promise<any> } }
  }
}
export {}
