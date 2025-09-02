import { defineEventHandler, readMultipartFormData, readBody } from 'h3'

// Mock chunker: returns count and metadata
function mockChunk(text: string) {
  // naive chunking every ~800 chars
  const size = 800
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

export default defineEventHandler(async (event) => {
  const ctype = event.node.req.headers['content-type'] || ''
  if (ctype.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    const filePart = parts?.find(p => p.name === 'file' && p.type && p.data)
    if (!filePart) return { ok: false, error: 'file missing' }

    const text = new TextDecoder().decode(filePart.data)
    const chunks = mockChunk(text)
    return { ok: true, chunks: chunks.length, bytes: filePart.data.length }
  } else {
    const body = await readBody<{ url?: string, text?: string }>(event)
    if (body?.text) {
      const chunks = mockChunk(body.text)
      return { ok: true, chunks: chunks.length, source: 'text' }
    }
    if (body?.url) {
      // Just return a stub here; the real fetch is via Electron Web tool
      return { ok: true, chunks: 0, notice: 'use web:get to fetch, then POST text here' }
    }
    return { ok: false, error: 'no input' }
  }
})
