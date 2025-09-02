// electron/vector.js
const { QdrantClient } = require('@qdrant/js-client-rest')

function clientFromCfg(cfg = {}) {
  const url = (cfg.url || 'http://localhost:6333').replace(/\/+$/, '')
  return new QdrantClient({ url })
}

async function ensureCollection(client, name, size) {
  try {
    await client.getCollection(name)
  } catch {
    await client.createCollection(name, {
      vectors: { size, distance: 'Cosine' }
    })
  }
}

async function vectorUpsert(points, options = {}, storeCfg = {}) {
  const name = storeCfg.collection || 'aaasaasa'
  const size = storeCfg.size ?? 384
  const client = clientFromCfg(storeCfg)
  await ensureCollection(client, name, size)

  const res = await client.upsert(name, { points })
  return res
}

async function vectorSearch(vector, options = {}, storeCfg = {}) {
  const name = storeCfg.collection || 'aaasaasa'
  const size = storeCfg.size ?? 384
  const limit = options.top ?? options.limit ?? 5
  const score_threshold = options.score_threshold
  const client = clientFromCfg(storeCfg)
  await ensureCollection(client, name, size)

  const res = await client.search(name, {
    vector,
    limit,
    with_payload: true,
    with_vector: false,
    score_threshold
  })
  return res
}

module.exports = {
  vectorUpsert,
  vectorSearch
}
