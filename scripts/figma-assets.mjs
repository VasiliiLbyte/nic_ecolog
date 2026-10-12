// Выгрузка ассетов из локальной копии макета Figma (.fig) в assets/figma/.
//
//   npm run figma:assets -- <путь к файлу .fig>
//
// .fig — zip: canvas.fig (kiwi-бинарник с деревом слоёв) + images/ (оригиналы картинок по sha1).
// Векторы собираются в SVG из геометрии слоёв и прогоняются через svgo.config.mjs,
// картинки пережимаются ImageMagick (convert/magick) в WebP (как и остальные картинки сайта).
// Сам .fig в git не кладём — это исходник дизайнера.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { compileSchema, decodeBinarySchema } from 'kiwi-schema';
import { decompress as zstd } from 'fzstd';
import { optimize } from 'svgo';
import svgoConfig from '../svgo.config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'assets', 'figma');
const FRAME = 'Главная — Desktop 1440';

// Что выгружаем: путь по именам слоёв от фрейма FRAME («имя#N» — N-й одноимённый сосед, с 0).
const SVG_EXPORTS = [
  { path: ['Header', 'logo'], file: 'logo-ecolog.svg' },
  { path: ['Подвал', 'footer-content', 'footer-top', 'footer-brand', 'logo_Эколог_white 1'], file: 'logo-ecolog-white.svg' },
  { path: ['Клиенты', 'clients-content', 'clients-logos', 'client-card#0', 'logo-slot', 'client-logo'], file: 'client-lahta.svg' },
  { path: ['Клиенты', 'clients-content', 'clients-logos', 'client-card#1', 'logo-slot', 'client-logo'], file: 'client-port-spb.svg' },
  { path: ['Клиенты', 'clients-content', 'clients-logos', 'client-card#2', 'logo-slot', 'client-logo'], file: 'client-moek.svg' },
  { path: ['лаборатория', 'lab-layout', 'lab-grid', 'Card/Lab#0', 'Frame 6', 'icon', 'Vector'], file: 'lab-water.svg' },
  { path: ['лаборатория', 'lab-layout', 'lab-grid', 'Card/Lab#1', 'Frame 6', 'icon', 'Vector'], file: 'lab-air.svg' },
  { path: ['лаборатория', 'lab-layout', 'lab-grid', 'Card/Lab#2', 'Frame 6', 'icon', 'Vector'], file: 'lab-soil.svg' },
  { path: ['лаборатория', 'lab-layout', 'lab-grid', 'Card/Lab#3', 'Frame 6', 'icon', 'Vector'], file: 'lab-waste.svg' },
];

// width — ширина результата в px (≈ @2x от размера в макете).
const IMAGE_EXPORTS = [
  { path: ['hero-section', 'image 2'], file: 'hero-wave', width: 2400 },
  { path: ['данные', 'data-layout', 'data-visual', 'data-chart'], file: 'esg-donut', width: 960 },
  { path: ['Клиенты', 'clients-content', 'clients-logos', 'client-card#3', 'logo-slot', 'client-logo'], file: 'client-mariinsky', width: 160 },
];

const figPath = process.argv[2];
if (!figPath || !existsSync(figPath)) {
  console.error('Usage: npm run figma:assets -- <file.fig>');
  process.exit(1);
}
const IM = ['magick', 'convert'].find((bin) => {
  try { execFileSync(bin, ['-version'], { stdio: 'ignore' }); return true; } catch { return false; }
});
if (!IM) {
  console.error('ImageMagick (magick/convert) не найден — нужен для картинок.');
  process.exit(1);
}

// --- чтение .fig ---
const tmp = mkdtempSync(join(tmpdir(), 'fig-'));
execFileSync('unzip', ['-q', '-o', figPath, '-d', tmp]);
const canvas = readFileSync(join(tmp, 'canvas.fig'));
const chunks = [];
for (let o = 12; o < canvas.length;) {
  const n = canvas.readUInt32LE(o);
  chunks.push(canvas.subarray(o + 4, o + 4 + n));
  o += 4 + n;
}
const unpack = (c) => (c.readUInt32BE(0) === 0x28b52ffd ? Buffer.from(zstd(c)) : inflateRawSync(c));
const schema = compileSchema(decodeBinarySchema(unpack(chunks[0])));
const msg = schema.decodeMessage(unpack(chunks[1]));

const key = (g) => (g ? `${g.sessionID}:${g.localID}` : null);
const kids = new Map();
for (const n of msg.nodeChanges) {
  const p = key(n.parentIndex?.guid);
  if (!p) continue;
  if (!kids.has(p)) kids.set(p, []);
  kids.get(p).push(n);
}
for (const list of kids.values()) list.sort((a, b) => (a.parentIndex.position < b.parentIndex.position ? -1 : 1));
const childrenOf = (n) => (kids.get(key(n.guid)) || []).filter((c) => c.visible !== false);

function find(path) {
  let node = msg.nodeChanges.find((n) => n.name === FRAME && n.visible !== false);
  for (const step of path) {
    const [name, idx = '0'] = step.split('#');
    node = childrenOf(node).filter((c) => c.name === name)[Number(idx)];
    if (!node) throw new Error(`Слой не найден: ${path.join(' / ')} (шаг «${step}»)`);
  }
  return node;
}

// --- векторы → SVG ---
const num = (v) => +v.toFixed(2);
function pathData(blobIndex) {
  const d = Buffer.from(msg.blobs[blobIndex].bytes);
  const out = [];
  for (let i = 0; i < d.length;) {
    const cmd = d[i++];
    const read = (k) => Array.from({ length: k }, () => { const v = num(d.readFloatLE(i)); i += 4; return v; }).join(' ');
    if (cmd === 0) out.push('Z');
    else if (cmd === 1) out.push(`M${read(2)}`);
    else if (cmd === 2) out.push(`L${read(2)}`);
    else if (cmd === 3) out.push(`Q${read(4)}`);
    else if (cmd === 4) out.push(`C${read(6)}`);
    else break;
  }
  return out.join('');
}
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const mul = (a, b) => ({
  m00: a.m00 * b.m00 + a.m01 * b.m10, m01: a.m00 * b.m01 + a.m01 * b.m11, m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02,
  m10: a.m10 * b.m00 + a.m11 * b.m10, m11: a.m10 * b.m01 + a.m11 * b.m11, m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12,
});
const ID = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 };
const matrix = (t) => `matrix(${[t.m00, t.m10, t.m01, t.m11, t.m02, t.m12].map(num).join(' ')})`;

function toSvg(rootNode) {
  const defs = [];
  const body = [];
  let gradId = 0;
  const paintAttr = (paint, node) => {
    if (paint.type === 'SOLID') {
      const op = (paint.opacity ?? 1) * paint.color.a;
      return `fill="${hex(paint.color)}"${op < 1 ? ` fill-opacity="${num(op)}"` : ''}`;
    }
    if (paint.type === 'GRADIENT_LINEAR') {
      // paint.transform: нормированные координаты слоя → пространство градиента (0,.5)→(1,.5)
      const t = paint.transform;
      const det = t.m00 * t.m11 - t.m01 * t.m10;
      const inv = (x, y) => {
        const dx = x - t.m02, dy = y - t.m12;
        return [(t.m11 * dx - t.m01 * dy) / det, (-t.m10 * dx + t.m00 * dy) / det];
      };
      const [x1, y1] = inv(0, 0.5);
      const [x2, y2] = inv(1, 0.5);
      const id = `g${gradId++}`;
      const w = node.size.x, h = node.size.y;
      defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${num(x1 * w)}" y1="${num(y1 * h)}" x2="${num(x2 * w)}" y2="${num(y2 * h)}">` +
        paint.stops.map((s) => `<stop offset="${num(s.position)}" stop-color="${hex(s.color)}"${s.color.a < 1 ? ` stop-opacity="${num(s.color.a)}"` : ''}/>`).join('') +
        '</linearGradient>');
      return `fill="url(#${id})"`;
    }
    return 'fill="none"';
  };
  const walk = (node, parentTf, isRoot) => {
    const tf = isRoot ? ID : mul(parentTf, node.transform || ID);
    const fills = (node.fillPaints || []).filter((p) => p.visible !== false);
    const strokes = (node.strokePaints || []).filter((p) => p.visible !== false && p.type === 'SOLID');
    const op = node.opacity != null && node.opacity < 1 ? ` opacity="${num(node.opacity)}"` : '';
    const tfAttr = tf === ID ? '' : ` transform="${matrix(tf)}"`;
    for (const g of node.fillGeometry || []) {
      for (const p of fills.length ? fills : []) {
        body.push(`<path${tfAttr}${op} fill-rule="${g.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" d="${pathData(g.commandsBlob)}" ${paintAttr(p, node)}/>`);
      }
    }
    if (strokes.length) {
      for (const g of node.strokeGeometry || []) body.push(`<path${tfAttr}${op} d="${pathData(g.commandsBlob)}" ${paintAttr(strokes[0], node)}/>`);
    }
    for (const c of childrenOf(node)) walk(c, tf, false);
  };
  walk(rootNode, ID, true);
  const w = num(rootNode.size.x), h = num(rootNode.size.y);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">` +
    (defs.length ? `<defs>${defs.join('')}</defs>` : '') + body.join('') + '</svg>';
}

// --- картинки ---
function imageOf(node) {
  const paint = (node.fillPaints || []).find((p) => p.type === 'IMAGE' && p.image?.hash);
  if (!paint) throw new Error(`У слоя «${node.name}» нет картинки`);
  return join(tmp, 'images', Buffer.from(paint.image.hash).toString('hex'));
}

mkdirSync(OUT, { recursive: true });
for (const { path, file } of SVG_EXPORTS) {
  const svg = optimize(toSvg(find(path)), { ...svgoConfig, path: file }).data;
  writeFileSync(join(OUT, file), svg + '\n');
  console.log(`svg  ${file}  ${svg.length} B`);
}
for (const { path, file, width } of IMAGE_EXPORTS) {
  execFileSync(IM, [imageOf(find(path)), '-resize', `${width}x>`, '-strip', '-quality', '82', join(OUT, `${file}.webp`)]);
  console.log(`img  ${file}.webp`);
}
rmSync(tmp, { recursive: true, force: true });
console.log(`Готово → ${OUT}`);
