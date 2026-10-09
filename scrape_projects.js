const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = chromePaths.find(p => fs.existsSync(p));
console.log('Using browser executable:', executablePath);

const projects = [
  {
    name: 'FitForge',
    url: 'https://earnest-begonia-0f18f2.netlify.app/',
    imageFile: 'fitforge_preview.png'
  },
  {
    name: 'Vanya Heritage',
    url: 'https://vanyaheritage.netlify.app/',
    imageFile: 'vanya_heritage_preview.png'
  },
  {
    name: 'Ideal Public School Hasanpura',
    url: 'https://www.idealpublicschoolhasanpura.com/',
    imageFile: 'ideal_school_preview.png'
  }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--ignore-certificate-errors', '--window-size=1440,900']
  });

  const results = [];

  for (const p of projects) {
    console.log(`Navigating to ${p.name} at ${p.url}...`);
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
      
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000)); // wait for transitions/fonts

      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean),
          h2: Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()).filter(Boolean).slice(0, 5),
          bodySnippet: document.body.innerText.slice(0, 600)
        };
      });

      const outPath = path.join(__dirname, 'assets', p.imageFile);
      // Capture screenshot of the above-the-fold or hero card area
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1440, height: 860 } });
      console.log(`Saved screenshot to ${outPath}`);

      results.push({ ...p, ...pageInfo, savedPath: outPath });
      await page.close();
    } catch (err) {
      console.error(`Error scraping ${p.name}:`, err.message);
      results.push({ ...p, error: err.message });
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'new_projects_data.json'), JSON.stringify(results, null, 2));
  console.log('Finished capturing all projects!');
}

run();
