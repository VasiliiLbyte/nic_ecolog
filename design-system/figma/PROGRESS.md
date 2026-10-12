# Прогресс: сайт по макету Figma (обновлено 2026-10-12)

Макет: https://www.figma.com/design/mMov36hdKHtm0ncyGM2KYm (только чтение, проект дизайнера).
Лимит Figma MCP (Starter/View): 20 вызовов/месяц — на октябрь исчерпан.

## Сделано (ветка `claude/gallant-newton-zvp4x6`, основана на `feat/nic-010-blog`)
- Главная заново по фрейму «Главная — Desktop 1440»: `site/index.html`, `site/services.json`,
  `assets/site/{chrome.css,site.css,site.js}`, шрифт Onest в `assets/fonts/`.
- Оверлей услуги по фрейму «Услуга — СЗЗ»; `/uslugi/*`, `/blog/*` — новый каркас
  (`scripts/lib/service-page-template.mjs`, `blog-template.mjs`); `lab.html` — новая шапка/подвал при сборке.
- QA зелёные: pages:qa-wave1, pages:qa-blog, mobile:audit.
- Выложено на devpreview.nic-ecolog.ru (workflow_dispatch deploy-devpreview.yml с этой ветки, run #14). Прод не трогали.
- Подробная спецификация макета: `spec.md` (тексты, размеры, цвета по секциям).

## Осталось
1. **Ассеты из Figma** (нужен доступ к `www.figma.com` в сети окружения). Ссылки — `assets.tsv`,
   действуют до ~2026-10-19, новых вызовов Figma MCP не требуют. Сейчас временно:
   фоны hero/лаборатории/ESG/подвала — CSS-градиенты (`.hero__bg`, `.lab__bg`, `.data__bg`, `.nf__bg`),
   3D-диаграмма охватов — SVG (`.donut`), логотипы клиентов — текст (`.logo-card__word`),
   иконки лаборатории — lucide в градиентных кругах. Заменить на оригиналы, сохранив размеры из `assets.tsv`.
2. **Мобильная версия**: сверить с фреймом «Главная — Mobile 390» (node 497:1237) после восстановления лимита Figma.
3. Решение пользователя: срок «4–8 месяцев» в оверлее СЗЗ (бриф seo_geo: «не публиковать без документа») — оставить/убрать.
4. Влить ветку в `feat/nic-010-blog`, иначе следующий push туда перезапишет devpreview старой версией.

## Как продолжить в новой сессии
- Склонировать `VasiliiLbyte/seo_geo` в `../seo_geo` (нужен для `/uslugi/*`).
- `BLOG_DRAFTS=1 npm run pages:build`, превью — `npx http-server docs`.
- Скачать ассеты: `cut -f1,3 design-system/figma/assets.tsv | grep -v '^#'` → curl в `assets/figma/`.
