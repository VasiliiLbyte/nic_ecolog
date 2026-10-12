import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { renderMarkdown } from './markdown.mjs';
import { chromeBar, ctaBlock, esc, footerBlock, headBlock, menuScript } from './service-page-template.mjs';

const SITE = 'https://nic-ecolog.ru';
const REQUIRED = ['title', 'description', 'h1', 'slug', 'status', 'date'];

// Service slug → label for the «Услуги по теме» block. Only built /uslugi/ pages.
const SERVICE_LABELS = {
  ndv: 'НДВ — нормативы допустимых выбросов',
  'proekt-szz': 'Проект санитарно-защитной зоны',
  ovos: 'ОВОС — оценка воздействия на окружающую среду',
  pek: 'Программа ПЭК',
  iei: 'Инженерно-экологические изыскания',
  'autsorsing-ekologa': 'Экологическое сопровождение предприятия',
  'plata-nvos': 'Расчёт платы за НВОС',
};

function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no front matter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value.startsWith('[')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      value = value.replace(/^"(.*)"$/, '$1');
    }
    meta[kv[1]] = value;
  }
  for (const key of REQUIRED) if (!meta[key]) throw new Error(`${file}: missing "${key}"`);
  if (!['draft', 'published'].includes(meta.status)) throw new Error(`${file}: status must be draft|published`);
  if (meta.title.length > 60) throw new Error(`${file}: title longer than 60`);
  if (meta.description.length > 160) throw new Error(`${file}: description longer than 160`);
  for (const s of meta.services ?? []) {
    if (!SERVICE_LABELS[s]) throw new Error(`${file}: unknown service "${s}"`);
  }
  // Optional cover: a file under assets/blog/ (1600×900, webp/jpg) plus alt text.
  if (meta.cover) {
    if (!/^[a-z0-9-]+\.(webp|jpg|png)$/.test(meta.cover)) throw new Error(`${file}: cover must be a file name in assets/blog/`);
    if (!meta.cover_alt) throw new Error(`${file}: cover_alt is required with cover`);
  }
  return { ...meta, services: meta.services ?? [], updated: meta.updated || meta.date, body: m[2] };
}

/** Loads content/blog/*.md. Drafts are included only when includeDrafts is true. */
export function loadArticles(contentDir, { includeDrafts = false } = {}) {
  if (!existsSync(contentDir)) return [];
  return readdirSync(contentDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => ({ ...parseFrontMatter(readFileSync(join(contentDir, f), 'utf8'), f), file: join(contentDir, f) }))
    .map((a) => {
      if (a.cover && !existsSync(join(dirname(dirname(contentDir)), 'assets', 'blog', a.cover))) {
        throw new Error(`${a.slug}: cover assets/blog/${a.cover} not found`);
      }
      return a;
    })
    .filter((a) => includeDrafts || a.status === 'published')
    .sort((a, b) => b.date.localeCompare(a.date));
}

const ruDate = (iso) => {
  const [y, m, d] = iso.split('-');
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
};

const ORG = { '@type': 'Organization', name: 'НИЦ «Эколог»', url: `${SITE}/` };

function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
}

export function renderArticlePage(a) {
  const url = `${SITE}/blog/${a.slug}/`;
  const homeHref = '../../index.html';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.h1,
        description: a.description,
        datePublished: a.date,
        dateModified: a.updated,
        inLanguage: 'ru',
        mainEntityOfPage: url,
        author: ORG,
        publisher: ORG,
        ...(a.cover ? { image: `${SITE}/assets/blog/${a.cover}` } : {}),
      },
      breadcrumbs([
        ['Главная', `${SITE}/`],
        ['Блог', `${SITE}/blog/`],
        [a.h1, url],
      ]),
    ],
  };
  const services = a.services
    .map((s) => `<a class="chip" href="../../uslugi/${s}/">${esc(SERVICE_LABELS[s])} <span aria-hidden="true">→</span></a>`)
    .join('\n    ');

  return `${headBlock({
    title: a.title,
    description: a.description,
    canonical: url,
    depth: 2,
    schema,
    ogType: 'article',
    ogImage: a.cover ? `${SITE}/assets/blog/${a.cover}` : undefined,
  })}
<body>
${chromeBar({
  depth: 2,
  homeHref,
  // Article title is already the H1; a full title here pushes the nav onto several lines.
  crumbsHtml: 'ГЛАВНАЯ · <a href="../" style="color:inherit;text-decoration:none"><b>БЛОГ</b></a>',
})}
<main class="wrap">
  <p class="eye">Блог НИЦ «Эколог»</p>
  <h1>${esc(a.h1)}</h1>
  <p class="post-meta"><time datetime="${a.date}">${ruDate(a.date)}</time>${a.updated !== a.date ? ` · обновлено <time datetime="${a.updated}">${ruDate(a.updated)}</time>` : ''}</p>${a.cover ? `
  <figure class="post-cover"><img src="../../assets/blog/${esc(a.cover)}" alt="${esc(a.cover_alt)}" width="1600" height="900" fetchpriority="high"></figure>` : ''}
  <article class="post">
${renderMarkdown(a.body)}
  </article>${services ? `
  <h2>Услуги по теме</h2>
  <div class="chips">${services}</div>` : ''}
  ${ctaBlock(homeHref)}
</main>
${footerBlock({ depth: 2, homeHref })}
${menuScript()}
</body>
</html>`;
}

export function renderBlogHub(articles) {
  const url = `${SITE}/blog/`;
  const homeHref = '../index.html';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'Блог НИЦ «Эколог»',
        url,
        publisher: ORG,
        blogPost: articles.map((a) => ({
          '@type': 'BlogPosting',
          headline: a.h1,
          url: `${SITE}/blog/${a.slug}/`,
          datePublished: a.date,
        })),
      },
      breadcrumbs([
        ['Главная', `${SITE}/`],
        ['Блог', url],
      ]),
    ],
  };
  const cards = articles
    .map(
      (a) => `<a class="hub-card" href="./${a.slug}/">${a.cover ? `
      <img class="cover" src="../assets/blog/${esc(a.cover)}" alt="" width="1600" height="900" loading="lazy">` : ''}
      <h3>${esc(a.h1)}</h3>
      <p>${esc(a.description)}</p>
      <p class="post-date"><time datetime="${a.date}">${ruDate(a.date)}</time></p>
    </a>`
    )
    .join('\n    ');

  return `${headBlock({
    title: 'Блог об экологической документации | НИЦ «Эколог»',
    description:
      'Разбираем требования к экологической документации предприятий: категории НВОС, санитарно-защитные зоны, нормативы, отчётность. НИЦ «Эколог», Санкт-Петербург.',
    canonical: url,
    depth: 1,
    schema,
  })}
<body>
${chromeBar({
  depth: 1,
  homeHref,
  uslugiHref: '../uslugi/',
  crumbsHtml: 'ГЛАВНАЯ · <b>БЛОГ</b>',
})}
<main class="wrap">
  <p class="eye">НИЦ «Эколог» · Санкт-Петербург</p>
  <h1>Блог НИЦ «Эколог»</h1>
  <p class="lead">Разборы требований к экологической документации предприятий: что изменилось в законодательстве и что с этим делать.</p>
  <div class="hub-grid">${cards}</div>
  ${ctaBlock(homeHref)}
</main>
${footerBlock({ depth: 1, homeHref, uslugiHref: '../uslugi/' })}
${menuScript()}
</body>
</html>`;
}

export function articlesByService(articles) {
  const map = {};
  for (const a of articles) for (const s of a.services) (map[s] ??= []).push(a);
  return map;
}
