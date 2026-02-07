<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Hero -->
    <div class="text-center pt-16 pb-10 px-4">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
        Nuxt 4 Template
      </h1>
      <p class="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
        Cloudflare Pages · D1 · Auth · MapKit JS — production-ready from the start.
      </p>

      <div class="flex flex-wrap justify-center gap-2 mt-6">
        <UBadge color="neutral" variant="subtle" size="lg">Nuxt 4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">Nuxt UI v4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">Tailwind CSS 4</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">Cloudflare D1</UBadge>
        <UBadge color="neutral" variant="subtle" size="lg">TypeScript</UBadge>
      </div>

      <div class="mt-8 flex items-center justify-center gap-x-4">
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

    <!-- Demo panels -->
    <div class="max-w-5xl mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientOnly>
          <AuthDemo />
        </ClientOnly>
        <ClientOnly>
          <MapKitDemo />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
