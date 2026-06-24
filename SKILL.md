---
name: nic-ecolog-design
description: Use this skill to generate well-branded interfaces and assets for НИЦ «Эколог» (independent environmental research center, St. Petersburg) — production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, assets, and UI kit components.
user-invocable: true
---

Read `design-system/MASTER.md` first, then `readme.md` and explore other files.

## Design workflow

1. Read `design-system/MASTER.md`
2. If building a specific page, read `design-system/pages/<page>.md`
3. For UX patterns, accessibility, or stack questions — use `.cursor/skills/ui-ux-pro-max/` or `search.py` (see `design-system/PROMPTS.md`)
4. **Brand overrides Pro Max** — never change palette, fonts, or tone from generic recommendations
5. Before finishing, run `design-system/CHECKLIST.md`

## Sources

- **Tokens:** link `styles.css` (it `@import`s `tokens/*.css`). Use CSS custom properties — never hardcode brand hexes.
- **Foundations:** `guidelines/*.html` (colors, type, spacing, brand specimen cards)
- **Components:** `components/{buttons,badges,cards,section,forms}` — Button, Eyebrow, MetaPill, ServiceCard, ProjectCard, SectionHeader, DarkSection, ProcessSteps, RequestForm/Field. Each has `.jsx` + `.d.ts` + `.prompt.md`
- **UI kit:** `ui_kits/website/index.html` (homepage) + `service.html` (service-detail)
- **Interactive master:** `NIC Ecolog - Главная v2.dc.html` (22 services, rail nav, chromatogram, modals, motion)
- **Process docs:** `design-system/`, `design-system/DESIGN-WORKFLOW.md`

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and follow `design-system/STACK.md`.

**Brand in one line:** premium, precise, "scientific" — cool petrol-and-mint palette on light, Stölzl display + Onest body + JetBrains Mono labels, gradient mesh hero, pill buttons, no emoji, data-led copy in Russian. Differentiators lead: the accredited lab «Аналитик Лаб» and the marquee project portfolio.

If invoked without guidance, ask what to build, ask a few questions, and act as an expert НИЦ «Эколог» designer who outputs HTML artifacts or production code as needed.
