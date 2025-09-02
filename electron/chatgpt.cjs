// electron/chatgpt.js (CommonJS)
const { BrowserWindow } = require('electron')
const path = require('path')

let chatWin = null

function openChatGPT() {
  if (chatWin) {
    chatWin.focus()
    return chatWin
  }

  chatWin = new BrowserWindow({
    width: 1400,
    height: 1000,
    title: 'Aaasaasa AI by Aleks - ChatGPT Web',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      devTools: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true
    }
  })

  chatWin.loadURL('https://chat.openai.com/')


  chatWin.webContents.openDevTools({ mode: 'detach' })


  chatWin.on('closed', () => {
    chatWin = null
  })


  return chatWin
}

module.exports = { openChatGPT }
