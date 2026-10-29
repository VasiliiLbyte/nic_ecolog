// make-devpreview.mjs — превращает собранный docs/ в приватный превью-бандл.
// Убирает индексацию (noindex + robots Disallow + X-Robots-Tag), вырезает
// Яндекс.Метрику (чтобы превью-трафик не попадал в боевой счётчик) и удаляет
// прод-артефакты GitHub Pages (CNAME, sitemap, verification). Источник — docs/,
// результат — в каталог из первого аргумента (по умолчанию devpreview_dist/).
//
// Использование:  node scripts/make-devpreview.mjs [outDir] [srcDir]
import { cpSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const OUT = join(root, process.argv[2] || 'devpreview_dist');
const SRC = join(root, process.argv[3] || 'docs');

if (!existsSync(SRC)) {
  console.error(`[devpreview] нет каталога сборки: ${SRC} — сначала выполните "npm run pages:build"`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });

// прод-артефакты, ненужные/вредные на превью
for (const f of ['CNAME', '.nojekyll', 'sitemap.xml']) rmSync(join(OUT, f), { force: true });
for (const f of readdirSync(OUT)) {
  if (/^yandex_.*\.html$/.test(f)) rmSync(join(OUT, f), { force: true });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) transform(p);
  }
}
function transform(p) {
  let html = readFileSync(p, 'utf8');
  // 1) вырезать блок Яндекс.Метрики
  html = html.replace(/<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->\s*/g, '');
  // 2) noindex: заменить существующий robots-мета, иначе вставить после <head>
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, nofollow">');
  } else {
    html = html.replace(/<head[^>]*>/i, (m) => `${m}\n<meta name="robots" content="noindex, nofollow">`);
  }
  writeFileSync(p, html);
}
walk(OUT);

writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
writeFileSync(
  join(OUT, '.htaccess'),
  `# devpreview.nic-ecolog.ru — приватный стенд для обсуждения дизайна
<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow, noarchive"
</IfModule>
DirectoryIndex index.html
Options -Indexes
`,
);

console.log(`[devpreview] бандл готов → ${OUT}`);
