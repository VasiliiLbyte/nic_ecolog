import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const PAGE_URL = 'http://localhost:8765/NIC%20Ecolog%20-%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F%20v2.dc.html';
const OUT = dirname(fileURLToPath(import.meta.url));

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500); // preloader + hero anim

await page.screenshot({ path: join(OUT, '01-hero-1440.png'), fullPage: false });

await page.evaluate(() => window.scrollTo(0, document.getElementById('laboratoriya')?.offsetTop ?? 1200));
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, '02-laboratory-1440.png'), fullPage: false });

await page.evaluate(() => window.scrollTo(0, document.getElementById('uslugi')?.offsetTop ?? 2400));
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, '03-services-1440.png'), fullPage: false });

const svc = page.locator('[data-svc-id="szz"]').first();
await svc.click();
await page.waitForTimeout(600);
await page.screenshot({ path: join(OUT, '04-service-modal-szz.png'), fullPage: false });

await page.setViewportSize({ width: 390, height: 844 });
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
await page.goto(PAGE_URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: join(OUT, '05-hero-mobile.png'), fullPage: false });

const title = await page.title();
const h1 = await page.locator('h1').first().textContent();
const preloader = await page.locator('#eco-preloader').isVisible().catch(() => false);

console.log(JSON.stringify({ title, h1: h1?.trim().slice(0, 120), preloaderVisible: preloader }, null, 2));

await browser.close();
