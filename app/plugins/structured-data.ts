/**
 * JSON-LD Structured Data — WebApplication schema for search engine rich results
 */
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Cosmic Click',
          url: 'https://cosmic-click.pages.dev',
          description: 'A fast-paced cosmic clicker game. Click stars, planets, and comets before they vanish. Dodge black holes! How high can you score in 30 seconds?',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        })
      }
    ]
  })
})
