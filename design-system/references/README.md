# References — кураторская библиотека лучших практик и инструментов

Отобранные внешние ресурсы (репозитории, порталы, инструменты, гайдлайны) для качественного
улучшения сайта НИЦ «Эколог» по **дизайну**, **мобильной адаптации**, **контенту**,
**доступности** и **производительности**.

Это **справочный слой**. Он дополняет, но не заменяет:
- `design-system/MASTER.md` — источник правды по бренду;
- `guidelines/*.html` — визуальные спеки (цвет, тип, тени, радиусы, мотивы);
- `tokens/*.css` — дизайн-токены;
- `.cursor/skills/ui-ux-pro-max/` — поисковый движок паттернов (`search.py`).

## Методология (важно)

Репозиторий работает по принципу **«берём приём/паттерн, а не generic-визуал»**
(см. `design-system/PROMAX-REFERENCE.md`). Любая внешняя рекомендация проходит фильтр бренда:

> Бренд всегда важнее универсального совета. Палитра (холодный петрол + мята), шрифты
> (Stölzl / Onest / JetBrains Mono), спокойный data-led тон на русском и «умная экология без
> greenwashing» — **не меняются** ради чужих гайдлайнов.

Поэтому в каждом файле у ресурса указано: **что это · почему лучший · как применить к НИЦ Эколог · ссылка**,
и — где нужно — **что из generic отвергаем**.

## Разделы

| Файл | О чём | Для чего |
|------|-------|----------|
| [design-and-css.md](design-and-css.md) | Основы дизайна + современный CSS (Refactoring UI, Laws of UX, Open Props, Utopia, Every Layout, Modern CSS) | Поднять планку дизайна |
| [mobile-responsive.md](mobile-responsive.md) | Мобайл и отзывчивость (web.dev, container queries, fluid, touch targets, safe-area, Mobbin) | Мобильная адаптация |
| [content-copy.md](content-copy.md) | Контент и копирайтинг (MarketingExamples, julian.com, NN/g, GOV.UK) | Качество текстов |
| [accessibility-performance.md](accessibility-performance.md) | Доступность и скорость (WCAG 2.2, A11y Project, Core Web Vitals) | Тех-качество, цели ТЗ |
| [inspiration-galleries.md](inspiration-galleries.md) | Галереи-референсы (Awwwards, Godly, Land-book, Mobbin) | Насмотренность, планка визуала |

## Готовые к применению инструменты (уже в репо)

- `tokens/fluid.css` — fluid type/space шкалы на `clamp()` (метод Utopia), откалибровано под бренд-рамп.
- `tokens/reset.css` — современный доступный CSS reset.
- `design-system/MOBILE-PLAYBOOK.md` — практики мобильной адаптации (следующий этап улучшения).

## Как пользоваться

1. Перед задачей по дизайну/мобайлу — открыть релевантный раздел, взять приём.
2. Свериться с `MASTER.md` и `guidelines/` — приём должен «звучать» по-брендовому.
3. Для конкретных паттернов/стека — дополнительно `search.py` из ui-ux-pro-max.
4. Итог проверить по `design-system/CHECKLIST.md`.
