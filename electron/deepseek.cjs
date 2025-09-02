// electron/deepseek.cjs (CommonJS)
const { BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises

let chatWin = null
let conversationData = {
  timestamp: new Date().toISOString(),
  messages: []
}

function openDeepSeek() {
  if (chatWin) {
    chatWin.focus()
    return chatWin
  }

  chatWin = new BrowserWindow({
    width: 1400,
    height: 1000,
    title: 'Aaasaasa AI by Aleks - DeepSeek Web',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      devTools: true,
      sandbox: false,
      nodeIntegration: false,
      webSecurity: true
    }
  })

  chatWin.loadURL('https://chat.deepseek.com/')
  chatWin.webContents.openDevTools({ mode: 'detach' })

  // Injektiraj sync skriptu nakon učitavanja stranice
  chatWin.webContents.on('did-finish-load', () => {
    setTimeout(() => injectSyncScript(chatWin.webContents), 2000)
  })

  // Debug konzola
  chatWin.webContents.on('console-message', (event, level, message) => {
    if (message.includes('Synced') || message.includes('Sync error')) {
      console.log('[DeepSeek Sync]', message)
    }
  })

  chatWin.on('closed', () => {
    chatWin = null
  })

  return chatWin
}

function injectSyncScript(webContents) {
  const syncScript = `
    // Funkcija za sinhronizaciju s Electron aplikacijom
    async function syncWithElectron() {
      if (window.aaasaasa && window.aaasaasa.conversation) {
        try {
          // Probaj različite selectore za DeepSeek poruke
          const selectors = [
            '[class*="message"]',
            '.message',
            '[data-message]',
            '.chat-message',
            '[class*="chat"]',
            '.msg',
            '.content',
            '[role="article"]',
            '.prose'
          ]
          
          let allElements = []
          for (const selector of selectors) {
            try {
              const elements = Array.from(document.querySelectorAll(selector))
              if (elements.length > 0) {
                allElements = [...allElements, ...elements]
              }
            } catch (e) {}
          }
          
          // Filtriraj duplikate i prazne elemente
          const uniqueElements = Array.from(new Set(allElements))
          const messageElements = uniqueElements.filter(el => 
            el.textContent && 
            el.textContent.trim().length > 10 &&
            !el.querySelector('button') // Ignoriši dugmad
          )
          
          const messages = messageElements.map((el, index) => {
            // Jednostavna heuristika - prva poruka je user, druga assistant, itd.
            const isUser = index % 2 === 0
            return {
              role: isUser ? 'user' : 'assistant',
              content: el.textContent.trim().substring(0, 1000) // Limitiraj dužinu
            }
          })
          
          if (messages.length > 0) {
            await window.aaasaasa.conversation.set({
              timestamp: new Date().toISOString(),
              messages: messages
            })
            console.log('Synced ' + messages.length + ' messages with Electron')
          }
        } catch (error) {
          console.log('Sync error:', error)
        }
      }
    }

    // Periodična sinhronizacija
    const syncInterval = setInterval(syncWithElectron, 5000)
    
    // Sinhroniziraj odmah nakon učitavanja
    setTimeout(syncWithElectron, 3000)
    
    // Cleanup na unload
    window.addEventListener('beforeunload', () => {
      clearInterval(syncInterval)
    })
    
    console.log('Aaasaasa DeepSeek sync script injected')
  `

  webContents.executeJavaScript(syncScript).catch(err => {
    console.log('Failed to inject sync script:', err)
  })
}

// IPC Handlers za konverzaciju
ipcMain.handle('conversation:get', async () => {
  return conversationData
})

ipcMain.handle('conversation:set', async (event, data) => {
  conversationData = data
  // Opciono: spremi u DuckDB
  try {
    const { duckdb } = require('./db.cjs')
    const conn = await duckdb.getConnection()
    if (conn) {
      await duckdb.runAndReadAll(
        `INSERT OR REPLACE INTO conversations (id, data, timestamp) 
         VALUES (?, ?, ?)`,
        ['current', JSON.stringify(data), new Date().toISOString()]
      )
    }
  } catch (e) {
    console.log('Failed to save conversation to DB:', e)
  }
  return { success: true, message: 'Conversation saved' }
})

ipcMain.handle('conversation:export', async (event) => {
  const result = await dialog.showSaveDialog(chatWin || BrowserWindow.getFocusedWindow(), {
    defaultPath: `conversation-\${Date.now()}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  
  if (!result.canceled) {
    await fs.writeFile(result.filePath, JSON.stringify(conversationData, null, 2))
    return { success: true, path: result.filePath }
  }
  return { success: false }
})

ipcMain.handle('conversation:import', async (event) => {
  const result = await dialog.showOpenDialog(chatWin || BrowserWindow.getFocusedWindow(), {
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  })
  
  if (!result.canceled) {
    const data = await fs.readFile(result.filePaths[0], 'utf8')
    conversationData = JSON.parse(data)
    return { success: true, data: conversationData }
  }
  return { success: false }
})

ipcMain.handle('conversation:sync-browser', async () => {
  if (chatWin) {
    injectSyncScript(chatWin.webContents)
    return { success: true, message: 'Sync script injected' }
  }
  return { success: false, message: 'No DeepSeek window found' }
})

module.exports = { openDeepSeek }