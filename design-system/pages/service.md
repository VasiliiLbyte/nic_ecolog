# Page override — Service (detail)

> Applies to service cards on homepage and full-screen service overlay `#eco-svc-page`.

**Data source:** `services` object in v2 DCLogic script (22 services, 4 groups)

---

## Service groups

1. **Проектирование и документация** — НДВ, НДС, ПНООЛР, СЗЗ, КЭР, ОВОС, ПЭК, ПМООС, ДВОС
2. **Сопровождение предприятий** — Аутсорсинг, 2-ТП, Учёт НВОС, Плата НВОС
3. **Изыскания и исследования** — ИЭИ, Лаборатория, Измерения
4. **ESG и устойчивое развитие** — Углеродный след, ESG-отчётность, Климатические риски

---

## Service card (`[data-svc]`)

- `tabindex="0"` for keyboard access
- `cursor: pointer` on card
- Gradient dot badge (10px) + abbr title (`data-svc-id`)
- Hover: border teal, lift -4px, shadow; description `[data-desc]` expands on hover/focus-within
- Click opens overlay via delegated click on `[data-svc-id]`

---

## Service overlay (`#eco-svc-page`)

Fixed full-viewport modal, z-index 170, `overscroll-behavior: contain`.

| Block | Content |
|-------|---------|
| Breadcrumb | `{{ svcGroup }}` / `{{ svcCrumb }}` |
| Title | `{{ svcName }}` |
| Lead | `{{ svcLead }}` |
| Facts | СРОК: `{{ svcTerm }}` · КОМУ: `{{ svcWho }}` |
| Result card | `{{ svcResult }}` |
| Includes | Numbered list `{{ svcIncludes }}` (01, 02, …) |
| Related | `{{ svcRelated }}` — opens sibling service |
| CTA | Close + «Оставить заявку» → scroll to `#zayavka` |

**Behavior:**
- `openService(id)` sets `body overflow: hidden`, scrolls overlay top
- `closeService()` on Escape or close button
- `goForm()` closes modal then scrolls to form

**Static reference:** `ui_kits/website/service.html` (СЗЗ example)

---

## Copy rules per service

Each entry must include:
- `lead` — outcome-led paragraph
- `term`, `who`, `result`
- `includes[]` — 4–5 concrete bullets
- `related[]` — 2–3 service ids

Highlight lab «Аналитик Лаб» where measurements are in-house (НДС, СЗЗ, ПЭК, ИЭИ, lab).

---

## Production note

For Next.js: extract `services` to `data/services.ts` or CMS; keep ids stable (`ndv`, `szz`, etc.) for URLs.
