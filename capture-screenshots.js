import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demos = [
  { file: 'gym-demo-1.webp', url: 'https://buc-gym-demo-1.netlify.app' },
  { file: 'gym-demo-2.webp', url: 'https://buc-gym-demo-2.netlify.app' },
  { file: 'gym-demo-3.webp', url: 'https://buc-gym-demo-3.netlify.app' },
  { file: 'clinic-demo-1.webp', url: 'https://buc-clinic-demo-1.netlify.app' },
  { file: 'clinic-demo-2.webp', url: 'https://buc-clinic-demo-2.netlify.app' },
  { file: 'clinic-demo-3.webp', url: 'https://buc-clinic-demo-3.netlify.app' },
  { file: 'clinic-demo-4.webp', url: 'https://buc-clinic-demo-4.netlify.app' },
  { file: 'restaurant-demo-1.webp', url: 'https://buc-restaurant-demo-1.netlify.app' },
  { file: 'restaurant-demo-2.webp', url: 'https://buc-restaurant-demo-2.netlify.app' },
  { file: 'restaurant-demo-3.webp', url: 'https://buc-restaurant-demo-3.netlify.app' },
  { file: 'restaurant-demo-4.webp', url: 'https://buc-restaurant-demo-4.netlify.app' },
  { file: 'coaching-demo-1.webp', url: 'https://buc-coaching-demo-1.netlify.app' },
  { file: 'coaching-demo-2.webp', url: 'https://buc-coaching-demo-2.netlify.app' },
  { file: 'coaching-demo-3.webp', url: 'https://buc-coaching-demo-3.netlify.app' },
  { file: 'coaching-demo-4.webp', url: 'https://buc-coaching-demo-4.netlify.app' },
  { file: 'ecommerce-demo-1.webp', url: 'https://sarthak-ecommerce-demo-1-app.netlify.app' },
  { file: 'ecommerce-demo-2.webp', url: 'https://sarthak-ecommerce-demo-2-app.netlify.app' },
  { file: 'ecommerce-demo-3.webp', url: 'https://sarthak-ecommerce-demo-3-app.netlify.app' },
  { file: 'ecommerce-demo-4.webp', url: 'https://sarthak-ecommerce-demo-4-app.netlify.app' }
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
      
      // Wait for 3 seconds to let any GSAP entrance animations finish
      await new Promise(r => setTimeout(r, 4000));
      
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
