# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/chat-bdd.spec.ts >> ChouetteGPT - E2E BDD Conversations and Behavior >> Simuler une conversation et manipuler les fonctionnalités principales
- Location: tests/e2e/chat-bdd.spec.ts:27:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="sidebar"]')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('ChouetteGPT - E2E BDD Conversations and Behavior', () => {
  4   |   // Give it a long timeout because downloading and running a real model takes time
  5   |   test.setTimeout(300000);
  6   |   
  7   |   test.beforeEach(async ({ page }) => {
  8   |     page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  9   |     page.on('pageerror', err => {
  10  |       console.error(`[BROWSER UNHANDLED ERROR] ${err.stack || err.message}`);
  11  |       throw new Error(`Browser console error: ${err.message}`);
  12  |     });
  13  |     page.on('requestfailed', request => console.log(`[BROWSER REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`));
  14  |     
  15  |     // Bypass onboarding modal during chat tests and pre-set engine as ready via mock
  16  |     await page.addInitScript(() => {
  17  |       try {
  18  |         window.localStorage.setItem('chouette-onboarding-seen', 'true');
  19  |         // Signal the app to use mock mode (bypasses real WebGPU & LLM loading)
  20  |         (window as any).__mock_llm = true;
  21  |       } catch (e) {
  22  |         // Ignore storage access errors on about:blank
  23  |       }
  24  |     });
  25  |   });
  26  | 
  27  |   test('Simuler une conversation et manipuler les fonctionnalités principales', async ({ page }) => {
  28  |     
  29  |     await test.step('Given je suis sur la page d\'accueil de ChouetteGPT', async () => {
  30  |       // open with mock=true to activate simulated Web-LLM engine
  31  |       await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
  32  |       
  33  |       // Verify app title
  34  |       await expect(page).toHaveTitle(/ChouetteGPT/);
  35  |       
  36  |       // Wait for Nuxt app to mount (wait for sidebar to exist in DOM)
  37  |       try {
> 38  |         await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 60000 });
      |                    ^ TimeoutError: page.waitForSelector: Timeout 60000ms exceeded.
  39  |       } catch (err) {
  40  |         console.log("PAGE CONTENT ON FAILURE:");
  41  |         console.log(await page.content());
  42  |         throw err;
  43  |       }
  44  |       
  45  |       // Verify sidebar is visible (md: breakpoint — 1280px viewport in config)
  46  |       const sidebar = page.getByTestId('sidebar');
  47  |       await expect(sidebar).toBeVisible();
  48  |       
  49  |       // Verify welcoming title
  50  |       const welcomeHeader = page.locator('h1');
  51  |       await expect(welcomeHeader).toContainText('ChouetteGPT');
  52  |       
  53  |       // Verify prompt suggestions are loaded
  54  |       const suggestionButtons = page.locator('button:has-text("Physique Quantique")');
  55  |       await expect(suggestionButtons).toBeVisible();
  56  |     });
  57  | 
  58  |     let conversationUrl: string;
  59  | 
  60  |     await test.step('When je saisis un message et que je l\'envoie', async () => {
  61  |       // Explicitly try to close the wizard modal if it's blocking the screen
  62  |       const closeWizardBtn = page.getByTestId('wizard-close-icon');
  63  |       try {
  64  |         await closeWizardBtn.waitFor({ state: 'visible', timeout: 3000 });
  65  |         await closeWizardBtn.click();
  66  |       } catch (e) {
  67  |         // Modal didn't appear, continue
  68  |       }
  69  | 
  70  |       const textarea = page.getByTestId('chat-textarea');
  71  |       await textarea.fill('Explique-moi la théorie de la relativité.');
  72  |       
  73  |       const submitBtn = page.getByTestId('send-button');
  74  |       await expect(submitBtn).toBeEnabled();
  75  |       await submitBtn.click();
  76  |     });
  77  |  
  78  |     await test.step('Then l\'application affiche l\'état de chargement du modèle', async () => {
  79  |       // Should show the loading overlay (DialogTitle has data-testid, not h3)
  80  |       const loadingOverlay = page.getByTestId('engine-loading-title');
  81  |       await expect(loadingOverlay).toBeVisible({ timeout: 10000 });
  82  |       
  83  |       // Wait for model downloading steps to finish (can take a few minutes on first run)
  84  |       await expect(loadingOverlay).not.toBeVisible({ timeout: 240000 }); // 4 minutes timeout
  85  |     });
  86  |  
  87  |     await test.step('And l\'IA locale répond sous forme de flux (streaming)', async () => {
  88  |       // The assistant message bubble should appear
  89  |       const assistantMessage = page.locator('.justify-start').last();
  90  |       await expect(assistantMessage).toBeVisible({ timeout: 10000 });
  91  |       
  92  |       // The stop button should be visible during generation
  93  |       const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
  94  |       await expect(stopBtn).toBeVisible({ timeout: 10000 });
  95  |       
  96  |       // Wait for some text to be generated (streaming)
  97  |       await expect(async () => {
  98  |         const textContent = await assistantMessage.textContent();
  99  |         expect(textContent?.length).toBeGreaterThan(50);
  100 |       }).toPass({ timeout: 30000 });
  101 | 
  102 |       // Click stop button to avoid long generation wait on CPU
  103 |       await stopBtn.click();
  104 | 
  105 |       // Wait for completion (stop button goes away and send button is back)
  106 |       const sendBtn = page.getByTestId('send-button');
  107 |       await expect(sendBtn).toBeVisible({ timeout: 10000 });
  108 |       
  109 |       // Keep track of the URL containing the conversation ID
  110 |       await page.waitForURL(/[?&]id=.+/);
  111 |       conversationUrl = page.url();
  112 |     });
  113 |  
  114 |     await test.step('And la conversation est enregistrée dans l\'historique', async () => {
  115 |       // href may be /?id= or /?mock=true&id=, so match just "id="
  116 |       const historyItem = page.locator('[data-testid="sidebar"] a[href*="id="]');
  117 |       await expect(historyItem).toHaveCount(1);
  118 |       
  119 |       // The title should match the default new conversation title (represented by first message prompt)
  120 |       await expect(historyItem.first()).toContainText('Explique-moi la');
  121 |     });
  122 |  
  123 |     await test.step('When je clique sur "Nouveau chat"', async () => {
  124 |       const newChatBtn = page.getByRole('button', { name: 'Nouveau chat' }).first();
  125 |       await newChatBtn.click();
  126 |       
  127 |       // Verify we returned to the clean welcoming page (but with the new conversation ID)
  128 |       await expect(page).toHaveURL(/[?&]id=.+/);
  129 |       const welcomeHeader = page.locator('h1');
  130 |       await expect(welcomeHeader).toContainText('ChouetteGPT');
  131 |     });
  132 |  
  133 |     await test.step('Then je peux créer une deuxième conversation', async () => {
  134 |       const textarea = page.getByTestId('chat-textarea');
  135 |       await textarea.fill('Comment faire une tarte aux pommes ?');
  136 |       
  137 |       const submitBtn = page.getByTestId('send-button');
  138 |       await submitBtn.click();
```