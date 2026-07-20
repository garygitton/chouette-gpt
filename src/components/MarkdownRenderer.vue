<template>
  <div class="prose max-w-none break-words" v-html="htmlContent"/>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, toRef } from 'vue'
import { refThrottled } from '@vueuse/core'
import { Marked } from 'marked'
import markedKatex from 'marked-katex-extension'

const props = defineProps<{ content: string }>()

const marked = new Marked()
marked.use(markedKatex({ throwOnError: false }))

let hljs: any = null
let mermaid: any = null
const depsLoaded = ref(false)

const contentRef = toRef(props, 'content')
const throttledContent = refThrottled(contentRef, 50)

// Register custom code block renderer for premium editor look and feel
marked.use({
  renderer: {
    code({ text, lang }: { text: string, lang?: string }) {
      const code = text;
      
      const infostring = lang;
      const langMatch = (infostring || '').match(/\S*/)?.[0] || 'code'
      
      if (lang === 'mermaid') {
        return `<div class="mermaid">${code}</div>`
      }
      
      const language = (hljs && hljs.getLanguage(lang)) ? lang : 'plaintext'
      let highlighted = code
      if (hljs) {
        try {
          highlighted = hljs.highlight(code, { language }).value
        } catch (e) {
          // Fallback
        }
      }

      // Safe Base64 encoding compatible with both SSR/Node and Client/Browser
      const base64Code = typeof window !== 'undefined'
        ? btoa(unescape(encodeURIComponent(code)))
        : Buffer.from(code).toString('base64')

      return `
<div class="my-5 overflow-hidden rounded-xl border border-slate-200/10 dark:border-slate-800/80 bg-[#0d1117] shadow-xl">
  <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800/60 text-[10px] font-bold text-slate-400 select-none">
    <div class="flex items-center space-x-1.5 uppercase tracking-wider font-mono">
      <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
      <span class="ml-2 text-slate-300">${language}</span>
    </div>
    <button 
      class="hover:text-white transition-colors flex items-center space-x-1 font-mono px-2 py-0.5 rounded hover:bg-slate-800" 
      onclick="navigator.clipboard.writeText(atob('${base64Code}')); this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000)"
    >
      Copy
    </button>
  </div>
  <pre class="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-slate-100 bg-[#0d1117]"><code class="hljs language-${language}">${highlighted}</code></pre>
</div>`
    }
  }
})

const htmlContent = computed(() => {
  // Dependency tracking for reactivity when deps are loaded
  depsLoaded.value
  return marked.parse(throttledContent.value, { async: false }) as string
})

const renderMermaid = () => {
  if (typeof document !== 'undefined' && mermaid) {
    mermaid.run({
      nodes: document.querySelectorAll('.mermaid'),
    }).catch((e: any) => console.error(e))
  }
}

let mermaidTimeout: any = null
watch(htmlContent, () => {
  if (mermaidTimeout) clearTimeout(mermaidTimeout)
  mermaidTimeout = setTimeout(renderMermaid, 100)
})

onMounted(async () => {
  try {
    const [hljsMod, mermaidMod] = await Promise.all([
      import('highlight.js'),
      import('mermaid'),
      import('highlight.js/styles/atom-one-dark.css')
    ])
    hljs = hljsMod.default
    mermaid = mermaidMod.default
    mermaid.initialize({ startOnLoad: false, theme: 'dark' })
    depsLoaded.value = true // Trigger re-render of computed
    setTimeout(renderMermaid, 100)
  } catch (e) {
    console.error('Failed to load markdown dependencies', e)
  }
})
</script>