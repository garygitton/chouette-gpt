import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let errors = [];
  
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    if (url.includes('_nuxt') && contentType.includes('text/html')) {
      console.log(`WARNING: _nuxt resource returned HTML! URL: ${url}`);
      try {
        const text = await response.text();
        console.log(`Preview of HTML: ${text.substring(0, 100)}`);
      } catch (e) {}
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });

  console.log("Navigating to http://localhost:3014 ...");
  try {
    await page.goto('http://localhost:3014', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (err) {
    console.error("Navigation error:", err.message);
  }

  if (errors.length > 0) {
    console.log(`\n\n--- FOUND ${errors.length} ERRORS ---`);
  } else {
    console.log("\n\n--- NO ERRORS FOUND. Page is clean! ---");
  }

  await browser.close();
  console.log("Done.");
})();
