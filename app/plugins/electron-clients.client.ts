// plugins/electron-clients.client.ts
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return
  // @ts-ignore
  const ipc = window?.electron?.ipcRenderer
  if (!ipc) return

  // @ts-ignore
  window.aaasaasa ??= {}
  // @ts-ignore
  window.aaasaasa.chatgpt = () => ipc.invoke('chatgpt')

  // (opciono) iz preload-a expect-uj i env, db, vector — ako postoje, ostaju tu
})
