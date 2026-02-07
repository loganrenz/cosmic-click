<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <div class="space-y-6 max-w-2xl">
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
        Your app is ready
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Start building your next big thing with the Nuxt 4 stack.
      </p>
      
      <div class="flex flex-wrap justify-center gap-2 mt-8">
        <UBadge color="neutral" variant="subtle" size="lg">Nuxt 4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">Nuxt UI v4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">Tailwind CSS 4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">TypeScript</UBadge>
      </div>

      <div class="mt-10 flex items-center justify-center gap-x-6">
        <UButton
          to="https://ui3.nuxt.com"
          target="_blank"
          size="xl"
          icon="i-lucide-book-open"
        >
          Documentation
        </UButton>
        <UButton
          to="https://github.com/loganrenz/nuxt-v4-template"
          target="_blank"
          variant="ghost"
          color="neutral"
          size="xl"
          icon="i-lucide-github"
        >
          GitHub
        </UButton>
      </div>
    </div>
  </div>
</template>
