#!/usr/bin/env node
/**
 * Local QA for NIC-004 wave-1 pages (preview server on :8766).
 * Usage: npm run pages:preview &  node scripts/qa-wave1.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:8766';
const METRIKA_ID = '112117233';

const PATHS = [
  '/uslugi/',
  '/uslugi/ndv/',
  '/uslugi/proekt-szz/',
  '/uslugi/ovos/',
  '/uslugi/pek/',
  '/uslugi/iei/',
  '/uslugi/autsorsing-ekologa/',
  '/uslugi/plata-nvos/',
];

const FORBIDDEN = [
  /TODO\(evidence/i,
  /аккредит/i,
  /штраф/i,
  /25-крат/i,
  /возвращаем переплат/i,
  /приказ 581/i,
];

const sitemap = readFileSync(join(root, 'docs', 'sitemap.xml'), 'utf8');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  const titles = new Set();
  let failed = 0;

  for (const path of PATHS) {
    const url = `${BASE}${path}`;
    const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
    const status = res?.status() ?? 0;
    const html = await page.content();
    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    const hasMetrika = html.includes(`metrika/tag.js?id=${METRIKA_ID}`);
    const hasSchema = html.includes('application/ld+json');
    const inSitemap = sitemap.includes(`https://nic-ecolog.ru${path}`);

    const forbiddenHits = FORBIDDEN.filter((re) => re.test(html)).map(String);
    const titleDup = titles.has(title);
    titles.add(title);

    const ok =
      status === 200 &&
      title &&
      h1 &&
      canonical?.includes(path) &&
      robots?.includes('index') &&
      hasMetrika &&
      hasSchema &&
      inSitemap &&
      !titleDup &&
      forbiddenHits.length === 0;

    console.log(`${ok ? 'OK' : 'FAIL'} ${path} status=${status} title="${title?.slice(0, 50)}"`);
    if (!ok) {
      failed++;
      if (status !== 200) console.log('  - bad status');
      if (titleDup) console.log('  - duplicate title');
      if (forbiddenHits.length) console.log('  - forbidden:', forbiddenHits.join(', '));
      if (!hasMetrika) console.log('  - missing metrika');
      if (!inSitemap) console.log('  - missing from sitemap');
    }
  }

  await browser.close();
  if (failed) {
    console.error(`\n${failed} page(s) failed QA`);
    process.exit(1);
  }
  console.log(`\nAll ${PATHS.length} wave-1 URLs passed local QA`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
