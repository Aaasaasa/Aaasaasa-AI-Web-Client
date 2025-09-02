<!-- layouts/default.vue -->
<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] min-h-screen">
    <AppSidebar />
    <div class="flex flex-col">
      <AppHeader />
      <main class="p-0">
        <slot />
      </main>
    </div>
  </div>
</template>
