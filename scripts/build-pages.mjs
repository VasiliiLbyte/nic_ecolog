import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWave1Briefs, WAVE1_SLUGS } from './lib/parse-brief.mjs';
import { renderHubPage, renderServicePage, WAVE1_SITEMAP_URLS } from './lib/service-page-template.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');
const seoGeoRoot = process.env.SEO_GEO_ROOT ?? join(root, '..', 'seo_geo');

const HOME_SRC = 'NIC Ecolog - Главная v2.dc.html';
const LAB_SRC = 'Ecolog-Lab.html';
const METRIKA_ID = '112117233';

const METRIKA_SNIPPET = `<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');

    ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->`;

function injectMetrika(html) {
  if (html.includes(`metrika/tag.js?id=${METRIKA_ID}`)) return html;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${METRIKA_SNIPPET}\n</head>`);
  }
  return html.replace('</body>', `${METRIKA_SNIPPET}\n</body>`);
}

function copyDir(src, dest) {
  cpSync(join(root, src), join(out, src), { recursive: true });
}

function patchHome(html) {
  return html.replaceAll('href="/privacy"', 'href="privacy.html"');
}

function patchLab(html) {
  return html
    .replaceAll('НИЦ Эколог - Сайт (вау).html', 'index.html')
    .replaceAll('#services', '#uslugi')
    .replaceAll('#about', '#o-centre')
    .replaceAll('#portfolio', '#proekty');
}

const privacyHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Политика конфиденциальности — НИЦ «Эколог»</title>
  <meta name="description" content="Политика конфиденциальности НИЦ «Эколог».">
  <link rel="canonical" href="https://nic-ecolog.ru/privacy.html">
  <meta name="robots" content="noindex, follow">
  <link rel="icon" type="image/png" href="assets/favicon-512.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <style>
    body{margin:0;font-family:var(--font-body, 'Onest', sans-serif);background:#F7FBF9;color:#13282B;padding:48px 24px}
    .wrap{max-width:720px;margin:0 auto}
    h1{font-weight:300;font-size:clamp(28px,4vw,40px);margin:0 0 16px}
    p{line-height:1.7;color:#51696B;margin:0 0 16px}
    a{color:#139EA1}
  </style>
</head>
<body>
  <div class="wrap">
    <p style="font-family:'Stolzl','Onest',sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#139EA1;margin-bottom:24px">Демо-версия</p>
    <h1>Политика конфиденциальности</h1>
    <p>Это демонстрационная страница для превью сайта. Полный текст политики будет опубликован на production-домене.</p>
    <p><a href="index.html">← На главную</a></p>
  </div>
</body>
</html>
`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, 'index.html'), injectMetrika(patchHome(readFileSync(join(root, HOME_SRC), 'utf8'))));
writeFileSync(join(out, 'lab.html'), injectMetrika(patchLab(readFileSync(join(root, LAB_SRC), 'utf8'))));

for (const file of ['support.js', 'image-slot.js']) {
  cpSync(join(root, file), join(out, file));
}

copyDir('tokens', 'tokens');
copyDir('assets', 'assets');
if (existsSync(join(root, 'api'))) {
  copyDir('api', 'api');
  const builtConfig = join(out, 'api', 'config.php');
  if (existsSync(builtConfig)) unlinkSync(builtConfig);
}

writeFileSync(join(out, '.nojekyll'), '');
writeFileSync(join(out, 'privacy.html'), injectMetrika(privacyHtml));
cpSync(join(root, 'yandex_23287c8f5d0b434c.html'), join(out, 'yandex_23287c8f5d0b434c.html'));

// --- Wave-1 service pages (NIC-004 Phase A) ---
const wave1Briefs = loadWave1Briefs(seoGeoRoot);
mkdirSync(join(out, 'uslugi'), { recursive: true });

for (const brief of wave1Briefs) {
  const dir = join(out, 'uslugi', brief.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'index.html'),
    injectMetrika(renderServicePage(brief, { depth: 2 }))
  );
}

writeFileSync(
  join(out, 'uslugi', 'index.html'),
  injectMetrika(renderHubPage(wave1Briefs))
);

// --- SEO: custom domain, robots, sitemap ---
const SITE = 'https://nic-ecolog.ru';
const lastmod = new Date().toISOString().slice(0, 10);
const sitemapPages = [
  { loc: `${SITE}/`, priority: '1.0' },
  { loc: `${SITE}/lab.html`, priority: '0.8' },
  { loc: `${SITE}/privacy.html`, priority: '0.3' },
  ...WAVE1_SITEMAP_URLS.map(({ path, priority }) => ({
    loc: `${SITE}${path}`,
    priority,
  })),
];

writeFileSync(join(out, 'CNAME'), 'nic-ecolog.ru\n');

writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (p) =>
      `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(out, 'sitemap.xml'), sitemap);

console.log(`Built GitHub Pages artifact → docs/ (+ ${WAVE1_SLUGS.length + 1} uslugi pages from ${seoGeoRoot})`);
