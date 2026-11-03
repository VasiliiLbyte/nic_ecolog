import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const WAVE1_SLUGS = [
  'ndv',
  'proekt-szz',
  'ovos',
  'pek',
  'iei',
  'autsorsing-ekologa',
  'plata-nvos',
];

export const WAVE2_SLUGS = new Set([
  'nds',
  'pnoolr',
  'ker',
  'dvos',
  'uchet-nvos',
  'uglerodnyy-sled',
]);

/** Phase A neutral intros where brief gated raw inventory lead. */
export const NEUTRAL_INTRO = {
  'proekt-szz':
    'Установление границ СЗЗ — от расчётов до внесения в ЕГРН.',
  pek: 'Программа ПЭК и её исполнение: что, где и как часто контролировать.',
  'plata-nvos':
    'Декларация о плате за негативное воздействие: расчёт и сопровождение подачи.',
  iei:
    'Полный цикл ИЭИ для проектирования: полевые работы, лабораторные исследования и технический отчёт по результатам изысканий.',
  ovos:
    'Материалы ОВОС для проектируемых объектов: честная оценка воздействия, альтернативы и общественные обсуждения.',
};

function cleanMetaValue(val) {
  return val
    .replace(/`/g, '')
    .replace(/\\\s*\|/g, ' |')
    .replace(/\\/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function parseMetaTable(section) {
  const meta = {};
  for (const line of section.split('\n')) {
    if (!line.startsWith('|') || line.includes('---')) continue;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2 || cells[0] === 'Поле') continue;
    const key = cells[0].toLowerCase();
    const val = cleanMetaValue(cells.slice(1).join(' | '));
    if (key === 'url') meta.url = val;
    else if (key === 'canonical') meta.canonical = val;
    else if (key === 'h1') meta.h1 = val;
    else if (key.startsWith('title')) meta.title = val;
    else if (key.startsWith('meta description')) meta.description = val;
    else if (key === 'parent hub') {
      const parts = val.split('→').map((s) => s.trim());
      meta.group = parts[0] ?? val;
      meta.parentHubUrl = parts[1]?.replace(/`/g, '') ?? '';
    } else if (key === 'inventory id') {
      meta.inventoryId = val.replace(/`/g, '');
    }
  }
  return meta;
}

function sectionBody(markdown, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`);
  const m = markdown.match(re);
  return m ? m[1].trim() : '';
}

// Разделы с текстом страницы (NIC-008). Раздел с меткой TODO(evidence не публикуется целиком.
function gatedSection(markdown, heading, slug) {
  // Разделитель «---» между разделами брифа в текст страницы не попадает.
  const body = sectionBody(markdown, heading).replace(/\n*[-_—]{3,}\s*$/, '').trim();
  if (!body) return '';
  if (body.includes('TODO(evidence')) {
    console.warn(`[build] «${slug}»: раздел «${heading}» содержит TODO(evidence — пропущен`);
    return '';
  }
  return body;
}

function parseLead(raw) {
  return raw
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('>') && !/^[-_—]{3,}$/.test(p));
}

/** FAQ: «### Вопрос?» и абзац ответа под ним. */
function parseFaq(raw) {
  const items = [];
  for (const block of raw.split(/\n(?=### )/)) {
    const m = block.trim().match(/^### (.+)\n([\s\S]+)$/);
    if (!m) continue;
    items.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return items;
}

function parseIntro(raw, slug) {
  if (NEUTRAL_INTRO[slug]) {
    return [NEUTRAL_INTRO[slug]];
  }
  const paragraphs = [];
  for (const block of raw.split('\n\n')) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith('>')) continue;
    if (trimmed.startsWith('- ')) break;
    // Markdown horizontal-rule separators (---, ___, ———) used by brief authors
    // to visually divide sections must not leak through as a literal "<p>---</p>".
    if (/^[-_—]{3,}$/.test(trimmed)) continue;
    paragraphs.push(trimmed);
  }
  return paragraphs;
}

/** Optional fact-checked blocks from the design (срок, кому, результат, почему мы). Gated text stays out. */
function parseOptionalText(raw) {
  const text = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('>') && !/^[-_—]{3,}$/.test(l))
    .join(' ')
    .trim();
  if (!text || /TODO\(evidence/i.test(text)) return null;
  return text;
}

function parseIncludes(raw) {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

function slugFromPath(href) {
  const m = href.match(/^\/uslugi\/([^/#]+)\/?$/);
  return m ? m[1] : null;
}

function isLinkableHref(href) {
  if (!href) return false;
  if (href.startsWith('https://analitik-lab.ru')) return true;
  const slug = slugFromPath(href);
  if (!slug) return false;
  if (WAVE1_SLUGS.includes(slug)) return true;
  if (WAVE2_SLUGS.has(slug)) return false;
  return false;
}

function parseRelated(raw) {
  const items = [];
  for (const line of raw.split('\n')) {
    if (!line.startsWith('|') || line.includes('---') || line.includes('Услуга')) {
      continue;
    }
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2) continue;
    let label = cells[0];
    let href = cells[1].replace(/\s*\(.*\)$/, '').trim();
    if (href.startsWith('`')) href = href.replace(/`/g, '');

    const external = href.startsWith('http');
    const linkable = isLinkableHref(href);

    items.push({
      label,
      href: linkable ? href : null,
      external: external && linkable,
      rawHref: href,
    });
  }
  return items;
}

function parseSchema(raw) {
  const m = raw.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try {
    const data = JSON.parse(m[1]);
    if (data['@graph']) {
      for (const node of data['@graph']) {
        if (
          typeof node.areaServed === 'string' &&
          node.areaServed.includes('TODO(evidence')
        ) {
          delete node.areaServed;
        }
      }
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * @param {string} slug
 * @param {string} seoGeoRoot absolute path to seo_geo repo
 */
export function parseBrief(slug, seoGeoRoot) {
  const path = join(seoGeoRoot, 'docs', 'briefs', 'nic', `uslugi-${slug}.md`);
  const markdown = readFileSync(path, 'utf8');
  const meta = parseMetaTable(sectionBody(markdown, 'Meta'));
  const lead = gatedSection(markdown, 'Лид', slug);
  const intro = lead ? parseLead(lead) : parseIntro(sectionBody(markdown, 'Интро'), slug);
  const copyBefore = gatedSection(markdown, 'Текст до работ', slug);
  const copyAfter = gatedSection(markdown, 'Текст после работ', slug);
  const faq = parseFaq(gatedSection(markdown, 'FAQ', slug));
  const includes = parseIncludes(sectionBody(markdown, 'Что входит в работу'));
  const related = parseRelated(sectionBody(markdown, 'Смежные услуги'));
  const schema = parseSchema(sectionBody(markdown, 'Schema-stub'));

  return {
    slug,
    ...meta,
    intro,
    copyBefore,
    copyAfter,
    faq,
    includes,
    related,
    schema,
    term: parseOptionalText(sectionBody(markdown, 'Срок')),
    who: parseOptionalText(sectionBody(markdown, 'Кому')),
    result: parseOptionalText(sectionBody(markdown, 'Результат')),
    whyUs: parseOptionalText(sectionBody(markdown, 'Почему мы')),
  };
}

export function loadWave1Briefs(seoGeoRoot) {
  // Брифы услуг лежат в соседнем репозитории seo_geo. Если его нет (например, в
  // CI без токена доступа) — не падаем, а пропускаем услуги с предупреждением:
  // главная и лаборатория соберутся в любом случае.
  const briefs = [];
  for (const slug of WAVE1_SLUGS) {
    try {
      briefs.push(parseBrief(slug, seoGeoRoot));
    } catch (err) {
      console.warn(`[build] пропущен бриф услуги «${slug}» (нет исходника в ${seoGeoRoot}): ${err.code || err.message}`);
    }
  }
  return briefs;
}
