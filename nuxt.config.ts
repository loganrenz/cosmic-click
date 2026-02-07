import { resolve } from 'node:path'
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
      appUrl: process.env.SITE_URL || 'https://nuxt-v4-template.pages.dev'
    }
  },

  site: {
    url: 'https://nuxt-v4-template.pages.dev',
    name: 'Nuxt v4 Template'
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
      script: [
        // Apple MapKit JS — loaded globally, initialized in components via mapkit.init()
        {
          src: 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js',
          crossorigin: 'anonymous',
          async: true
        }
      ]
    }
  }
})
