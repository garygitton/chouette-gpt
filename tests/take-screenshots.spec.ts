import { test } from '@playwright/test';
import * as path from 'path';

test('take real site screenshots with conversation', async ({ page }) => {
  // Listen to browser console and errors
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  // Wait for the dev server to settle
  await page.waitForTimeout(5000);

  // 1. Visit the home page to initialize the domain/localstorage context
  await page.goto('/?mock=true&autoDownload=false');
  await page.waitForTimeout(2000);

  // 2. Seed IndexedDB with a conversation and set dark mode in localStorage
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('app_language', 'fr');
    
    // Force light style on document element
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('chouette-gpt-db', 1);
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('conversations', 'readwrite');
        const store = transaction.objectStore('conversations');
        
        const mockConv = {
          id: '123456789',
          title: 'Fonctionnement local',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
          messages: [
            {
              id: 'm1',
              role: 'user',
              content: "Peux-tu m'expliquer le fonctionnement de ChouetteGPT ?",
              timestamp: Date.now() - 10000
            },
            {
              id: 'm2',
              role: 'assistant',
              content: "Bien sûr ! 🦉 **ChouetteGPT** est un assistant de discussion intelligent et **100% local**.\n\nContrairement aux IA traditionnelles (comme ChatGPT ou Claude) qui envoient vos messages sur des serveurs distants, ChouetteGPT effectue tous ses calculs directement dans **votre navigateur internet** via :\n1. **WebGPU** : Pour exploiter la puissance de calcul de votre carte graphique (GPU) et accélérer l'inférence.\n2. **WebAssembly (WASM)** : Pour l'exécution CPU si WebGPU n'est pas supporté.\n\nVos données de chat et vos documents ne quittent jamais votre machine, garantissant une confidentialité absolue. 🛡️",
              timestamp: Date.now()
            }
          ]
        };
        
        const putReq = store.put(mockConv);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
      request.onerror = () => reject(request.error);
    });
  });

  // 3. Navigate directly to the seeded conversation
  await page.goto('/?id=123456789&mock=true&autoDownload=false');

  // Wait for the conversation messages to render
  await page.waitForSelector('text=Bien sûr !');
  
  // Make sure the theme and styles are applied properly
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  });

  // Allow animations and render to settle
  await page.waitForTimeout(2000);

  // 4. Capture Desktop View (1280x800)
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500); // let layout resize settle
  const desktopPath = path.resolve('public/app_mockup.png');
  await page.screenshot({ path: desktopPath });
  console.log(`Desktop mockup saved to: ${desktopPath}`);

  // 5. Capture Mobile View (375x812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500); // let layout resize settle
  const mobilePath = path.resolve('public/app_mockup_mobile.png');
  await page.screenshot({ path: mobilePath });
  console.log(`Mobile mockup saved to: ${mobilePath}`);
});
