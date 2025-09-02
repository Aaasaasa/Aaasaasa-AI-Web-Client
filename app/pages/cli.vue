<script setup lang="ts">
const output = ref<string>(''); 
const running = ref(false)
function append(type:string, text:string){ output.value += `[${type}] ${text}` }

function start(){
  // @ts-ignore
  window.ipc?.invoke('cli:start','aaasaasa-cli',['--help']).then(()=> running.value=true)
}
function stop(){
  // @ts-ignore
  window.ipc?.invoke('cli:stop').then(()=> running.value=false)
}
// @ts-ignore
window.ipc?.on('cli:out', (t)=>append('out', t))
// @ts-ignore
window.ipc?.on('cli:err', (t)=>append('err', t))
// @ts-ignore
window.ipc?.on('cli:exit', (code)=>{ append('exit', `code=${code}\n`); running.value=false })
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-xl font-semibold">aaasaasa-cli</h2>
    <div class="flex gap-2">
      <button class="border px-3 rounded" :disabled="running" @click="start">Start</button>
      <button class="border px-3 rounded" :disabled="!running" @click="stop">Stop</button>
    </div>
    <pre class="border rounded p-3 h-[50vh] overflow-auto whitespace-pre-wrap">{{ output }}</pre>
  </div>
</template>
