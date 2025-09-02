// app/composables/useDbSql.ts
export function useDbSql() {
  return async (q: string, p?: any[]) => {
    const sql =
      (globalThis as any)?.aaasaasa?.db?.sql as
        | ((q: string, p?: any[]) => Promise<any>)
        | undefined

    if (typeof sql !== 'function') {
      throw new Error('aaasaasa.db.sql not available (preload/IPC missing)')
    }

    return await sql(q, p)
  }
}
