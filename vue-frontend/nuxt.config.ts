// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      fs: {
        allow: ['.'],
      },
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    // '@primevue/nuxt-module',

  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true }
})
