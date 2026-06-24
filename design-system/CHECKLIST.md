# Pre-delivery checklist — НИЦ «Эколог»

Run this before merging UI changes or shipping a new page. Combines brand rules with UI UX Pro Max delivery standards.

## Brand compliance

- [ ] Copy is Russian, Cyrillic, B2B peer tone — no hype, no emoji
- [ ] Colors use `tokens/` CSS variables — no ad-hoc hex unless matching v2 inline patterns
- [ ] Display type: Stölzl; body: Onest; labels/data: JetBrains Mono
- [ ] Fingerprint mark from `assets/` — no substitute logos
- [ ] Service blocks include СРОК / КОМУ / РЕЗУЛЬТАТ where applicable
- [ ] Numbers are real (14 лет, 500+ проектов, etc.) — not decorative filler
- [ ] No AI purple gradients, warm gray neutrals, or icon overload

## Accessibility (WCAG AA target)

- [ ] Body text contrast ≥ 4.5:1 on light backgrounds
- [ ] Large text / UI labels ≥ 3:1 where applicable
- [ ] Dark sections (lab, ESG, footer): text readable on `#0A3D42` / `#122E54` / `#0A3236`
- [ ] All interactive elements have visible `:focus-visible` outline (not removed)
- [ ] Images have meaningful `alt` or `alt=""` + `aria-hidden` when decorative
- [ ] Form fields have associated `<label>` or `aria-label`
- [ ] Modal / overlay: Escape closes; focus managed on open/close
- [ ] `prefers-reduced-motion`: animations disabled or reduced to instant

## Interaction

- [ ] `cursor: pointer` on all clickable elements (`[data-svc]`, CTAs, nav, rail, cards)
- [ ] Hover states use 150–300ms transitions
- [ ] Touch targets ≥ 44×44px on mobile (burger, menu links, rail hidden on mobile)
- [ ] No hover-only critical information (descriptions also on focus-within / tap)
- [ ] Keyboard: service cards activatable (Enter); Escape closes service modal
- [ ] Links and buttons are semantic (`<a href>` vs `<button type>`)

## Responsive

Test at: **375px**, **768px**, **1024px**, **1440px**

- [ ] Header: nav hidden ≤1060px, burger visible, phone hidden appropriately
- [ ] Rail nav hidden ≤1060px
- [ ] Service grid: 4 → 2 → 1 columns
- [ ] Section horizontal padding: 48px → 24px on small screens
- [ ] Hero headline readable without horizontal scroll
- [ ] CTA row wraps; buttons full-width on narrow if needed

## Motion

- [ ] Scroll reveal: fade + 30px rise, staggered, `--ease-out`
- [ ] Hero word-up animation on load (respect reduced motion)
- [ ] Counters animate once in view (or show final value if reduced motion)
- [ ] Lab chromatogram draws on scroll (static full path if reduced motion)
- [ ] Marquee on slogans — paused/hidden if reduced motion
- [ ] Preloader skippable / hidden when reduced motion

## Forms (`#eco-form`)

- [ ] Required fields marked
- [ ] Placeholder color muted (`--slate-5`)
- [ ] Submit shows success state (`#eco-form-ok`) — plan error state for production
- [ ] No submit without `preventDefault` in prototype

## Performance & polish

- [ ] No layout shift from web fonts (use `font-display: swap`)
- [ ] Decorative layers `aria-hidden="true"` and `pointer-events: none`
- [ ] `scroll-margin-top` on anchored sections for fixed header
- [ ] Z-index stack respected: header 100, rail 90, service modal 170, menu 180, preloader 200

## Source alignment

- [ ] Matches `NIC Ecolog - Главная v2.dc.html` patterns unless page override documents deviation
- [ ] Page override file exists in `design-system/pages/` if building a named surface
