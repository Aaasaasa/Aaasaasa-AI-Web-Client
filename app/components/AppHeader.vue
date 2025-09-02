<script setup lang="ts">
import ThemeToggle from '@/components/ui/ThemeToggle.vue'  // ako već nije globalno
</script>

<template>
  <header class="h-14 border-b px-4 flex items-center justify-between bg-background text-foreground">
    <div class="text-sm text-foreground/70">Aaasaasa AI Web Client</div>
    <div class="flex items-center gap-4">
      <div class="text-xs text-foreground/60">Nuxt4 + shadcn-vue + electron by Aleks</div>
      <ThemeToggle />
    </div>
  </header>
</template>
