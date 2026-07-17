const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, 'src')

const replacements = [
  { search: /import\s+\{\s*useChat\s*\}\s+from\s+['"]~\/contexts\/chatContext['"]/g, replace: "import { useChatStore } from '~/stores/chatStore'" },
  { search: /import\s+\{\s*useModel\s*\}\s+from\s+['"]~\/contexts\/modelContext['"]/g, replace: "import { useModelStore } from '~/stores/modelStore'" },
  { search: /import\s+\{\s*useSettings\s*\}\s+from\s+['"]~\/contexts\/settingsContext['"]/g, replace: "import { useSettingsStore } from '~/stores/settingsStore'" },
  { search: /import\s+\{\s*useConversation\s*\}\s+from\s+['"]~\/contexts\/conversationContext['"]/g, replace: "import { useConversationStore } from '~/stores/conversationStore'" },
  { search: /import\s+\{\s*useDevice\s*\}\s+from\s+['"]~\/contexts\/deviceContext['"]/g, replace: "import { useDeviceStore } from '~/stores/deviceStore'" },

  { search: /useChat\(\)/g, replace: "useChatStore()" },
  { search: /useModel\(\)/g, replace: "useModelStore()" },
  { search: /useSettings\(\)/g, replace: "useSettingsStore()" },
  { search: /useConversation\(\)/g, replace: "useConversationStore()" },
  { search: /useDevice\(\)/g, replace: "useDeviceStore()" }
]

function walk(directory) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const fullPath = path.join(directory, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath)
    } else if (fullPath.endsWith('.vue') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false
      for (const r of replacements) {
        if (content.match(r.search)) {
          content = content.replace(r.search, r.replace)
          changed = true
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8')
        console.log('Updated', fullPath)
      }
    }
  }
}

walk(dir)
console.log('Done.')
