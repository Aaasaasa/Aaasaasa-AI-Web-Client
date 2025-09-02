// -------------------------------------------------------------
// db.cjs — robust DuckDB wrapper (Neo API)
// -------------------------------------------------------------
const os = require('os');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

let instance = null;    // DuckDBInstance
let connection = null;  // DuckDBConnection

async function ensurePath(filePath) {
  if (!filePath) return;
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
}

// default lokacija DB fajla (NE u app.asar)
function getDefaultDbPath(dbCfg) {
  if (dbCfg && dbCfg.path) return dbCfg.path;
  try {
    const { app } = require('electron');
    const dir = app ? app.getPath('userData') : path.join(os.homedir(), '.aaasaasa');
    return path.join(dir, 'aaasaasa.duckdb');
  } catch {
    return path.join(os.homedir(), '.aaasaasa', 'aaasaasa.duckdb');
  }
}

async function init(dbCfg = {}) {
  try {
    const { DuckDBInstance, DuckDBConnection } = require('@duckdb/node-api');

    // 1) putanja ili :memory:
    const dbFile = getDefaultDbPath(dbCfg);
    const target = dbCfg.path === ':memory:' ? ':memory:' : dbFile;
    if (target !== ':memory:') await ensurePath(target);

    // 2) kreiraj *instancu*
    instance = await DuckDBInstance.create(target);

    // 3) kreiraj *konekciju* iz te instance (POZICIJSKI ARGUMENT!)
    connection = await DuckDBConnection.create(instance);

    // 4) pragme
    const threads = Number(dbCfg.threads) || os.cpus().length || 1;
    await connection.run(`PRAGMA threads = ${threads}`);
    if (dbCfg.memoryLimit) {
      await connection.run(`PRAGMA memory_limit = '${dbCfg.memoryLimit}'`);
    }

    return connection;
  } catch (e) {
    console.error('[duckdb] init failed:', e);
    instance = null;
    connection = null;
    return null;
  }
}

async function getConnection(dbCfg) {
  if (!connection) await init(dbCfg);  // lenja inicijalizacija
  return connection;
}

async function runAndReadAll(sql, params = []) {
  const conn = await getConnection();
  if (!conn) throw new Error('DuckDB not initialized runAndReadAll');
  const result = await conn.runAndReadAll(sql, params);
  return result; // .getRowObjects() dostupno
}

async function query(sql, params = []) {
  const reader = await runAndReadAll(sql, params);
  return reader.getRowObjects();
}

async function closeDuck() {
  if (connection) {
    try { await connection.close(); } catch {}
    connection = null;
  }
  if (instance && typeof instance.terminate === 'function') {
    try { await instance.terminate(); } catch {}
    instance = null;
  }
}

exports.duckdb = { ensurePath, init, getConnection, runAndReadAll, query, closeDuck };
