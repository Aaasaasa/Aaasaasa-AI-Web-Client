<script setup lang="ts">
const { $duckdb } = useNuxtApp()
const rows = ref<any[] | null>(null)
const err = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await $duckdb.sql('select 1 as ok')
    rows.value = res?.toArray?.() ?? []
  } catch (e:any) {
    err.value = e?.message || String(e)
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold">DuckDB health</h1>
    <pre v-if="rows">{{ rows }}</pre>
    <pre v-else-if="err" class="text-red-500">{{ err }}</pre>
    <p v-else>Loading…</p>
  </div>
</template>
