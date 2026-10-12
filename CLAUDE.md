# НИЦ «Эколог» — сайт nic-ecolog.ru

Статический сайт плюс PHP-обработчик формы (`api/send.php`). Сборка: `npm run pages:build` → `docs/` (чистый Node, без зависимостей; `docs/` в .gitignore). Превью: `npm run pages:preview`. QA: `pages:qa-wave1`, `pages:qa-blog`, `mobile:audit` (Playwright).

## Окружения и деплой
- **devpreview.nic-ecolog.ru** — `.github/workflows/deploy-devpreview.yml`: при push в `feat/nic-004-build` или `feat/nic-010-blog` (или вручную: `gh workflow run deploy-devpreview.yml --ref <ветка>`) собирает noindex-бандл без Метрики и заливает по FTPS. Черновики блога (`BLOG_DRAFTS=1`) видны только тут.
- **Прод nic-ecolog.ru** — reg.ru shared hosting, `u3337857@server40.hosting.reg.ru`, докрут `~/www/nic-ecolog.ru/`. Деплой — `.github/workflows/deploy-prod.yml` (только ручной запуск, `gh workflow run deploy-prod.yml --ref <ветка>`), локально — тем же rsync с ключом `~/.ssh/nic_ecolog_regru`.
  - Каждый деплой прода — **только после явного «да» пользователя**.
  - rsync **без `--delete`**; исключать `api/config.php` (SMTP-секреты есть только на сервере), `CNAME`, `.nojekyll`.
  - Перед деплоем — tar-бэкап докрута в `~/backups/` на сервере.
  - После — проверить: страницы совпадают с `docs/`, Метрика на месте, нет noindex, пустой POST на `/api/send.php` → 422.
  - Никогда не заливать devpreview-бандл на прод. Никогда не трогать `muru.online` на том же аккаунте. Только ключ, не пароль (за неудачные логины банят IP).
- `deploy-pages.yml` (GitHub Pages) на живой сайт **не влияет**.

## SEO и контент
- SEO-план, брифы и правила — в соседнем репозитории `VasiliiLbyte/seo_geo` (начать с `nic-ecolog/00_START.md` и `nic-ecolog/nic_ecolog_seo_memory.md`). Сборка `/uslugi/*` требует его: `SEO_GEO_ROOT=<путь> npm run pages:build` (локально по умолчанию `../seo_geo`). В облачной сессии его нужно склонировать отдельно; без него страницы услуг молча пропускаются.
- Жёсткое правило: никаких утверждений об аккредитации, лицензиях, методиках, нормативах, сроках, штрафах, кейсах, клиентах, географии без записи в реестре доказательств и факт-чека эксперта.
- SEO-изменения живого сайта (robots, canonical, sitemap, редиректы, аналитика) — только по утверждённому task packet.

## Решения, которые не пересматривать
- Кнопки — прямоугольные, плоские `#1C6BA2`, radius 4px. Не pill/градиент, даже если в `Сайт-2/Сайт.pdf` иначе.
- 7 SEO-страниц `/uslugi/<slug>/` намеренно **не связаны** с главной (на главной карточки услуг открывают оверлей). Не «чинить» без запроса.
- Страницы `uslugi/*` имеют полный nav/футер как главная (`scripts/lib/service-page-template.mjs`).
- Тёмный футер — `#06141C` (`--navy`).
- Если на devpreview пропали страницы услуг — проверить секрет `SEO_GEO_TOKEN`.

## Что есть только локально (не в git)
`backup/`, `Сайт-2/` (макеты дизайнера), `_docs_myedits_20260901/`, `api/config.php`.
