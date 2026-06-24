# Page override — Homepage

> Overrides `MASTER.md` only where noted. All other MASTER rules apply.

**Implementation:** `NIC Ecolog - Главная v2.dc.html`  
**Static recreation:** `ui_kits/website/index.html`

---

## Section order (anchor IDs)

| # | Section | `id` | Notes |
|---|---------|------|-------|
| 1 | Герой | `#top` | min-height 96vh, mesh blobs, word-up headline |
| 2 | Бегущая строка | — | RU slogans, marquee 38s |
| 3 | О центре — цифры | `#o-centre` | Blueprint grid bg, animated counters `[data-count]` |
| 4 | Лаборатория | `#laboratoriya` | See `laboratory.md` |
| 5 | Услуги | `#uslugi` | 22 cards, 4 groups — see `service.md` |
| 6 | Проекты | `#proekty` | Portfolio grid `[data-proj]` |
| 7 | Как мы работаем | — | Process steps `[data-steps]` |
| 8 | ESG | `#esg` | Dark gradient, data narrative |
| 9 | Клиенты и отзывы | — | Logo wall `[data-logo-wall]` |
| 10 | Форма заявки | `#zayavka` | `#eco-form` |
| 11 | Подвал | `#kontakty` | Dark footer |

---

## Homepage-only UI

### Fixed header (`#eco-header`)
- Transparent at top → glass `rgba(255,255,255,0.88)` + `blur(16px)` after 40px scroll
- Padding condenses 22px → 12px on scroll
- Burger `[data-burger]` visible ≤1060px

### Rail navigation (`[data-rail]`)
- Fixed right, vertical section progress
- Labels show on rail hover; active/past states via `.is-active` / `.is-past`
- `[data-rail-dark]` sections toggle `.on-dark` on rail
- Hidden ≤1060px

### Preloader (`#eco-preloader`)
- Fingerprint scan animation ~1.4s
- Skip entirely when `prefers-reduced-motion`

### Scroll reveal (`[data-rv]`)
- Parent `[data-anim="on"]` on `#eco-root`
- IntersectionObserver threshold 0.12, stagger 80ms max 7 per section

### Marquee
- Duplicate inline-flex for seamless loop
- RU copy on v2 (not EN micro-slogans)

---

## Mobile menu overlay

- `sc-if` bound to `menuOpen` state
- Full-screen blur overlay z-index 180
- Large type nav links 30px, closes on link click via `closeMenu`

---

## Do not change without approval

- Hero headline structure (3-line word-up with gradient words «данные» / «решения»)
- Rail nav section labels and order
- Preloader fingerprint scan concept
- Section background alternation: light → dark lab → light → dark ESG → light → dark footer
