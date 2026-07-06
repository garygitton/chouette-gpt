const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type().toUpperCase(), msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err.message, '\\n', err.stack));
  console.log('Navigating to http://localhost:3000/ ...');
  try {
    await page.goto('http://localhost:3000/', { timeout: 60000 });
  } catch(e) {
    console.log('Goto timed out, proceeding anyway...');
  }
  console.log('Waiting 45 seconds for Vite HMR/Pre-bundling reloads to settle...');
  await page.waitForTimeout(45000);
  const html = await page.content();
  console.log('[DOM HTML START]\\n' + html.substring(0, 3000) + '\\n[DOM HTML END]');
  await browser.close();
})();
