// Выгрузка ассетов из локальной копии макета Figma (.fig) в assets/figma/.
//
//   npm run figma:assets -- <путь к файлу .fig>
//
// .fig — zip: canvas.fig (kiwi-бинарник с деревом слоёв) + images/ (оригиналы картинок по sha1).
// Векторы собираются в SVG из геометрии слоёв и прогоняются через svgo.config.mjs,
// картинки пережимаются ImageMagick (convert/magick) в WebP (как и остальные картинки сайта),
// размытые фоны секций (векторные пятна + blur) собираются в SVG и растеризуются Playwright'ом.
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
const FRAME_MOBILE = 'Главная — Mobile 390';

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
  { path: ['Клиенты', 'clients-content', 'clients-logos', 'client-card#3', 'logo-slot', 'client-logo'], file: 'client-mariinsky', width: 160 },
];

// Фоны секций: фрейм целиком (заливка + размытые пятна), обрезанный по своим границам.
const BG_EXPORTS = [
  { path: ['лаборатория', 'lab-background'], file: 'bg-lab' },
  { path: ['лаборатория', 'lab-background'], frame: FRAME_MOBILE, file: 'bg-lab-mobile' },
  { path: ['данные', 'data-background'], file: 'bg-data' },
  { path: ['данные', 'data-background'], frame: FRAME_MOBILE, file: 'bg-data-mobile' },
  { path: ['hero-section'], frame: FRAME_MOBILE, file: 'bg-hero-mobile', skip: ['Hero'] },
];

// 3D-диаграмма ESG режется на три слоя (охват 3 / 2 / 1), чтобы на сайте анимировать сегменты
// по отдельности, сохранив исходную картинку пиксель в пиксель (каждый пиксель — ровно в одном слое).
// Сегменты определяются по тону (синий / бирюзовый / зелёный), блики отдаются ближайшему сегменту.
// Зелёный сегмент вместе с его тёмным срезом задан многоугольником по швам картинки
// (координаты при ширине 1038 px); по тону срез неотличим от бирюзового.
const DONUT = { path: ['данные', 'data-layout', 'data-visual', 'data-chart'], width: 960, mapScale: 4 };
const DONUT_GREEN_POLY = [[102, 218], [148, 290], [318, 385], [392, 440], [380, 470], [370, 514], [58, 524], [6, 436], [0, 400], [0, 330], [40, 290], [70, 255]];

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

function find(path, frame = FRAME) {
  let node = msg.nodeChanges.find((n) => n.name === frame && n.visible !== false);
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

function toSvg(rootNode, { clip = false, skip = [] } = {}) {
  const defs = [];
  const body = [];
  let gradId = 0;
  let blurId = 0;
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
    // Размытие слоя (Figma «Layer/Foreground blur»): stdDeviation ≈ radius / 2
    const blur = (node.effects || []).find((e) => e.visible !== false && (e.type === 'FOREGROUND_BLUR' || e.type === 'LAYER_BLUR'));
    if (blur) {
      const id = `b${blurId++}`;
      defs.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${num(blur.radius / 2)}"/></filter>`);
      body.push(`<g filter="url(#${id})">`);
    }
    // Заливка фрейма/прямоугольника без готовой геометрии — прямоугольник по размеру слоя
    const geometry = node.fillGeometry?.length ? node.fillGeometry
      : (fills.length && node.type === 'FRAME' ? [{ rect: true }] : []);
    for (const g of geometry) {
      for (const p of fills) {
        const d = g.rect ? `M0 0H${num(node.size.x)}V${num(node.size.y)}H0Z` : pathData(g.commandsBlob);
        body.push(`<path${tfAttr}${op} fill-rule="${g.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}" d="${d}" ${paintAttr(p, node)}/>`);
      }
    }
    if (strokes.length) {
      for (const g of node.strokeGeometry || []) body.push(`<path${tfAttr}${op} d="${pathData(g.commandsBlob)}" ${paintAttr(strokes[0], node)}/>`);
    }
    for (const c of childrenOf(node)) if (!skip.includes(c.name)) walk(c, tf, false);
    if (blur) body.push('</g>');
  };
  walk(rootNode, ID, true);
  const w = num(rootNode.size.x), h = num(rootNode.size.y);
  if (clip) {
    defs.push(`<clipPath id="clip"><rect width="${w}" height="${h}"/></clipPath>`);
    body.unshift('<g clip-path="url(#clip)">');
    body.push('</g>');
  }
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
if (BG_EXPORTS.length) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const { path, frame, file, skip } of BG_EXPORTS) {
    const node = find(path, frame);
    const [w, h] = [Math.round(node.size.x), Math.round(node.size.y)];
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<body style="margin:0;background:#FFFFFF">${toSvg(node, { clip: true, skip })}</body>`);
    const png = join(tmp, `${file}.png`);
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: w, height: h } });
    execFileSync(IM, [png, '-strip', '-quality', '80', join(OUT, `${file}.webp`)]);
    console.log(`bg   ${file}.webp  ${w}x${h}`);
  }
  await page.setContent('<body></body>');
  const donut = await page.evaluate(async ({ b64, W, poly, mapScale }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const H = Math.round((img.height * W) / img.width);
    const cv = Object.assign(document.createElement('canvas'), { width: W, height: H });
    const cx = cv.getContext('2d');
    cx.imageSmoothingQuality = 'high';
    cx.drawImage(img, 0, 0, W, H);
    const px = cx.getImageData(0, 0, W, H).data;
    const N = W * H;
    const opaque = new Uint8Array(N);
    let L = new Uint8Array(N); // 1 — охват 3 (синий), 2 — охват 2 (бирюзовый), 3 — охват 1 (зелёный)
    for (let i = 0; i < N; i++) {
      const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], a = px[i * 4 + 3];
      if (a <= 8) continue;
      opaque[i] = 1;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (!max || (max - min) / max <= 0.22) continue;
      const dl = max - min;
      let h = max === r ? ((g - b) / dl) % 6 : max === g ? (b - r) / dl + 2 : (r - g) / dl + 4;
      h = (h * 60 + 360) % 360;
      L[i] = h >= 195 && h < 250 ? 1 : h >= 140 && h < 195 ? 2 : h >= 45 && h < 125 ? 3 : 0;
    }
    // сглаживание: метка большинства в окне 9×9 (через суммы по прямоугольникам)
    const R = 4, W1 = W + 1;
    const integ = [1, 2, 3].map((k) => {
      const I = new Int32Array(W1 * (H + 1));
      for (let y = 0; y < H; y++) {
        let row = 0;
        for (let x = 0; x < W; x++) {
          row += L[y * W + x] === k ? 1 : 0;
          I[(y + 1) * W1 + x + 1] = I[y * W1 + x + 1] + row;
        }
      }
      return I;
    });
    const sm = new Uint8Array(N);
    for (let y = 0; y < H; y++) {
      const y0 = Math.max(0, y - R), y1 = Math.min(H, y + R + 1);
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!opaque[i]) continue;
        const x0 = Math.max(0, x - R), x1 = Math.min(W, x + R + 1);
        let best = 0, bestN = 0;
        integ.forEach((I, j) => {
          const n = I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0];
          if (n > bestN) { bestN = n; best = j + 1; }
        });
        sm[i] = best;
      }
    }
    L = sm;
    const fill = () => {
      for (let pass = 0; pass < 400; pass++) {
        const next = L.slice();
        let left = 0;
        for (let i = 0; i < N; i++) {
          if (!opaque[i] || L[i]) continue;
          const x = i % W;
          const n = (x > 0 && L[i - 1]) || (x < W - 1 && L[i + 1]) || (i >= W && L[i - W]) || (i + W < N && L[i + W]);
          if (n) next[i] = n; else left++;
        }
        L = next;
        if (!left) break;
      }
    };
    fill();
    // зелёный сегмент со срезом — многоугольник по швам
    const pc = Object.assign(document.createElement('canvas'), { width: W, height: H });
    const px2 = pc.getContext('2d');
    const k = W / 1038;
    px2.beginPath();
    poly.forEach(([x, y], j) => (j ? px2.lineTo(x * k, y * k) : px2.moveTo(x * k, y * k)));
    px2.closePath();
    px2.fill();
    const inPoly = px2.getImageData(0, 0, W, H).data;
    for (let i = 0; i < N; i++) {
      const inside = inPoly[i * 4 + 3] > 127;
      if (inside && L[i] === 2) L[i] = 3;
      else if (!inside && L[i] === 3) L[i] = 0;
    }
    fill();
    const layers = [1, 2, 3].map((seg) => {
      const out = cx.createImageData(W, H);
      for (let i = 0; i < N; i++) if (L[i] === seg) for (let c = 0; c < 4; c++) out.data[i * 4 + c] = px[i * 4 + c];
      const lc = Object.assign(document.createElement('canvas'), { width: W, height: H });
      lc.getContext('2d').putImageData(out, 0, 0);
      return lc.toDataURL('image/png');
    });
    // карта сегментов для попадания курсором: красный канал = номер сегмента × 80
    const mw = Math.round(W / mapScale), mh = Math.round(H / mapScale);
    const mc = Object.assign(document.createElement('canvas'), { width: mw, height: mh });
    const mx = mc.getContext('2d');
    const md = mx.createImageData(mw, mh);
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      const v = L[Math.min(H - 1, y * mapScale + 2) * W + Math.min(W - 1, x * mapScale + 2)];
      const o = (y * mw + x) * 4;
      md.data[o] = v * 80; md.data[o + 3] = 255;
    }
    mx.putImageData(md, 0, 0);
    const share = [1, 2, 3].map((seg) => L.reduce((s, v) => s + (v === seg), 0));
    return { layers, map: mc.toDataURL('image/png'), W, H, share };
  }, { b64: readFileSync(imageOf(find(DONUT.path))).toString('base64'), W: DONUT.width, poly: DONUT_GREEN_POLY, mapScale: DONUT.mapScale });
  const toFile = (dataUrl, file) => writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
  ['scope3', 'scope2', 'scope1'].forEach((name, j) => {
    const png = join(tmp, `donut-${name}.png`);
    toFile(donut.layers[j], png);
    execFileSync(IM, [png, '-strip', '-quality', '86', '-define', 'webp:alpha-quality=100', join(OUT, `esg-donut-${name}.webp`)]);
  });
  toFile(donut.map, join(OUT, 'esg-donut-map.png'));
  const total = donut.share.reduce((a, b) => a + b, 0);
  console.log(`esg  esg-donut-scope3/2/1.webp + esg-donut-map.png  ${donut.W}x${donut.H}, доли пикселей ${donut.share.map((v) => Math.round((v / total) * 100)).join('/')}%`);
  await browser.close();
}
rmSync(tmp, { recursive: true, force: true });
console.log(`Готово → ${OUT}`);
