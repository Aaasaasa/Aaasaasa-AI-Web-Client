// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // 🚫 SSR isključen → čista SPA aplikacija
  future: { compatibilityVersion: 4 },
  ssr: false,                 // SPA u Electronu
  app: {
    // renderMode: 'spa',
    baseURL: '/',            // KLJUČNO: relativno, da _nuxt/ radi s file://
    buildAssetsDir: '_nuxt/', // default, neka ostane eksplicitno
    // buildAssetsDir: '_nuxt/',
    cdnURL: ''                // bez CDN-a u desktopu
  },
  nitro: {
    preset: 'static'          // Nuxt 4: generate statički output
  },
  routeRules: {
    '/**': { prerender: true }  // sve stranice prerender
  },

  css: ['~/assets/css/tailwind.css'],

  modules: [
    // shadcn-nuxt ili druge module po potrebi
  ],

  vite: {
    plugins: [tailwindcss()],

    // ⚡ Spriječava bundling DuckDB native .node fajlova
    ssr: {
    external: [
      '@duckdb/node-bindings-linux-arm64',
      '@duckdb/node-bindings-linux-x64',
      '@duckdb/node-bindings-darwin-arm64'
    ],
    noExternal: ['@duckdb/node-bindings']
  },
  optimizeDeps: {
    include: ['electron', '@duckdb/node-api'],
    exclude: [
      '@duckdb/node-bindings',
      '@duckdb/node-bindings-linux-arm64',
      '@duckdb/node-bindings-darwin-arm64'
    ]
  }
  },

  // 🔑 Ostavljeno kao podloga za buduće projekte (CMS, API, multilang)
  runtimeConfig: {
    // privatne (samo server / Electron main)
    dbUrl: process.env.NUXT_DB_URL || '',
    s3Bucket: process.env.NUXT_S3_BUCKET || '',

    // javne (dostupne kroz useRuntimeConfig().public)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      wpBase: process.env.NUXT_PUBLIC_WP_BASE || 'http://localhost:8080',
      duckdbBase: process.env.NUXT_PUBLIC_DUCKDB_BASE || '/duckdb'
    }
  },

  devtools: {
    enabled: true
  }
})
