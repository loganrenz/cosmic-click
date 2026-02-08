import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  ui: {
    colorMode: true
  },

  // Inject build-time constants available in client & server code
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_VERSION__: JSON.stringify(pkg.version)
    }
  },

    runtimeConfig: {
    // Server-only keys (override via env vars)
    appleTeamId: process.env.APPLE_TEAM_ID || '',
    appleClientId: process.env.APPLE_CLIENT_ID || '',
    appleKeyId: process.env.APPLE_KEY_ID || '',
    appleSecretKey: process.env.APPLE_SECRET_KEY || '',

    public: {
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      appUrl: process.env.SITE_URL || 'https://cosmic-click.pages.dev',
      // App name for partitioning in a single PostHog project (set APP_NAME in Doppler)
      appName: process.env.APP_NAME || pkg.name || ''
    }
  },

  site: {
    url: 'https://cosmic-click.pages.dev',
    name: 'Cosmic Click'
  },

  sitemap: {
    sources: ['/api/sitemap-urls']
  },

  nitro: {
    preset: 'cloudflare-pages',
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },

  app: {
    head: {
      title: 'Cosmic Click — Click the Cosmos!',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'A fast-paced cosmic clicker game. Click stars, planets, and comets before they vanish. Dodge black holes! How high can you score in 30 seconds?' },
        { name: 'keywords', content: 'clicker game, cosmic game, browser game, space game, click game, arcade game, free online game' },
        { property: 'og:title', content: 'Cosmic Click — Click the Cosmos!' },
        { property: 'og:description', content: 'A fast-paced cosmic clicker game. Click stars, planets, and comets before they vanish. Dodge black holes!' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cosmic-click.pages.dev' },
        { property: 'og:site_name', content: 'Cosmic Click' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Cosmic Click — Click the Cosmos!' },
        { name: 'twitter:description', content: 'A fast-paced cosmic clicker game. Click stars, planets, and comets before they vanish. Dodge black holes!' },
        { name: 'theme-color', content: '#030712' }
      ],
      link: [
        { rel: 'canonical', href: 'https://cosmic-click.pages.dev' }
      ]
    }
  }
})
