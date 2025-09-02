export default defineEventHandler(async () => {
  const { qdrant } = useRuntimeConfig()
  const res = await $fetch(`${qdrant.url}/collections`, { headers: qdrant.apiKey ? { 'api-key': qdrant.apiKey } : {} })
  return { ok: true, collections: res }
})
