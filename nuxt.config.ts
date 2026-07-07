import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { useNuxt } from '@nuxt/kit'
import { defineNuxtConfig } from 'nuxt/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

const FORBIDDEN_PALETTES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet',
  'purple', 'fuchsia', 'pink', 'rose',
];

const RAW_PALETTE_REGEX = new RegExp(
  `(?:bg|text|border|ring|shadow|outline|from|via|to|divide|placeholder)-(${FORBIDDEN_PALETTES.join('|')})-\\d+`,
  'g'
);
const TEXT_SURFACE_BG_REGEX = /text-surface-bg(?!\w)/g;
const DARK_PREFIX_REGEX = /\bdark:/g;
const ALWAYS_ALLOWED_PROPERTIES = [
  'scrollbar-width', '-ms-overflow-style', '-webkit-overflow-scrolling',
  'pointer-events', 'content-visibility', 'contain', 'will-change',
];
const FORBIDDEN_VALUE_PATTERNS = [
  /#[0-9a-fA-F]{3,8}\b/, /rgba?\(\s*\d/, /hsla?\(\s*\d/, /:\s*\d+(\.\d+)?%/, /:\s*\d+px/,
];
const EXCEPTION_PATTERNS = [/z-index:\s*\d+/, /opacity:\s*0(\b|;)/];

function isAllowedProperty(styleValue: string) {
  return ALWAYS_ALLOWED_PROPERTIES.some((prop) => styleValue.includes(prop));
}

function isExceptionValue(styleValue: string) {
  return EXCEPTION_PATTERNS.some((pattern) => pattern.test(styleValue));
}

function hasForbiddenValue(styleValue: string) {
  return FORBIDDEN_VALUE_PATTERNS.some((pattern) => pattern.test(styleValue));
}

function vitePluginOwpStandards() {
  return {
    name: 'vite-plugin-owp-standards',
    enforce: 'pre' as const,
    transform(this: any, code: string, id: string) {
      if (id.includes('node_modules') || id.includes('.nuxt') || id.includes('.output')) {
        return;
      }
      const violations: string[] = [];

      if (code.includes('@qa-bypass') || code.includes('@standards-ignore') || code.includes('@qa-ignore') || code.includes('@owp-bypass') || code.includes('@owp-ignore')) {
        violations.push(`Bypass annotations (@qa-bypass, @standards-ignore, @qa-ignore, @owp-bypass, @owp-ignore) are strictly forbidden. Please fix the underlying issues.`);
      }

      if (id.endsWith('.vue')) {
        const lines = code.split('\n');
        if (lines.length > 200) {
          violations.push(`Vue file is too long (${lines.length} lines). Files should not exceed 200 lines to maintain readability and encourage componentization. AI: Please refactor and split this component.`);
        }

        const inlineStyleIgnore = code.includes('@inline-style-ignore');
        if (!inlineStyleIgnore) {
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line) continue;
            const prevLine = i > 0 ? lines[i - 1] : undefined;
            if (prevLine?.includes('@inline-style-ignore-next')) {
              continue;
            }
            const staticStyleMatches = [...line.matchAll(/(?<![:])\bstyle="([^"]*)"/g)];
            for (const match of staticStyleMatches) {
              const styleValue = match[1];
              if (!styleValue) continue;
              if (isAllowedProperty(styleValue)) continue;
              if (isExceptionValue(styleValue)) continue;
              if (hasForbiddenValue(styleValue)) {
                violations.push(
                  `Line ${i + 1}: Forbidden static inline style: style="${styleValue}". Use Tailwind classes (e.g. w-[43%]) or CSS variables instead, or add "<!-- @inline-style-ignore-next -->" above the line to suppress.`
                );
              }
            }
          }
        }

        // F. Missing test IDs on interactive elements in app templates
        const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
        if (templateMatch) {
          const templateContent = templateMatch[1];
          if (templateContent) {
            const tlines = templateContent.split('\n');
            for (let i = 0; i < tlines.length; i++) {
              const line = tlines[i];
              if (!line) continue;
              const tagPattern = /<(button|input|select|textarea)\b(?![^>]*\bdata-testid\b)[^>]*>/g;
              const matches = [...line.matchAll(tagPattern)];
              for (const match of matches) {
                if (match[0].includes('type="hidden"') || match[0].includes('type=\'hidden\'')) {
                  continue;
                }
                violations.push(
                  `Line ${i + 1} (in template): Interactive tag "${match[0].trim()}" is missing a "data-testid" or ":data-testid" attribute for BDD testing.`
                );
              }
            }
          }
        }

        const classAttrRegex = /class\s*=\s*['"]([^'"]+)['"]/g;
        let classMatch;
        while ((classMatch = classAttrRegex.exec(code)) !== null) {
          const classValue = classMatch[1];
          if (classValue) {
            const classes = classValue.split(/\s+/).filter((c) => c.trim().length > 0);
            if (classes.length > 15) {
              violations.push(
                `Tailwind utility class bloat detected (${classes.length} classes in one tag). This inflates token count and breaks style consistency. Extract styles to a scoped <style> block.`
              );
            }
          }
        }

        if (code.includes("from 'pinia'") || code.includes('defineStore(')) {
          violations.push(
            `Pinia global store usage detected. Global stores fragment state context and hinder AI local reasoning. Use local Composition API refs or inject state via parent props.`
          );
        }

        const dynamicComponentRegex = /<component\s+[^>]*:is\s*=\s*['"]([^'"]+)['"]/g;
        let compMatch;
        while ((compMatch = dynamicComponentRegex.exec(code)) !== null) {
          violations.push(
            `Dynamic component resolution (is="${compMatch[1]}") is forbidden. It bypasses compile-time safety. Use static imports and standard v-if/v-else rendering.`
          );
        }

        if ((code.includes('<script setup>') || code.includes('<script setup ')) && !code.includes('lang="ts"')) {
          violations.push(
            `Vue script setup does not use TypeScript (lang="ts"). Strongly typed props and emits are required for compiler verification.`
          );
        }
      }

      if (violations.length > 0) {
        const message =
          `\n🚨 [OWP_ACTION_REQUIRED] in ${id}:\n` +
          violations.map((v) => `   ✖ ${v}`).join('\n') +
          `\n\n💡 AI Instruction: Please rewrite the code to respect our Design System standards. If this is a special exception, you can use the appropriate ignore comment (e.g., @ds-ignore-file or @inline-style-ignore-next).\n`;
        this.error(message);
      }
    },
  };
}

export default defineNuxtConfig({
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
  ssr: false, // 100% Client-side
  nitro: {
    routeRules: {
      '/models/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
      '/wasm/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    }
  },
  devtools: { enabled: true },
  experimental: {
    appManifest: false
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/devtools'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  // Disable tailwind expose config templates and config viewer to prevent Nitro
  // from compiling 100+ tailwind/expose/*.mjs virtual modules on every first
  // cold-start request (which causes >5 min compile timeouts in tests/dev).
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
    '**/playwright-report/**'
  ],



  spaLoadingTemplate: './spa-loading-template.html',

  app: {
    head: {
      title: 'ChouetteGPT',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Local AI Chat Assistant running on WebAssembly & WebGPU' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      // ...(process.env.CI === 'true' || process.env.DISABLE_OWP === 'true' ? [] : [vitePluginOwpStandards()])
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
      // web-llm ships pre-built ESM + WASM — skip Vite pre-bundling
      exclude: ['@mlc-ai/web-llm']
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: ['chouette-gpt.localhost', '.localhost'],
      hmr: {
        // Let Vite automatically infer the client port from window.location
      },
      watch: {
        usePolling: true
      },
      headers: {
        // Required for SharedArrayBuffer used by WebAssembly in web-llm workers
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  },

  compatibilityDate: '2024-04-03'
})
