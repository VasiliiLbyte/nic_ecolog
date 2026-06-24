# Website UI kit — НИЦ «Эколог»

High-fidelity recreation of the **approved homepage**. Single self-contained screen
(`index.html`) that links the system `styles.css` and uses the brand tokens, mesh hero,
service grid, portfolio cards, dark ESG block and CTA.

- `index.html` — homepage (hero → numbers → services → portfolio → ESG → CTA → footer).
- `service.html` — service-detail page (СЗЗ): breadcrumb, facts, scope steps, result/why cards, related, CTA.

Source of truth: `NIC Ecolog - Главная v2.dc.html` (the interactive master, with the full 22-service
catalog, per-service detail pages, rail navigation, scroll motion, lab chromatogram and contact form). This kit is the static visual
recreation for the Design System tab and as a starting point. To build new pages, compose the
primitives in `components/` (Button, Eyebrow/MetaPill, ServiceCard, ProjectCard, SectionHeader)
on top of these section patterns. See `design-system/MASTER.md` and `design-system/pages/`.
