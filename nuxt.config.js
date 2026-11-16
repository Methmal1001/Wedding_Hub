// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss'],

  // Accounts are stored in the browser, so pages that depend on the signed-in
  // user render on the client. /login and /register are friendly shortcuts.
  routeRules: {
    '/profile': { ssr: false },
    '/auth/**': { ssr: false },
    '/login': { redirect: '/auth/login' },
    '/register': { redirect: '/auth/register' }
  },

  // main.css contains the @tailwind directives plus custom styles/animations
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  app: {
    head: {
      title: 'Wedding Hub – Where Your Forever Begins',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Wedding Hub is Sri Lanka's premium wedding directory. Discover trusted vendors, beautiful venues, photographers, bridal salons and inspiring wedding ideas."
        },
        { name: 'theme-color', content: '#B4637A' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap'
        }
      ]
    }
  }
})
