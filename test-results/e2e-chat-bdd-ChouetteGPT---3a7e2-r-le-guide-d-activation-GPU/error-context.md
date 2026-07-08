# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/chat-bdd.spec.ts >> ChouetteGPT - E2E BDD Conversations and Behavior >> Accéder aux paramètres et utiliser le guide d'activation GPU
- Location: tests/e2e/chat-bdd.spec.ts:198:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Paramètres"
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 60000ms
  - waiting for locator('h1')

```

# Test source

```ts
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
  139 |       
  140 |       // Model loading overlay will be skipped since engine is already loaded!
  141 |       const assistantMessage = page.locator('.justify-start').last();
  142 |       await expect(assistantMessage).toBeVisible({ timeout: 10000 });
  143 |       
  144 |       // Wait for some text to be generated
  145 |       await expect(async () => {
  146 |         const textContent = await assistantMessage.textContent();
  147 |         expect(textContent?.length).toBeGreaterThan(50);
  148 |       }).toPass({ timeout: 30000 });
  149 | 
  150 |       // Click stop button
  151 |       const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
  152 |       await stopBtn.click();
  153 | 
  154 |       // Wait for completion (send button is back)
  155 |       const sendBtn = page.getByTestId('send-button');
  156 |       await expect(sendBtn).toBeVisible({ timeout: 10000 });
  157 |       
  158 |       // Verify we have 2 history items in sidebar (href may be /?id= or /?mock=true&id=)
  159 |       const historyItems = page.locator('[data-testid="sidebar"] a[href*="id="]');
  160 |       await expect(historyItems).toHaveCount(2);
  161 |     });
  162 | 
  163 |     await test.step('When je bascule en mode sombre ou clair', async () => {
  164 |       const htmlElement = page.locator('html');
  165 |       
  166 |       // Get current mode by checking HTML class
  167 |       const themeToggleBtn = page.getByTestId('theme-toggle');
  168 |       const isInitialDark = await htmlElement.evaluate(el => el.classList.contains('dark'));
  169 |       
  170 |       // Toggle
  171 |       await themeToggleBtn.click();
  172 |       
  173 |       // Verify toggle changed classes
  174 |       if (isInitialDark) {
  175 |         await expect(htmlElement).not.toHaveClass(/dark/);
  176 |       } else {
  177 |         await expect(htmlElement).toHaveClass(/dark/);
  178 |       }
  179 |     });
  180 | 
  181 |     await test.step('When je supprime une conversation de l\'historique', async () => {
  182 |       // Hover the first conversation item to reveal the trash button
  183 |       const firstConvItem = page.locator('[data-testid="sidebar"] div.group').first();
  184 |       const trashBtn = firstConvItem.locator('button');
  185 |       
  186 |       // Hover & click trash
  187 |       await firstConvItem.hover();
  188 |       await expect(trashBtn).toBeVisible();
  189 |       await trashBtn.click();
  190 |       
  191 |       // We should only have 1 conversation left in history
  192 |       const historyItems = page.locator('[data-testid="sidebar"] a[href*="id="]');
  193 |       await expect(historyItems).toHaveCount(1);
  194 |     });
  195 | 
  196 |   });
  197 | 
  198 |   test('Accéder aux paramètres et utiliser le guide d\'activation GPU', async ({ page }) => {
  199 |     // Force WebGPU detection to fail in this test to reveal the GPU guide warning
  200 |     await page.addInitScript(() => {
  201 |       delete (window.Navigator.prototype as any).gpu;
  202 |     });
  203 | 
  204 |     // Go directly to settings
  205 |     await page.goto('/settings', { waitUntil: 'domcontentloaded' });
  206 |     
  207 |     // Verify title
  208 |     const header = page.locator('h1');
> 209 |     await expect(header).toContainText('Paramètres', { timeout: 60000 });
      |                          ^ Error: expect(locator).toContainText(expected) failed
  210 |     
  211 |     // The guide button should be visible since the headless runner doesn't have a fully compatible GPU
  212 |     const guideBtn = page.locator('button').filter({ hasText: 'Guide d\'activation GPU' }).first();
  213 |     await expect(guideBtn).toBeVisible({ timeout: 60000 });
  214 |     await guideBtn.click();
  215 |     
  216 |     // Verify modal title via data-testid (Radix Dialog renders as h2, not h3)
  217 |     const modalHeader = page.getByTestId('wizard-title');
  218 |     await expect(modalHeader).toBeVisible();
  219 |     
  220 |     // Verify modal step text
  221 |     const stepOne = page.locator('text=Utiliser un navigateur compatible');
  222 |     await expect(stepOne).toBeVisible();
  223 |     
  224 |     // Close modal via data-testid button
  225 |     await page.getByTestId('wizard-close-btn').click();
  226 |     
  227 |     // Modal should disappear
  228 |     await expect(modalHeader).not.toBeVisible();
  229 |   });
  230 | 
  231 |   test('Vérifier et modifier les paramètres de l\'application (Langue, LLM, Liens Sociaux)', async ({ page }) => {
  232 |     // Go directly to settings
  233 |     await page.goto('/settings', { waitUntil: 'domcontentloaded' });
  234 | 
  235 |     // 1. Verify and Edit Social Inputs
  236 |     const linkedinInput = page.getByTestId('linkedin-input');
  237 |     const githubInput = page.getByTestId('github-input');
  238 |     const websiteInput = page.getByTestId('website-input');
  239 | 
  240 |     await expect(linkedinInput).toBeVisible();
  241 |     await linkedinInput.fill('https://linkedin.com/in/testuser');
  242 |     await githubInput.fill('https://github.com/testuser');
  243 |     await websiteInput.fill('https://testuser.com');
  244 | 
  245 |     // 3. Language Selector
  246 |     const langSelectTrigger = page.locator('main').getByTestId('language-select-trigger');
  247 |     await expect(langSelectTrigger).toBeVisible();
  248 |     await langSelectTrigger.click();
  249 | 
  250 |     // Select english language
  251 |     const langEnItem = page.getByTestId('language-item-en');
  252 |     await expect(langEnItem).toBeVisible();
  253 |     await langEnItem.click();
  254 | 
  255 |     // Verify UI language changed to English (card title becomes "Interface Language")
  256 |     const langCardTitle = page.getByTestId('language-card-title');
  257 |     await expect(langCardTitle).toContainText('Interface Language');
  258 | 
  259 |     // Restore language to french
  260 |     await langSelectTrigger.click();
  261 |     const langFrItem = page.getByTestId('language-item-fr');
  262 |     await expect(langFrItem).toBeVisible();
  263 |     await langFrItem.click();
  264 | 
  265 |     // 4. Persistence verification: Navigate away and come back
  266 |     const backBtn = page.getByTestId('back-button');
  267 |     await expect(backBtn).toBeVisible();
  268 |     await backBtn.click();
  269 | 
  270 |     // Navigate to settings again via sidebar footer button
  271 |     const settingsSidebarBtn = page.getByTestId('settings-button');
  272 |     await expect(settingsSidebarBtn).toBeVisible();
  273 |     await settingsSidebarBtn.click();
  274 | 
  275 |     // Check if the inputs are still populated (persisted via settingsStore localStorage watch)
  276 |     await expect(linkedinInput).toHaveValue('https://linkedin.com/in/testuser');
  277 |     await expect(githubInput).toHaveValue('https://github.com/testuser');
  278 |     await expect(websiteInput).toHaveValue('https://testuser.com');
  279 |   });
  280 | 
  281 |   test('Utiliser les suggestions de messages sur le tableau de bord', async ({ page }) => {
  282 |     // Open home page with mock=true
  283 |     await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
  284 | 
  285 |     // Verify suggested prompts are visible
  286 |     const suggestionBtn = page.getByTestId('suggested-prompt-physique-quantique');
  287 |     await expect(suggestionBtn).toBeVisible();
  288 |     
  289 |     // Click suggestion
  290 |     await suggestionBtn.click();
  291 | 
  292 |     // Model loading overlay will show up
  293 |     const loadingOverlay = page.getByTestId('engine-loading-title');
  294 |     await expect(loadingOverlay).toBeVisible({ timeout: 10000 });
  295 |     await expect(loadingOverlay).not.toBeVisible({ timeout: 240000 }); // Wait for compilation/loading
  296 | 
  297 |     // Should show chat streaming response
  298 |     const assistantMessage = page.locator('.justify-start').last();
  299 |     await expect(assistantMessage).toBeVisible({ timeout: 10000 });
  300 |     
  301 |     // Stop generation
  302 |     const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
  303 |     await expect(stopBtn).toBeVisible();
  304 |     await stopBtn.click();
  305 |   });
  306 | 
  307 |   test('Accéder à la page de confidentialité et retourner à l\'accueil', async ({ page }) => {
  308 |     // Open home page with mock=true
  309 |     await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
```