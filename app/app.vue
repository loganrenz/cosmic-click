<script setup lang="ts">
// Nuxt v4 + Tailwind 4 Template Base
const links = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Analytics', icon: 'i-lucide-trending-up', to: '#' },
  { label: 'Settings', icon: 'i-lucide-settings', to: '#' }
]
</script>

<template>
  <UApp>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="p-6">
          <div class="flex items-center gap-2 font-display text-2xl font-bold text-emerald-500">
            <UIcon name="i-lucide-zap" class="w-8 h-8" />
            <span>APP_NAME</span>
          </div>
        </div>
        
        <nav class="flex-1 px-4 space-y-1">
          <UButton
            v-for="link in links"
            :key="link.label"
            :icon="link.icon"
            :label="link.label"
            variant="ghost"
            color="neutral"
            class="w-full justify-start text-lg font-medium"
            :class="{ 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30': link.label === 'Dashboard' }"
          />
        </nav>

        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3 px-2">
            <UAvatar src="https://github.com/loganrenz.png" />
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold truncate">User</span>
              <span class="text-xs text-gray-500 truncate">Account</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header class="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <h1 class="font-display text-xl font-bold">New Project</h1>
          <div class="flex items-center gap-4">
            <UButton icon="i-lucide-bell" variant="ghost" color="neutral" />
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
          <div class="max-w-6xl mx-auto space-y-8">
            <UCard class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
              <template #header>
                <div class="flex items-center justify-between">
                  <h2 class="font-display text-xl font-bold">Template Initialized</h2>
                  <UBadge color="primary" variant="solid">Ready to Build</UBadge>
                </div>
              </template>

              <div class="prose dark:prose-invert max-w-none">
                <p class="text-lg text-gray-600 dark:text-gray-400">
                  This project was generated from the <span class="text-emerald-500 font-bold">Stonx V4 Template</span>.
                  Nuxt 4 and Tailwind 4 are pre-configured with Space Grotesk typography.
                </p>
              </div>
            </UCard>
          </div>
        </main>
      </div>
    </div>
  </UApp>
</template>
