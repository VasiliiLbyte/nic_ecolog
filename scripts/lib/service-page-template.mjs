const SITE = 'https://nic-ecolog.ru';

// Site-wide switches set by build-pages.mjs. hasBlog adds «Блог» to nav and footer,
// only when at least one article is built, so a build without articles stays unchanged.
const siteOptions = { hasBlog: false };
export function setSiteOptions(opts) {
  Object.assign(siteOptions, opts);
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// depth: 0 — корень сайта (lab.html), 1 — /uslugi/, /blog/, 2 — /uslugi/<slug>/, /blog/<slug>/.
function assetPrefix(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

function homeFor(depth) {
  return depth === 0 ? './' : assetPrefix(depth);
}

export function headBlock({ title, description, canonical, depth, schema, ogType = 'website', ogImage: ogImageOverride }) {
  const prefix = assetPrefix(depth);
  const schemaScript = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : '';
  const ogImage = ogImageOverride ?? `${SITE}/assets/hero-mesh-poster.jpg`;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="НИЦ «Эколог»">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" type="image/png" href="${prefix}assets/favicon-512.png">
<link rel="apple-touch-icon" href="${prefix}assets/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="${prefix}assets/fonts/onest-cyrillic-wght-normal.woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/site/chrome.css">
<link rel="stylesheet" href="${prefix}assets/site/site.css">
${schemaScript}
</head>`;
}

function navLinks({ depth, uslugiHref }) {
  const prefix = assetPrefix(depth);
  const home = homeFor(depth);
  return [
    { href: uslugiHref ?? `${prefix}uslugi/`, label: 'Услуги', key: 'uslugi' },
    { href: `${prefix}lab.html`, label: 'Лаборатория', key: 'lab' },
    { href: `${home}#proekty`, label: 'Проекты' },
    { href: `${home}#o-centre`, label: 'О центре' },
    { href: `${home}#esg`, label: 'ESG' },
    { href: `${home}#litsenzii`, label: 'Лицензии' },
    { href: `${home}#kontakty`, label: 'Контакты' },
    ...(siteOptions.hasBlog ? [{ href: `${prefix}blog/`, label: 'Блог', key: 'blog' }] : []),
  ];
}

/** Шапка по макету Figma: логотип, меню, телефон, кнопка; на узких экранах — бургер и полноэкранное меню. */
export function chromeBar({ depth, uslugiHref, current, ctaHref }) {
  const prefix = assetPrefix(depth);
  const home = homeFor(depth);
  const cta = ctaHref ?? `${home}#zayavka`;
  const links = navLinks({ depth, uslugiHref })
    .map((l) => `<a href="${l.href}"${l.key && l.key === current ? ' aria-current="page"' : ''}>${l.label}</a>`)
    .join('\n      ');
  return `<a class="skip" href="#main">Перейти к содержанию</a>
<header class="nh" data-hdr>
  <div class="nh__in">
    <a class="nh__logo" href="${home}" aria-label="НИЦ «Эколог» — на главную"><img src="${prefix}assets/logo_ecolog.svg" alt="НИЦ «Эколог»" width="104" height="35"></a>
    <nav class="nh__nav" aria-label="Основная навигация">
      ${links}
    </nav>
    <div class="nh__actions">
      <a class="nh__phone" href="tel:+78124499348">+7 (812) 449 93 48</a>
      <a class="nbtn" href="${cta}">Заказать исследование</a>
      <button class="nh__burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="nm" data-menu-open>
        <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 1h20M1 8h20M1 15h20"/></g></svg>
      </button>
    </div>
  </div>
</header>
<div class="nm" id="nm" role="dialog" aria-modal="true" aria-label="Меню" tabindex="-1">
  <div class="nm__top">
    <img src="${prefix}assets/logo_ecolog.svg" alt="" width="104" height="35">
    <button class="nm__close" type="button" aria-label="Закрыть меню" data-menu-close>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l14 14M16 2L2 16"/></g></svg>
    </button>
  </div>
  <nav class="nm__nav" aria-label="Мобильная навигация">
    ${links}
  </nav>
  <div class="nm__foot">
    <a class="nh__phone" href="tel:+78124499348">+7 (812) 449 93 48</a>
    <a class="nbtn" href="${cta}">Заказать исследование</a>
  </div>
</div>`;
}

/** Скрипт каркаса: шапка, меню, появление блоков (тот же, что на главной). */
export function menuScript(depth = 2) {
  return `<script src="${assetPrefix(depth)}assets/site/site.js" defer></script>`;
}

/** Подвал по макету Figma. */
export function footerBlock({ depth, uslugiHref }) {
  const prefix = assetPrefix(depth);
  const home = homeFor(depth);
  const uslugi = uslugiHref ?? `${prefix}uslugi/`;
  return `<footer class="nf" id="kontakty">
  <div class="nf__bg" aria-hidden="true"></div>
  <div class="container nf__in">
    <div class="nf__top">
      <div class="nf__brand">
        <a href="${home}" aria-label="НИЦ «Эколог» — на главную"><img src="${prefix}assets/logo_ecolog.svg" alt="НИЦ «Эколог»" width="104" height="35"></a>
        <div><p>Наука + экология + прикладные решения</p><p>Надёжность и экспертиза без бюрократии</p></div>
      </div>
      <nav class="nf__nav" aria-label="Навигация в подвале">
        <div class="nf__col"><h3>Услуги</h3><ul>
          <li><a href="${uslugi}">Проектирование и документация</a></li>
          <li><a href="${home}#uslugi-soprovozhdenie">Сопровождение предприятий</a></li>
          <li><a href="${home}#uslugi-izyskaniya">Изыскания и исследования</a></li>
          <li><a href="${home}#esg">ESG и устойчивое развитие</a></li>
        </ul></div>
        <div class="nf__col"><h3>Центр</h3><ul>
          <li><a href="${home}#o-centre">О центре</a></li>
          <li><a href="${prefix}lab.html">Лаборатория «Аналитик Лаб»</a></li>
          <li><a href="${home}#proekty">Проекты</a></li>
          <li><a href="${home}#esg">ESG</a></li>
          <li><a href="${home}#litsenzii">Лицензии</a></li>${siteOptions.hasBlog ? `
          <li><a href="${prefix}blog/">Блог</a></li>` : ''}
        </ul></div>
        <div class="nf__col"><h3>Контакты</h3><ul>
          <li><a href="tel:+78124499348">+7 812 449 93 48</a></li>
          <li><a href="mailto:info@nic-ecolog.ru">info@nic-ecolog.ru</a></li>
          <li>Санкт-Петербург</li>
        </ul></div>
      </nav>
    </div>
    <div class="nf__bottom">
      <span>© 2026 НИЦ «Эколог»</span>
      <nav aria-label="Правовая информация"><a href="${prefix}privacy.html">Политика конфиденциальности</a><a href="${home}">nic-ecolog.ru</a></nav>
    </div>
  </div>
</footer>`;
}

/** Хлебные крошки «Главная | Услуги | СЗЗ»: items — [label, href?], последний без ссылки. */
export function crumbsNav(items) {
  const parts = items.map(([label, href], i) =>
    href && i < items.length - 1 ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`
  );
  return `<nav class="svcp__crumbs" aria-label="Хлебные крошки">${parts.join('<span aria-hidden="true">|</span>')}</nav>`;
}

/** Плашка «Обсудим вашу задачу» внизу страниц (макет «Услуга — СЗЗ»). */
export function ctaBlock(depth = 2) {
  return `<div class="cta">
    <div><h2>Обсудим вашу задачу</h2><p>Вернёмся с планом работ и оценкой в течение рабочего дня.</p></div>
    <a class="nbtn nbtn--white" href="${homeFor(depth)}#zayavka">Отправить заявку</a>
  </div>`;
}

function chip(item) {
  if (item.href) {
    const target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="chip" href="${esc(item.href)}"${target}>${esc(item.label)}&nbsp;→</a>`;
  }
  return `<span class="chip chip--static">${esc(item.label)}</span>`;
}

// Ссылки из брифа абсолютные (/uslugi/ndv/) — переводим в относительные, чтобы работало и на превью.
function relHref(href, depth) {
  if (!href || /^https?:/.test(href)) return href;
  return href.startsWith('/') ? `${assetPrefix(depth)}${href.slice(1)}` : href;
}

/**
 * Страница услуги по макету «Услуга — СЗЗ». Контент — только из брифа seo_geo
 * (сроки, «кому» и «результат» из инвентаря не публикуются без реестра доказательств).
 */
export function renderServicePage(brief, { depth = 2, articles = [] } = {}) {
  const prefix = assetPrefix(depth);
  const introHtml = brief.intro.map((p) => `<p>${esc(p)}</p>`).join('\n        ');
  const steps = brief.includes
    .map((text, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(text)}</p></li>`)
    .join('\n          ');
  const related = (brief.related ?? [])
    .map((r) => chip({ ...r, href: relHref(r.href, depth) }))
    .join('\n            ');
  const articleChips = articles
    .map((a) => chip({ label: a.h1, href: `${prefix}blog/${a.slug}/` }))
    .join('\n            ');
  const short = brief.h1.split(' — ')[0];

  return `${headBlock({
    title: brief.title,
    description: brief.description,
    canonical: brief.canonical,
    depth,
    schema: brief.schema,
  })}
<body>
${chromeBar({ depth, current: 'uslugi' })}
<main class="svcp" id="main">
  <div class="container svcp__in">
    ${crumbsNav([['Главная', homeFor(depth)], ['Услуги', `${prefix}uslugi/`], [short]])}
    <div class="svcp__head">
      <p class="eyebrow">${esc(brief.group ?? '')}</p>
      <h1 class="h2">${esc(brief.h1)}</h1>
      <div class="lead svcp__lead">
        ${introHtml}
      </div>
    </div>
    <h2 class="svcp__h">Что входит в работу</h2>
    <div class="svcp__grid">
      <ol class="inc">
          ${steps}
      </ol>
      <div class="svcp__aside">${related ? `
        <div class="box box--why">
          <h3>Смежные услуги</h3>
          <div class="chips chips--box">
            ${related}
          </div>
        </div>` : ''}${articleChips ? `
        <div class="box box--why">
          <h3>Статьи по теме</h3>
          <div class="chips chips--box">
            ${articleChips}
          </div>
        </div>` : ''}
      </div>
    </div>
    ${ctaBlock(depth)}
  </div>
</main>
${footerBlock({ depth })}
${menuScript(depth)}
</body>
</html>`;
}

const HUB_GROUPS = [
  {
    title: 'Проектирование и документация',
    slugs: ['ndv', 'proekt-szz', 'ovos', 'pek'],
    soon: ['nds', 'pnoolr', 'ker', 'pmoos', 'dvos'],
  },
  {
    title: 'Экологическое сопровождение предприятий',
    slugs: ['autsorsing-ekologa', 'plata-nvos'],
    soon: ['2-tp', 'uchet-nvos'],
  },
  {
    title: 'Инженерные изыскания и лабораторные исследования',
    slugs: ['iei'],
    soon: ['izmereniya-pek-szz'],
  },
  {
    title: 'ESG и устойчивое развитие',
    slugs: [],
    soon: ['uglerodnyy-sled', 'esg-otchetnost', 'klimaticheskie-riski'],
  },
];

const SOON_LABELS = {
  nds: 'НДС — нормативы допустимых сбросов',
  pnoolr: 'ПНООЛР — нормативы образования отходов',
  ker: 'КЭР — комплексное экологическое разрешение',
  pmoos: 'ПМООС — мероприятия по охране окружающей среды',
  dvos: 'ДВОС — декларация о воздействии на ОС',
  '2-tp': 'Статистическая отчётность 2-ТП',
  'uchet-nvos': 'Постановка на учёт объектов НВОС',
  'izmereniya-pek-szz': 'Измерения для ПЭК и СЗЗ',
  'uglerodnyy-sled': 'Углеродный след',
  'esg-otchetnost': 'ESG-отчётность',
  'klimaticheskie-riski': 'Климатические риски',
};

function hubSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Услуги НИЦ «Эколог»',
        url: `${SITE}/uslugi/`,
        isPartOf: { '@type': 'WebSite', url: `${SITE}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${SITE}/uslugi/` },
        ],
      },
    ],
  };
}

export function renderHubPage(briefs) {
  const bySlug = Object.fromEntries(briefs.map((b) => [b.slug, b]));

  const groupsHtml = HUB_GROUPS.map((g, gi) => {
    const cards = g.slugs
      .filter((s) => bySlug[s])
      .map((s) => {
        const b = bySlug[s];
        const teaser = b.intro[0] ?? '';
        return `<a class="hub-card" href="./${s}/"><h3><span class="dot dot--s" aria-hidden="true"></span>${esc(b.h1)}</h3><p>${esc(teaser.length > 120 ? `${teaser.slice(0, 117)}…` : teaser)}</p></a>`;
      })
      .join('\n      ');
    const soon = g.soon
      .map((s) => `<span class="chip chip--static">${esc(SOON_LABELS[s] ?? s)} — скоро</span>`)
      .join('\n      ');
    return `<section class="hub-group">
    <h2><b>${String(gi + 1).padStart(2, '0')}</b>${esc(g.title)}</h2>
    ${cards ? `<div class="hub-grid">${cards}</div>` : ''}
    ${soon ? `<div class="hub-soon">${soon}</div>` : ''}
  </section>`;
  }).join('\n  ');

  return `${headBlock({
    title: 'Экологические услуги в Санкт-Петербурге | НИЦ «Эколог»',
    description:
      'Проектирование экологической документации, сопровождение предприятий, инженерные изыскания и ESG-услуги в Санкт-Петербурге.',
    canonical: `${SITE}/uslugi/`,
    depth: 1,
    schema: hubSchema(),
  })}
<body>
${chromeBar({ depth: 1, uslugiHref: './', current: 'uslugi' })}
<main class="page" id="main">
  <div class="container page__in">
    ${crumbsNav([['Главная', '../'], ['Услуги']])}
    <p class="eyebrow">НИЦ «Эколог» · Санкт-Петербург</p>
    <h1 class="h2" style="margin-top:24px">Услуги НИЦ «Эколог»</h1>
    <p class="page__lead">Проектирование экологической документации, сопровождение предприятий, инженерные изыскания и ESG-услуги.</p>
  ${groupsHtml}
    <section class="hub-group">
      <h2><b>05</b>Лабораторные исследования</h2>
      <div class="hub-grid"><a class="hub-card" href="https://analitik-lab.ru" target="_blank" rel="noopener noreferrer"><h3><span class="dot dot--s" aria-hidden="true"></span>«Аналитик Лаб»</h3><p>Анализы воды, воздуха, почв и отходов — сайт лаборатории analitik-lab.ru.</p></a></div>
    </section>
    ${ctaBlock(1)}
  </div>
</main>
${footerBlock({ depth: 1, uslugiHref: './' })}
${menuScript(1)}
</body>
</html>`;
}

export const WAVE1_SITEMAP_URLS = [
  { path: '/uslugi/', priority: '0.9' },
  { path: '/uslugi/ndv/', priority: '0.85' },
  { path: '/uslugi/proekt-szz/', priority: '0.85' },
  { path: '/uslugi/ovos/', priority: '0.85' },
  { path: '/uslugi/pek/', priority: '0.85' },
  { path: '/uslugi/iei/', priority: '0.85' },
  { path: '/uslugi/autsorsing-ekologa/', priority: '0.85' },
  { path: '/uslugi/plata-nvos/', priority: '0.85' },
];
