// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron')

const aaasaasa = {
  env: {
    isDev: process.env.NODE_ENV !== 'production',
    versions: process.versions
  },
  db: {
    sql: (query, params) => ipcRenderer.invoke('db:sql', query, params)
  },
  vector: {
    search: (vector, options) => ipcRenderer.invoke('vector:search', vector, options),
    upsert: (points, options) => ipcRenderer.invoke('vector:upsert', points, options)
  },
  config: {
    get: () => ipcRenderer.invoke('config:get')
  },
  openChatGPT: () => ipcRenderer.send('chatgpt:open'),
  deepseek: () => ipcRenderer.send('deepseek:open'),
  
  // DODAJ OVO ZA SINHRONIZACIJU RAZGOVORA
  conversation: {
    // Dohvati trenutni razgovor iz Electrona
    get: () => ipcRenderer.invoke('conversation:get'),
    
    // Postavi novi razgovor u Electron
    set: (data) => ipcRenderer.invoke('conversation:set', data),
    
    // Export razgovora u JSON fajl
    export: () => ipcRenderer.invoke('conversation:export'),
    
    // Import razgovora iz JSON fajla
    import: () => ipcRenderer.invoke('conversation:import'),
    
    // Sinhronizacija sa browser storage-om
    syncWithBrowser: () => ipcRenderer.invoke('conversation:sync-browser')
  }
}

console.log('[preload] injected aaasaasa.env')

contextBridge.exposeInMainWorld('aaasaasa', aaasaasa)