# UX audit baseline — NIC Ecolog - Главная v2

**Audited:** `NIC Ecolog - Главная v2.dc.html`  
**Checklist:** `design-system/CHECKLIST.md`  
**Date:** 2026-06-24  
**Status:** Documentation only — fixes are separate tasks.

---

## Summary

| Area | Pass | Partial | Fail |
|------|------|---------|------|
| Brand compliance | 8 | 1 | 0 |
| Accessibility | 4 | 5 | 2 |
| Interaction | 6 | 3 | 1 |
| Responsive | 6 | 0 | 0 |
| Motion | 5 | 0 | 0 |
| Forms | 4 | 2 | 1 |
| Performance & polish | 5 | 2 | 1 |

**Overall:** Strong brand and motion baseline. Main gaps: modal a11y, duplicate `id`, focus management, form validation UX.

---

## Pass (working well)

### Brand
- Russian B2B copy throughout; no emoji in body content
- Petrol-mint palette consistent with brand mesh and dark sections
- Stölzl wired for headings; JetBrains Mono for eyebrows
- Service cards follow СРОК/КОМУ pattern in overlay data
- Real metrics (14 лет, 500+ проектов) in hero trust line
- Fingerprint mark used correctly in header/footer/preloader

### Interaction
- `[data-svc]` cards: `tabindex="0"`, `cursor: pointer`, hover lift, `focus-within` expands description
- Escape closes service modal (`keydown` handler)
- Enter on focused `[data-svc]` opens service
- Burger and close buttons: 44×44px touch targets
- Rail items: `cursor: pointer`, `aria-label` per section
- Header scroll condensation implemented in `componentDidMount`

### Responsive
- Breakpoints at 1060px and 720px match plan (nav/rail hide, grid collapse, padding reduce)
- `scroll-margin-top: 80px` on anchored sections

### Motion
- `@media (prefers-reduced-motion: reduce)` disables animations and reveals content immediately
- Chroma path sets `strokeDashoffset: 0` when reduced motion
- Preloader skipped when reduced motion

### Forms
- Fields have proper `<label for="...">` associations (`f-name`, `f-phone`, `f-task`)
- Required fields marked on name and phone
- Success state `#eco-form-ok` after submit mock

---

## Partial (improve in production)

### Accessibility

| Item | Finding |
|------|---------|
| Focus visibility | Inputs use `outline: none` + DC `style-focus` — verify runtime applies visible focus ring for keyboard users |
| Rail active state | Visual `.is-active` class only — no `aria-current="true"` on active section link |
| Header nav links | No explicit `cursor: pointer` (browser default for `<a>` is OK) |
| Footer / CTA links | Same — functional but no `:focus-visible` styles in `<style>` block |
| Decorative images | Fingerprint `alt=""` in header/footer is correct; logo link has `aria-label` on parent `<a>` |
| Success checkmark | Unicode `✓` in success state — acceptable; not emoji but consider SVG for consistency |

### Interaction

| Item | Finding |
|------|---------|
| Service modal | Escape works; no `role="dialog"`, `aria-modal="true"`, or `aria-labelledby` |
| Focus trap | Opening modal does not move focus inside; closing does not restore focus to triggering card |
| Mobile menu | Opens/closes via state; no `aria-expanded` on burger, no focus trap, body scroll not locked |

### Forms

| Item | Finding |
|------|---------|
| Validation | HTML5 `required` only — no inline error messages or `aria-invalid` |
| Privacy link | `href="#"` placeholder — needs real URL in production |
| Task field | Optional — OK for prototype |

### Performance & polish

| Item | Finding |
|------|---------|
| Duplicate anchor ID | `id="kontakty"` appears on inner contact column (form section) **and** `<footer>` — invalid HTML, breaks unique anchor targets |
| Z-index | Documented stack respected in markup |

---

## Fail (should fix before production)

| Priority | Item | Recommendation |
|----------|------|----------------|
| P1 | Duplicate `id="kontakty"` | Rename form-side block to `id="kontakty-info"` or remove id; keep footer as sole `#kontakty` |
| P1 | Service modal a11y | Add `role="dialog"`, `aria-modal="true"`, focus trap, return focus on close |
| P2 | Mobile menu a11y | `aria-expanded` on burger; lock body scroll; trap focus while open |
| P2 | Global `:focus-visible` | Add CSS rule for links, buttons, `[data-svc]`, rail items (2px teal outline) |
| P3 | Form error UX | Add validation feedback + `aria-live` region for submit errors |

---

## Checklist mapping

| CHECKLIST item | v2 status |
|----------------|-----------|
| RU copy, no emoji | Pass |
| CSS tokens in new work | N/A (inline in DC) — use tokens in production port |
| Stölzl / Onest / Mono | Pass |
| Contrast light text | Pass (visual review) |
| Contrast dark sections | Pass — footer `rgba(255,255,255,0.6)` on `#0A3236` acceptable |
| `:focus-visible` | Partial |
| Form labels | Pass |
| Modal Escape | Pass |
| Modal focus management | Fail |
| `prefers-reduced-motion` | Pass |
| `cursor: pointer` on cards | Pass |
| Touch 44px mobile | Pass (burger, close) |
| Responsive breakpoints | Pass |
| `scroll-margin-top` | Pass |
| Decorative `aria-hidden` | Pass |

---

## Recommended fix order (future tasks)

1. Resolve duplicate `#kontakty` id
2. Service modal: dialog semantics + focus trap + restore focus
3. Add `:focus-visible` styles in v2 `<helmet>` style block
4. Mobile menu: `aria-expanded`, body lock, focus trap
5. Form: error states and live region for production backend integration

---

## Notes

This audit does not change v2 code per implementation plan scope. Track fixes in separate PRs against checklist items above.
