// ─────────────────────────────────────────────────────────────
// File: server/api/aaasaasa/[...route].ts (proxy to aaasaasad)
// ─────────────────────────────────────────────────────────────
import { proxyRequest } from 'h3'


export default defineEventHandler(async (event) => {
const base = process.env.AAASAASA_BASE || 'http://127.0.0.1:8080'
const rest = event.context.params?.route
const path = Array.isArray(rest) ? rest.join('/') : String(rest || '')
const target = `${base}/${path}`
try {
  new URL(target)
  // console.log('Proxying request to:', target)  
    return proxyRequest(event, target)
} catch (e) {
  throw createError({ statusCode: 400, statusMessage: 'Invalid target URL' })
}
// console.log('Proxying request to:', target)  
return proxyRequest(event, target)
})


// Examples this will handle:
// POST /api/aaasaasa/chat → http://127.0.0.1:8080/chat
// POST /api/aaasaasa/search → http://127.0.0.1:8080/search
// POST /api/aaasaasa/session → http://127.0.0.1:8080/session
// GET /api/aaasaasa/session/123/export → http://127.0.0.1:8080/session/123/export


// ─────────────────────────────────────────────────────────────
// Env
// ─────────────────────────────────────────────────────────────
// Add to .env.local or your process env when running nuxt:
// AAASAASA_BASE=http://127.0.0.1:8080