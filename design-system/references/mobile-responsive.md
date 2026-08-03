# Мобайл и отзывчивость

Ресурсы и правила для **мобильной адаптации**. Практический свод — в
`design-system/MOBILE-PLAYBOOK.md`; текущее состояние — в `design-system/pages/mobile.md`.

---

## Базовые гайдлайны

### web.dev — «Learn Responsive Design» + «Responsive» collection (Google)
- **Что:** современный курс/справочник по отзывчивости (mobile-first, media/container queries, fluid, изображения).
- **Почему лучший:** первоисточник, синхронен с Chrome/Core Web Vitals.
- **Применить:** mobile-first как метод (стили от малого экрана вверх через `min-width`); переход
  части сеток на container queries. У нас сейчас — `max-width`-каскад в `.dc.html` + `tokens/responsive.css`.
- **Ссылка:** https://web.dev/learn/design/

### MDN — Responsive design / Media & Container queries
- **Что:** справочная документация без маркетинга.
- **Почему лучший:** точная семантика свойств и поддержки.
- **Применить:** сверять синтаксис при рефакторе (например, `@container`, `dvh`, `env()`).
- **Ссылка:** https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries

---

## Ключевые приёмы (свести в MOBILE-PLAYBOOK)

### Container Queries — адаптация по контейнеру, а не по вьюпорту
- **Что:** `@container` реагирует на ширину родителя, а не экрана.
- **Почему важно:** карточка ведёт себя правильно в любой раскладке (сетка, сайдбар) — без завязки на брейкпоинты.
- **Применить:** карточки услуг/преимуществ/лицензий → перевести на `@container` вместо `data-cols4`.
- **Ссылка:** https://web.dev/articles/cq-stable

### Fluid type & space (Utopia)
- **Что:** плавные `clamp()`-шкалы.
- **Применить:** `tokens/fluid.css` уже в репо — убрать ступеньки заголовков между 720/1060.
- **Ссылка:** https://utopia.fyi/

### Touch targets — WCAG 2.5.8 / 2.5.5
- **Что:** минимум **24×24 CSS-px** (AA, WCAG 2.2), рекомендуемо **44×44** (Apple HIG / WCAG AAA).
- **Правила:** зазор ≥ **8px** между интерактивными элементами; отступ ≥ **16px** от края экрана (notch/скругления).
- **Применить:** проверить все ссылки/кнопки/поля на мобайле (меню-оверлей уже 44px min-height).
- **Ссылки:** https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

### Safe-area insets — вырезы и home-indicator
- **Что:** `env(safe-area-inset-*)` + `viewport-fit=cover`.
- **Применить:** отступы фикс-шапки и будущего sticky-CTA учитывают вырез/индикатор.
- **Ссылка:** https://webkit.org/blog/7929/designing-websites-for-iphone-x/

### `(hover: none)` и `dvh`
- **Что:** фолбэки для тач-устройств (нет hover) и корректная высота с адресной строкой.
- **Применить:** у карточек услуг раскрытие описания на тач уже есть (`@media (hover:none)`); распространить
  принцип на новые интерактивы. Высоты hero — через `dvh`/`svh`.
- **Ссылка:** https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover

---

## Галерея мобильных паттернов

### Mobbin
- **Что:** крупнейшая база реальных мобильных экранов и потоков (навигация, формы, онбординг).
- **Почему лучший:** насмотренность по конкретным мобильным решениям, а не по «десктопным красивостям».
- **Применить:** искать паттерны sticky-CTA, компактной шапки, мобильных форм — фильтровать под спокойный
  премиум-тон бренда.
- **Ссылка:** https://mobbin.com/

---

## Тест-матрица (как в CHECKLIST)
375 / 768 / 1024 / 1440 · `npm run mobile:audit` (Playwright) · скриншоты `screenshots/mobile-audit/`.
