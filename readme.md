# НИЦ «Эколог» — Design System

Design system for **Независимый исследовательский центр «Эколог»** (nic-ecolog.ru) — an independent
environmental engineering, consulting and laboratory center in St. Petersburg. The system codifies the
**approved homepage look** (accepted by the client) and anchors it to the brand book.

> **Positioning:** premium, precise, "scientific". Strong visuals act as a **signal of competence**, not
> decoration. Balance of premium ESG/научный narrative ("наука + экология + прикладные решения",
> "ECO IS DATA") with concrete compliance language (НДВ, НДС, ПНООЛР, СЗЗ, КЭР, ОВОС, ПЭК, ИЭИ).
> Two differentiators lead everything: the own accredited lab **«Аналитик Лаб»** and a marquee project
> portfolio (Лахта Центр, Большой порт СПб, МОЭК, Мариинский театр).

## Sources
- `NIC Ecolog - Главная v2.dc.html` — the approved homepage (master implementation, source of truth for the look).
- `design-system/MASTER.md` — agent-facing design system (MASTER + `pages/` overrides).
- `design-system/DESIGN-WORKFLOW.md` — team workflow (UI UX Pro Max + brand hierarchy).
- `НИЦ Эколог - Главная (standalone).html` — self-contained bundle the client approved.
- `uploads/brandbook.pdf` (21 pp, image-only) — brand book: palette stops, logo, Stölzl type, isoline motif.
- `uploads/Промпт_Claude_Design_НИЦ_Эколог.md` — original brief (structure, tone, palette).
- `assets/fingerprint-color.png`, `assets/fingerprint-white.png` — the fingerprint mark.

## CONTENT FUNDAMENTALS
**Language:** Russian, Cyrillic everywhere. **Voice:** direct, exact, no "green noise" or empty pathos —
*«Говорим прямо, считаем точно, показываем реальную картину.»* Addresses a B2B reader (chief engineers,
plant ecologists, developers) as a peer — uses "мы"/"вы", never hype.

- **Headlines** are short, declarative, often with one or two words gradient-highlighted:
  *«Превращаем **данные** и исследования в понятные эффективные **решения**.»*
- **Eyebrows / labels** are mono, uppercase, wide-tracked: `НЕЗАВИСИМЫЙ ИССЛЕДОВАТЕЛЬСКИЙ ЦЕНТР · САНКТ-ПЕТЕРБУРГ`.
- **Micro-slogans** (mono, English allowed): `ECO IS DATA`, `NO DATA — NO DECISION`, `SCIENCE FOR NATURE`.
- **Service copy** is concrete and outcome-led: each service states СРОК / КОМУ / ЧТО ВХОДИТ / РЕЗУЛЬТАТ.
- **No emoji.** Numbers are real and load-bearing (14 лет, 500+ проектов) — never decorative stat-slop.

## VISUAL FOUNDATIONS
- **Color:** cool, petrol-and-mint. Light base (`#F7FBF9`), graphite-teal ink (`#13282B`), accents drawn
  from a single brand mesh ramp **lime → green → teal → ocean → deep blue**. Neutrals are slate (cool),
  never warm gray. Hairlines are petrol-tinted (`rgba(11,92,96,.12)`), never pure black.
- **Brand mesh:** slow-drifting blurred radial blobs (lime / teal / ocean / green) behind hero & accent
  sections, faded to white at the bottom. The signature surface.
- **Type:** Onest (geometric grotesque, full Cyrillic) — **display leans Light (300)** at large fluid
  sizes with tight tracking and balanced wrap; body 400/500. JetBrains Mono for all eyebrows/labels/data.
  Brand-intended display is **Stölzl** (slot reserved — see Caveats).
- **Gradients:** `--grad-brand` (teal→ocean) on primary buttons & accent fills; `--grad-text`
  (teal→green→lime) for highlighted words on light; dark sections use `--grad-esg` / `--grad-lab`.
- **Backgrounds:** light by default; 1–2 dark sections per page (lab `#0A3D42`, ESG `#122E54`, footer
  `#06141C`). Motifs used sparingly: isolines (topographic thin rings), blueprint grid, ESG donut (Scope 1–3).
- **Cards:** white, radius 20–28px, 1px petrol hairline, soft cool shadow on lift. Image areas use a
  diagonal mint stripe placeholder until real photography is dropped in.
- **Corners:** pills (999px) for every button/chip/badge; 20px service cards; 24–28px feature/CTA blocks.
- **Shadows:** accent-tinted, generous, mostly on hover (`--shadow-btn`, `--shadow-card`). Never neutral gray.
- **Motion:** smooth, restrained, *signals precision*. Sections reveal on scroll (fade + 30px rise, ease
  `cubic-bezier(.22,1,.36,1)`, ~0.9s, staggered); hero words rise word-by-word; counters animate in view;
  cards lift on hover and reveal description. Always respect `prefers-reduced-motion`.
- **Header:** transparent over hero, condenses to glass (blur 16px + hairline) on scroll.

## ICONOGRAPHY
The brand is **near-iconless by design** — competence is signalled by type, data and the fingerprint, not
icon sets. Where marks appear: small **gradient dot-badges** (radial lime→teal) lead service rows; thin
1.8px stroke line-icons (burger, close, arrow `→`) in petrol. No emoji, no filled icon set. The one true
brand symbol is the **fingerprint** (`assets/fingerprint-*.png`) — uniqueness + independent verification,
echoing topographic isolines. If a UI needs a broader icon set, use a thin-stroke CDN set (e.g. Lucide,
1.8px) in petrol — and flag it. **Lab section exception:** four capability icons in `assets/icons/lab/`
(Lucide: droplet, wind, mountain, trash-2) on gradient squircles — see `design-system/pages/laboratory.md`.

## INDEX
- `styles.css` — entry point (link this). `@import`s everything below.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable primitives: `buttons/`, `badges/`, `cards/`, `section/`, `forms/`.
  - `section/` holds SectionHeader, **DarkSection** (Lab/ESG/Contact band), **ProcessSteps** (numbered timeline).
  - `forms/` holds **RequestForm** + the labelled **Field** primitive.
- `ui_kits/website/` — НИЦ «Эколог» website screens (homepage, service detail).
- `design-system/` — MASTER, CHECKLIST, STACK, PROMPTS, page overrides.
- `.cursor/skills/ui-ux-pro-max/` — UX intelligence layer (patterns, a11y; brand wins).
- `assets/` — fingerprint logo (color / white); `assets/icons/lab/` — Lucide lab capability SVG subset
- `SKILL.md` — portable skill manifest.

## Demo (GitHub Pages)

Публичное демо для заказчика:

**URL:** https://vasiliilbyte.github.io/nic_ecolog/

| Страница | Путь |
|----------|------|
| Главная | `/` |
| Лаборатория | `/lab.html` |

### Локальная сборка

```bash
npm run pages:build
npm run pages:preview
```

Превью: http://127.0.0.1:8766/

### Деплой

Push в `main` запускает [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) — артефакт собирается в `docs/` и публикуется на GitHub Pages.

**Первый раз (один раз в GitHub):** Settings → Pages → Build and deployment → **Source: GitHub Actions**.

## CAVEATS
- **Stölzl is the active display face** (brandbook face; full Cyrillic confirmed across Book/Regular/
  Medium/Bold). Files live in `assets/Stolzl-*.woff2`, wired in `tokens/fonts.css`; `--font-display`
  falls back to Onest if a weight is ever missing.
- **Brand book reviewed (21 pp, all outlined/flattened — no live text or font strings, full-page render
  unsupported in-tool).** Pages were extracted as images: the cover gradient mesh, fingerprint mark,
  stationery and merch (incl. a lime-green hoodie and the gradient-fingerprint keychain) **visually
  confirm the lime → green → teal → ocean → blue mesh, the petrol/cream surfaces and the logo** used here.
  Exact swatch hex values could not be auto-read — please confirm them against the printed book if needed.
- **Imagery:** project & client visuals are still placeholders pending real photos/logos.
