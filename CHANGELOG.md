# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-18

### Features
- **Core**: Implementation of local AI inference using WebGPU and WASM fallback.
- **I18n**: Added bilingual support (English and French).
- **UI/UX**: Comprehensive suite of UI components (Sheet, Dialog, Dropdown, etc.).
- **Mobile & A11y**: Fully responsive layouts, improved touch targets, and accessibility testing.
- **Assets**: Brand assets page, press kit, and light mode mockups.
- **Benchmarks**: Added CPU/GPU toggle on the benchmark page.
- **Privacy**: Trust UX indicators and local-only processing validation.

### Fixes
- **CI/CD**: Fixed Playwright headless configuration and WASM tests execution order.
- **WebGPU**: Fixed robust worker-side capability checks to prevent initialization crashes.
- **State**: Migrated legacy context providers to Pinia stores for better state management.
- **Styles**: Fixed contrast ratios, ARIA labels, and improved mobile layout responsiveness.

### Chores
- **Linting**: Migrated to flat ESLint configuration.
- **Assets**: Reorganized static assets and moved the public folder.
- **Testing**: Configured comprehensive E2E Playwright tests and Unit tests via Vitest.
- **Deployment**: Automated GitHub Pages deployment pipeline.
