# Page override — Mobile responsive

> Applies to homepage (`NIC Ecolog - Главная v2.dc.html` → `index.html`) and lab (`Ecolog-Lab.html` → `lab.html`).

---

## Test viewports (CHECKLIST)

| Width | Device class | Must pass |
|-------|--------------|-----------|
| **375** | Phone | No horizontal scroll; compact header |
| **768** | Tablet portrait | 2-col grids where defined |
| **1024** | Tablet landscape / small laptop | Nav burger, no rail |
| **1440** | Desktop reference | Full nav + rail |

Automated check: `npm run mobile:audit` (Playwright, viewports 375 / 768 / 1024).

---

## Breakpoints (unified)

| Breakpoint | Behaviour |
|------------|-----------|
| **≤1060px** | Hide desktop nav and right rail; show burger; 2-column grids (services, footer, stats on lab) |
| **≤720px** | `--section-pad-x: 24px`; 1-column layouts; hide header CTA («Заказать…» / «Запросить КП»); full-width hero CTAs |
| **≤480px** (home footer) | Footer columns → 1 |
| **≤560px** (lab footer) | Footer columns → 1 |
| **≤400px** (lab) | Shorter brand subtitle letter-spacing |

Tokens: `tokens/responsive.css` (imports `spacing.css`, switches `--section-pad-x` at 720px).

---

## Header (mobile)

- Visible: logo + burger only
- Hidden at ≤720px: `data-head-cta` (home), `.hdr .mini` (lab)
- Burger: `aria-expanded`, `aria-controls`; menu open → `body { overflow: hidden }`
- Touch targets in overlay menu: min-height **44px**, padding ≥ **12px**

---

## Hero

### Homepage `#top`

- `padding-top`: ~**120px** (fixed header + safe area)
- H1: `clamp(32px, 9vw, 44px)`
- Meta line `[data-hero-meta]`: 11px, relaxed line-height
- CTA row `[data-cta-row]`: column stack, links `width: 100%`

### Lab `#lab` / homepage `#laboratoriya`

- `padding-top`: ~**100–116px** at ≤720px (fixed header + safe area)
- H1: `clamp(29px, 8vw, 42px)` on ≤720px
- Capability grid: **2 колонки**, на ≤560 → **1 колонка** (v0)
- Process chips: вертикальный степпер с шевронами (не поворот стрелок)
- CTA: pill-кнопки на мобиле (ghost + filled)
- `.lab-chips` / меню: скролл на низких экранах (`max-height:720`)

---

## Sections

- Vertical padding at ≤720px: **80px** (was 120–130px inline)
- Services grid (lab `.srv-grid`): **3 → 2 → 1** columns at default / 1060 / 720
- Lab capability cards: 2-col → 1-col at ≤560
- Footer grid: **4 → 2 → 1** (home: 1060 / 720+480; lab: 1060 / 560)

---

## Touch and cards

- Service cards `[data-svc]`: on `(hover: none)` show excerpt in `[data-desc]` (always visible, capped height)
- Lab mobile menu: `body.menu-open` scroll lock (existing)

---

## Anchors

- Single `id="kontakty"` on footer; form block uses `id="kontakty-info"` (no duplicate anchors)

---

## Regression

```bash
npm run pages:build
npm run mobile:audit
```

Audit checks:
1. `documentElement.scrollWidth` vs viewport (classic overflow)
2. **Visual clip** — content `getBoundingClientRect().right` past viewport inside key sections (catches `overflow: hidden` / `overflow-x: clip` cases)

Screenshots: `screenshots/mobile-audit/`. CI: `.github/workflows/mobile-audit.yml`.