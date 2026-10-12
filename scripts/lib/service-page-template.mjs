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

function assetPrefix(depth) {
  return depth === 1 ? '../' : '../../';
}

export function pageStyles() {
  // Оболочка и страница услуги — по макету Figma «Услуга — СЗЗ — Desktop» и шапке/подвалу главной.
  return `
  :root{--f-heading:#0B5C60;--f-text:#444444;--f-primary:#222222;--f-teal:#139EA1;--f-green:#4CB272;--f-green-l:#ADCF7A;--f-blue:#1C6BA2;--f-border:#E0E0E0;--f-muted:#767676;--f-alt:#F3F7F7}
  *{box-sizing:border-box}
  body{margin:0;font-family:'Onest',-apple-system,'Segoe UI',sans-serif;background:var(--f-alt);color:var(--f-text);font-size:16px;line-height:1.6}
  body.menu-open{overflow:hidden}
  h1,h2,h3,p{margin:0}
  a{color:inherit}
  .bar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:33px 32px;background:#FFFFFF;border-bottom:1px solid var(--f-border)}
  .bar-left{display:flex;align-items:center;flex:0 0 auto}
  .bar-left img{display:block;width:104px;height:35px}
  .bar-nav{display:flex;align-items:center;gap:32px}
  .bar-nav a{font-size:12px;line-height:20px;color:var(--f-heading);text-decoration:none;transition:color .2s}
  .bar-nav a:hover{color:var(--f-teal)}
  .bar-actions{display:flex;align-items:center;gap:24px;flex:0 0 auto}
  .bar-phone{font-size:14px;line-height:20px;color:var(--f-heading);text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
  .btn-cta{display:inline-flex;align-items:center;justify-content:center;min-width:210px;height:35px;padding:0 24px;border:1px solid var(--f-blue);border-radius:4px;background:var(--f-blue);color:#FFFFFF;font-size:13px;line-height:20px;text-decoration:none;white-space:nowrap;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
  .btn-cta:hover{transform:scale(1.03);box-shadow:0 0 0 2px #FFFFFF,0 0 0 3px var(--f-blue)}
  .btn-cta:active{transform:scale(1);background:var(--f-teal);border-color:var(--f-teal);box-shadow:none}
  .burger{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:0;background:transparent;cursor:pointer;padding:0;flex:0 0 auto}
  .crumbs-row{max-width:1160px;margin:0 auto;padding:24px 48px 0}
  .crumbs{font-size:12px;line-height:18px;color:var(--f-text)}
  .crumbs a{color:inherit;text-decoration:none}
  .crumbs a:hover{color:var(--f-teal)}
  .crumbs b{font-weight:400;color:var(--f-heading)}
  .mmenu{position:fixed;inset:0;z-index:180;background:rgba(255,255,255,.98);display:flex;flex-direction:column;padding:18px 20px 36px;opacity:0;visibility:hidden;transition:opacity .25s ease;outline:none;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
  .mmenu.open{opacity:1;visibility:visible}
  .mm-top{display:flex;align-items:center;justify-content:space-between}
  .mm-top img{display:block;width:104px;height:35px}
  .mm-close{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border:0;background:transparent;cursor:pointer;padding:0}
  .mmenu nav{display:flex;flex-direction:column;margin-top:40px}
  .mmenu nav a{font-size:22px;font-weight:600;color:var(--f-heading);text-decoration:none;padding:12px 0;min-height:44px;display:flex;align-items:center;border-bottom:1px solid var(--f-border)}
  .mm-foot{margin-top:auto;padding-top:32px;display:flex;flex-direction:column;gap:16px}
  .mm-foot .bar-phone{font-size:18px}
  .mm-foot .btn-cta{height:44px}
  @media(min-width:1061px){.burger{display:none !important}}
  @media(max-width:1060px){.bar-nav,.bar-phone,.bar-actions .btn-cta{display:none}.burger{display:flex}}
  .wrap{max-width:1160px;margin:0 auto;padding:40px 48px 96px}
  .eye{font-size:12px;line-height:25px;letter-spacing:.02em;color:var(--f-text);text-transform:uppercase}
  h1{margin-top:24px;max-width:640px;font-weight:400;font-size:50px;line-height:55px;color:var(--f-heading);text-wrap:balance}
  .lead{margin-top:24px;max-width:540px;font-size:16px;line-height:23px;color:var(--f-text)}
  .lead p+p{margin-top:12px}
  .facts{display:flex;flex-wrap:wrap;gap:30px;margin-top:40px}
  .fact{display:flex;align-items:flex-start;gap:16px;padding:4px 16px;border-radius:5px;background:#FFFFFF;font-size:10px;line-height:25px;letter-spacing:.02em}
  .fact b{font-weight:400;color:var(--f-heading);text-transform:uppercase}
  .fact span{padding-left:16px;border-left:1px solid var(--f-border);color:var(--f-muted)}
  h2{margin:48px 0 20px;font-weight:400;font-size:30px;line-height:36px;color:var(--f-text)}
  .svc-cols{display:grid;grid-template-columns:minmax(0,522px) minmax(0,520px);justify-content:space-between;gap:22px;align-items:start}
  .svc-cols--single{grid-template-columns:minmax(0,760px)}
  .steps{display:flex;flex-direction:column;border-top:1px solid var(--f-border)}
  .step{display:flex;gap:18px;padding:20px 10px 20px 38px;border-bottom:1px solid var(--f-border)}
  .step .n{flex:0 0 auto;min-width:13px;font-size:12px;line-height:23px;color:var(--f-muted)}
  .step p{font-size:12px;line-height:20px;padding-top:2px;color:var(--f-text)}
  .aside{display:flex;flex-direction:column;gap:20px}
  .aside-card{padding:23px 33px 28px;border-radius:5px;background:#FFFFFF}
  .aside-card h3{font-size:16px;line-height:18px;font-weight:400;color:var(--f-green);text-transform:uppercase}
  .aside-card p{margin-top:12px;font-size:12px;line-height:20px;color:var(--f-text)}
  .aside-card--accent{background:linear-gradient(105deg,#4CB272 0%,#139EA1 33%,#0072BB 100%)}
  .aside-card--accent h3,.aside-card--accent p{color:#FFFFFF}
  .chips{display:flex;flex-wrap:wrap;gap:20px;margin-top:8px}
  .chip{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:4px 22px;border-radius:5px;background:#FFFFFF;color:var(--f-heading);font-size:12px;line-height:25px;letter-spacing:.02em;text-decoration:none;transition:box-shadow .2s ease}
  .chip:hover{box-shadow:0 0 0 1px var(--f-teal)}
  .chip-static{display:inline-flex;align-items:center;min-height:32px;padding:4px 22px;border-radius:5px;background:rgba(255,255,255,.6);color:var(--f-muted);font-size:12px;line-height:25px;letter-spacing:.02em}
  .cta{margin-top:64px;min-height:127px;padding:20px 36px;border-radius:5px;background:linear-gradient(90deg,#1C6BA2,#139EA1);color:#FFFFFF;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
  .cta h3{font-size:32px;line-height:55px;font-weight:400;letter-spacing:-.01em}
  .cta p{font-size:12px;line-height:23px;color:#FFFFFF}
  .cta-btn{display:inline-flex;align-items:center;justify-content:center;min-width:210px;height:35px;padding:0 24px;border:1px solid #FFFFFF;border-radius:4px;color:#FFFFFF;font-size:13px;line-height:20px;text-decoration:none;margin-right:200px;transition:transform .2s ease,background .2s ease}
  .cta-btn:hover{transform:scale(1.03);background:rgba(255,255,255,.12)}
  .hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:24px}
  .hub-card{display:block;padding:16px;border-radius:8px;background:#FFFFFF;text-decoration:none;color:inherit;transition:box-shadow .2s}
  a.hub-card:hover{box-shadow:0 0 0 1px var(--f-teal)}
  .hub-card h3{margin-bottom:8px;font-size:20px;line-height:28px;font-weight:600;color:var(--f-heading)}
  .hub-card p{font-size:14px;line-height:20px;color:var(--f-text)}
  .hub-group{margin-top:48px}
  .hub-group h2{margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid var(--f-border);font-size:16px;line-height:20px;font-weight:700;letter-spacing:.02em;color:var(--f-primary)}
  .lab-block{margin-top:48px;padding:24px;border-radius:8px;background:#FFFFFF}
  .soon{font-size:12px;color:var(--f-muted);font-style:italic}
  .ft{background:#06141C;color:#FFFFFF;padding:64px 48px 85px}
  .ft-inner{max-width:1064px;margin:0 auto}
  .ft-top{display:flex;justify-content:space-between;gap:16px}
  .ft-brand{flex:0 0 254px;display:flex;flex-direction:column;gap:32px}
  .ft-brand img{display:block;width:104px;height:35px}
  .ft-brand p{font-size:12px;line-height:18px}
  .ft-brand p+p{margin-top:16px}
  .ft-nav{display:flex;gap:96px}
  .ft-col{display:flex;flex-direction:column;gap:16px}
  .ft-col h4{margin:0 0 8px;font-size:10px;line-height:18px;font-weight:400;text-transform:uppercase;color:var(--f-teal)}
  .ft-col a,.ft-col p{font-size:12px;line-height:18px;color:#FFFFFF;text-decoration:none}
  .ft-col a:hover{color:var(--f-green-l)}
  .ft-bot{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px;margin-top:32px;padding-top:32px;border-top:1px solid var(--f-teal);font-size:12px;line-height:18px;color:var(--f-teal)}
  .ft-bot div{display:flex;gap:48px}
  .ft-bot a{color:inherit;text-decoration:none}
  .ft-bot a:hover{color:#FFFFFF}
  @media(max-width:1060px){.svc-cols{grid-template-columns:1fr}.ft-top{flex-direction:column;gap:40px}.ft-nav{gap:48px;flex-wrap:wrap}.cta-btn{margin-right:0}}
  @media(max-width:720px){
    .bar{padding:18px 10px 19px 20px}
    .crumbs-row{padding:16px 20px 0}
    .wrap{padding:24px 20px 48px}
    h1{font-size:30px;line-height:36px;margin-top:16px;font-weight:600}
    h2{font-size:24px;line-height:30px;margin-top:40px}
    .facts{gap:12px}
    .fact{flex-direction:column;gap:0}
    .fact span{padding-left:0;border-left:0}
    .step{padding:16px 0 16px 8px}
    .aside-card{padding:20px}
    .cta{padding:24px 20px}
    .cta h3{font-size:24px;line-height:32px}
    .cta-btn{width:100%;height:44px}
    .chips{gap:12px}
    .ft{padding:32px 20px}
    .ft-nav{flex-direction:column;gap:24px}
    .ft-bot{flex-direction:column;align-items:flex-start;gap:16px;margin-top:24px;padding-top:24px}
    .ft-bot div{flex-direction:column;gap:16px}
  }
  .post-meta{margin-top:14px;font-size:14px;color:var(--f-muted)}
  .post{margin-top:28px;max-width:760px;font-size:16px;line-height:1.75;color:var(--f-primary)}
  .post p{margin:0 0 16px}
  .post h2{margin:40px 0 16px}
  .post h3{font-size:18px;font-weight:600;color:var(--f-heading);margin:28px 0 12px}
  .post ul,.post ol{margin:0 0 18px;padding-left:22px}
  .post li{margin:6px 0}
  .post a{color:var(--f-heading);text-underline-offset:3px}
  .post strong{color:var(--f-primary);font-weight:600}
  .post .tbl{overflow-x:auto;margin:0 0 20px;-webkit-overflow-scrolling:touch}
  .post table{border-collapse:collapse;width:100%;min-width:560px;font-size:14px;line-height:1.5;background:#fff}
  .post th,.post td{border:1px solid var(--f-border);padding:10px 12px;text-align:left;vertical-align:top}
  .post th{background:var(--f-alt);color:var(--f-primary);font-weight:500}
  .post-date{font-size:12px;color:var(--f-muted);margin-top:10px}
  .post-cover{margin:28px 0 0;max-width:960px}
  .post-cover img{display:block;width:100%;height:auto;border-radius:8px}
  .hub-card .cover{display:block;width:calc(100% + 32px);margin:-16px -16px 16px;height:auto;border-radius:8px 8px 0 0}
  `;
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
    ...(siteOptions.hasBlog ? [{ href: `${prefix}blog/`, label: 'Блог' }] : []),
  ];
}

export function chromeBar({ depth, crumbCurrent, homeHref = '/', uslugiHref: uslugiOverride, crumbsHtml }) {
  const prefix = assetPrefix(depth);
  const uslugiHref = uslugiOverride ?? (depth === 1 ? './' : `${prefix}uslugi/`);
  const links = navLinks({ uslugiHref, prefix, homeHref });
  const navHtml = links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('\n    ');
  const crumbs = crumbsHtml
    ?? `<a href="${homeHref}">Главная</a> | <a href="${uslugiHref}">Услуги</a>${crumbCurrent ? ` | <b>${esc(crumbCurrent)}</b>` : ''}`;
  return `<header class="bar">
  <a class="bar-left" href="${homeHref}"><img src="${prefix}assets/figma/logo-ecolog.svg" alt="НИЦ Эколог" width="104" height="35"></a>
  <nav class="bar-nav" aria-label="Навигация">
    ${navHtml}
  </nav>
  <div class="bar-actions">
    <a class="bar-phone" href="tel:+78124499348">+7&nbsp;(812)&nbsp;449&nbsp;93&nbsp;48</a>
    <a class="btn-cta" href="${homeHref}#zayavka">Заказать исследование</a>
    <button class="burger" type="button" aria-label="Открыть меню" aria-haspopup="dialog" aria-expanded="false" aria-controls="mmenu" data-menu-open>
      <svg width="24" height="17" viewBox="0 0 24 17" aria-hidden="true"><g stroke="#0B5C60" stroke-width="1"><line x1="0" y1="0.5" x2="24" y2="0.5"></line><line x1="0" y1="8.5" x2="24" y2="8.5"></line><line x1="0" y1="16.5" x2="24" y2="16.5"></line></g></svg>
    </button>
  </div>
</header>
<nav class="crumbs-row" aria-label="Хлебные крошки"><p class="crumbs">${crumbs}</p></nav>
<div class="mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Меню навигации" tabindex="-1">
  <div class="mm-top">
    <img src="${prefix}assets/figma/logo-ecolog.svg" alt="НИЦ Эколог" width="104" height="35">
    <button type="button" class="mm-close" aria-label="Закрыть меню" data-menu-close>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g stroke="#0B5C60" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="2" x2="14" y2="14"></line><line x1="14" y1="2" x2="2" y2="14"></line></g></svg>
    </button>
  </div>
  <nav aria-label="Мобильная навигация">
    ${navHtml}
  </nav>
  <div class="mm-foot">
    <a class="bar-phone" href="tel:+78124499348">+7&nbsp;(812)&nbsp;449&nbsp;93&nbsp;48</a>
    <a class="btn-cta" href="${homeHref}#zayavka">Заказать исследование</a>
  </div>
</div>`;
}

export function menuScript() {
  return `<script>(function(){
var b=document.querySelector('[data-menu-open]'),c=document.querySelector('[data-menu-close]'),m=document.getElementById('mmenu');
function open(){if(!m)return;m.classList.add('open');b&&b.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');}
function close(){if(!m)return;m.classList.remove('open');b&&b.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');}
if(b)b.addEventListener('click',function(){m&&m.classList.contains('open')?close():open();});
if(c)c.addEventListener('click',close);
})();</script>`;
}

export function footerBlock({ depth, homeHref = '/', uslugiHref: uslugiOverride }) {
  const prefix = assetPrefix(depth);
  const uslugiHref = uslugiOverride ?? (depth === 1 ? './' : `${prefix}uslugi/`);
  const privacyHref = `${prefix}privacy.html`;
  return `<footer class="ft">
  <div class="ft-inner">
    <div class="ft-top">
      <div class="ft-brand">
        <a href="${homeHref}"><img src="${prefix}assets/figma/logo-ecolog-white.svg" alt="НИЦ Эколог" width="104" height="35"></a>
        <div>
          <p style="color:#139EA1">Наука + экология +<br>прикладные решения</p>
          <p style="color:#ADCF7A">Надёжность и экспертиза<br>без бюрократии</p>
        </div>
      </div>
      <div class="ft-nav">
        <nav class="ft-col" aria-label="Услуги">
          <h4>Услуги</h4>
          <a href="${uslugiHref}">Проектирование и документация</a>
          <a href="${uslugiHref}">Сопровождение предприятий</a>
          <a href="${uslugiHref}">Изыскания и исследования</a>
          <a href="${homeHref}#esg">ESG и устойчивое развитие</a>
        </nav>
        <nav class="ft-col" aria-label="Центр">
          <h4>Центр</h4>
          <a href="${homeHref}#o-centre">О центре</a>
          <a href="${prefix}lab.html">Лаборатория «Аналитик Лаб»</a>
          <a href="${homeHref}#proekty">Проекты</a>
          <a href="${homeHref}#esg">ESG</a>
          <a href="${homeHref}#litsenzii">Лицензии</a>${siteOptions.hasBlog ? `
          <a href="${prefix}blog/">Блог</a>` : ''}
        </nav>
        <div class="ft-col">
          <h4>Контакты</h4>
          <a href="tel:+78124499348">+7&nbsp;812&nbsp;449&nbsp;93&nbsp;48</a>
          <a href="mailto:info@nic-ecolog.ru">info@nic-ecolog.ru</a>
          <p>Санкт-Петербург</p>
        </div>
      </div>
    </div>
    <div class="ft-bot">
      <span>© 2026 НИЦ «Эколог»</span>
      <div><a href="${privacyHref}">Политика конфиденциальности</a><span>nic-ecolog.ru</span></div>
    </div>
  </div>
</footer>`;
}

export function ctaBlock(homeHref = '/') {
  return `<div class="cta">
  <div><h3>Обсудим вашу задачу</h3><p>Вернёмся с планом работ и оценкой в течение рабочего дня.</p></div>
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
function articlesBlock(articles) {
  if (!articles?.length) return '';
  const chips = articles
    .map((a) => `<a class="chip" href="../../blog/${esc(a.slug)}/">${esc(a.h1)} <span aria-hidden="true">→</span></a>`)
    .join('\n    ');
  return `<h2>Статьи по теме</h2>
  <div class="chips">${chips}</div>`;
}

// Блоки «Срок / Кому» и «Результат / Почему мы» из макета выводятся только при наличии
// проверенных разделов в брифе (parse-brief.mjs): без факт-чека их не публикуем.
function factsBlock(brief) {
  const facts = [['Срок', brief.term], ['Кому', brief.who]].filter(([, v]) => v);
  if (!facts.length) return '';
  return `<div class="facts">${facts.map(([k, v]) => `<p class="fact"><b>${k}</b><span>${esc(v)}</span></p>`).join('')}</div>`;
}

function asideBlock(brief) {
  const cards = [];
  if (brief.result) cards.push(`<div class="aside-card aside-card--accent"><h3>Результат</h3><p>${esc(brief.result)}</p></div>`);
  if (brief.whyUs) cards.push(`<div class="aside-card"><h3>Почему мы</h3><p>${esc(brief.whyUs)}</p></div>`);
  return cards.length ? `<div class="aside">${cards.join('\n      ')}</div>` : '';
}

export function renderServicePage(brief, { depth = 2, articles = [] } = {}) {
  const homeHref = depth === 1 ? '../index.html' : '../../index.html';
  const introHtml = brief.intro.map((p) => `<p>${esc(p)}</p>`).join('\n      ');
  const steps = brief.includes
    .map(
      (text, i) =>
        `<div class="step"><span class="n">${String(i + 1).padStart(2, '0')}</span><p>${esc(text)}</p></div>`
    )
    .join('\n      ');
  const aside = asideBlock(brief);

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
  ${factsBlock(brief)}
  <h2>Что входит в работу</h2>
  <div class="svc-cols${aside ? '' : ' svc-cols--single'}">
    <div class="steps">${steps}</div>
    ${aside}
  </div>
  ${relatedBlock(brief.related)}${articles.length ? `
  ${articlesBlock(articles)}` : ''}
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
