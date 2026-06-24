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

### Lab `#lab`

- `padding-top`: ~**100px** at ≤720px
- `.lab-cta-row`: column stack (no inline `margin-left` on second link)
- `.lab-chips`: `max-width: 100%`, `flex-wrap`

---

## Sections

- Vertical padding at ≤720px: **80px** (was 120–130px inline)
- Services grid (lab): **3 → 2 → 1** columns at default / 1060 / 720
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

Screenshots: `screenshots/mobile-audit/`. CI: `.github/workflows/mobile-audit.yml`.
