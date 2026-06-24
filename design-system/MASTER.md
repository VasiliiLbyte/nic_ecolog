# НИЦ «Эколог» — Design System MASTER

> **Global source of truth** for all UI work in this repository.
> Page-specific overrides live in `design-system/pages/<page>.md` and take precedence for that page only.

## Rule hierarchy

1. `design-system/MASTER.md` (this file)
2. `design-system/pages/<page>.md` (if building a specific page)
3. `readme.md` + `tokens/` + `styles.css`
4. `NIC Ecolog - Главная v2.dc.html` — interactive reference implementation
5. UI UX Pro Max (`.cursor/skills/ui-ux-pro-max/`) — UX patterns, a11y, anti-patterns, stack guides only. **Never overrides brand colors, fonts, or tone without explicit request.**

---

## Product

**Независимый исследовательский центр «Эколог»** (nic-ecolog.ru) — environmental engineering, consulting and accredited laboratory in Saint Petersburg.

**Positioning:** premium, precise, scientific. Visuals signal competence, not decoration.

**Differentiators (lead every page):**
- Own accredited lab **«Аналитик Лаб»**
- Marquee portfolio: Лахта Центр, Большой порт СПб, МОЭК, Мариинский театр

**UX pattern (from industry reasoning — pattern only, not visual):**
- Trust & Authority + Social Proof
- Conversion via data and credentials, not hype
- CTA repeated: hero → mid-page → form

**Visual style keywords:** Gradient Mesh, Swiss precision, Accessible & Ethical, near-iconless data-led UI.

---

## Content & voice

| Rule | Detail |
|------|--------|
| Language | Russian, Cyrillic everywhere |
| Voice | Direct, exact, peer-to-peer B2B (chief engineers, plant ecologists, developers). «мы»/«вы», never hype |
| Tagline spirit | *«Говорим прямо, считаем точно, показываем реальную картину.»* |
| Headlines | Short, declarative; 1–2 words gradient-highlighted |
| Eyebrows | Mono, uppercase, wide-tracked (`НЕЗАВИСИМЫЙ ИССЛЕДОВАТЕЛЬСКИЙ ЦЕНТР · САНКТ-ПЕТЕРБУРГ`) |
| Micro-slogans | Mono; RU preferred on v2 marquee: `ЭКОЛОГИЯ — ЭТО ДАННЫЕ`, `НЕТ ДАННЫХ — НЕТ РЕШЕНИЯ`, `НАУКА ДЛЯ ПРИРОДЫ` |
| Services | Each states **СРОК / КОМУ / ЧТО ВХОДИТ / РЕЗУЛЬТАТ** |
| Numbers | Real and load-bearing (14 лет, 500+ проектов) — never decorative |
| Emoji | **Never** |

---

## Colors

**Always use CSS custom properties from `tokens/colors.css`.** Do not hardcode hex in new code unless matching an existing inline pattern in v2.

| Token | Role |
|-------|------|
| `--bg` | Page light background (`#F7FBF9`) |
| `--ink` | Primary heading ink (`#13282B`) |
| `--teal` / `--teal-deep` | Primary accent / petrol text |
| `--lime` → `--green` → `--teal` → `--ocean` → `--blue-deep` | Brand mesh ramp |
| `--line` | Petrol-tinted hairlines — never pure black |
| `--grad-brand` | Primary buttons |
| `--grad-text` | Gradient highlight words on light |
| `--grad-lab` / `--grad-esg` | Dark section backgrounds |
| `--surface-lab` | Lab section base (`#0A3D42`) |

Neutrals are **cool slate**, never warm gray.

---

## Typography

| Role | Font | Weights |
|------|------|---------|
| Display (h1–h4) | Stölzl (`--font-display`) | 300 light heroes, 400–600 accents |
| Body | Onest (`--font-body`) | 400/500 |
| Labels / data | JetBrains Mono (`--font-mono`) | 400/500, uppercase eyebrows |

Scale: `--fs-hero`, `--fs-h2`, `--fs-lead`, `--fs-label` from `tokens/typography.css`.

---

## Layout & spacing

From `tokens/spacing.css`:
- Section padding: `--section-pad-y` (120px), `--section-pad-y-lg` (140px)
- Gutters: `--section-pad-x` (48px desktop), `--section-pad-x-sm` (24px mobile)
- Container: `--container` (1240px)
- 8pt base grid

---

## Components & surfaces

- **Cards:** white, radius `--r-md` (20px) services / `--r-xl` (28px) projects, `--border`, `--shadow-card` on hover
- **Buttons:** pill `--r-pill`, `--grad-brand`, `--shadow-btn`
- **Header:** transparent over hero → glass (`--blur-glass`) + hairline on scroll
- **Section rail:** ghost ticks at right edge, no capsule — labels on hover only; see `components/navigation/rail.card.html`
- **Dark sections:** max 1–2 per page (lab, ESG, footer)
- **Motifs (sparingly):** isolines, blueprint grid, ESG donut — never dominate
- **Imagery placeholders:** `--placeholder` diagonal mint stripe until real photos
- **Brand mark:** `assets/fingerprint-color.png` / `fingerprint-white.png` only true symbol

---

## Iconography

Near-iconless by design. Allowed:
- Gradient dot-badges (lime→teal) on service rows
- Thin 1.8px stroke icons (burger, close, arrow `→`) in petrol
- **Lab capability cards only:** gradient squircle 48×48 + white Lucide stroke 1.8px — source files in `assets/icons/lab/` (`droplet`, `wind`, `mountain`, `trash-2`); optimize with `npm run icons:optimize`
- Lucide or similar thin-stroke set at 1.8px in petrol elsewhere if needed — flag it

---

## Motion

| Property | Value |
|----------|-------|
| Easing | `--ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)` |
| Reveal | fade + 30px rise, ~0.9s, staggered 80ms per item |
| Hover | 150–300ms transitions on cards and buttons |
| Reduced motion | **Required** — disable blobs, marquee, counters, chroma draw, word-up |

---

## Anti-patterns (never)

- Emoji as icons or decoration
- AI purple/pink gradients, neon, warm gray neutrals
- Decorative stat-slop, fake metrics
- Filled icon sets, icon-heavy UI
- Harsh or playful animations
- Pure black hairlines or neutral gray shadows
- Empty greenwashing pathos («спасаем планету»)
- Generic SaaS look that ignores brand tokens

---

## File index

| Path | Purpose |
|------|---------|
| `styles.css` | Token entry point |
| `tokens/` | fonts, colors, typography, spacing, effects |
| `components/` | React primitives + `.prompt.md` per component |
| `guidelines/` | Brand specimen cards |
| `ui_kits/website/` | Static homepage + service detail recreation |
| `NIC Ecolog - Главная v2.dc.html` | Full interactive master (22 services, modals, motion) |
| `design-system/CHECKLIST.md` | Pre-delivery QA |
| `design-system/STACK.md` | Production stack guidance |
| `design-system/PROMPTS.md` | Team prompt templates |

---

## Pre-delivery

Before marking UI work complete, run through `design-system/CHECKLIST.md`.
