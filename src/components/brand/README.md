# Brand Assets Components

This directory contains the modular UI components that make up the `/brand-assets` page.
The page was split to improve maintainability and avoid a monolithic >500 line file.

## Architecture

- **`pages/brand-assets.vue`**: The parent view. It is responsible for injecting the global `selectedLang` prop into all children components. This allows users to preview brand pitches in either English or French, regardless of the app's global language setting (though they sync by default).
- **`src/components/brand/*.vue`**: Dumb UI components. They receive `selectedLang` as a prop and use `useBrandAssetsData.ts` to access their static data (which contains pitches, FAQs, scenario strings, etc.).
- **`src/composables/useBrandAssetsData.ts`**: Contains all static copies, logos, and taglines used exclusively by the brand pages.

## Styling Guidelines

To ensure components are easy for AI coding agents and human developers to read, edit, and maintain:
- Avoid excessive inline Tailwind utility classes.
- Use scoped `<style scoped>` blocks with Tailwind's `@apply` directive to consolidate styles under descriptive, semantic class names (e.g., `.press-card`, `.section-title`).
- This keeps the `<template>` structure clean, readable, and highly maintainable.

## Testing Rules

When adding new components to this directory, please ensure you add isolated unit tests using Vitest (e.g. `tests/unit/BrandHeader.test.ts`). This is critical since these are pure visual components and easier to test in isolation than the full Playwright E2E browser scope.

