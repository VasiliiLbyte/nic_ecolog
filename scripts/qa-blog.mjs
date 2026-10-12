#!/usr/bin/env node
/**
 * QA for the blog (NIC-010) on the local preview server (:8766).
 * Usage: npm run pages:build (or BLOG_DRAFTS=1 npm run pages:build) && npm run pages:preview & npm run pages:qa-blog
 *
 * Checks every built blog page: 200, unique title/H1, self-canonical, index/follow, Metrika,
 * parseable JSON-LD of the right type, no editorial leftovers, internal links resolve inside docs/.
 * Published articles must be in the sitemap; drafts must not.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadArticles } from './lib/blog-template.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const BASE = process.env.QA_BASE_URL ?? 'http://localhost:8766';
const METRIKA_ID = '112117233';
const LEFTOVERS = [/ФАКТ-ЧЕК/, /Вопросы эксперту/, /TODO/, /\*\*/, /\]\(/];

const all = loadArticles(join(root, 'content', 'blog'), { includeDrafts: true });
const built = all.filter((a) => existsSync(join(docs, 'blog', a.slug, 'index.html')));
const sitemap = readFileSync(join(docs, 'sitemap.xml'), 'utf8');

// Resolve an href found on /blog/... to a file in docs/.
function resolvesInDocs(pagePath, href) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return true;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return true;
  const abs = clean.startsWith('/') ? clean : new URL(clean, `http://x${pagePath}`).pathname;
  const file = join(docs, decodeURIComponent(abs));
  return existsSync(abs.endsWith('/') ? join(file, 'index.html') : file);
}

async function main() {
  let failed = 0;
  const fail = (msg) => {
    failed++;
    console.log(`  - ${msg}`);
  };

  // Drafts must never be in the sitemap; published ones must be.
  for (const a of all) {
    const inSitemap = sitemap.includes(`https://nic-ecolog.ru/blog/${a.slug}/`);
    if (a.status === 'draft' && inSitemap) { console.log(`FAIL sitemap ${a.slug}`); fail('draft is in sitemap'); }
    if (a.status === 'published' && !inSitemap) { console.log(`FAIL sitemap ${a.slug}`); fail('published article missing from sitemap'); }
  }
  if (!all.some((a) => a.status === 'published') && sitemap.includes('/blog/')) {
    console.log('FAIL sitemap'); fail('/blog/ in sitemap without published articles');
  }
  if (process.env.BLOG_DRAFTS !== '1' && built.some((a) => a.status === 'draft')) {
    console.log('FAIL drafts'); fail('drafts built without BLOG_DRAFTS=1');
  }

  if (!built.length) {
    console.log(failed ? `\n${failed} blog check(s) failed` : '\nNo blog pages built (no published articles) — nothing else to check');
    process.exit(failed ? 1 : 0);
  }

  const pages = [{ path: '/blog/', type: 'Blog' }, ...built.map((a) => ({ path: `/blog/${a.slug}/`, type: 'Article' }))];
  const browser = await chromium.launch();
  const page = await (await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })).newPage();
  const titles = new Set();
  const h1s = new Set();

  for (const { path, type } of pages) {
    const before = failed;
    const res = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const title = await page.title();
    const h1 = (await page.locator('h1').first().textContent())?.trim();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    const mainText = await page.locator('main').innerText();

    if (res?.status() !== 200) fail(`${path}: status ${res?.status()}`);
    if (!title || titles.has(title)) fail(`${path}: empty or duplicate title`);
    if (!h1 || h1s.has(h1)) fail(`${path}: empty or duplicate H1`);
    titles.add(title);
    h1s.add(h1);
    if (canonical !== `https://nic-ecolog.ru${path}`) fail(`${path}: canonical ${canonical}`);
    if (robots !== 'index, follow') fail(`${path}: robots ${robots}`);
    if (!html.includes(`metrika/tag.js?id=${METRIKA_ID}`)) fail(`${path}: Metrika missing`);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    let types = [];
    try {
      types = ld.flatMap((t) => (JSON.parse(t)['@graph'] ?? [JSON.parse(t)]).map((n) => n['@type']));
    } catch {
      fail(`${path}: JSON-LD does not parse`);
    }
    if (!types.includes(type) || !types.includes('BreadcrumbList')) fail(`${path}: JSON-LD types ${types.join(',')}`);

    for (const re of LEFTOVERS) if (re.test(mainText)) fail(`${path}: leftover ${re}`);

    const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    const dead = [...new Set(hrefs)].filter((h) => !resolvesInDocs(path, h));
    if (dead.length) fail(`${path}: dead links ${dead.join(', ')}`);

    console.log(`${failed === before ? 'OK' : 'FAIL'} ${path} "${title}"`);
  }

  // Service pages named in articles must link back to them.
  for (const a of built) {
    for (const s of a.services) {
      const f = join(docs, 'uslugi', s, 'index.html');
      const ok = existsSync(f) && readFileSync(f, 'utf8').includes(`/blog/${a.slug}/`);
      if (!ok) { console.log(`FAIL /uslugi/${s}/`); fail(`/uslugi/${s}/ has no link to ${a.slug}`); }
    }
  }

  await browser.close();
  if (failed) {
    console.error(`\n${failed} blog check(s) failed`);
    process.exit(1);
  }
  console.log(`\nAll ${pages.length} blog pages passed local QA`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
