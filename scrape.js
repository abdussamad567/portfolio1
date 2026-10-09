const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Visiting Majd Framer Portfolio...');
  try {
    await page.goto('https://majd-portfolio.framer.website/', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: 'majd_screenshot.png', fullPage: true });
    console.log('Saved majd_screenshot.png');

    // Extract elements and text
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href })),
        images: Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt }))
      };
    });
    fs.writeFileSync('majd_data.json', JSON.stringify(data, null, 2));
    console.log('Saved majd_data.json');
  } catch (e) {
    console.error('Error on Majd site:', e.message);
  }

  console.log('Visiting user project: temporary-fast-dune-r0j7496.vercel.app...');
  try {
    const projPage = await browser.newPage();
    await projPage.setViewport({ width: 1440, height: 900 });
    const response = await projPage.goto('https://temporary-fast-dune-r0j7496.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Response status:', response ? response.status() : 'none');
    await projPage.screenshot({ path: 'project_full.png', fullPage: true });
    await projPage.screenshot({ path: 'project_hero.png', fullPage: false });
    console.log('Saved project_full.png and project_hero.png');

    const projData = await projPage.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText,
        h1s: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim())
      };
    });
    fs.writeFileSync('project_data.json', JSON.stringify(projData, null, 2));
    console.log('Saved project_data.json');
  } catch (e) {
    console.error('Error on Project site:', e.message);
  }

  console.log('Visiting GitHub profile: github.com/abdussamad567...');
  try {
    const ghPage = await browser.newPage();
    await ghPage.setViewport({ width: 1440, height: 900 });
    await ghPage.goto('https://github.com/abdussamad567', { waitUntil: 'networkidle2', timeout: 30000 });
    await ghPage.screenshot({ path: 'github_profile.png' });
    const ghData = await ghPage.evaluate(() => {
      const bio = document.querySelector('.p-note')?.innerText;
      const pinned = Array.from(document.querySelectorAll('.pinned-item-list-item')).map(item => item.innerText);
      const repos = Array.from(document.querySelectorAll('[itemprop="owns"]')).map(item => item.innerText);
      return { bio, pinned, repos };
    });
    fs.writeFileSync('github_data.json', JSON.stringify(ghData, null, 2));
    console.log('Saved github_data.json');
  } catch (e) {
    console.error('Error on GitHub:', e.message);
  }

  await browser.close();
  console.log('All done!');
}

run();
