<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Hero -->
    <div class="text-center pt-12 pb-6 px-4">
      <h1 class="text-5xl font-bold tracking-tight font-display text-white">
        Cosmic Click
      </h1>
      <p class="mt-2 text-lg text-gray-400 max-w-md mx-auto">
        Click stars, planets, and comets before they vanish. Dodge black holes. How high can you score in 30 seconds?
      </p>
    </div>

    <!-- Game -->
    <div class="px-4 pb-16">
      <ClientOnly>
        <CosmicGame />
      </ClientOnly>
    </div>

    <!-- Footer -->
    <footer class="text-center pb-8 text-xs text-gray-600">
      Built with Nuxt &amp; deployed on Cloudflare Pages
    </footer>
  </div>
</template>
