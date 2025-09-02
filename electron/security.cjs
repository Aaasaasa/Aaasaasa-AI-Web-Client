// electron/security.js
const { app, session } = require('electron');

function parseAllowed() {
  const raw = process.env.NUXT_PUBLIC_ALLOWED_ORIGINS || '';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function setupSecurity(win) {
  const s = win ? win.webContents.session : session.defaultSession;

  // Ako želiš TOTALNO isključiti sigurnosne headere:
  if (process.env.ELECTRON_RELAX_SECURITY === '1') {
    return; // NEMA CSP, NEMA COOP/COEP — sve prolazi
  }

  const allowList = parseAllowed().join(' ');

  s.webRequest.onHeadersReceived((details, callback) => {
    // Minimalni, permisivni CSP za desktop (dozvoli app:, file:, blob:, data:, i sve http/https)
    const csp = [
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: app: file:",
      "img-src * data: blob: app: file:",
      "connect-src * ws: wss: http: https:",
      "worker-src * blob: data: app: file:",
      "script-src * 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: data: app: file: http: https:",
      "style-src * 'unsafe-inline' app: file: http: https:",
      "frame-ancestors *"
    ].join('; ');

    const headers = {
      ...details.responseHeaders,
      'Content-Security-Policy': [csp]
    };

    // Ako TI stvarno treba SharedArrayBuffer (npr. DuckDB WASM), uključi ručno:
    if (process.env.CROSS_ORIGIN_ISOLATION === '1') {
      headers['Cross-Origin-Opener-Policy'] = ['same-origin'];
      headers['Cross-Origin-Embedder-Policy'] = ['require-corp'];
    }

    callback({ responseHeaders: headers });
  });
}

module.exports = { setupSecurity };
