import { test, expect } from '@playwright/test';

test.describe('ChouetteGPT - E2E BDD Conversations and Behavior', () => {
  // Give it a long timeout because downloading and running a real model takes time
  test.setTimeout(300000);
  
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => {
      console.error(`[BROWSER UNHANDLED ERROR] ${err.stack || err.message}`);
      throw new Error(`Browser console error: ${err.message}`);
    });
    page.on('requestfailed', request => console.log(`[BROWSER REQUEST FAILED] ${request.url()}: ${request.failure()?.errorText}`));
    
    // Bypass onboarding modal during chat tests and pre-set engine as ready via mock
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('chouette-onboarding-seen', 'true');
        // Signal the app to use mock mode (bypasses real WebGPU & LLM loading)
        (window as any).__mock_llm = true;
      } catch (e) {
        // Ignore storage access errors on about:blank
      }
    });
  });

  test('Simuler une conversation et manipuler les fonctionnalités principales', async ({ page }) => {
    
    await test.step('Given je suis sur la page d\'accueil de ChouetteGPT', async () => {
      // open with mock=true to activate simulated Web-LLM engine
      await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });
      
      // Verify app title
      await expect(page).toHaveTitle(/ChouetteGPT/);
      
      // Wait for Nuxt app to mount (wait for sidebar to exist in DOM)
      try {
        await page.waitForSelector('[data-testid="sidebar"]', { state: 'attached', timeout: 60000 });
      } catch (err) {
        console.log("PAGE CONTENT ON FAILURE:");
        console.log(await page.content());
        throw err;
      }
      
      // Verify sidebar is visible (md: breakpoint — 1280px viewport in config)
      const sidebar = page.getByTestId('sidebar');
      await expect(sidebar).toBeVisible();
      
      // Verify welcoming title
      const welcomeHeader = page.locator('h1');
      await expect(welcomeHeader).toContainText('ChouetteGPT');
      

      // Wait for engine to be ready
      const readyBadge = page.getByText(/Prêt/i).first();
      await expect(readyBadge).toBeVisible({ timeout: 60000 });
    });

    let conversationUrl: string;

    await test.step('When je saisis un message et que je l\'envoie', async () => {
      // Explicitly try to close the wizard modal if it's blocking the screen
      const closeWizardBtn = page.getByTestId('wizard-close-icon');
      try {
        await closeWizardBtn.waitFor({ state: 'visible', timeout: 3000 });
        await closeWizardBtn.click();
      } catch (e) {
        // Modal didn't appear, continue
      }

      const textarea = page.getByTestId('chat-textarea');
      await textarea.fill('Explique-moi la théorie de la relativité.');
      
      const submitBtn = page.getByTestId('send-button');
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
    });
 

 
    await test.step('And l\'IA locale répond sous forme de flux (streaming)', async () => {
      // The assistant message bubble should appear
      const assistantMessage = page.locator('.justify-start').last();
      await expect(assistantMessage).toBeVisible({ timeout: 10000 });
      
      // The stop button should be visible during generation
      const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
      await expect(stopBtn).toBeVisible({ timeout: 10000 });
      
      // Wait for some text to be generated (streaming)
      await expect(async () => {
        const textContent = await assistantMessage.textContent();
        expect(textContent?.length).toBeGreaterThan(10);
      }).toPass({ timeout: 30000 });

      // Click stop button to avoid long generation wait on CPU
      await stopBtn.click();

      // Wait for completion (stop button goes away and send button is back)
      const sendBtn = page.getByTestId('send-button');
      await expect(sendBtn).toBeVisible({ timeout: 10000 });
      
      // Keep track of the URL containing the conversation ID
      await page.waitForURL(/[?&]id=.+/);
      conversationUrl = page.url();
    });
 
    await test.step('And la conversation est enregistrée dans l\'historique', async () => {
      // href may be /?id= or /?mock=true&id=, so match just "id="
      const historyItem = page.locator('[data-testid="sidebar"] a[href*="id="]');
      await expect(historyItem).toHaveCount(1);
      
      // The title should match the default new conversation title (represented by first message prompt)
      await expect(historyItem.first()).toContainText('Explique-moi la');
    });
 
    await test.step('When je clique sur "Nouveau chat"', async () => {
      const newChatBtn = page.getByRole('button', { name: 'Nouveau chat' }).first();
      await newChatBtn.click();
      
      // Verify we returned to the clean welcoming page (but with the new conversation ID)
      await expect(page).toHaveURL(/[?&]id=.+/);
      const welcomeHeader = page.locator('h1');
      await expect(welcomeHeader).toContainText('ChouetteGPT');
    });
 
    await test.step('Then je peux créer une deuxième conversation', async () => {
      const textarea = page.getByTestId('chat-textarea');
      await textarea.fill('Comment faire une tarte aux pommes ?');
      
      const submitBtn = page.getByTestId('send-button');
      await submitBtn.click();
      
      // Model loading overlay will be skipped since engine is already loaded!
      const assistantMessage = page.locator('.justify-start').last();
      await expect(assistantMessage).toBeVisible({ timeout: 10000 });
      
      // Wait for some text to be generated
      await expect(async () => {
        const textContent = await assistantMessage.textContent();
        expect(textContent?.length).toBeGreaterThan(10);
      }).toPass({ timeout: 30000 });

      // Click stop button
      const stopBtn = page.locator('button').filter({ hasText: 'Interrompre' }).first();
      await stopBtn.click();

      // Wait for completion (send button is back)
      const sendBtn = page.getByTestId('send-button');
      await expect(sendBtn).toBeVisible({ timeout: 10000 });
      
      // Verify we have 2 history items in sidebar (href may be /?id= or /?mock=true&id=)
      const historyItems = page.locator('[data-testid="sidebar"] a[href*="id="]');
      await expect(historyItems).toHaveCount(2);
    });

    await test.step('When je bascule en mode sombre ou clair', async () => {
      const htmlElement = page.locator('html');
      
      // Get current mode by checking HTML class
      const themeToggleBtn = page.getByTestId('theme-toggle');
      const isInitialDark = await htmlElement.evaluate(el => el.classList.contains('dark'));
      
      // Toggle
      await themeToggleBtn.click();
      
      // Verify toggle changed classes
      if (isInitialDark) {
        await expect(htmlElement).not.toHaveClass(/dark/);
      } else {
        await expect(htmlElement).toHaveClass(/dark/);
      }
    });

    await test.step('When je supprime une conversation de l\'historique', async () => {
      // Hover the first conversation item to reveal the trash button
      const firstConvItem = page.locator('[data-testid="sidebar"] div.group').first();
      const trashBtn = firstConvItem.locator('button');
      
      // Hover & click trash
      await firstConvItem.hover();
      await expect(trashBtn).toBeVisible();
      await trashBtn.click();
      
      // We should only have 1 conversation left in history
      const historyItems = page.locator('[data-testid="sidebar"] a[href*="id="]');
      await expect(historyItems).toHaveCount(1);
    });

  });



  test('Vérifier et modifier les paramètres de l\'application (Langue, LLM, Liens Sociaux)', async ({ page }) => {
    // Go directly to settings
    await page.goto('/settings', { waitUntil: 'domcontentloaded' });

    // 1. Verify and Edit Social Inputs
    const linkedinInput = page.getByTestId('linkedin-input');
    const githubInput = page.getByTestId('github-input');
    const websiteInput = page.getByTestId('website-input');

    await expect(linkedinInput).toBeVisible();
    await linkedinInput.fill('https://linkedin.com/in/testuser');
    await githubInput.fill('https://github.com/testuser');
    await websiteInput.fill('https://testuser.com');

    // 3. Language Selector
    const langSelectTrigger = page.locator('main').getByTestId('language-select-trigger');
    await expect(langSelectTrigger).toBeVisible();
    await langSelectTrigger.click();

    // Select english language
    const langEnItem = page.getByTestId('language-item-en');
    await expect(langEnItem).toBeVisible();
    await langEnItem.click();

    // Verify UI language changed to English (card title becomes "Interface Language")
    const langCardTitle = page.getByTestId('language-card-title');
    await expect(langCardTitle).toContainText('Interface Language');

    // Restore language to french
    await langSelectTrigger.click();
    const langFrItem = page.getByTestId('language-item-fr');
    await expect(langFrItem).toBeVisible();
    await langFrItem.click();

    // 4. Persistence verification: Navigate away and come back
    const backBtn = page.getByTestId('back-button');
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Navigate to settings again via sidebar footer button
    const settingsSidebarBtn = page.getByTestId('settings-button');
    await expect(settingsSidebarBtn).toBeVisible();
    await settingsSidebarBtn.click();

    // Check if the inputs are still populated (persisted via settingsStore localStorage watch)
    await expect(linkedinInput).toHaveValue('https://linkedin.com/in/testuser');
    await expect(githubInput).toHaveValue('https://github.com/testuser');
    await expect(websiteInput).toHaveValue('https://testuser.com');
  });



  test('Accéder à la page de confidentialité et retourner à l\'accueil', async ({ page }) => {
    // Open home page with mock=true
    await page.goto('/?mock=true', { waitUntil: 'domcontentloaded' });

    // Click privacy button in sidebar
    const privacySidebarBtn = page.getByTestId('privacy-button');
    await expect(privacySidebarBtn).toBeVisible();
    await privacySidebarBtn.click();

    // Check URL
    await expect(page).toHaveURL(/\/privacy$/);

    // Verify privacy title
    const header = page.locator('h1');
    await expect(header).toContainText('Confidentialité');

    // Go back to home page via back button
    const backBtn = page.getByTestId('back-button');
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // We should be back on home page
    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });
  
});
