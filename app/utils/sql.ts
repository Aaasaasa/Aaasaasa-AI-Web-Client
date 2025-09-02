// app/utils/sql.ts
export async function sql(query: string, params?: any[]) {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.__duckdb?.query) {
    // WASM u rendereru (poželjno u dev-u)
    // @ts-ignore
    return await window.__duckdb.query(query)
  }
  // Fallback na IPC (ako ikad imaš native u main-u npr. u produkciji)
  // @ts-ignore
  if (window?.ipc?.invoke) {
    // @ts-ignore
    return await window.ipc.invoke('db:sql', query, params)
  }
  throw new Error('No SQL backend available (neither WASM nor IPC)')
}
