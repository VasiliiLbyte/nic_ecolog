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
