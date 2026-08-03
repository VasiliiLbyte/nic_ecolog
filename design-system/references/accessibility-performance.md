# Доступность и производительность

Тех-качество, напрямую связанное с целями ТЗ (PageSpeed Mobile ≥ 85 / Desktop ≥ 90, базовое SEO)
и с брендовым обещанием «надёжности».

---

## Доступность (a11y)

### WCAG 2.2 — Quick Reference (W3C / WAI)
- **Что:** официальный чек-лист критериев успеха (A/AA/AAA) с техниками.
- **Почему лучший:** первоисточник; в 2.2 добавлены target-size, focus-appearance, dragging.
- **Применить:** цель — **AA**. Контраст текста ≥ 4.5:1; видимый фокус (в v2 уже есть `:focus-visible`);
  таргеты ≥ 24px (лучше 44 — см. MOBILE-PLAYBOOK).
- **Ссылка:** https://www.w3.org/WAI/WCAG22/quickref/

### The A11y Project — Checklist
- **Что:** практичный, человеко-читаемый чек-лист доступности.
- **Почему лучший:** быстро прогнать страницу без чтения всего WCAG.
- **Применить:** пройти перед сдачей: alt у изображений, порядок заголовков, метки форм, контраст, клавиатура.
- **Ссылка:** https://www.a11yproject.com/checklist/

### Inclusive Components (Heydon Pickering)
- **Что:** разбор доступных паттернов (меню, табы, карточки, тултипы, модалки).
- **Почему лучший:** готовые доступные реализации интерактивов.
- **Применить:** свериться при доработке меню-оверлея, модалки услуги, формы (focus-trap, `aria-*`).
- **Ссылка:** https://inclusive-components.design/

### axe DevTools
- **Что:** движок/расширение автоматического аудита a11y.
- **Применить:** прогнать главную и лабораторию; чинить критичные нарушения.
- **Ссылка:** https://www.deque.com/axe/devtools/

---

## Производительность

### web.dev — Core Web Vitals + Lighthouse / PageSpeed Insights
- **Что:** метрики LCP / CLS / INP и инструменты замера (первоисточник Google).
- **Почему лучший:** ровно то, что оценивает mobile-first индексация и цель ТЗ по PageSpeed.
- **Применить:** бюджеты (см. MOBILE-PLAYBOOK): LCP < 2.5s, CLS < 0.1, INP < 200ms. Мерить mobile-эмуляцию.
- **Ссылки:** https://web.dev/articles/vitals · https://pagespeed.web.dev/

### Оптимизация изображений — Squoosh + SVGO
- **Что:** сжатие растра (Squoosh, форматы AVIF/WebP) и SVG (SVGO — уже есть `svgo.config.mjs` в репо).
- **Почему важно:** проектные фото портфеля — главный вес; изображения = частый LCP-элемент.
- **Применить:** проектные фото (`assets/projects/`) в WebP/AVIF с явными `width/height` (против CLS),
  `loading="lazy"` для внеэкранных, responsive `srcset`. Прогнать SVG через SVGO.
- **Ссылки:** https://squoosh.app/ · https://github.com/svg/svgo

### Шрифты
- **Что:** `font-display: swap`, `preload` ключевых начертаний, subset под кириллицу.
- **Применить:** Stölzl/Onest/JetBrains Mono — уже `swap`; добавить `preload` для hero-начертаний,
  проверить subsetting (в `assets/` .woff2).
- **Ссылка:** https://web.dev/articles/font-best-practices

---

## Быстрый прогон перед сдачей
1. Lighthouse (mobile) — Perf/A11y/Best-Practices/SEO.
2. axe DevTools — 0 критичных.
3. The A11y Project checklist — вручную.
4. Сверить с целями ТЗ и `design-system/CHECKLIST.md`.
