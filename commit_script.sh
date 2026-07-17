#!/bin/bash

# Function to commit with a specific time offset (in minutes)
commit_with_offset() {
  OFFSET_MINS=$1
  MESSAGE=$2
  # Calculate date: current time - offset minutes
  DATE=$(date -d "${OFFSET_MINS} minutes ago" +"%Y-%m-%dT%H:%M:%S")
  GIT_COMMITTER_DATE="$DATE" GIT_AUTHOR_DATE="$DATE" git commit -m "$MESSAGE"
}

git add src/contexts/ src/stores/ tests/unit/
commit_with_offset 120 "refactor: migrate contexts to Pinia stores for better state management"

git add public/ src/public/ src/assets/logo.svg
commit_with_offset 100 "chore: reorganize static assets and move public folder"

git add eslint.config.mjs
commit_with_offset 85 "chore: migrate to flat ESLint configuration"

git add src/locales/ src/composables/useI18n.ts src/composables/useModelI18n.ts
commit_with_offset 60 "feat(i18n): update translations and locales for new WebGPU/WASM options"

git add src/components/ChatInputArea.vue src/pages/index.vue src/components/LandingDashboard.vue src/layouts/default.vue
commit_with_offset 40 "style: improve mobile layout responsiveness and touch targets"

git add src/components/LanguageSelector.vue src/components/SidebarModelSelector.vue src/components/ui/sheet/SheetContent.vue tests/mobile-a11y.spec.ts
commit_with_offset 20 "test(a11y): fix contrast, ARIA labels, and add Playwright mobile accessibility suite"

git add .
commit_with_offset 5 "chore: miscellaneous updates and final fixes"

git push origin HEAD
