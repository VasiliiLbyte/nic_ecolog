import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'screenshots/mobile-audit');
const port = 8766;
const baseUrl = `http://127.0.0.1:${port}`;

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
];

const PAGES = [
  { path: '/', slug: 'home', shots: ['hero', 'services', 'form'] },
  { path: '/lab.html', slug: 'lab', shots: ['hero', 'services', 'form'] },
];

/** Sections where clipped content must be caught even with overflow-x: clip */
const CLIP_CHECK_SECTIONS = {
  home: ['#top', '#laboratoriya', '#uslugi', '#zayavka', '#kontakty'],
  lab: ['#lab', '#process', '#domains', '#lab-contact', '.ft'],
};

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        /* retry */
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server not ready at ${url}`));
        return;
      }
      setTimeout(tick, 250);
    };
    tick();
  });
}

function startPreview() {
  return spawn('npx', ['--yes', 'serve', 'docs', '-p', String(port), '-l', String(port)], {
    cwd: root,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

async function captureSection(page, selector, filePath) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) {
    await page.screenshot({ path: filePath, fullPage: false });
    return;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await el.screenshot({ path: filePath });
}

async function assertNoOverflow(page, label) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  if (scrollWidth > innerWidth + 1) {
    throw new Error(`${label}: horizontal overflow ${scrollWidth}px > ${innerWidth}px`);
  }
}

/**
 * Detects content clipped by overflow:hidden/clip when scrollWidth stays equal
 * to viewport (common on #lab / #laboratoriya).
 */
async function assertNoVisualClip(page, label, sectionSelectors) {
  const offenders = await page.evaluate((sels) => {
    const vw = window.innerWidth;
    const hits = [];
    const roots = sels
      .map((s) => document.querySelector(s))
      .filter(Boolean);

    const skip = (el) => {
      if (!el || el.nodeType !== 1) return true;
      if (el.getAttribute('aria-hidden') === 'true') return true;
      if (el.hasAttribute('data-chroma')) return true;
      const tag = el.tagName;
      if (tag === 'SVG' || tag === 'PATH' || tag === 'LINE' || tag === 'CIRCLE' || tag === 'DEFS' || tag === 'G' || tag === 'STOP') {
        return true;
      }
      const st = getComputedStyle(el);
      if (st.position === 'fixed') return true;
      if (st.visibility === 'hidden' || st.display === 'none' || Number(st.opacity) === 0) return true;
      return false;
    };

    for (const root of roots) {
      const nodes = root.querySelectorAll('h1,h2,h3,p,a,span,li,label,button,input,textarea');
      for (const el of nodes) {
        if (skip(el)) continue;
        if (el.closest('[aria-hidden="true"]')) continue;
        // Prefer leaf-ish text nodes; skip empty wrappers
        if (!(el.textContent || '').trim() && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        // Tolerate subpixel / scrollbar rounding
        if (r.right > vw + 2) {
          const text = (el.textContent || el.getAttribute('placeholder') || '').trim().slice(0, 48).replace(/\s+/g, ' ');
          hits.push({
            tag: el.tagName.toLowerCase(),
            right: Math.round(r.right * 10) / 10,
            vw,
            text,
          });
          if (hits.length >= 8) return hits;
        }
      }
    }
    return hits;
  }, sectionSelectors);

  if (offenders.length) {
    const sample = offenders
      .slice(0, 3)
      .map((o) => `<${o.tag}> right=${o.right}>${o.vw} "${o.text}"`)
      .join('; ');
    throw new Error(`${label}: visual clip ${sample}`);
  }
}

async function run() {
  mkdirSync(outDir, { recursive: true });

  const server = startPreview();
  try {
    await waitForServer(`${baseUrl}/`);
    const browser = await chromium.launch();
    const failures = [];

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      for (const pg of PAGES) {
        const url = `${baseUrl}${pg.path}`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(pg.slug === 'home' ? 2000 : 800);

        const label = `${pg.slug}@${vp.name}`;
        try {
          await assertNoOverflow(page, label);
          await assertNoVisualClip(page, label, CLIP_CHECK_SECTIONS[pg.slug] || []);
        } catch (err) {
          failures.push(err.message);
          await page.screenshot({
            path: join(outDir, `FAIL-${pg.slug}-${vp.name}-overflow.png`),
            fullPage: true,
          });
        }

        const heroSel = pg.slug === 'home' ? '#top' : '#lab';
        const servicesSel = pg.slug === 'home' ? '#uslugi' : '#domains';
        const formSel = pg.slug === 'home' ? '#zayavka' : '#lab-contact';

        await captureSection(page, heroSel, join(outDir, `${pg.slug}-${vp.name}-hero.png`));
        await captureSection(page, servicesSel, join(outDir, `${pg.slug}-${vp.name}-services.png`));
        await captureSection(page, formSel, join(outDir, `${pg.slug}-${vp.name}-form.png`));
      }

      await context.close();
    }

    await browser.close();

    if (failures.length) {
      console.error('Mobile audit failed:\n' + failures.map((f) => `  - ${f}`).join('\n'));
      process.exit(1);
    }

    console.log(`Mobile audit passed (${VIEWPORTS.length} viewports × ${PAGES.length} pages). Screenshots → screenshots/mobile-audit/`);
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
