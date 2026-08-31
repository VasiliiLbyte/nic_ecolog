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

function parseIntro(raw, slug) {
  if (NEUTRAL_INTRO[slug]) {
    return [NEUTRAL_INTRO[slug]];
  }
  const paragraphs = [];
  for (const block of raw.split('\n\n')) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith('>')) continue;
    if (trimmed.startsWith('- ')) break;
    paragraphs.push(trimmed);
  }
  return paragraphs;
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
  const intro = parseIntro(sectionBody(markdown, 'Интро'), slug);
  const includes = parseIncludes(sectionBody(markdown, 'Что входит в работу'));
  const related = parseRelated(sectionBody(markdown, 'Смежные услуги'));
  const schema = parseSchema(sectionBody(markdown, 'Schema-stub'));

  return {
    slug,
    ...meta,
    intro,
    includes,
    related,
    schema,
  };
}

export function loadWave1Briefs(seoGeoRoot) {
  return WAVE1_SLUGS.map((slug) => parseBrief(slug, seoGeoRoot));
}
