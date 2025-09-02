// Pokreni jednom (ili kad god update‑uješ @duckdb/duckdb-wasm):
// Copies DuckDB WASM assets into Nuxt public dir for LOCAL hosting (no CDN).
// Works with @duckdb/duckdb-wasm >= 1.29 where subpaths aren't exported.
// Usage: pnpm -C app exec node scripts/prepare-duckdb-assets.mjs

// app/scripts/prepare-duckdb-assets.mjs
// Copies DuckDB WASM assets into Nuxt public dir for LOCAL hosting (no CDN).
// Works with @duckdb/duckdb-wasm >= 1.29 where subpaths aren't exported.
// Usage: pnpm -C app exec node scripts/prepare-duckdb-assets.mjs

import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import url from 'url'
import { createRequire } from 'module'


const require = createRequire(import.meta.url)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))


const appRoot = path.join(__dirname, '..')
const publicDir = path.join(appRoot, 'public', 'duckdb')


function isDuckdbWasmPackage(dir) {
try {
const pkgPath = path.join(dir, 'package.json')
if (!fs.existsSync(pkgPath)) return false
const json = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
return json?.name === '@duckdb/duckdb-wasm'
} catch {
return false
}
}


function findPackageRoot() {
const entry = require.resolve('@duckdb/duckdb-wasm')
let dir = path.dirname(entry)
const { root } = path.parse(dir)
while (dir && dir !== root) {
if (isDuckdbWasmPackage(dir)) return dir
dir = path.dirname(dir)
}
throw new Error('Could not locate @duckdb/duckdb-wasm package root starting from: ' + entry)
}


async function* walk(dir) {
const list = await fsp.readdir(dir, { withFileTypes: true })
for (const d of list) {
const p = path.join(dir, d.name)
if (d.isDirectory()) yield* walk(p)
else yield p
}
}


function pickFiles(candidates) {
// Heuristics: find worker js, and wasm mvp/eh
let worker = null
let wasmMVP = null
let wasmEH = null


for (const p of candidates) {
const base = path.basename(p)
const low = base.toLowerCase()
if (!worker && low.endsWith('.js') && low.includes('worker') && low.includes('duckdb')) {
worker = p
}
if (!wasmMVP && low.endsWith('.wasm') && (low.includes('mvp') || low.includes('eh-mvp'))) {
wasmMVP = p
}
if (!wasmEH && low.endsWith('.wasm') && low.includes('eh')) {
wasmEH = p
}
if (worker && wasmMVP && wasmEH) break
}
return { worker, wasmMVP, wasmEH }
}


async function main() {
const pkgRoot = findPackageRoot()
const files = []
for await (const p of walk(pkgRoot)) files.push(p)


const { worker, wasmMVP, wasmEH } = pickFiles(files)


if (!worker) {
console.error('[duckdb] Could not find worker .js in package')
process.exit(1)
}
if (!wasmMVP) {
console.error('[duckdb] Could not find MVP .wasm in package')
process.exit(1)
}
if (!wasmEH) {
console.error('[duckdb] Could not find EH .wasm in package')
process.exit(1)
}


await fsp.mkdir(publicDir, { recursive: true })


const outWorker = path.join(publicDir, 'duckdb-browser.worker.js')
const outMVP = path.join(publicDir, 'duckdb-mvp.wasm')
const outEH = path.join(publicDir, 'duckdb-eh.wasm')


await fsp.copyFile(worker, outWorker)
await fsp.copyFile(wasmMVP, outMVP)
await fsp.copyFile(wasmEH, outEH)


console.log('✓ Worker →', path.relative(appRoot, outWorker))
console.log('✓ MVP WASM→', path.relative(appRoot, outMVP))
console.log('✓ EH WASM →', path.relative(appRoot, outEH))
console.log('All DuckDB assets copied locally. Reference them from /duckdb/*.')
}


main().catch((e) => {
console.error(e)
process.exit(1)
})