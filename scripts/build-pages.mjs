import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWave1Briefs, WAVE1_SLUGS } from './lib/parse-brief.mjs';
import {
  chromeBar,
  footerBlock,
  headBlock,
  menuScript,
  renderHubPage,
  renderServicePage,
  setSiteOptions,
  WAVE1_SITEMAP_URLS,
} from './lib/service-page-template.mjs';
import { articlesByService, loadArticles, renderArticlePage, renderBlogHub } from './lib/blog-template.mjs';
import { renderLabPage } from './lib/lab-template.mjs';
import { renderMarkdown } from './lib/markdown.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');
const seoGeoRoot = process.env.SEO_GEO_ROOT ?? join(root, '..', 'seo_geo');

const HOME_SRC = 'NIC Ecolog - Главная v2.dc.html';
const BLOG_SRC = join(root, 'content', 'blog');

// Blog (NIC-010): only status=published articles go into a production build.
// BLOG_DRAFTS=1 also builds drafts — for local preview and devpreview only.
const articles = loadArticles(BLOG_SRC, { includeDrafts: process.env.BLOG_DRAFTS === '1' });
const hasBlog = articles.length > 0;
setSiteOptions({ hasBlog });
const LAB_SRC = 'scripts/lib/lab-template.mjs';
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

// Уведомление о cookie Метрики (2026-11-03, по политике конфиденциальности): плашка внизу слева, на телефоне — во всю ширину.
// Скрыта до проверки localStorage, чтобы не мелькала у тех, кто уже нажал «Понятно»; без JS не показывается.
const COOKIE_NOTE = `<div class="ck-note" id="ck-note" role="region" aria-label="Уведомление о cookie" hidden>
  <p>Сайт использует cookie Яндекс Метрики для статистики посещаемости. Продолжая пользоваться сайтом, вы соглашаетесь с этим. Подробнее — в <a href="/privacy.html">политике конфиденциальности</a>.</p>
  <button type="button" data-ck-ok>Понятно</button>
</div>
<style>
.ck-note{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:150;display:flex;align-items:center;gap:20px;max-width:560px;padding:16px 20px;border-radius:8px;background:#FFFFFF;box-shadow:0 0 0 1px #E0E0E0,0 12px 32px -12px rgba(11,92,96,.35);font-family:'Onest',-apple-system,'Segoe UI',sans-serif;font-size:12px;line-height:16px;color:#444444}
.ck-note[hidden]{display:none}
.ck-note p{margin:0}
.ck-note a{color:#0B5C60;text-underline-offset:2px}
.ck-note button{flex:0 0 auto;min-width:120px;height:40px;padding:0 24px;border:0;border-radius:0;background:linear-gradient(90deg,#139EA1 0%,#1C6BA2 100%);color:#FFFFFF;font:inherit;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}
.ck-note button:hover{transform:scale(1.01);box-shadow:inset 0 0 0 1px #1C6BA2}
.ck-note button:focus-visible{outline:2px solid #139EA1;outline-offset:2px}
@media(max-width:720px){.ck-note{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));max-width:none;flex-direction:column;align-items:stretch;gap:12px;padding:16px}.ck-note button{height:44px}}
</style>
<script>(function(){var k='nic-cookie-ok',n=document.getElementById('ck-note');if(!n)return;try{if(localStorage.getItem(k))return;}catch(e){}n.hidden=false;n.querySelector('[data-ck-ok]').addEventListener('click',function(){n.hidden=true;try{localStorage.setItem(k,'1');}catch(e){}});})();</script>`;

function injectCookieNote(html) {
  if (html.includes('id="ck-note"')) return html;
  const at = html.lastIndexOf('</body>');
  return at < 0 ? html : `${html.slice(0, at)}${COOKIE_NOTE}\n${html.slice(at)}`;
}

// Метрика и уведомление о её cookie — на каждой странице сборки.
function injectMetrika(page) {
  const html = injectCookieNote(page);
  if (html.includes(`metrika/tag.js?id=${METRIKA_ID}`)) return html;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${METRIKA_SNIPPET}\n</head>`);
  }
  return html.replace('</body>', `${METRIKA_SNIPPET}\n</body>`);
}

function copyDir(src, dest) {
  cpSync(join(root, src), join(out, src), { recursive: true });
}

// Adds a «Блог» link right after the given anchor link (header nav, footer «Центр», mobile menu), only when the blog is built.
function addBlogLink(html, anchor, link) {
  if (!hasBlog) return html;
  if (!html.includes(anchor)) throw new Error(`blog link anchor not found: ${anchor.slice(0, 60)}`);
  return html.replace(anchor, `${anchor}\n${link}`);
}

function patchHome(html) {
  // «Блог» — последним пунктом меню шапки (как в макете Figma) и в колонке «Центр» подвала.
  // Якоря различаются отступом: в шапке 6 пробелов, в подвале 12.
  const withHeader = addBlogLink(
    html.replaceAll('href="/privacy"', 'href="privacy.html"'),
    '\n      <a href="#kontakty">Контакты</a>',
    '      <a href="blog/">Блог</a>'
  );
  const withFooter = addBlogLink(withHeader, '\n            <a href="#esg">ESG</a>', '            <a href="blog/">Блог</a>');
  // …и последним пунктом мобильного меню (там ссылки с крупным начертанием, стиль — как у соседних).
  const menuItemStyle = 'font-size:30px;font-weight:300;color:#13282B;text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(11,92,96,0.1)';
  return addBlogLink(
    withFooter,
    `\n        <a href="#kontakty" onClick="{{ closeMenu }}" style="${menuItemStyle}">Контакты</a>`,
    `        <a href="blog/" style="${menuItemStyle}">Блог</a>`
  );
}

// Страница лаборатории — шаблон lab-template.mjs в дизайн-системе главной: стили компонентов (блок
// «Вёрстка по макету Figma» и правила появления) и карточки «Вода / Воздух / Почвы / Отходы» берутся из главной.
function renderLab(homeHtml) {
  const cssStart = homeHtml.indexOf('/* ==== Вёрстка по макету Figma');
  const cssEnd = homeHtml.indexOf('</style>', cssStart);
  if (cssStart < 0 || cssEnd < 0) throw new Error('home Figma styles not found');
  const reveal = homeHtml.match(/^\[data-anim="on"\] \[data-rv\].*$/gm) || [];
  if (reveal.length < 2) throw new Error('home reveal rules not found');
  const labStart = homeHtml.indexOf('<section id="laboratoriya"');
  const labEnd = homeHtml.indexOf('</section>', labStart);
  const labCards = homeHtml.slice(labStart, labEnd).match(/^\s*<div class="f-lab__card".*$/gm)?.map((l) => l.trim()) || [];
  if (labCards.length !== 4) throw new Error(`home lab cards: expected 4, got ${labCards.length}`);
  return renderLabPage({ homeCss: `${reveal.join('\n')}\n${homeHtml.slice(cssStart, cssEnd)}`, labCards });
}

// Политика — в оболочке страниц услуг (шапка, меню, подвал), noindex и вне sitemap, как раньше.
// Текст — content/privacy.md. Пока в нём есть незаполненные поля [[…]], на сайт идёт прежняя заглушка;
// PRIVACY_DRAFT=1 собирает черновик — только для локального превью, не для прода.
const PRIVACY_SRC = join(root, 'content', 'privacy.md');
const privacyMd = existsSync(PRIVACY_SRC) ? readFileSync(PRIVACY_SRC, 'utf8') : '';
const privacyGaps = privacyMd.match(/\[\[[^\]]*\]\]/g) ?? [];
const privacyDraft = process.env.PRIVACY_DRAFT === '1';
if (privacyGaps.length) {
  console.warn(`privacy.html: в content/privacy.md незаполненных полей [[…]]: ${privacyGaps.length} — ${privacyDraft ? 'собран черновик (PRIVACY_DRAFT=1)' : 'на сайте остаётся заглушка'}`);
}
const privacyMain = privacyMd && (!privacyGaps.length || privacyDraft)
  ? `<p class="eye">НИЦ «Эколог»</p>
  <h1>Политика конфиденциальности</h1>
  <article class="post">${renderMarkdown(privacyMd)}</article>`
  : `<p class="eye">Демо-версия</p>
  <h1>Политика конфиденциальности</h1>
  <div class="lead"><p>Это демонстрационная страница для превью сайта. Полный текст политики будет опубликован на production-домене.</p></div>`;
const privacyHtml = `${headBlock({
  title: 'Политика конфиденциальности — НИЦ «Эколог»',
  description: 'Политика конфиденциальности НИЦ «Эколог».',
  canonical: 'https://nic-ecolog.ru/privacy.html',
  depth: 0,
  robots: 'noindex, follow',
})}
<body>
${chromeBar({ depth: 0, homeHref: 'index.html', crumbsHtml: '<a href="index.html">Главная</a> | <b>Политика конфиденциальности</b>' })}
<main class="wrap">
  ${privacyMain}
</main>
${footerBlock({ depth: 0, homeHref: 'index.html' })}
${menuScript()}
</body>
</html>
`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, 'index.html'), injectMetrika(patchHome(readFileSync(join(root, HOME_SRC), 'utf8'))));
writeFileSync(join(out, 'lab.html'), injectMetrika(renderLab(readFileSync(join(root, HOME_SRC), 'utf8'))));

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
const blogByService = articlesByService(articles);
mkdirSync(join(out, 'uslugi'), { recursive: true });

for (const brief of wave1Briefs) {
  const dir = join(out, 'uslugi', brief.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'index.html'),
    injectMetrika(renderServicePage(brief, { depth: 2, articles: blogByService[brief.slug] ?? [] }))
  );
}

writeFileSync(
  join(out, 'uslugi', 'index.html'),
  injectMetrika(renderHubPage(wave1Briefs))
);

// --- Blog (NIC-010) ---
if (hasBlog) {
  mkdirSync(join(out, 'blog'), { recursive: true });
  writeFileSync(join(out, 'blog', 'index.html'), injectMetrika(renderBlogHub(articles)));
  for (const a of articles) {
    mkdirSync(join(out, 'blog', a.slug), { recursive: true });
    writeFileSync(join(out, 'blog', a.slug, 'index.html'), injectMetrika(renderArticlePage(a)));
  }
}

// --- SEO: custom domain, robots, sitemap ---
const SITE = 'https://nic-ecolog.ru';
const today = new Date().toISOString().slice(0, 10);

// lastmod = date the page's sources last changed (git), not the build date.
// Uncommitted or untracked sources count as changed today.
function lastmodFor(files) {
  const dates = files.map((file) => {
    try {
      const git = (...args) => execFileSync('git', ['-C', dirname(file), ...args, '--', file], { encoding: 'utf8' }).trim();
      if (git('status', '--porcelain')) return today;
      return git('log', '-1', '--format=%cs') || today;
    } catch {
      return today;
    }
  });
  return dates.sort().at(-1);
}

const TEMPLATE_SRC = join(root, 'scripts', 'lib', 'service-page-template.mjs');
const BLOG_TEMPLATE_SRC = join(root, 'scripts', 'lib', 'blog-template.mjs');
const briefSrc = (slug) => join(seoGeoRoot, 'docs', 'briefs', 'nic', `uslugi-${slug}.md`);
const uslugiSources = (path) => {
  const slug = path.split('/').filter(Boolean)[1];
  return slug ? [TEMPLATE_SRC, briefSrc(slug)] : [TEMPLATE_SRC, ...WAVE1_SLUGS.map(briefSrc)];
};

// privacy.html is noindex, so it stays out of the sitemap.
const sitemapPages = [
  { loc: `${SITE}/`, priority: '1.0', lastmod: lastmodFor([join(root, HOME_SRC)]) },
  { loc: `${SITE}/lab.html`, priority: '0.8', lastmod: lastmodFor([join(root, LAB_SRC)]) },
  ...WAVE1_SITEMAP_URLS.map(({ path, priority }) => ({
    loc: `${SITE}${path}`,
    priority,
    lastmod: lastmodFor(uslugiSources(path)),
  })),
  // Drafts never reach the sitemap, even in a BLOG_DRAFTS build.
  ...(articles.some((a) => a.status === 'published')
    ? [
        {
          loc: `${SITE}/blog/`,
          priority: '0.7',
          lastmod: lastmodFor([BLOG_TEMPLATE_SRC, ...articles.filter((a) => a.status === 'published').map((a) => a.file)]),
        },
      ]
    : []),
  ...articles
    .filter((a) => a.status === 'published')
    .map((a) => ({ loc: `${SITE}/blog/${a.slug}/`, priority: '0.6', lastmod: lastmodFor([BLOG_TEMPLATE_SRC, a.file]) })),
];

writeFileSync(join(out, 'CNAME'), 'nic-ecolog.ru\n');

// NIC-011: one address for every page — https://nic-ecolog.ru without www and without index.html.
// Apache on reg.ru reads .htaccess (nginx in front). http→https is already done by the hosting.
// make-devpreview.mjs writes its own .htaccess for devpreview, so these rules never reach it.
writeFileSync(
  join(out, '.htaccess'),
  `RewriteEngine On

# www.nic-ecolog.ru → nic-ecolog.ru (same path and query)
RewriteCond %{HTTP_HOST} ^www\\.nic-ecolog\\.ru$ [NC]
RewriteRule ^(.*)$ https://nic-ecolog.ru/$1 [R=301,L]

# /index.html and /dir/index.html → / and /dir/ (only when typed in the request, not for DirectoryIndex)
RewriteCond %{THE_REQUEST} \\s/+((?:[^\\s?]*/)?)index\\.html[\\s?] [NC]
RewriteRule ^ https://nic-ecolog.ru/%1 [R=301,L]
`
);

writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    (p) =>
      `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(out, 'sitemap.xml'), sitemap);

console.log(
  `Built GitHub Pages artifact → docs/ (+ ${WAVE1_SLUGS.length + 1} uslugi pages from ${seoGeoRoot}; blog: ${articles.length} article(s)${process.env.BLOG_DRAFTS === '1' ? ', drafts included' : ''})`
);
