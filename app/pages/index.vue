<script setup lang="ts">
import { onMounted, shallowRef, ref } from 'vue'
import { Button } from '@/components/ui/button'

const sqlResult = shallowRef('')
const vectorResult = shallowRef('')
const envRef = shallowRef<any>(null)

onMounted(() => {
  // dostupno tek u rendereru
  //envRef.value = (globalThis as any)?.aaasaasa?.env ?? null
  envRef.value = (window as any)?.aaasaasa?.env ?? null
  // demonstracija configa
  ;(async () => {
    try {
      const config = await (globalThis as any)?.aaasaasa?.config?.get?.()
      console.log('aaasaasa config:', config)
    } catch (e) {
      console.warn('config.get failed:', e)
    }
  })()
})
const testText = ref( (globalThis as any)?.aaasaasa );
const runSQL = async () => {
  try {
    // const res = await window?.aaasaasa?.db?.sql?.('SELECT 42 AS answer', [])
    const res = await (globalThis as any)?.aaasaasa?.db?.sql?.('SELECT 42 AS answer', [])
    sqlResult.value = JSON.stringify(res, null, 2)
  } catch (e:any) {
    sqlResult.value = String(e?.message || e)
  }
}

const testVectorSearch = async () => {
  try {
    const size = 384
    const vector = Array.from({ length: size }, () => 0)
    const search = (globalThis as any)?.aaasaasa?.vector?.search
    if (typeof search !== 'function') throw new Error('aaasaasa.vector.search not available')
    const res = await search(vector, { top: 3 })
    vectorResult.value = JSON.stringify(res, null, 2)
  } catch (e: any) {
    vectorResult.value = String(e?.message || e)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="max-w-xl w-full space-y-6">
      <h1 class="text-3xl font-bold">Aaasaasa AI Web Client</h1>
      <p class="opacity-80">
        Electron + Nuxt 4 starter is running. Below are live calls through the secure preload API.
      </p>
      <p>{{ testText }}</p>

      <div class="space-y-3 border rounded-lg p-4">
        <Button @click="runSQL">
          Run DuckDB SQL (SELECT 42 AS answer)
        </Button>
        <div v-if="sqlResult" class="text-sm">
          <strong>SQL result:</strong>
          <pre>{{ sqlResult }}</pre>
        </div>
        <div v-else="" class="text-sm">
          <strong>Warte auf SQL result. Klicke auf Button oben</strong>
          <pre></pre>
        </div>
      </div>

      <div class="space-y-3 border rounded-lg p-4">
        <Button @click="testVectorSearch">
          Test Qdrant Search (vector of zeros)
        </Button>
        <div v-if="vectorResult" class="text-sm">
          <strong>Vector search result:</strong>
          <pre>{{ vectorResult }}</pre>
        </div>
      </div>

      <div class="text-xs opacity-70">
        <div>Dev: {{ envRef?.isDev ? 'yes' : 'no' }}</div>
        <div>Electron: {{ envRef?.versions?.electron }}</div>
        <div>Chrome: {{ envRef?.versions?.chrome }}</div>
        <div>Node: {{ envRef?.versions?.node }}</div>
      </div>
    </div>
  </div>
</template>
