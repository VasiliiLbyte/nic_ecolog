# Design workflow — НИЦ «Эколог»

How the team (and Cursor agent) builds UI in this repository.

---

## Two-layer process

| Layer | What | Where |
|-------|------|-------|
| **Brand** | Colors, type, tone, components | `design-system/MASTER.md`, `tokens/`, v2 |
| **UX intelligence** | Patterns, a11y, anti-patterns, stack tips | `.cursor/skills/ui-ux-pro-max/` |

**Brand always wins** over generic Pro Max palette or font suggestions.

---

## First-time setup

### Prerequisites

- **Node.js** + npm (for `uipro-cli`)
- **Python 3.x** (for `search.py`)

### Install UI UX Pro Max

```bash
npm install -g uipro-cli@latest
cd "/path/to/nic_ecolog"
uipro init --ai cursor
```

This creates `.cursor/skills/ui-ux-pro-max/` in the project (commit to git).

For personal global copy (optional):

```bash
cp -R .cursor/skills/ui-ux-pro-max ~/.cursor/skills/
```

Restart Cursor after install.

---

## Daily workflow

### 1. Start from design system

- Global rules: `design-system/MASTER.md`
- Page-specific: `design-system/pages/<name>.md`
- Interactive reference: `NIC Ecolog - Главная v2.dc.html`

### 2. Ask Cursor

**Option A — natural language** (brand skill + rules auto-apply):

```
Добавь страницу кейса для Лахта Центр по бренду Эколог
```

**Option B — explicit Pro Max** (UX-heavy tasks):

```
/ui-ux-pro-max Проверь accessibility секции услуг в v2
```

Always include brand anchor when using Pro Max — see templates in `design-system/PROMPTS.md`.

### 3. Pick stack

Read `design-system/STACK.md`. Default: HTML + tokens. Say "Next.js" or "Astro" if migrating.

### 4. Before merge / handoff

Walk through `design-system/CHECKLIST.md`. Fix or ticket any failures.

---

## Adding a new page

1. Create `design-system/pages/my-page.md` — sections, behaviors, deviations from MASTER
2. Implement in code (`.dc.html`, `ui_kits/`, or `components/`)
3. Run CHECKLIST
4. Update `ui_kits/website/README.md` or INDEX in `readme.md` if it's a major surface

---

## Pro Max search commands

Run from project root:

```bash
# Full design system suggestion (reference only — do not override MASTER)
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py \
  "B2B environmental consulting laboratory trust" \
  --design-system -p "NIC Ecolog Reference" -f markdown

# UX guideline lookup
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "focus states keyboard" --domain ux

# Stack-specific
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

Saved reference: `design-system/PROMAX-REFERENCE.md` (if generated).

---

## File map

```
design-system/
├── MASTER.md              # Brand source of truth
├── CHECKLIST.md           # Pre-delivery QA
├── STACK.md               # HTML vs Next vs Astro
├── PROMPTS.md             # Copy-paste prompts
├── AUDIT-v2-baseline.md   # Known UX gaps in v2
└── pages/
    ├── homepage.md
    ├── service.md
    └── laboratory.md

.cursor/
├── skills/ui-ux-pro-max/  # Pro Max skill (committed)
└── rules/                 # Always-on agent rules
```

---

## What not to do

- Do not let Pro Max replace Stölzl/Onest/petrol-mint palette
- Do not treat v1 (`NIC Ecolog - Главная.dc.html`) as source of truth
- Do not skip CHECKLIST for "small" UI changes
- Do not add emoji or stock icon sets

---

## Updating Pro Max

```bash
uipro update          # if available in your CLI version
# or re-run:
uipro init --ai cursor --force
```

Then re-copy to `~/.cursor/skills/` if using global install.
