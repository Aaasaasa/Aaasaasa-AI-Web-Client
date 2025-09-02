// [electron/main.cjs] — minimal, clear, dev/prod-stable (CommonJS)
// -------------------------------------------------------------
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));
process.on('uncaughtException',  (e) => console.error('[uncaughtException]', e));

const path = require('path');
const fs   = require('fs');
const os   = require('os');
const { app, BrowserWindow, ipcMain, globalShortcut, protocol } = require('electron');

const isDev  = !app.isPackaged;
const DEV_URL = process.env.DEV_SERVER_URL || 'http://localhost:3000';

if (isDev) {
  try {
    const dotenv = require('dotenv');
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
  } catch {}
}

// Local modules
const { vectorUpsert, vectorSearch } = require('./vector.cjs');
const { openChatGPT } = require('./chatgpt.cjs');
const { openDeepSeek } = require('./deepseek.cjs');
const web  = require('./web.cjs');
const { setupSecurity } = require('./security.cjs');
const { duckdb } = require('./db.cjs');

// Protokol za app://
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);

function registerAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const u = new URL(request.url);                // npr. app://-/_nuxt/entry.js
      const clean = decodeURIComponent(u.pathname)   // "/_nuxt/entry.js" ili "/index.html"
        .replace(/^\/+/, '');                        // "_nuxt/entry.js" | "index.html"

      const base = path.join(__dirname, 'renderer');
      let target = path.normalize(path.join(base, clean));

      if (!target.startsWith(base)) return callback({ error: -6 }); // net::ERR_FILE_NOT_FOUND

      fs.stat(target, (err, st) => {
        if (!err && st.isDirectory()) target = path.join(target, 'index.html');
        else if (err && !path.extname(clean)) target = path.join(base, 'index.html');
        callback({ path: target });
      });
    } catch (e) {
      console.error('app:// handler error:', e);
      callback({ error: -2 });
    }
  });
}

// Config
function loadConfigRaw() {
  const p = isDev
    ? path.join(process.cwd(), 'aaasaasa.config.json')
    : path.join(process.resourcesPath, 'aaasaasa.config.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}

function normalizeConfig(cfg) {
  const c = { ...cfg };
  if (!isDev) {
    c.apiBase = '';
    c.wsBase  = '';
    c.duckdb ||= {};
    c.duckdb.path = path.join(app.getPath('userData'), 'duckdb', 'aaasaasa.duckdb');
    c.duckdb.threads = c.duckdb.threads || 'auto';
    c.duckdb.memoryLimit = c.duckdb.memoryLimit || '8GB';
  }
  return c;
}

// BrowserWindow
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    title: 'Aaasaasa AI Tool by Aleks',
    show: false,
    webPreferences: {
      preload: fs.existsSync(path.join(__dirname, 'preload.cjs')) ? path.join(__dirname, 'preload.cjs') : undefined,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: process.env.ELECTRON_RELAX_SECURITY === '1'
    }
  });

  try { if (typeof setupSecurity === 'function') setupSecurity(win); } catch (e) { console.error('[security]', e); }

  win.once('ready-to-show', () => win.show());
  win.webContents.on('did-fail-load', (_e, code, desc, url) => console.error('[did-fail-load]', code, desc, url));
  win.webContents.on('console-message', (_e, level, msg) => console.log('[renderer]', msg));

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // 🔧 UVIJEK koristi app:// u produkciji
    win.loadURL('app:///index.html');
  }

  // 🔧 Čuvar: ako nešto pokuša na file:// glavnu navigaciju, preusmjeri na app://
  const filter = { urls: ['file://*/*'] };
  win.webContents.session.webRequest.onBeforeRequest(filter, (details, cb) => {
    if (details.resourceType === 'mainFrame') return cb({ redirectURL: 'app://index.html' });
    cb({});
  });

  globalShortcut.register('CommandOrControl+Shift+I', () => win.webContents.openDevTools({ mode: 'detach' }));
  globalShortcut.register('CommandOrControl+R', () => win.reload());

  return win;
}

// IPC
let configCache = null;

ipcMain.handle('config:get', async () => configCache);

ipcMain.handle('db:ready', async () => {
  const conn = await duckdb.getConnection();
  return !!conn;
});

ipcMain.handle('db:sql', async (_evt, sql, params) => duckdb.query(sql, params));

ipcMain.handle('web:get', async (_evt, url, options = {}) => {
  const res = await web.httpGet(url);
  if (options.readability) {
    const readable = web.toReadable(res.body, url);
    return { ...readable, status: res.status };
  }
  return res;
});

ipcMain.handle('web:post', async (_evt, url, body, options = {}) => {
  const res = await web.httpPost(url, body, options.headers || {});
  if (options.readability) {
    const readable = web.toReadable(res.body, url);
    return { ...readable, status: res.status };
  }
  return res;
});

ipcMain.handle('vector:upsert', async (_evt, points, options = {}) =>
  vectorUpsert(points, options, configCache?.rag?.vectorStore)
);
ipcMain.handle('vector:search', async (_evt, vector, options = {}) =>
  vectorSearch(vector, options, configCache?.rag?.vectorStore)
);

ipcMain.handle('chatgpt', () => openChatGPT());
ipcMain.on('chatgpt:open', () => openChatGPT());
ipcMain.on('deepseek:open', () => openDeepSeek());

// App lifecycle
app.whenReady().then(async () => {
  registerAppProtocol();

  // 🔧 Jedna, jasna inicijalizacija DuckDB (bez dupliranja)
  const raw = loadConfigRaw();
  configCache = normalizeConfig(raw);
  await duckdb.ensurePath(configCache.duckdb?.path);
  await duckdb.init(configCache.duckdb);
  console.log('[duckdb] ready');

  createWindow();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('will-quit', () => { try { globalShortcut.unregisterAll(); } catch {} });
