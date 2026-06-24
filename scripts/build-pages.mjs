import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');

const HOME_SRC = 'NIC Ecolog - Главная v2.dc.html';
const LAB_SRC = 'Ecolog-Lab.html';

function copyDir(src, dest) {
  cpSync(join(root, src), join(out, src), { recursive: true });
}

function patchHome(html) {
  return html.replaceAll('href="/privacy"', 'href="privacy.html"');
}

function patchLab(html) {
  return html
    .replaceAll('НИЦ Эколог - Сайт (вау).html', 'index.html')
    .replaceAll('#services', '#uslugi')
    .replaceAll('#about', '#o-centre')
    .replaceAll('#portfolio', '#proekty');
}

const privacyHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Политика конфиденциальности — НИЦ «Эколог»</title>
  <style>
    body{margin:0;font-family:var(--font-body, 'Onest', sans-serif);background:#F7FBF9;color:#13282B;padding:48px 24px}
    .wrap{max-width:720px;margin:0 auto}
    h1{font-weight:300;font-size:clamp(28px,4vw,40px);margin:0 0 16px}
    p{line-height:1.7;color:#51696B;margin:0 0 16px}
    a{color:#139EA1}
  </style>
</head>
<body>
  <div class="wrap">
    <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#139EA1;margin-bottom:24px">Демо-версия</p>
    <h1>Политика конфиденциальности</h1>
    <p>Это демонстрационная страница для превью сайта. Полный текст политики будет опубликован на production-домене.</p>
    <p><a href="index.html">← На главную</a></p>
  </div>
</body>
</html>
`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, 'index.html'), patchHome(readFileSync(join(root, HOME_SRC), 'utf8')));
writeFileSync(join(out, 'lab.html'), patchLab(readFileSync(join(root, LAB_SRC), 'utf8')));

for (const file of ['support.js', 'image-slot.js']) {
  cpSync(join(root, file), join(out, file));
}

copyDir('tokens', 'tokens');
copyDir('assets', 'assets');

writeFileSync(join(out, '.nojekyll'), '');
writeFileSync(join(out, 'privacy.html'), privacyHtml);

console.log('Built GitHub Pages artifact → docs/');
