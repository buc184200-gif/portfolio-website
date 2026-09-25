import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demos = [
  { file: 'venom-gym.webp', url: 'https://buc-venom-gym.netlify.app' }
];

const outputDir = path.join(__dirname, 'public', 'demo-previews');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    defaultViewport: { width: 1600, height: 900, deviceScaleFactor: 1 }
  });

  for (const demo of demos) {
    console.log(`Processing ${demo.file} (${demo.url})...`);
    const page = await browser.newPage();
    
    try {
      // Go to the URL and wait for network idle to ensure fonts/images are loaded
      await page.goto(demo.url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Wait for 5 seconds to let any entrance animations fully settle
      console.log("Waiting 5 seconds for animations...");
      await new Promise(r => setTimeout(r, 5000));
      
      const outputPath = path.join(outputDir, demo.file);
      await page.screenshot({ path: outputPath, type: 'webp', quality: 80 });
      console.log(`Saved screenshot to ${outputPath}`);
    } catch (e) {
      console.error(`Failed to capture ${demo.url}:`, e);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured!');
})();
