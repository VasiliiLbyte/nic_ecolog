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
  body.menu-open{overflow:hidden}
  h1,h2,h3,p{margin:0}
  a{color:inherit}
  .mono{font-family:var(--font-mono,'Stolzl','Onest',sans-serif)}
  .bar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 24px;background:rgba(247,251,249,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line,#E2EBE8);flex-wrap:wrap}
  .bar-left{display:flex;align-items:center;gap:16px;min-width:0;flex:1 1 auto;overflow:hidden}
  .bar-left img{height:34px;width:auto;display:block;flex:0 0 auto}
  .crumbs{font-family:var(--font-mono,'Stolzl','Onest',sans-serif);font-size:11px;letter-spacing:.08em;color:var(--slate-3,#7A9496);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .crumbs b{color:var(--teal-deep,#0B5C60);font-weight:500}
  .bar-nav{display:flex;align-items:center;gap:24px;flex-wrap:wrap;flex:1;justify-content:flex-end}
  .bar-nav a:not(.btn-cta){font-size:14.5px;color:#2C4346;text-decoration:none;font-weight:400;transition:color .2s}
  .bar-nav a:not(.btn-cta):hover{color:var(--teal,#139EA1)}
  .bar-phone{font-size:14.5px;font-weight:500;color:var(--teal-deep,#0B5C60);text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
  .btn-cta{display:inline-flex;align-items:center;gap:8px;background:#1C6BA2;color:#fff;font-size:14px;font-weight:500;text-decoration:none;padding:10px 20px;border-radius:4px;white-space:nowrap}
  .burger{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid rgba(11,92,96,.25);border-radius:12px;background:rgba(255,255,255,.75);cursor:pointer;padding:0;flex:0 0 auto}
  .mmenu{position:fixed;inset:0;z-index:180;background:rgba(247,251,249,.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:flex;flex-direction:column;padding:22px 24px 36px;opacity:0;visibility:hidden;transition:opacity .25s ease;outline:none;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
  .mmenu.open{opacity:1;visibility:visible}
  .mm-top{display:flex;align-items:center;justify-content:space-between}
  .mm-brand{font-size:20px;font-weight:600;color:var(--teal-deep,#0B5C60)}
  .mm-close{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid rgba(11,92,96,.25);border-radius:12px;background:#fff;cursor:pointer;padding:0}
  .mmenu nav{display:flex;flex-direction:column;gap:6px;margin-top:48px}
  .mmenu nav a{font-size:26px;font-weight:300;color:var(--ink,#13282B);text-decoration:none;padding:14px 0;min-height:44px;display:flex;align-items:center;border-bottom:1px solid rgba(11,92,96,.1)}
  .mm-foot{margin-top:auto;display:flex;flex-direction:column;gap:16px}
  .mm-foot .bar-phone{font-size:19px}
  .mm-foot .btn-cta{justify-content:center;padding:18px 38px;font-size:16px}
  @media(min-width:1061px){.burger{display:none !important}}
  @media(max-width:1060px){.bar-nav a:not(.btn-cta),.bar-phone,.bar-nav .btn-cta{display:none}.burger{display:flex}}
  .wrap{max-width:960px;margin:0 auto;padding:48px 24px 80px}
  .eye{font-family:var(--font-mono,'Stolzl','Onest',sans-serif);font-size:11px;font-weight:500;letter-spacing:.18em;color:var(--teal,#139EA1);text-transform:uppercase;margin-bottom:12px}
  h1{font-family:var(--font-display,'Stolzl',sans-serif);font-weight:300;font-size:clamp(28px,4vw,48px);line-height:1.12;color:var(--ink,#13282B);margin-top:8px;text-wrap:balance}
  .lead{margin-top:20px;font-size:17px;line-height:1.7;color:var(--slate-2,#3D5557);max-width:720px}
  .lead p+p{margin-top:12px}
  h2{font-weight:400;font-size:22px;color:var(--ink,#13282B);margin:48px 0 20px}
  .steps{display:flex;flex-direction:column;border-top:1px solid var(--line,#E2EBE8)}
  .step{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid var(--line,#E2EBE8)}
  .step .n{font-family:var(--font-mono,'Stolzl','Onest',sans-serif);font-size:13px;color:var(--teal,#139EA1);padding-top:2px;flex:0 0 auto;min-width:28px}
  .step p{font-size:15px;line-height:1.65;color:var(--slate-1,#3D5557)}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
  .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line-strong,#C5D6D2);border-radius:999px;background:#fff;color:var(--teal-deep,#0B5C60);font-size:14px;font-weight:500;padding:10px 18px;text-decoration:none}
  .chip:hover{border-color:var(--teal,#139EA1);background:rgba(19,158,161,.06)}
  .chip-static{display:inline-flex;align-items:center;border:1px dashed var(--line-strong,#C5D6D2);border-radius:999px;color:var(--slate-3,#7A9496);font-size:14px;padding:10px 18px}
  .cta{margin-top:56px;background:linear-gradient(105deg,#139EA1,#1C6BA2);border-radius:20px;padding:36px 32px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
  .cta h3{font-family:var(--font-display,'Stolzl',sans-serif);font-weight:300;font-size:clamp(22px,2.5vw,28px)}
  .cta p{margin-top:6px;font-size:15px;color:rgba(255,255,255,.88)}
  .cta-btn{background:#fff;color:var(--teal-deep,#0B5C60);border-radius:4px;font-size:15px;font-weight:500;padding:14px 28px;text-decoration:none;display:inline-block}
  .hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:24px}
  .hub-card{border:1px solid var(--line,#E2EBE8);border-radius:16px;padding:24px;background:#fff;text-decoration:none;color:inherit;display:block;transition:border-color .2s,box-shadow .2s}
  a.hub-card:hover{border-color:var(--teal,#139EA1);box-shadow:0 8px 24px rgba(19,158,161,.1)}
  .hub-card h3{font-size:17px;font-weight:500;color:var(--ink,#13282B);margin-bottom:8px}
  .hub-card p{font-size:14px;line-height:1.6;color:var(--slate-2,#3D5557)}
  .hub-group{margin-top:40px}
  .hub-group h2{font-size:20px;margin:0 0 16px}
  .lab-block{margin-top:40px;padding:24px;border:1px solid var(--line,#E2EBE8);border-radius:16px;background:#fff}
  .soon{font-size:14px;color:var(--slate-3,#7A9496);font-style:italic}
  .ft{background:#06141C;color:#fff;padding:64px 24px 32px;margin-top:80px}
  .ft-inner{max-width:1240px;margin:0 auto}
  .ft-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px}
  .ft-grid>div:first-child p{max-width:300px;line-height:1.6;color:rgba(255,255,255,.7);margin-top:14px}
  .ft h4{font-family:'Stolzl','Onest',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:18px}
  .ft a,.ft p{font-size:14.5px;color:rgba(255,255,255,.75);text-decoration:none;line-height:2;display:block}
  .ft a:hover{color:#fff}
  .ft-bot{display:flex;justify-content:space-between;align-items:center;margin-top:54px;padding-top:24px;border-top:1px solid rgba(255,255,255,.1);font-size:13px;color:rgba(255,255,255,.5);flex-wrap:wrap;gap:12px}
  @media(max-width:900px){.ft-grid{grid-template-columns:1fr 1fr;gap:32px}}
  @media(max-width:640px){.bar{padding:12px 16px}.wrap{padding:32px 16px 64px}.ft-grid{grid-template-columns:1fr}}
  `;
}

function headBlock({ title, description, canonical, depth, schema }) {
  const prefix = assetPrefix(depth);
  const schemaScript = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : '';
  const ogImage = `${SITE}/assets/hero-mesh-poster.jpg`;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
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

function navLinks({ uslugiHref, prefix, homeHref }) {
  return [
    { href: uslugiHref, label: 'Услуги' },
    { href: `${prefix}lab.html`, label: 'Лаборатория' },
    { href: `${homeHref}#proekty`, label: 'Проекты' },
    { href: `${homeHref}#o-centre`, label: 'О центре' },
    { href: `${homeHref}#esg`, label: 'ESG' },
    { href: `${homeHref}#litsenzii`, label: 'Лицензии' },
    { href: `${homeHref}#kontakty`, label: 'Контакты' },
  ];
}

function chromeBar({ depth, crumbCurrent, homeHref = '/' }) {
  const prefix = assetPrefix(depth);
  const uslugiHref = depth === 1 ? './' : `${prefix}uslugi/`;
  const links = navLinks({ uslugiHref, prefix, homeHref });
  const navHtml = links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('\n    ');
  return `<header class="bar">
  <div class="bar-left">
    <a href="${homeHref}"><img src="${prefix}assets/logo_ecolog.svg" alt="НИЦ Эколог"></a>
    <span class="crumbs">ГЛАВНАЯ · <a href="${uslugiHref}" style="color:inherit;text-decoration:none">УСЛУГИ</a>${crumbCurrent ? ` · <b>${esc(crumbCurrent)}</b>` : ''}</span>
  </div>
  <nav class="bar-nav" aria-label="Навигация">
    ${navHtml}
    <a class="bar-phone" href="tel:+78124499348">+7&nbsp;(812)&nbsp;449-93-48</a>
    <a class="btn-cta" href="${homeHref}#zayavka">Оставить заявку</a>
  </nav>
  <button class="burger" type="button" aria-label="Открыть меню" aria-haspopup="dialog" aria-expanded="false" aria-controls="mmenu" data-menu-open>
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><g stroke="#0B5C60" stroke-width="1.8" stroke-linecap="round"><line x1="1" y1="1" x2="19" y2="1"></line><line x1="1" y1="7" x2="19" y2="7"></line><line x1="1" y1="13" x2="19" y2="13"></line></g></svg>
  </button>
</header>
<div class="mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Меню навигации" tabindex="-1">
  <div class="mm-top">
    <span class="mm-brand">Эколог</span>
    <button type="button" class="mm-close" aria-label="Закрыть меню" data-menu-close>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g stroke="#0B5C60" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="2" x2="14" y2="14"></line><line x1="14" y1="2" x2="2" y2="14"></line></g></svg>
    </button>
  </div>
  <nav aria-label="Мобильная навигация">
    ${navHtml}
  </nav>
  <div class="mm-foot">
    <a class="bar-phone" href="tel:+78124499348">+7&nbsp;(812)&nbsp;449-93-48</a>
    <a class="btn-cta" href="${homeHref}#zayavka">Оставить заявку</a>
  </div>
</div>`;
}

function menuScript() {
  return `<script>(function(){
var b=document.querySelector('[data-menu-open]'),c=document.querySelector('[data-menu-close]'),m=document.getElementById('mmenu');
function open(){if(!m)return;m.classList.add('open');b&&b.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');}
function close(){if(!m)return;m.classList.remove('open');b&&b.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');}
if(b)b.addEventListener('click',function(){m&&m.classList.contains('open')?close():open();});
if(c)c.addEventListener('click',close);
})();</script>`;
}

function footerBlock({ depth, homeHref = '/' }) {
  const prefix = assetPrefix(depth);
  const uslugiHref = depth === 1 ? './' : `${prefix}uslugi/`;
  const privacyHref = `${prefix}privacy.html`;
  return `<footer class="ft">
  <div class="ft-inner">
    <div class="ft-grid">
      <div>
        <a href="${homeHref}" style="display:inline-flex;align-items:center"><img src="${prefix}assets/logo_ecolog.svg" alt="НИЦ Эколог" style="height:40px"></a>
        <p>Наука + экология + прикладные решения. Надёжность и экспертиза без бюрократии.</p>
      </div>
      <div>
        <h4>Услуги</h4>
        <a href="${uslugiHref}">Проектирование и документация</a>
        <a href="${uslugiHref}">Сопровождение предприятий</a>
        <a href="${uslugiHref}">Изыскания и исследования</a>
        <a href="${homeHref}#esg">ESG и устойчивое развитие</a>
      </div>
      <div>
        <h4>Центр</h4>
        <a href="${homeHref}#o-centre">О центре</a>
        <a href="${prefix}lab.html">Лаборатория «Аналитик Лаб»</a>
        <a href="${homeHref}#proekty">Проекты</a>
        <a href="${homeHref}#litsenzii">Лицензии</a>
      </div>
      <div>
        <h4>Контакты</h4>
        <a href="tel:+78124499348">+7&nbsp;(812)&nbsp;449-93-48</a>
        <a href="mailto:info@nic-ecolog.ru">info@nic-ecolog.ru</a>
        <p>Санкт-Петербург</p>
      </div>
    </div>
    <div class="ft-bot">
      <span>© 2026 НИЦ «Эколог» · НАУКА ДЛЯ ПРИРОДЫ</span>
      <span>nic-ecolog.ru · <a href="${privacyHref}" style="display:inline;color:inherit">Политика конфиденциальности</a></span>
    </div>
  </div>
</footer>`;
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
${footerBlock({ depth, homeHref })}
${menuScript()}
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
${footerBlock({ depth: 1, homeHref })}
${menuScript()}
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
