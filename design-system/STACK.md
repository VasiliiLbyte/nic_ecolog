# Stack guidance — НИЦ «Эколог»

Production stack is **not yet chosen**. Default to the current prototype stack unless the task explicitly names Next.js or Astro.

---

## Default (current) — HTML + design tokens

**Use for:** `.dc.html` prototypes, `ui_kits/website/`, static HTML exports, component specimen cards.

| Layer | Source |
|-------|--------|
| Tokens | `styles.css` → `tokens/*.css` |
| Interactive master | `NIC Ecolog - Главная v2.dc.html` |
| DC runtime | `support.js`, `image-slot.js` |
| Components (reference) | `components/*.jsx` + `.prompt.md` |
| Static kit | `ui_kits/website/index.html`, `service.html` |

**Rules:**
- Link `styles.css` or duplicate token values as CSS custom properties
- Prefer semantic HTML + minimal inline styles in DC files (match v2 conventions)
- Reuse `data-*` hooks for scroll, rail, services, reveal animations
- Do not introduce Tailwind in DC files unless migrating a specific page

**Pro Max stack search:**
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

---

## Future — Next.js + React

**Use when:** task mentions Next.js, App Router, production SPA/SSR, or migrating `components/` to live app.

| Layer | Approach |
|-------|----------|
| Components | Port from `components/` (Button, ServiceCard, SectionHeader, etc.) |
| Styles | CSS Modules or Tailwind with tokens as `:root` vars from `tokens/` |
| Fonts | `next/font` for Onest + JetBrains Mono; local `Stolzl` woff2 from `assets/` |
| Motion | CSS transitions + `IntersectionObserver` — match v2 timing |

**Rules:**
- Import tokens once in `app/globals.css` via `@import` or copy `:root` block
- Keep Russian copy and service data structure from v2 DCLogic `services` object
- Server components for static sections; client components for modal, rail, form, scroll effects

**Pro Max stack search:**
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack nextjs
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "layout" --stack react
```

---

## Alternative — Astro

**Use when:** task mentions Astro, static site, islands architecture.

| Layer | Approach |
|-------|----------|
| Pages | `ui_kits/website/` as layout reference |
| Interactivity | Islands for header scroll, counters, service modal only |
| Styles | Global `styles.css` + scoped component styles |

**Pro Max stack search:**
```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "static site" --stack astro
```

---

## Decision tree for agents

```
Task mentions Next.js / React production?
  yes → Next.js section + components/
  no → Task mentions Astro?
    yes → Astro section + ui_kits/
    no → Default HTML + tokens + v2.dc.html
```

When stack is ambiguous, **ask once** then document choice in the page override file.
