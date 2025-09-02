<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-bold">DuckDB WASM Test</h1>
    <button @click="run" class="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">Run SELECT 42</button>
    <pre class="bg-black text-green-400 p-3 rounded">{{ out }}</pre>
  </div>
</template>

<script setup lang="ts">
const out = ref('idle')
async function run() {
  try {
    // koristi polyfill ako postoji, inače direktnu __duckdb konekciju
    const sql = (window as any)?.aaasaasa?.db?.sql
    if (typeof sql === 'function') {
      const rows = await sql('SELECT 42 AS answer')
      out.value = JSON.stringify(rows, null, 2)
      return
    }
    const conn = (window as any).__duckdb?.conn
    if (!conn) throw new Error('No WASM connection')
    const res = await conn.query('SELECT 42 AS answer')
    // @ts-ignore
    const rows = typeof res?.toArray === 'function' ? await res.toArray() : Array.from(res)
    out.value = JSON.stringify(rows, null, 2)
  } catch (e:any) {
    out.value = 'ERR: ' + (e?.message || e)
  }
}
</script>
