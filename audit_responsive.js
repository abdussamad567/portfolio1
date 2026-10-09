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

const viewports = [
  { name: 'mobile_360', width: 360, height: 740, isMobile: true },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true },
  { name: 'tablet_768', width: 768, height: 1024, isMobile: false },
  { name: 'laptop_1024', width: 1024, height: 800, isMobile: false },
  { name: 'desktop_1440', width: 1440, height: 900, isMobile: false }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditReport = [];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // Check horizontal overflow
    const overflowCheck = await page.evaluate((vpWidth) => {
      const docScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      const windowWidth = window.innerWidth;
      
      const overflowingElements = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > windowWidth + 1.5) {
          overflowingElements.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      });

      return {
        hasOverflow: docScrollWidth > windowWidth || bodyScrollWidth > windowWidth,
        docScrollWidth,
        bodyScrollWidth,
        windowWidth,
        overflowingElementsCount: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 5)
      };
    }, vp.width);

    // If mobile, test opening hamburger menu
    if (vp.isMobile) {
      const menuBtn = await page.$('#mobileMenuToggle');
      if (menuBtn) {
        await menuBtn.click();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    const shotPath = path.join(__dirname, 'assets', `audit_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });

    auditReport.push({
      viewport: vp.name,
      width: vp.width,
      overflowCheck,
      screenshot: shotPath
    });

    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'responsive_audit_results.json'), JSON.stringify(auditReport, null, 2));
  console.log('Responsive audit completed successfully!');
}

run();
