# Page override — Laboratory «Аналитик Лаб»

> Section `#laboratoriya` on homepage. Standalone lab pages: `Ecolog-Lab.html`, `НИЦ Эколог - Лаборатория (вау).html`.

---

## Section identity

- **Primary differentiator** — lead with accredited lab, not generic consulting
- Background: `--grad-lab` (`linear-gradient(125deg, #0A3D42, #0B5C60 42%, #14496F 100%)`)
- Text on white / `--grad-text-l` for highlights

---

## Chromatogram (v2 signature)

Element: `[data-chroma="true"]` at section bottom, height 176px.

- SVG path `#eco-chroma-path` — chromatography curve, gradient stroke lime→teal→ocean
- Draws on scroll via `stroke-dashoffset` (`_updateChroma` in DCLogic)
- Moving dot `#eco-chroma-dot` follows path tip while drawing
- Axis labels: `ОТКЛИК` (left), `ВРЕМЯ →` (right), mono 10px muted white
- Static full path when `prefers-reduced-motion`

**Meaning:** visual metaphor for analytical precision — lab as data source.

---

## Content blocks

- Two-column layout `[data-two-col]`: copy left, capability cards right
- Capability cards: **gradient squircle icon** (48×48, `border-radius: 14px`, brand mesh gradient) + **thin stroke SVG** (Lucide subset, 24×24, stroke 1.8px white) + title + short description
- Icon source: `assets/icons/lab/` — homepage: `droplet`, `wind`, `mountain`, `trash-2`; lab page (`Ecolog-Lab.html`): + `audio-waveform`, `radiation`, `scan`, `flask-conical`, `layers`; inlined in v2, optimized via `npm run icons:optimize`
- CTA: link to lab services / `#zayavka`
- Mention: аккредитация, полный цикл отбора → протокол, сроки от 3 рабочих дней

---

## Dark-section rules

- Rail nav uses `[data-rail-dark="1"]` on this anchor
- Hairlines `rgba(255,255,255,0.14)` not petrol
- Blob accents at low opacity (lime/teal) — do not overpower text
- Min contrast: body text `rgba(255,255,255,0.92)` on `#0A3D42`

---

## Related services (cross-link)

From lab section, emphasize service ids: `lab`, `nds`, `izm`, `iei`, `pek`

---

## Standalone lab page

When building full lab site (not homepage section):
- Reuse `#laboratoriya` visual language and chromatogram motif
- Expand: methods list, accreditations, equipment, turnaround table
- Keep dark hero or dark band + light content below — max 2 dark bands per page per MASTER
