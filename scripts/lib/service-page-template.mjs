const SITE = 'https://nic-ecolog.ru';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function assetPrefix(depth) {
  return depth === 1 ? '../' : '../../';
}

function pageStyles() {
  return `
  *{box-sizing:border-box}
  body{margin:0;font-family:var(--font-body,'Onest',sans-serif);background:var(--bg,#F7FBF9);color:var(--ink-2,#51696B);font-size:16px;line-height:1.6}
  h1,h2,h3,p{margin:0}
  a{color:inherit}
  .mono{font-family:var(--font-mono,'JetBrains Mono',monospace)}
  .bar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 24px;background:rgba(247,251,249,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,#E2EBE8);flex-wrap:wrap}
  .bar-left{display:flex;align-items:center;gap:16px;min-width:0;flex:1}
  .bar-left img{height:34px;width:auto;display:block;flex:0 0 auto}
  .crumbs{font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:11px;letter-spacing:.08em;color:var(--slate-3,#7A9496);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .crumbs b{color:var(--teal-deep,#0F6B6D);font-weight:500}
  .bar-nav{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .bar-nav a{font-size:14px;color:var(--teal-deep,#0F6B6D);text-decoration:none;font-weight:500}
  .bar-nav a:hover{text-decoration:underline}
  .btn-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(105deg,#139EA1,#1C6BA2);color:#fff;font-size:14px;font-weight:500;text-decoration:none;padding:10px 20px;border-radius:999px;white-space:nowrap}
  .wrap{max-width:960px;margin:0 auto;padding:48px 24px 80px}
  .eye{font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:11px;font-weight:500;letter-spacing:.18em;color:var(--teal,#139EA1);text-transform:uppercase;margin-bottom:12px}
  h1{font-family:var(--font-display,'Stolzl',sans-serif);font-weight:300;font-size:clamp(28px,4vw,48px);line-height:1.12;color:var(--ink,#13282B);margin-top:8px;text-wrap:balance}
  .lead{margin-top:20px;font-size:17px;line-height:1.7;color:var(--slate-2,#3D5557);max-width:720px}
  .lead p+p{margin-top:12px}
  h2{font-weight:400;font-size:22px;color:var(--ink,#13282B);margin:48px 0 20px}
  .steps{display:flex;flex-direction:column;border-top:1px solid var(--line,#E2EBE8)}
  .step{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid var(--line,#E2EBE8)}
  .step .n{font-family:var(--font-mono,'JetBrains Mono',monospace);font-size:13px;color:var(--teal,#139EA1);padding-top:2px;flex:0 0 auto;min-width:28px}
  .step p{font-size:15px;line-height:1.65;color:var(--slate-1,#3D5557)}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
  .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line-strong,#C5D6D2);border-radius:999px;background:#fff;color:var(--teal-deep,#0F6B6D);font-size:14px;font-weight:500;padding:10px 18px;text-decoration:none}
  .chip:hover{border-color:var(--teal,#139EA1);background:rgba(19,158,161,.06)}
  .chip-static{display:inline-flex;align-items:center;border:1px dashed var(--line-strong,#C5D6D2);border-radius:999px;color:var(--slate-3,#7A9496);font-size:14px;padding:10px 18px}
  .cta{margin-top:56px;background:linear-gradient(105deg,#139EA1,#1C6BA2);border-radius:20px;padding:36px 32px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
  .cta h3{font-family:var(--font-display,'Stolzl',sans-serif);font-weight:300;font-size:clamp(22px,2.5vw,28px)}
  .cta p{margin-top:6px;font-size:15px;color:rgba(255,255,255,.88)}
  .cta-btn{background:#fff;color:var(--teal-deep,#0F6B6D);border-radius:999px;font-size:15px;font-weight:500;padding:14px 28px;text-decoration:none;display:inline-block}
  .hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:24px}
  .hub-card{border:1px solid var(--line,#E2EBE8);border-radius:16px;padding:24px;background:#fff;text-decoration:none;color:inherit;display:block;transition:border-color .2s,box-shadow .2s}
  a.hub-card:hover{border-color:var(--teal,#139EA1);box-shadow:0 8px 24px rgba(19,158,161,.1)}
  .hub-card h3{font-size:17px;font-weight:500;color:var(--ink,#13282B);margin-bottom:8px}
  .hub-card p{font-size:14px;line-height:1.6;color:var(--slate-2,#3D5557)}
  .hub-group{margin-top:40px}
  .hub-group h2{font-size:20px;margin:0 0 16px}
  .lab-block{margin-top:40px;padding:24px;border:1px solid var(--line,#E2EBE8);border-radius:16px;background:#fff}
  .soon{font-size:14px;color:var(--slate-3,#7A9496);font-style:italic}
  @media(max-width:640px){.bar{padding:12px 16px}.wrap{padding:32px 16px 64px}}
  `;
}

function headBlock({ title, description, canonical, depth, schema }) {
  const prefix = assetPrefix(depth);
  const schemaScript = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/png" href="${prefix}assets/fingerprint-color.png">
<link rel="stylesheet" href="${prefix}tokens/reset.css">
<link rel="stylesheet" href="${prefix}tokens/fonts.css">
<link rel="stylesheet" href="${prefix}tokens/colors.css">
<link rel="stylesheet" href="${prefix}tokens/typography.css">
<link rel="stylesheet" href="${prefix}tokens/spacing.css">
<link rel="stylesheet" href="${prefix}tokens/fluid.css">
<link rel="stylesheet" href="${prefix}tokens/effects.css">
<link rel="stylesheet" href="${prefix}tokens/responsive.css">
<style>${pageStyles()}</style>
${schemaScript}
</head>`;
}

function chromeBar({ depth, crumbCurrent, homeHref = '/' }) {
  const prefix = assetPrefix(depth);
  const uslugiHref = depth === 1 ? './' : `${prefix}uslugi/`;
  return `<header class="bar">
  <div class="bar-left">
    <a href="${homeHref}"><img src="${prefix}assets/fingerprint-color.png" alt="НИЦ «Эколог»"></a>
    <span class="crumbs">ГЛАВНАЯ · <a href="${uslugiHref}" style="color:inherit;text-decoration:none">УСЛУГИ</a>${crumbCurrent ? ` · <b>${esc(crumbCurrent)}</b>` : ''}</span>
  </div>
  <nav class="bar-nav" aria-label="Навигация">
    <a href="${uslugiHref}">Услуги</a>
    <a href="${prefix}lab.html">Лаборатория</a>
    <a class="btn-cta" href="${homeHref}#zayavka">Оставить заявку</a>
  </nav>
</header>`;
}

function ctaBlock(homeHref = '/') {
  return `<div class="cta">
  <div><h3>Обсудим вашу задачу?</h3><p>Оставьте заявку — мы свяжемся с вами.</p></div>
  <a class="cta-btn" href="${homeHref}#zayavka">Оставить заявку</a>
</div>`;
}

function relatedBlock(related) {
  if (!related?.length) return '';
  const chips = related
    .map((r) => {
      if (r.href) {
        const target = r.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="chip" href="${esc(r.href)}"${target}>${esc(r.label)} <span aria-hidden="true">→</span></a>`;
      }
      return `<span class="chip-static">${esc(r.label)}</span>`;
    })
    .join('\n    ');
  return `<h2>Смежные услуги</h2>
  <div class="chips">${chips}</div>`;
}

/**
 * @param {import('./parse-brief.mjs').parseBrief extends (...args: any[]) => infer R ? R : never} brief
 */
export function renderServicePage(brief, { depth = 2 } = {}) {
  const homeHref = depth === 1 ? '../index.html' : '../../index.html';
  const introHtml = brief.intro.map((p) => `<p>${esc(p)}</p>`).join('\n      ');
  const steps = brief.includes
    .map(
      (text, i) =>
        `<div class="step"><span class="n">${String(i + 1).padStart(2, '0')}</span><p>${esc(text)}</p></div>`
    )
    .join('\n      ');

  return `${headBlock({
    title: brief.title,
    description: brief.description,
    canonical: brief.canonical,
    depth,
    schema: brief.schema,
  })}
<body>
${chromeBar({ depth, crumbCurrent: brief.h1, homeHref })}
<main class="wrap">
  <p class="eye">${esc(brief.group ?? '')}</p>
  <h1>${esc(brief.h1)}</h1>
  <div class="lead">${introHtml}</div>
  <h2>Что входит в работу</h2>
  <div class="steps">${steps}</div>
  ${relatedBlock(brief.related)}
  ${ctaBlock(homeHref)}
</main>
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
  const homeHref = '../index.html';

  const wave1Cards = briefs
    .map((b) => {
      const teaser = b.intro[0] ?? '';
      return `<a class="hub-card" href="./${b.slug}/">
      <h3>${esc(b.h1)}</h3>
      <p>${esc(teaser.length > 120 ? `${teaser.slice(0, 117)}…` : teaser)}</p>
    </a>`;
    })
    .join('\n    ');

  const groupsHtml = HUB_GROUPS.map((g) => {
    const cards = g.slugs
      .filter((s) => bySlug[s])
      .map((s) => {
        const b = bySlug[s];
        return `<a class="hub-card" href="./${s}/"><h3>${esc(b.h1)}</h3><p>${esc((b.intro[0] ?? '').slice(0, 100))}</p></a>`;
      })
      .join('\n      ');
    const soon = g.soon
      .map((s) => `<span class="chip-static">${esc(SOON_LABELS[s] ?? s)} <span class="soon">— скоро</span></span>`)
      .join('\n      ');
    return `<section class="hub-group">
    <h2>${esc(g.title)}</h2>
    <div class="hub-grid">${cards}</div>
    ${soon ? `<div class="chips" style="margin-top:12px">${soon}</div>` : ''}
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
${chromeBar({ depth: 1, crumbCurrent: null, homeHref })}
<main class="wrap">
  <p class="eye">НИЦ «Эколог» · Санкт-Петербург</p>
  <h1>Услуги НИЦ «Эколог»</h1>
  <p class="lead">Проектирование экологической документации, сопровождение предприятий, инженерные изыскания и ESG-услуги.</p>
  <h2>Ключевые услуги</h2>
  <div class="hub-grid">${wave1Cards}</div>
  ${groupsHtml}
  <div class="lab-block">
    <h2 style="margin-top:0;font-size:18px">Лабораторные исследования</h2>
    <p style="font-size:15px;color:var(--slate-2,#3D5557);margin:8px 0 16px">Анализы воды, воздуха, почв и отходов — в лаборатории «Аналитик Лаб».</p>
    <a class="chip" href="https://analitik-lab.ru" target="_blank" rel="noopener noreferrer">Перейти на analitik-lab.ru →</a>
  </div>
  ${ctaBlock(homeHref)}
</main>
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
