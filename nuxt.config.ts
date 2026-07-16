import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { useNuxt } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  dir: {
    public: '../public'
  },
  alias: {
    '#tailwind-config/theme/colors': resolve(__dirname, './tailwind-colors.ts')
  },
  hooks: {
    'build:before'() {
      const nuxt = useNuxt()
      if (nuxt.options.build?.templates) {
        nuxt.options.build.templates = nuxt.options.build.templates.filter(
          (t: any) => !t.filename?.startsWith('tailwind/expose/') && t.filename !== 'types/tailwind.config.d.ts'
        )
      }
    }
  },
  sourcemap: {
    server: false,
    client: false
  },
  imports: { autoImport: false },
  ssr: false,
  // @ts-ignore
  nitro: {
    preset: 'github-pages',
    output: {
      publicDir: resolve(__dirname, 'dist')
    },
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      },
      '/models/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    }
  },
  devtools: { enabled: false },
  experimental: {
    appManifest: true
  },
  devServer: {
    port: parseInt(process.env.PORT || '3000')
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/devtools'
  ],
  shadcn: {
    prefix: '',
    componentDir: './src/components/ui'
  },
  tailwindcss: {
    exposeConfig: false,
    viewer: false,
    editorSupport: false
  },
  ignore: [
    '**/.nuxt',
    '**/.nuxt/**',
    '**/node_modules/**',
    '**/test-results/**',
    '**/playwright-report/**',
    'models/',
    '**/target/**'
  ],
  spaLoadingTemplate: './spa-loading-template.html',
  app: {
    head: {
      title: 'ChouetteGPT',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'viewport-fit=cover, width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Local AI Chat Assistant running on WebAssembly & WebGPU' },
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      {
        name: 'fix-vue-mime',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.includes('.vue')) {
              res.setHeader('Content-Type', 'text/javascript')
            }
            next()
          })
        }
      }
    ],
    ...(process.env.NODE_ENV === 'production' ? {
      build: {
        modulePreload: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        }
      }
    } : {}),
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      exclude: ['@mlc-ai/web-llm']
    },
    server: {
      allowedHosts: ['.localhost'],
      watch: {
        usePolling: false
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  },

  watchers: {
    chokidar: {
      usePolling: false,
      interval: 1000
    }
  },
  compatibilityDate: '2024-04-03'
} as any)
