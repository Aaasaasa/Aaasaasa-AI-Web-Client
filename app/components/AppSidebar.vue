// ─────────────────────────────────────────────────────────────
// File: components/AppSidebar.vue (ChatGPT item, shadcn UI)
// ─────────────────────────────────────────────────────────────
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import { Home, Bot, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const collapsed = ref(false)
const route = useRoute()
const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/ai', label: 'AI', icon: Bot },
  { to: '/chatgpt', label: 'ChatGPT', icon: Bot },
  { to: 'about', label: 'About', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const actions = [
  { action: 'chatgptWeb', label: 'ChatGPT Web', icon: Bot },
  { action: 'deepseek', label: 'DeepSeek', icon: Bot },
  // Додај друге акције овдје
]
//  const isActive = (to: string) => computed(() => route.path === to)
const isActive = (to: string) => computed(() => route.path === to)
function handleAction(item: any) {
  if (item.action === 'chatgptWeb') {
    (window as any)?.aaasaasa?.openChatGPT?.();
    // console.log( window?.aaasaasa);
    // console.log((window as any)?.aaasaasa);
  }
  if (item.action === 'deepseek') {
    (window as any)?.aaasaasa?.deepseek?.();
  }
}
</script>

<template>
  <aside
    :class="[
      'h-screen border-r bg-background transition-all duration-200',
      collapsed ? 'w-16' : 'w-56',
    ]"
  >
    <div class="h-14 flex items-center justify-between px-3">
      <span class="font-semibold text-primary" v-if="!collapsed">Aaasaasa</span>
      <button
        class="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm hover:bg-muted"
        @click="collapsed = !collapsed"
        :title="collapsed ? 'Expand' : 'Collapse'"
      >
        <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="w-4 h-4" />
        <span v-if="!collapsed" class="text-xs">Sidebar</span>
      </button>
    </div>
    <Separator />

    <ScrollArea class="h-[calc(100vh-56px)]">
      <nav class="p-2 space-y-1">
        <TooltipProvider>
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
            :class="
              isActive(item.to).value
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            "
          >
            <Tooltip>
              <TooltipTrigger as-child>
                <component :is="item.icon" class="w-5 h-5 shrink-0" />
              </TooltipTrigger>
              <TooltipContent v-if="collapsed" side="right">
                {{ item.label }}
              </TooltipContent>
            </Tooltip>
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </TooltipProvider>

        <Separator class="my-2" />

        <!-- DRUGI BLOK: само акције (ChatGPT Web, DeepSeek...) -->
        <TooltipProvider>
          <button
            v-for="item in actions"
            :key="item.action"
            @click="handleAction(item)"
            class="group w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-left"
            :class="'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            <Tooltip>
              <TooltipTrigger as-child>
                <component :is="item.icon" class="w-5 h-5 shrink-0" />
              </TooltipTrigger>
              <TooltipContent v-if="collapsed" side="right">
                {{ item.label }}
              </TooltipContent>
            </Tooltip>
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
          </button>
        </TooltipProvider>

      </nav>
    </ScrollArea>
  </aside>
</template>
