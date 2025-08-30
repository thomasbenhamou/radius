// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-30',
  devtools: { enabled: true },
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // Global configuration
      defaults: {
        VBtn: {
          style: 'text-transform: none;'
        }
      }
    }
  },
  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET,
      origin: process.env.AUTH_ORIGIN
    },
    database: {
      url: process.env.DATABASE_URL
    }
  }
})
