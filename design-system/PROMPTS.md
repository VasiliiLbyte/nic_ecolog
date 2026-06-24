# Prompt templates — НИЦ «Эколог»

Copy, fill brackets, paste into Cursor chat.

---

## Universal prefix (append to any UI task)

```
Read design-system/MASTER.md first.
If building a specific page, also read design-system/pages/[page].md.
Brand rules override ui-ux-pro-max generic palette/fonts.
Interactive reference: NIC Ecolog - Главная v2.dc.html.
Stack: design-system/STACK.md (default: HTML + tokens).
Language: Russian. Run design-system/CHECKLIST.md before finishing.
```

---

## New service detail page

```
/ui-ux-pro-max Design a standalone service detail page for [НДВ / СЗЗ / …].

[Universal prefix]

Content: use service data from v2 DCLogic (СРОК, КОМУ, ЧТО ВХОДИТ, РЕЗУЛЬТАТ, related services).
Pattern: Trust & Authority. Reuse ServiceCard / SectionHeader from components/.
```

---

## Project case study

```
/ui-ux-pro-max Create a project case study page for [Лахта Центр / Большой порт СПб / …].

[Universal prefix]

Sections: hero eyebrow, challenge, scope, lab involvement, outcome, related projects, CTA to #zayavka.
```

---

## UX audit of a section

```
/ui-ux-pro-max Audit accessibility and UX of [секция услуг / форма заявки / rail-nav] in NIC Ecolog - Главная v2.dc.html.

[Universal prefix]

Output: findings list mapped to CHECKLIST.md items. Document only — do not fix unless asked.
```

---

## Migrate section to components/

```
Port [hero / DarkSection lab / ProcessSteps] from NIC Ecolog - Главная v2.dc.html to components/.

[Universal prefix]

Match tokens exactly. Export JSX + types. Update component .prompt.md if behavior changes.
```

---

## Domain UX search (Pro Max script)

```bash
# Form / a11y
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "form validation accessibility" --domain ux

# Landing pattern
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "B2B consulting trust" --domain landing

# Style reference (do not override brand)
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "gradient mesh scientific" --domain style

# Stack-specific
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

---

## New page override workflow

When adding a new surface:

1. Create `design-system/pages/[page-name].md` with section order, unique behaviors, deviations from MASTER
2. Prompt agent: *"I am building [Page Name]. Read MASTER.md and design-system/pages/[page-name].md."*
3. Implement in code
4. Run CHECKLIST.md

---

## Weak prompts to avoid

| Bad | Why |
|-----|-----|
| «Сделай красивый сайт» | No product type, surface, or brand anchor |
| «Используй последние тренды» | Conflicts with fixed brand system |
| «Сделай как у конкурентов» | Ignores approved v2 look |
